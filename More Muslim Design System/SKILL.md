---
name: more-muslim-design
description: Use this skill to generate well-branded interfaces and assets for More Muslim (a narrative audio documentary podcast produced in Qatar), either for production or throwaway prototypes/mocks/social posts/slides. Contains essential design guidelines, colours, type, fonts, logos, the star-lattice pattern, and UI kit components for prototyping.
user-invocable: true
---

Read the `readme.md` file within this skill, and explore the other available files.

If creating visual artifacts (slides, social posts, mocks, throwaway prototypes, etc), copy assets out and create static HTML files for the user to view. If working on production code, you can copy assets and read the rules here to become an expert in designing with this brand.

If the user invokes this skill without any other guidance, ask them what they want to build or design, ask some questions, and act as an expert designer who outputs HTML artifacts _or_ production code, depending on the need.

Quick map:
- `styles.css` → links every token + `@font-face` (ABC Marist). Link this one file.
- `tokens/` → colours, typography, spacing, base.
- `assets/` → `fonts/`, `logos/` (5 colourways), `patterns/` (**20 official star-lattice tiles** — the only permitted patterns), `imagery/`.
- `guidelines/` → foundation specimen cards.
- `components/` → React primitives (`core/`, `media/`); see each `.prompt.md`.
- `ui_kits/` → `social/` (post templates — the brand's main output), `website/` (moremuslim.org), `slides/` (keynote deck).

Brand essentials: one typeface (ABC Marist, Regular + Italic — **no bold**; build hierarchy with size/UPPERCASE/tracking). **All uppercase text is tracked to 165 (`0.165em` — the `--tracking-caps` token / `.more-caps` utility); never retrack all-caps to any other value.** Warm-earth + cool-blue palette, usually one saturated ground + one contrasting text colour. Tone-on-tone 8-point-star lattice + film grain on backgrounds. Sharp corners, calm motion, no emoji. Editorial, literary, documentary voice. **Logo sizes:** symbol alone = **187 × 187 px**; horizontal lockup = **734 × 141 px**.

**Pattern rule (hard):** the brand's star-lattice pattern exists only as the 20 official artwork tiles in `assets/patterns/pattern-1a…7b.png`. Place one with `PatternPanel` (`tile="6B"`) or as a full-bleed `background-image`. **Never hand-draw, recreate with SVG/CSS, generate, or recolour a star pattern — always use an official tile.**

**Colour pairing rule (hard):** only these seven ground × ink pairs are permitted — Night+Ivory · Oak+Ivory · Ivory+Oak · Harvest+Oak · Mist+Night · Black+Beige Soft · Black+White. Never place any colour on a ground outside this list. Use `.more-pair-*` CSS classes or `--pair-ground`/`--pair-ink` tokens.
