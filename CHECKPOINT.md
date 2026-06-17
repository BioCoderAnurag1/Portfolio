# Project Checkpoint

**Date:** 2026-06-17
**Project:** Anurag Chauhan — Biotechnology & Bioinformatics Portfolio (personal site)
**Location:** `/Users/meow/Downloads/web`

## Snapshot of Current State

The project is a single-page static portfolio website. It is not under git, has no build tooling, and is meant to be served as flat files.

### Files (as of checkpoint)

- [index.html](index.html) — page markup, SEO meta, Google Fonts + Lucide Icons via CDN, references local CSS/JS. Mtime 16:07.
- [style.css](style.css) — stylesheet (glass-card design, animated gradient blobs, Inter + Outfit fonts). Mtime 16:02.
- [script.js](script.js) — client-side behavior (likely Lucide init, blob animation, mobile menu, form handling). Mtime 16:04.
- [assets/](assets/) — local assets folder (avatar.png referenced from HTML). Contents not yet inventoried.
- `.DS_Store` — macOS metadata; safe to ignore or gitignore later.

### Site Identity

- **Owner / subject:** Anurag Chauhan
- **Role:** B.Tech Biotechnology student at Noida Institute of Engineering and Technology (NIET)
- **Location:** Greater Noida, UP, India
- **Contact shown in markup:** chauhananurag940@gmail.com · +91 7409822340 · github.com/BioCoderAnurag1
- **Focus areas referenced:** protein structure prediction, molecular docking, computational biology, AlphaFold, AI in biotech.

### Known To-Dos / Open Items

- Several contact links still hold placeholder values:
  - `mailto:your-email@example.com` in [index.html:59](index.html#L59) (display text is correct; href is not).
  - `tel:+91XXXXXXXXXX` in [index.html:65](index.html#L65) (display text is correct; href is not).
  - GitHub href still points to the generic `anuragchauhan` slug in [index.html:77](index.html#L77) while display text shows `BioCoderAnurag1`.
- Verify `assets/avatar.png` exists and matches the rendered `<img>`; replace if missing.
- Confirm Lucide icon names (`contact`, `mail`, `phone`, `map-pin`, `github`, …) all exist in the current Lucide build loaded from `unpkg.com/lucide@latest` — pinning a version is safer than `@latest`.
- No favicon declared in `<head>`.
- No `robots.txt` / `sitemap.xml` — fine for a single-page portfolio but worth noting if SEO matters.

### What Was NOT Done Yet

- No accessibility audit (color contrast on glass cards over animated blobs, focus styles, alt text completeness).
- No responsive testing across breakpoints — only authored CSS rules.
- No form backend wired up (if a contact form is present, it isn't clear where it posts).
- No performance pass (preload critical assets, defer script, image optimization).
- No git initialization or version history.

## How To Resume

1. Open `/Users/meow/Downloads/web/index.html` directly in a browser, or serve with `python3 -m http.server` from that folder.
2. Start with the placeholder fixes listed above — they are the smallest visible polish wins.
3. Before adding new features, decide whether to (a) init git here for history, or (b) copy the folder elsewhere as a baseline backup.

## Context Worth Preserving Beyond This File

- The user has not yet stated long-term intent (deploy? rebuild? add projects section?). Ask before assuming scope.
- The folder lives under `Downloads/` — not a stable working location. Consider relocating to `~/Projects/` once direction is set.

## Polish & Depth Refresh (June 2026)

Single commit shipped a visual refresh while keeping the minimalist dark theme and the existing layout. Direction: subtle / Linear-tier depth, hover-only motion plus a one-time staggered fade-up of cards when a section becomes active.

**What changed**

- **Atmosphere.** New `body::before` (dim accent glow in the top corners) and `body::after` (faint grid masked to fade at the edges). Body itself sits at `z-index: 1` to host content above the fixed pseudos.
- **Surfaces.** Every card (`.section-card`, `.interest-card`, `.project-card`, `.skill-category-card`, `.achievements-card`, `.certifications-card`, `.cert-item`, `.lab-item`, `.skill-tag`, `.about-tag`) got a unified depth treatment: top inner highlight (1px white at 4% opacity), 1px card border, soft drop shadow, and on hover a 2px lift + stronger shadow + accent-tinted background. Cards now have a vertical `linear-gradient(180deg, #141417, #0e0e10)` background instead of flat `--card-bg`.
- **Sticky elements.** Both `.sidebar-panel` and `.glass-navbar` got `backdrop-filter: blur(12px)` plus a translucent gradient bg, so content scrolling under them stays legible. Tagged with `data-blur` for future opt-in control.
- **Sidebar hero.** `.avatar-wrapper` has a 2px accent gradient ring; `.avatar-glow` is back as a soft accent halo behind the avatar. `.profile-name` is 24→28px with tighter letter-spacing. New `.profile-status` pill ("Open to research & internship opportunities") under the subtitle, with a pulsing green dot using a new `statusPulse` keyframe.
- **Navbar active state.** The `#1c1c1f` bg on `.nav-link.active` was replaced with a 24×1.5px accent-color underline (the Vercel pattern).
- **Typography.** `.section-title` 20→22px, icon lifted from `--text-muted` to `--text-secondary`. `.career-objective-text` 14.5→15px with a 3px (was 2px) accent left border. `.section-desc` 14→14.5px with 1.65 line-height.
- **Staggered reveal.** New CSS keyframe `fadeUp`, new classes `.reveal` / `.reveal.is-visible`. New JS function `initRevealOnActive()` marks reveal targets (`interest-card`, `project-card`, `skill-category-card`, `about-tag`, `cert-item`, `lab-item`, `tool-item`, `about-tag-group`, `summary-divider`) and re-triggers the animation on every tab switch with a 50ms-per-item stagger (capped at 8 items = 400ms total). Reduced-motion users get the static version via a `prefers-reduced-motion` media query. `<html>` carries `class="no-js"` by default, removed on DOMContentLoaded, so the noscript fallback rule keeps content visible if JS fails.

**What did NOT change**

- Layout, breakpoints, content, copy, canvas simulations, fonts, icon set, color tokens.
- The three canvas simulations still drive visual interest; they were not rewritten, only the cards wrapping them got the depth treatment.

## Compact Sidebar + Deploy Pack (June 2026)

**Sidebar (compact / scrollable).** Goal: the entire sidebar fits in a typical desktop viewport (≥900px tall) without the user having to scroll inside it.

- `grid-template-columns` 320px → 260px
- `.sidebar-panel` padding 28 → 20, gap 28 → 18, sticky `top` 40 → 24, `max-height` `calc(100vh - 80px)` → `calc(100vh - 48px)`
- `.avatar-wrapper` 120×120 → 88×88, radius 14 → 12
- `.profile-name` 28px → 22px (still bigger than body text, just not the dominant element)
- `.profile-status` font 11.5 → 11, padding tightened
- `.info-section` padding-top 20 → 14
- `.section-title-sm` 11.5 → 10.5, margin-bottom 12 → 10
- `.contact-link` 13 → 12.5, padding tightened, margin reduced
- `.skill-tag` 10.5 → 10, padding 4/10 → 3/8
- `.skills-tag-container` gap 6 → 5
- `.education-card` padding 14 → 10/12
- Core Attributes: 8 tags → 6 (dropped "Adaptability" and "Time Management" — covered by the other six)

Long URL contact items (`https://github.com/...`, `www.linkedin.com/...`) still safely truncate with ellipsis thanks to the existing `.contact-text { white-space: nowrap; text-overflow: ellipsis; }` rule — no wrapping ugliness.

**Deploy pack.** Goal: the project can be deployed to Vercel, Netlify, or Cloudflare Pages with zero config changes, no build step, and no new dependencies.

- [`vercel.json`](vercel.json) — Vercel config: `cleanUrls`, `trailingSlash: false`, cache headers for `/assets/*` and `*.{css,js}` (1 year immutable), security headers on every response (`X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`, `Permissions-Policy`), SPA rewrite `/(.*) → /index.html`.
- [`netlify.toml`](netlify.toml) — same cache + security headers, plus a Netlify-format SPA redirect.
- [`_redirects`](_redirects) — Cloudflare Pages redirect fallback (`/* → /index.html 200`). Also picked up by Netlify if the TOML is missing.
- [`404.html`](404.html) — branded fallback page for hosts that don't honor the SPA redirect.
- [`robots.txt`](robots.txt), [`sitemap.xml`](sitemap.xml) — SEO basics.
- [`README.md`](README.md) — stack overview, local dev instructions, one-paragraph deploy steps for Vercel, Netlify, Cloudflare Pages, and GitHub Pages (no config file needed for GH Pages).

**What did NOT change**

- Site layout, copy, canvas simulations, design tokens.
- The hover / reveal motion from the previous commit.
- No new dependencies; no build tooling.

## Optimization, Core Attributes Section & Icon Pack (June 2026)

A wider pass on the portfolio: cut bloat, relocate Core Attributes out of the sidebar into its own content section, and add a real icon layer across links.

**File-size reductions** (lines / bytes):

| File | Before | After | Saved |
|------|--------|-------|-------|
| [index.html](index.html) | 623 / 37,006 B | 456 / ~30 KB | −27% lines |
| [style.css](style.css) | 1,133 / 23,193 B | 653 / ~24 KB | −42% lines |
| [script.js](script.js) | 491 / 16,999 B | 333 / 12.8 KB | −32% lines |

**Core Attributes — moved to its own section**

- Removed the 6-chip tag block from the sidebar (it was cramping the layout and not getting its own visual weight).
- New `#attributes` content article (between `#interests` and `#profile`) renders as a 3-column icon grid in [style.css](style.css) under `.attributes-grid` / `.attribute-card`.
- Each attribute (Analytical Thinking, Problem Solving, Research Aptitude, Critical Thinking, Team Collaboration, Communication) gets a dedicated Lucide icon (`brain`, `puzzle`, `flask-conical`, `scale`, `users`, `message-square`), its own tile with a tinted icon box, and a one-line description.
- Added a new **Attributes** nav tab between **Research** and **Projects** so it can be linked to directly.

**Icon layer added to links**

- **Email & phone rows** in the sidebar — click-to-reveal pattern: text is masked (`••••••••••••@gmail.com`, `+91 ••••• ••••0`) until clicked; an `eye` icon badge flips to the real address/number. `data-reveal`, `data-hidden`, `data-revealed` attributes drive the toggle in [script.js](script.js) under `initRevealContacts()`.
- **GitHub & LinkedIn** — replaced the plain text links with a dedicated `.social-link` row containing a **30×30 always-visible colored tile** (GitHub `#0d1117` / white mark, LinkedIn `#0a66c2` / white mark), the handle (`@BioCoderAnurag1`, `Anurag Chauhan`), and a dim `external-link` arrow that brightens on hover. Tiles lift on hover and pick up a brand-tinted drop shadow.
- **Certifications** — converted `<div>` to `<a href="#">` so they read as clickable credentials.
- **Back-to-top button** — new fixed `#back-to-top` button (bottom-right), uses the `arrow-up` Lucide icon, hidden via the new `.hidden` utility until the user scrolls past 320px.

**`.hidden` utility**

Added in [style.css](style.css) near the end of the reveal block:

```css
[hidden], .hidden { display: none !important; }
```

Covers the native `hidden` attribute, the `.hidden` class, and is wired to the back-to-top button's show/hide behavior (`opacity` + `pointer-events` transition, not the hard `display:none`, so the button can fade smoothly).

**Code condensation (no behavior changes)**

- **HTML** — collapsed multi-line `<meta>` tags, replaced redundant class repeats, switched the blob container to the native `hidden` attribute, added an inline-SVG favicon (🧬 emoji glyph).
- **CSS** — merged 10 card-surface declarations into one shared selector list (`.glass-card, .sidebar-panel, .glass-navbar, .section-card, .interest-card, .project-card, .skill-category-card, .achievements-card, .certifications-card, .attribute-card`), collapsed `0.2s` → `.2s`, merged adjacent rules, dropped the now-orphan `.skill-tag` rule (its only consumer was the old sidebar Core Attributes block).
- **JS** — factored the repeated `resize()` block in all three canvas setups into a shared `setupCanvas(canvas)` helper, replaced edge-iteration `for` loops with `[a,b]` destructuring, swapped class-toggle boilerplate for shorter arrow callbacks.

**What did NOT change**

- Layout grid, breakpoints, color tokens, fonts, Lucide as the icon set.
- The three canvas simulations are still drawn identically — just driven by a shared setup helper.
- No build tooling, no new dependencies, no external icon assets (everything still comes from Lucide via the unpkg CDN).

**Known follow-ups**

- Reveal pattern for email/phone currently toggles the row's `href` behavior on click; consider moving to a dedicated reveal button rather than the whole `<a>` once usage data exists.
- The Social-link tile uses inline `<svg>` for the GitHub / LinkedIn marks so they remain visible even if Lucide's CDN is down — keep these in sync if branding changes.
- Some inline SVG icons (the contact icons in the sidebar) replace the Lucide-based ones for offline safety. Worth a sweep to see if all icons should be inlined this way or just the social ones.

## Adaptive Resize Pass — Rolled Back (June 2026)

The "Adaptive resize pass" commit was reverted on user request. Layout, type, and canvas rendering are back to the fixed-pixel state from the prior checkpoint.

**Why reverted**

The user asked to go "back to normal" — the adaptive pass (fluid `clamp()` tokens, container queries, intermediate breakpoints, ResizeObserver-driven canvas relayout, and the `initResponsiveFlags()` helper) was not the desired direction.

**What was rolled back**

- The :root fluid token block in [style.css](style.css) (`--fs-*`, `--sp-*`, `--container-pad`, `--card-pad`, `--grid-gap`/`-lg`, `--sidebar-w`, `--max-w`) is gone. Type and spacing return to hard `px` values.
- All 7 intermediate breakpoint tiers (`2xl`, `lg`, `md`, `tab`, `sm`, `xs`, plus the `(hover: none)` block) are gone. The two original media queries (`max-width: 1024px` and `max-width: 768px`) are back in place.
- All 3 container queries (`@container main`, `@container card`) are gone, along with `container-type: inline-size` annotations on `.scroll-content` and `.project-card`.
- The ResizeObserver-driven `setupCanvas()` rewrite is reverted. Canvases use `window.addEventListener('resize', resize)` and `devicePixelRatio` captured at the moment `resize()` runs.
- All three canvas initializers (`initProteinCanvas`, `initNetworkCanvas`, `initDockingCanvas`) are back to absolute pixel coords (no relative relayout).
- The `initResponsiveFlags()` helper, `canvasRegistry`, `setActiveSection()`, `makeLooper()`, and `onResize()` are removed.

**Files back to the pre-adaptive state**

| File | Lines (this checkpoint) |
|---|---|
| [index.html](index.html) | 456 |
| [style.css](style.css) | 653 |
| [script.js](script.js) | 333 |
| **Total** | **1,442** |

**Verification**

- `node -c script.js` passes.
- `clamp(` count in [style.css](style.css): **0**.
- Adaptive JS symbols (`ResizeObserver`, `matchMedia`, `canvasRegistry`, `setActiveSection`, `makeLooper`, `onResize`, `initResponsiveFlags`) all return **0** matches in [script.js](script.js).
- The portfolio's prior commit chain (`ae698a4` Optimize + icon pack) is the current `main` HEAD with the rollback applied on top.

**Note on this section**

This entry stays in CHECKPOINT.md so the adaptive pass is recorded as a thing that was tried and reverted. If the rollback is itself later squashed away, the next refresh of the "Optimize, Core Attributes, Icon Pack" section above is the canonical post-rollback state.