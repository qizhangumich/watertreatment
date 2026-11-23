# Integrated Water Treatment Solutions

A static trilingual website (English, Arabic, Simplified Chinese) with no runtime dependencies.

## Develop

```bash
npm run preview
```

Open http://localhost:4173/watertreatment/.

## Update content

- `content/data.mjs` holds language-neutral facts: models, water quality, references and contact.
- `content/en.mjs`, `content/ar.mjs` and `content/zh.mjs` hold all wording. The build fails if their structure differs.
- Set `contact.email` in `content/data.mjs` to show enquiry buttons.

## Publish

`npm run build` writes the site to `dist/`. The `gh-pages` branch serves that output through GitHub Pages.
