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
| `vercel.json` | Vercel deployment config (headers + SPA rewrite) |
| `404.html` | Custom 404 page |
| `robots.txt`, `sitemap.xml` | SEO basics |

## Local development

No build step. Open `index.html` directly in a browser, or run a local static server:

```bash
python3 -m http.server 8000
# then visit http://localhost:8000
```

## Deploy

The project is configured for Vercel. `vercel.json` ships the SPA rewrite (`/* → /index.html`), a 1-year immutable cache for `/assets/*` and `*.{css,js}`, and security headers (X-Content-Type-Options, X-Frame-Options, Referrer-Policy, Permissions-Policy) on every response.

```bash
npx vercel deploy --prod --yes
```

The first run fetches and caches the Vercel CLI under `~/.npm/_npx/`. Subsequent runs are instant.

For drag-and-drop deploys: visit [vercel.com/new](https://vercel.com/new), import the project, and accept the detected framework ("Other" / static).

## Design tokens

All colors and most spacing live in CSS custom properties at the top of `style.css` (`:root` block):

- `--bg-dark`, `--card-bg`, `--card-border`
- `--text-primary`, `--text-secondary`, `--text-muted`
- `--accent-color` (premium tech blue) — interaction
- `--accent-gold` (editorial gold) — editorial accents

## License

© Anurag Chauhan. All rights reserved.
