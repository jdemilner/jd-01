# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Quick Start

**Setup:**
```bash
npm install
npm run lint:fix  # fix any linting issues
```

**Development:**
```bash
npm run aem up  # or globally: npm install -g @adobe/aem-cli && aem up
```
Runs dev server at `http://localhost:3000` with auto-reload. Content comes from local code (including uncommitted changes) and CMS preview.

**Code Quality:**
```bash
npm run lint          # check both JS and CSS
npm run lint:js       # ESLint only
npm run lint:css      # Stylelint only
npm run lint:fix      # auto-fix linting issues
```

Linting must pass before committing. Run `npm run lint:fix` to resolve most issues automatically.

## Architecture Overview

This is an **Adobe Experience Manager (AEM) Edge Delivery Services** project. Pages are authored in the CMS and decorated client-side by blocks and scripts.

### Three-Phase Loading

Pages load in phases to maximize Core Web Vitals:
1. **Eager** — sections and first block (LCP critical)
2. **Lazy** — remaining blocks (header, footer)
3. **Delayed** — martech, analytics, heavy features

Implement performance-sensitive code in `lazy-styles.css` and `delayed.js`; put LCP-critical styles in `styles/styles.css`.

### Block Pattern

Each block exports a decorator function that transforms CMS-authored HTML into final UI:

```javascript
export default function decorate(block) {
  // 1. Load dependencies
  // 2. Extract config from DOM
  // 3. Transform DOM structure
  // 4. Add event listeners
}
```

Blocks are self-contained and reusable. CSS is scoped to `.{blockname}` selector. Block markup is the contract between authors and developers — inspect CMS output with `curl http://localhost:3000/path` before assuming structure.

### Auto-Blocking

Certain patterns create blocks automatically (see `buildAutoBlocks` in `scripts.js`):
- `a[href*="/fragments/"]` → fragment blocks
- `a[href*="/widgets/"]` → widget blocks

### Content & Markup

CMS content is structured into **sections** (divs with data attributes) containing default content and block markup. For testing without CMS content, create static `.html` files in `drafts/` and run `aem up --html-folder drafts`.

Reference the markup structure at https://www.aem.live/developer/markup-sections-blocks.

## Testing & Debugging

**Inspect CMS HTML:**
```bash
curl http://localhost:3000/path/to/page
curl http://localhost:3000/path/to/page.plain.html  # raw HTML before decoration
```

**Check DOM transformation:** Open browser DevTools Console on `http://localhost:3000` and inspect block elements after decoration.

**Performance:** Run PageSpeed Insights against `https://{branch}--{repo}--{owner}.aem.page/` (feature preview) before merging. Target 100.

## For Detailed Guidance

See **[AGENTS.md](./AGENTS.md)** for:
- Complete project structure and file organization
- Code style rules (ES6+ JS, modern CSS, semantic HTML)
- Block development patterns and accessibility standards
- Content/CMS workflow and deployment
- AEM Edge Delivery documentation links

See **[CONTRIBUTING.md](./CONTRIBUTING.md)** for PR and publishing workflow.
