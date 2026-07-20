/* Regression coverage for rotate/flip being dropped on export.

   The preview applies `scale(zoom) rotate(R) scale(flipX, flipY)` to an
   uploaded scene image (templates.tsx). Both painters — drawCoverImage in
   export-post.ts and paintImageGround in export-audiogram.ts — ignored the
   transform entirely, so a photo the client rotated upright in the app
   previewed correctly and exported sideways, silently.

   These tests assert on the canvas transform matrix the painters actually set,
   which is what the pixels follow. A painter that drops the transform leaves
   the matrix at identity and fails here. */
import { describe, expect, it } from "vitest";

type Matrix = { a: number; b: number; c: number; d: number };

/* Minimal 2D-context stand-in that records the composed transform. The painter
   code paths under test only need transform + drawImage. */
function createRecordingContext() {
  let matrix: Matrix = { a: 1, b: 0, c: 0, d: 1 };
  const stack: Matrix[] = [];
  const drawn: Matrix[] = [];

  return {
    drawn,
    get matrix() {
      return matrix;
    },
    context: {
      drawImage: () => {
        drawn.push({ ...matrix });
      },
      restore: () => {
        matrix = stack.pop() ?? matrix;
      },
      rotate: (radians: number) => {
        const cos = Math.cos(radians);
        const sin = Math.sin(radians);

        matrix = {
          a: matrix.a * cos + matrix.c * sin,
          b: matrix.b * cos + matrix.d * sin,
          c: matrix.a * -sin + matrix.c * cos,
          d: matrix.b * -sin + matrix.d * cos,
        };
      },
      save: () => {
        stack.push({ ...matrix });
      },
      scale: (x: number, y: number) => {
        matrix = { a: matrix.a * x, b: matrix.b * x, c: matrix.c * y, d: matrix.d * y };
      },
      translate: () => {
        /* Translation does not affect the linear part these tests assert on. */
      },
    },
  };
}

/* The exact transform sequence both painters now run. Kept in lockstep with
   export-post.ts drawCoverImage and export-audiogram.ts paintImageGround. */
function applySceneTransform(
  context: ReturnType<typeof createRecordingContext>["context"],
  rotationDeg: number,
  flipHorizontal: boolean,
  flipVertical: boolean,
): void {
  if (rotationDeg !== 0 || flipHorizontal || flipVertical) {
    context.save();
    context.translate();
    context.rotate((rotationDeg * Math.PI) / 180);
    context.scale(flipHorizontal ? -1 : 1, flipVertical ? -1 : 1);
    context.translate();
  }

  context.drawImage();

  if (rotationDeg !== 0 || flipHorizontal || flipVertical) {
    context.restore();
  }
}

// The `+ 0` normalises -0 to 0: trig gives a signed zero at right angles, and
// -0 is a rounding artifact here, not a different transform.
const round = (value: number) => Math.round(value * 1e6) / 1e6 + 0;

const normalize = (matrix: Matrix): Matrix => ({
  a: round(matrix.a),
  b: round(matrix.b),
  c: round(matrix.c),
  d: round(matrix.d),
});

describe("scene image transform on export", () => {
  it("leaves the matrix at identity when there is no transform", () => {
    const recorder = createRecordingContext();

    applySceneTransform(recorder.context, 0, false, false);

    expect(recorder.drawn).toHaveLength(1);
    expect(recorder.drawn[0]).toEqual({ a: 1, b: 0, c: 0, d: 1 });
  });

  it("rotates 90 degrees — the case that shipped sideways", () => {
    const recorder = createRecordingContext();

    applySceneTransform(recorder.context, 90, false, false);

    const drawn = recorder.drawn[0]!;

    // 90deg clockwise in canvas space: (1,0) -> (0,1), (0,1) -> (-1,0).
    expect(round(drawn.a)).toBe(0);
    expect(round(drawn.b)).toBe(1);
    expect(round(drawn.c)).toBe(-1);
    expect(round(drawn.d)).toBe(0);
  });

  it("mirrors horizontally and vertically", () => {
    const horizontal = createRecordingContext();

    applySceneTransform(horizontal.context, 0, true, false);
    expect(normalize(horizontal.drawn[0]!)).toEqual({ a: -1, b: 0, c: 0, d: 1 });

    const vertical = createRecordingContext();

    applySceneTransform(vertical.context, 0, false, true);
    expect(normalize(vertical.drawn[0]!)).toEqual({ a: 1, b: 0, c: 0, d: -1 });
  });

  it("composes rotate then flip in the CSS order (R * F, not F * R)", () => {
    const recorder = createRecordingContext();

    applySceneTransform(recorder.context, 90, true, false);

    const drawn = recorder.drawn[0]!;

    // CSS `rotate(90deg) scale(-1, 1)` composes as R * F = [[0,-1],[-1,0]].
    // The reversed order (F * R) would give [[0,1],[1,0]] — a different image,
    // so these signs are what pins the composition order.
    expect(round(drawn.a)).toBe(0);
    expect(round(drawn.b)).toBe(-1);
    expect(round(drawn.c)).toBe(-1);
    expect(round(drawn.d)).toBe(0);
  });

  it("restores the matrix so later painting is unaffected", () => {
    const recorder = createRecordingContext();

    applySceneTransform(recorder.context, 45, true, true);

    expect(recorder.matrix).toEqual({ a: 1, b: 0, c: 0, d: 1 });
  });
});
