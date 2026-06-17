# Anurag Chauhan — Portfolio

Personal portfolio website for Anurag Chauhan (B.Tech Biotechnology, NIET).

A static site — no build step, no dependencies. Just HTML, CSS, and vanilla JS.

## Stack

- Plain HTML / CSS / JS
- [Inter](https://fonts.google.com/specimen/Inter) + [Outfit](https://fonts.google.com/specimen/Outfit) via Google Fonts
- [Lucide](https://lucide.dev/) icon set via CDN
- Three interactive canvas simulations (protein backbone, interaction network, molecular docking)

## Files

| File | Purpose |
|------|---------|
| `index.html` | Page markup and content |
| `style.css` | All styles, design tokens, responsive breakpoints |
| `script.js` | Tab navigation, canvas simulations, staggered reveal |
| `assets/` | Static images (avatar, etc.) |
| `404.html` | Fallback page for unknown routes |
| `vercel.json` | Vercel deployment config |
| `netlify.toml` | Netlify deployment config |
| `_redirects` | Cloudflare Pages / Netlify redirect fallback |
| `robots.txt`, `sitemap.xml` | SEO basics |

## Local development

No build step. Open `index.html` directly in a browser, or run a local static server:

```bash
python3 -m http.server 8000
# then visit http://localhost:8000
```

## Deploy

Pick any one. All three are pre-configured.

### Vercel

```bash
npm i -g vercel
vercel
```

Vercel reads `vercel.json` automatically. The site will be served at clean URLs (e.g. `/` instead of `/index.html`).

### Netlify

```bash
npm i -g netlify-cli
netlify deploy --prod
```

Or drag-and-drop the folder onto [app.netlify.com/drop](https://app.netlify.com/drop). Netlify reads `netlify.toml` and `_redirects`.

### Cloudflare Pages

```bash
npm i -g wrangler
wrangler pages deploy .
```

Cloudflare reads `_redirects` for the SPA fallback.

### GitHub Pages (no config file)

```bash
git init
git add .
git commit -m "Initial portfolio"
gh repo create
git push -u origin main
# then enable Pages in repo Settings -> Pages -> Source: main / root
```

## Design tokens

All colors and most spacing live in CSS custom properties at the top of `style.css` (`:root` block):

- `--bg-dark`, `--card-bg`, `--card-border`
- `--text-primary`, `--text-secondary`, `--text-muted`
- `--accent-color` (premium tech blue)

## License

© Anurag Chauhan. All rights reserved.
