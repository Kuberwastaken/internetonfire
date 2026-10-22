# Assets

- `fonts/inter-latin-opsz-*.woff2`: Inter variable (weight + optical size), Latin subset, from `@fontsource-variable/inter@5.2.5`. SIL Open Font License, see `Inter-LICENSE.txt`.
- `this-is-fine.mp4` / `.webp`: see `THIS-IS-FINE.md`.
- `favicon.svg`: flame mark drawn for this project.
- `og.png`: social card, rendered from `tools/og/og.html` with `node tools/og/render.mjs`.
- `source-icons/*.png`: favicons for source domains via Google's favicon service, cached by `node tools/fetch-source-icons.mjs`. They identify the linked source; no endorsement is implied. Missing icons fall back to the domain's first letter.
