import { defineToolcraft } from "@/toolcraft/runtime";

import { COLOURWAYS, EPISODE_ILLUSTRATIONS, type ColourwayKey } from "./brand";

const colourwayOptions = (Object.keys(COLOURWAYS) as ColourwayKey[]).map((key) => ({
  label: COLOURWAYS[key].label,
  value: key,
}));

const imageSceneCondition = {
  oneOf: ["illustration", "upload"],
  target: "scene.source",
} as const;

const whenTemplate = (template: string) =>
  ({ equals: template, target: "post.template" }) as const;

export const appSchema = defineToolcraft({
  canvas: {
    enabled: true,
    size: { height: 1350, unit: "px", width: 1080 },
    sizing: { mode: "editable-output" },
    upload: false,
  },
  export: {
    png: {
      background: "include",
    },
  },
  panels: {
    timeline: { defaultDurationSeconds: 60, mode: "playback" },
    controls: {
      sections: [
        {
          controls: {
            template: {
              defaultValue: "cover",
              description:
                "Six brand layouts: Cover, Quote exchange, Synopsis, Now streaming, Episode credits, and the timeline-driven Audiogram.",
              label: "Template",
              options: [
                { label: "Cover", value: "cover" },
                { label: "Quote exchange", value: "quote" },
                { label: "Synopsis", value: "synopsis" },
                { label: "Now streaming", value: "streaming" },
                { label: "Episode credits", value: "credits" },
                { label: "Audiogram", value: "audiogram" },
              ],
              orderRole: "mode",
              performanceReason:
                "Switching templates swaps the whole DOM slide layout in one commit.",
              performanceRole: "responsiveness",
              target: "post.template",
              type: "select",
            },
            episode: {
              defaultValue: "S1 E1",
              description:
                "The episode marker shown on every layout: cover and credits footer, quote and synopsis eyebrow, streaming heading.",
              label: "Episode",
              orderRole: "primary",
              performanceReason: "Short text edits re-render one DOM text node.",
              performanceRole: "responsiveness",
              target: "content.episode",
              type: "text",
            },
            coverPresents: {
              defaultValue: "More Muslim presents",
              label: "Label",
              orderRole: "primary",
              performanceReason: "Short text edits re-render one DOM text node.",
              performanceRole: "responsiveness",
              target: "content.cover.presents",
              type: "text",
              visibleWhen: whenTemplate("cover"),
            },
            coverTitle: {
              defaultValue: "Side Entrances",
              label: "Title",
              orderRole: "primary",
              performanceReason: "Short text edits re-render one DOM text node.",
              performanceRole: "responsiveness",
              target: "content.cover.title",
              type: "text",
              visibleWhen: whenTemplate("cover"),
            },
            quoteDialogue: {
              defaultValue:
                "Yassmin: Do you remember the first time you heard about people using chatbots as therapists?\nDr. Rania: Yeah, it was a patient of mine. And she said, \u2018In between our sessions\u2026 I talked to a chatbot.\u2019",
              description: "One exchange per line as \u201cSpeaker: quote\u201d.",
              label: "Dialogue",
              orderRole: "primary",
              performanceReason:
                "Multiline text edits re-render one wrapped DOM text block.",
              performanceRole: "responsiveness",
              target: "content.quote.dialogue",
              type: "code",
              visibleWhen: whenTemplate("quote"),
            },
            synopsisBody: {
              defaultValue:
                "When a patient starts using ChatGPT as a therapist, a reporter investigates.\n\nWhat does it mean when an AI becomes your spiritual guide?",
              description: "Blank line between paragraphs.",
              label: "Body",
              orderRole: "primary",
              performanceReason:
                "Multiline text edits re-render one wrapped DOM text block.",
              performanceRole: "responsiveness",
              target: "content.synopsis.body",
              type: "code",
              visibleWhen: whenTemplate("synopsis"),
            },
            streamingLines: {
              defaultValue:
                "Listen to the full episode at moremuslim.org.\nOr search \u201cMore Muslim\u201d wherever you get podcasts.",
              description: "One outro line per row.",
              label: "Outro",
              orderRole: "primary",
              performanceReason:
                "Multiline text edits re-render one wrapped DOM text block.",
              performanceRole: "responsiveness",
              target: "content.streaming.lines",
              type: "code",
              visibleWhen: whenTemplate("streaming"),
            },
            creditsList: {
              defaultValue:
                "Yassmin Abdel-Magied \u2014 Reporter\nTaqwa Sadiq \u2014 Producer\nSarah Qari \u2014 Story Editor\nAlexander Overington \u2014 Composer\nAmel Mukhtar \u2014 Exec. Producer",
              description: "One credit per line as \u201cName \u2014 Role\u201d.",
              label: "Credits",
              orderRole: "primary",
              performanceReason:
                "Multiline text edits re-render one wrapped DOM text block.",
              performanceRole: "responsiveness",
              target: "content.credits.list",
              type: "code",
              visibleWhen: whenTemplate("credits"),
            },
          },
          title: "Post",
        },
        {
          controls: {
            colourway: {
              defaultValue: "night",
              description:
                "Nine approved ground × ink pairings from the brand palette. Ink, pattern tile, and symbol follow the ground automatically.",
              label: "Colourway",
              options: colourwayOptions,
              orderRole: "color",
              performanceReason:
                "Colourway changes restyle the slide ground, ink, and pattern in one commit.",
              performanceRole: "responsiveness",
              target: "post.colourway",
              type: "select",
            },
          },
          title: "Colourway",
        },
        {
          controls: {
            source: {
              defaultValue: "pattern",
              description:
                "Star-lattice pattern on the colourway ground, plain solid ground, an episode illustration, or an uploaded image.",
              label: "Scene",
              options: [
                { label: "Pattern", value: "pattern" },
                { label: "Solid colour", value: "solid" },
                { label: "Episode illustration", value: "illustration" },
                { label: "Uploaded image", value: "upload" },
              ],
              orderRole: "input",
              performanceReason:
                "Source switches between pattern, solid, and decoded-image slide grounds.",
              performanceRole: "responsiveness",
              target: "scene.source",
              type: "select",
            },
            illustration: {
              defaultValue: "ep1",
              items: EPISODE_ILLUSTRATIONS.map((entry) => ({
                label: entry.label,
                src: entry.src,
                value: entry.value,
              })),
              label: "Episode",
              orderRole: "input",
              performanceReason:
                "Choosing an illustration swaps one full-bleed decoded image.",
              performanceRole: "workload",
              target: "scene.illustration",
              type: "imagePicker",
              visibleWhen: { equals: "illustration", target: "scene.source" },
            },
            upload: {
              accept: "image/*",
              assetKind: "image",
              defaultValue: [],
              label: "Image",
              multiple: false,
              orderRole: "input",
              performanceReason:
                "Uploads decode arbitrary user images as the slide ground.",
              performanceRole: "workload",
              target: "scene.upload",
              type: "fileDrop",
              visibleWhen: { equals: "upload", target: "scene.source" },
            },
            imagePosition: {
              defaultValue: { x: 0, y: 0 },
              label: "Focus",
              orderRole: "spatial",
              performanceReason:
                "Focus drags update the cover-crop position of a decoded full-bleed image live.",
              performanceRole: "responsiveness",
              target: "scene.imagePosition",
              type: "vector",
              visibleWhen: imageSceneCondition,
              xLabel: "X",
              yLabel: "Y",
            },
            imageZoom: {
              defaultValue: 1,
              label: "Zoom",
              max: 2,
              min: 1,
              orderRole: "spatial",
              performanceReason:
                "Zoom scales a decoded full-bleed image live while dragging.",
              performanceRole: "responsiveness",
              step: 0.01,
              target: "scene.imageZoom",
              type: "slider",
              visibleWhen: imageSceneCondition,
            },
          },
          title: "Scene",
        },
        {
          controls: {
            audio: {
              accept: "audio/*",
              assetKind: "file",
              defaultValue: [],
              description:
                "MP3 or M4A episode audio; its duration becomes the timeline duration.",
              label: "Audio",
              multiple: false,
              orderRole: "input",
              performanceReason:
                "Audio uploads decode metadata and set the timeline duration.",
              performanceRole: "workload",
              target: "audiogram.audio",
              type: "fileDrop",
              visibleWhen: { equals: "audiogram", target: "post.template" },
            },
            captions: {
              accept: ".srt,.txt",
              assetKind: "file",
              defaultValue: [],
              description:
                "SRT captions; lines like \u201cSpeaker: text\u201d split the speaker out.",
              label: "Captions",
              multiple: false,
              orderRole: "input",
              performanceReason:
                "Caption files parse once into timed blocks for the preview.",
              performanceRole: "workload",
              target: "audiogram.captions",
              type: "fileDrop",
              visibleWhen: { equals: "audiogram", target: "post.template" },
            },
          },
          title: "Sound & Captions",
        },
        {
          controls: {
            episodeSet: {
              defaultValue: "ep1",
              description:
                "Episode used by Build episode set: cover, two synopsis slides, credits, and now-streaming, one slide layer each.",
              label: "Episode set",
              options: [
                { label: "E1 Side Entrances", value: "ep1" },
                { label: "E2 Nikkah Loophole", value: "ep2" },
                { label: "E3 Secret Translators", value: "ep3" },
                { label: "E4 Recitation Revolution", value: "ep4" },
                { label: "E5 Hanabneehu", value: "ep5" },
                { label: "E6 Cape Malay", value: "ep6" },
                { label: "E7 SheikhaGPT", value: "ep7" },
                { label: "E8 Travelling Sisterhood", value: "ep8" },
                { label: "E9 A More Muslim Japan", value: "ep9" },
                { label: "E10 Washing the Dead", value: "ep10" },
              ],
              orderRole: "mode",
              performanceReason:
                "Choosing the episode only changes which set the build action creates.",
              performanceRole: "responsiveness",
              target: "carousel.episode",
              type: "select",
            },
            slideActions: {
              actions: [
                { label: "Build episode set", value: "carousel-build-episode-set" },
              ],
              label: "Slides",
              orderRole: "action",
              performanceReason:
                "Slide actions add layers and write snapshots in one commit each.",
              performanceRole: "responsiveness",
              target: "carousel.slides",
              type: "actions",
            },
          },
          title: "Carousel",
        },
        {
          controls: {
            includeBackground: {
              defaultValue: true,
              label: "Include",
              orderRole: "mode",
              performanceReason:
                "Toggling the background swaps the slide ground for transparency.",
              performanceRole: "responsiveness",
              target: "export.includeBackground",
              type: "switch",
            },
            backgroundColor: {
              defaultValue: { hex: "#FBF2E9" },
              label: false,
              orderRole: "color",
              performanceReason:
                "Export backdrop colour fills one rect behind the slide.",
              performanceRole: "responsiveness",
              target: "appearance.background",
              type: "color",
            },
          },
          layoutGroups: [
            {
              columns: 2,
              controls: ["includeBackground", "backgroundColor"],
              layout: "inline",
            },
          ],
          title: "Background",
        },
        {
          controls: {
            imageFormat: {
              defaultValue: "png",
              label: "Format",
              options: [
                { label: "PNG", value: "png" },
                { label: "JPG", value: "jpg" },
              ],
              orderRole: "mode",
              performanceReason:
                "Export format only affects the export encode pass.",
              performanceRole: "workload",
              target: "export.image.format",
              type: "select",
            },
            imageResolution: {
              defaultValue: "4k",
              label: "Resolution",
              options: [
                { label: "Current", value: "current" },
                { label: "2K", value: "2k" },
                { label: "4K", value: "4k" },
                { label: "8K", value: "8k" },
              ],
              orderRole: "mode",
              performanceReason:
                "Export resolution changes the rasterised export canvas size.",
              performanceRole: "workload",
              target: "export.image.resolution",
              type: "select",
            },
          },
          layoutGroups: [
            {
              columns: 2,
              controls: ["imageFormat", "imageResolution"],
              layout: "inline",
            },
          ],
          title: "Image Export",
        },
        {
          controls: {
            videoFormat: {
              defaultValue: "mp4",
              label: "Format",
              options: [
                { label: "MP4", value: "mp4" },
                { label: "WebM", value: "webm" },
              ],
              orderRole: "mode",
              performanceReason:
                "Video format selects the WebCodecs container for export.",
              performanceRole: "workload",
              target: "export.video.format",
              type: "select",
              visibleWhen: { equals: "audiogram", target: "post.template" },
            },
            videoResolution: {
              defaultValue: "current",
              label: "Resolution",
              options: [
                { label: "Current", value: "current" },
                { label: "4K", value: "4k" },
              ],
              orderRole: "mode",
              performanceReason:
                "Video resolution scales the encoded frame size.",
              performanceRole: "workload",
              target: "export.video.resolution",
              type: "select",
              visibleWhen: { equals: "audiogram", target: "post.template" },
            },
          },
          layoutGroups: [
            {
              columns: 2,
              controls: ["videoFormat", "videoResolution"],
              layout: "inline",
            },
          ],
          title: "Video Export",
        },
        {
          actionGroup: "primary",
          controls: {
            exportActions: {
              actions: [
                {
                  icon: "upload-simple",
                  label: "Export PNG",
                  value: "export-png",
                },
                {
                  icon: "download-simple",
                  label: "Export ZIP",
                  value: "export-zip",
                },
                {
                  icon: "upload-simple",
                  label: "Export Video",
                  value: "export-video",
                },
              ],
              target: "panel.actions",
              type: "panelActions",
            },
          },
          title: "Export",
        },
      ],
      title: "More Muslim Studio",
    },
  },
  persistence: {
    include: ["values", "canvas", "panels"],
    key: "toolcraft:more-muslim-social-studio:state:v1",
    storage: "localStorage",
    version: 1,
  },
  settingsTransfer: {
    appId: "more-muslim-social-studio",
    enabled: true,
    fileName: "more-muslim-post-settings",
  },
  toolbar: {
    history: true,
    radar: true,
    theme: true,
    zoom: true,
  },
});
