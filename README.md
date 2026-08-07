# Sudhanshu Pal — Portfolio (React)

React + Vite rewrite of the portfolio, with a **Problems & solutions** log you post to by
editing one data file.

Built and verified — see [What was verified](#what-was-verified).

## Requirements

Node 18+. This machine has **Node 24.19.0 LTS** installed at `~/.local/nodejs`, symlinked
into `~/.local/bin` (already on `PATH` via `~/.profile`). No system packages were touched
and no dotfiles were edited. To remove it: `rm -rf ~/.local/nodejs ~/.local/bin/{node,npm,npx,corepack}`.

## Commands

```bash
cd portfolio-react
npm install          # 63 packages
npm run dev          # http://localhost:5173
npm run build        # → dist/  (~772ms)
npm run preview      # serve dist/ locally
```

Build output:

```
dist/index.html                 2.95 kB │ gzip:  1.39 kB
dist/assets/index-*.css        45.66 kB │ gzip:  9.87 kB
dist/assets/index-*.js        211.66 kB │ gzip: 67.98 kB
```

`npm run build` empties `dist/` first, so don't keep anything in there by hand.

## Deploy

`vite.config.js` sets `base: './'`, so `dist/` works from any path — a root domain, a
project subpath, or opened off disk.

### Netlify — drag and drop (fastest, no account setup beyond signup)

1. `npm run build`
2. Go to <https://app.netlify.com/drop>
3. Drag the **`dist` folder** onto the page

Live in seconds at a random `*.netlify.app` name, which you can rename under
**Site configuration → Change site name**. The catch: every update means rebuilding and
re-dragging.

### Netlify — connected to Git (recommended)

`netlify.toml` in this folder already carries the settings, so there is nothing to type
into the UI:

| Setting | Value |
|---|---|
| Build command | `npm run build` |
| Publish directory | `dist` |
| Node version | 22 (pinned in `netlify.toml` and `.nvmrc`) |

1. Put this folder in a Git repo and push it to GitHub.
2. Netlify → **Add new site → Import an existing project** → pick the repo.
3. Netlify reads `netlify.toml` — confirm and deploy.

Every push to the default branch redeploys. Pull requests get their own preview URL.

**If the repo root is the parent folder** (with `portfolio/` and `portfolio-react/` side
by side), set **Base directory** to `portfolio-react` in Netlify's build settings.

### Netlify — CLI

```bash
npm install -g netlify-cli
netlify login
netlify deploy --build            # draft URL to check first
netlify deploy --build --prod     # promote to the live URL
```

### Other free hosts

| Host | Settings |
|---|---|
| **Vercel** | Auto-detects Vite. Build `npm run build`, output `dist` |
| **Cloudflare Pages** | Build `npm run build`, output `dist`, `NODE_VERSION=22` env var |
| **GitHub Pages** | Free, but needs an Action to build — the others build for you |

### What `netlify.toml` sets, and why

- **Node 22** — Netlify's default can lag behind, and Vite 5 needs 18+.
- **`/assets/*` cached forever** — Vite fingerprints those filenames, so they can never
  go stale.
- **`index.html` never cached** — otherwise visitors keep requesting old asset names
  after a deploy and see a blank page.
- **No SPA catch-all.** Most Vite guides tell you to add `/* /index.html 200`. That's for
  client-side routers. This site is one page and navigates with hash fragments
  (`#log/<slug>`) which never reach the server, so a catch-all would only hide real 404s.

### ⚠️ Everything in `public/` becomes a public URL

Vite copies `public/` into `dist/` verbatim — no bundling, no filtering. `public/notes.txt`
is live at `yoursite.com/notes.txt`, linked from nowhere but reachable by anyone who
guesses or crawls it.

`IMAGES.md` lives at the project root rather than in `public/images/` for exactly this
reason: it names a client email thread and a colleague's username, and it was previously
being published at `/images/README.md`. Keep working notes out of `public/`.

Before each deploy, check what you are actually shipping:

```bash
find dist -type f
```

Right now that is six files — the HTML, one JS bundle, one CSS bundle, two screenshots
and the résumé PDF. 756 KB total.

## Where the content lives

All copy is in `src/data/` — you should rarely need to touch a component.

| File | Holds |
|---|---|
| `profile.js` | Name, contact, availability, hero terminal lines, stats, focus areas, education |
| `skills.js` | The eleven skill cards. `hot` marks a tag for accent colour |
| `experience.js` | Roles and bullets |
| `projects.js` | Project cards, their tags and layout spans |
| `posts.js` | **The problem log** — see below |
| `bots.js` | Channel cards, message-flow steps, the chat demo script, gallery images |

## Posting a problem & solution

Add an object to the `posts` array in `src/data/posts.js`. The schema is documented at
the top of that file. Minimum viable entry:

```js
{
  slug: 'redis-connection-storm',
  title: 'Every pod reconnected to Redis at the same second',
  date: '2026-08-14',
  kind: 'Production incident',      // Build | Bug | Performance | Production incident
  tone: 'red',                      // red | amber | blue | green
  tags: ['Redis', 'Production'],
  summary: 'One line. This is what people read before deciding to expand.',
  symptom: 'What you saw.',
  cause: 'What was actually wrong.',
  fix: ['First thing you did.', 'Second thing.'],
  outcome: 'What changed. Measured, if you can measure it.',
  takeaway: 'The transferable lesson — the part worth reading.',
}
```

Optional: `evidence: { label, body }` for a verbatim log block, and
`code: { label, body }` for a snippet. Both render in a monospace panel.

Behaviour you get for free:

- Entries sort newest-first by `date`
- Every distinct `tags` value becomes a filter chip with a live count
- Full-text search across title, summary, symptom, cause, takeaway and tags
- Each entry is deep-linkable at `#log/<slug>` — opening that URL expands it and scrolls
  to it, and expanding an entry updates the address bar so you can share it
- Every entry is searchable from the command palette (`Ctrl/Cmd + K`)

### ⚠️ The three seeded entries

`posts.js` ships with three entries reconstructed from build logs and screenshots found
in your Downloads folder. **The symptoms are real and quoted verbatim; the root causes and
fixes are the most likely explanation, not a record of what you actually did.** Rewrite
each to match what really happened, or delete it. Nothing there should go public unverified.

## Architecture

```
src/
  main.jsx            entry
  App.jsx             layout, theme, palette wiring, toast
  styles.css          the whole design system — CSS custom properties, no CSS-in-JS
  hooks/index.js      useTheme, useReveal, useCountUp, useScrollSpy, useTypewriter, copyText
  components/
    Icon.jsx          every SVG in one lookup
    Reveal.jsx        scroll-reveal wrapper + SectionHead + Tags
    Nav.jsx           nav, scroll spy, sliding indicator, mobile menu
    CommandPalette.jsx
    Hero.jsx          hero + code window + stats strip
    AiSection.jsx     RAG diagram (inline SVG) + capabilities + code
    BotsSection.jsx   channels, message flow, animated chat demo, gallery + lightbox
    ProblemLog.jsx    ← the problems & solutions section
    Projects.jsx      filterable project grid
    Sections.jsx      About, Skills, Experience, Education, Contact, Footer
```

Deliberately no router, no UI library, no CSS framework — one page, plain CSS, two
dependencies (`react`, `react-dom`).

### Notes on the port

- Theme is applied by an inline script in `index.html` before first paint; `useTheme`
  reads that value rather than recomputing it, so there's no flash.
- `StrictMode` double-invokes effects in development. The chat demo guards against this
  with a run counter, so a replay cancels the previous run instead of interleaving.
- The chat script is the only place using `dangerouslySetInnerHTML` — it renders `<b>`
  inside bot messages. The content is your own static data, but keep it that way.
- The nav collapses to a burger at **1080px** rather than 860px, because eight links no
  longer fit one row.

## What was verified

Built with `npm run build`, served from `dist/`, and driven in headless Chrome.

- **Build** — compiles clean, 48 modules, no warnings.
- **Runtime** — no console errors. All 11 sections mount; 3 log entries, 9 log tag chips,
  6 project chips, 11 skill cards, 4 timeline entries, 2 gallery images (0 failed),
  RAG diagram SVG present.
- **Problem log interactions** — expand sets `aria-expanded` and reveals the body and
  writes `#log/<slug>`; collapse clears the hash; search for "idempotency" narrows to 1;
  the Maven tag chip narrows to 2; the command palette lists 19 entries including all
  three write-ups.
- **Deep links** — loading `#log/maven-repackage-zip-end-header` opens that entry and
  jumps to it (scrollY 6951).
- **Responsive** — no horizontal overflow at 500 / 640 / 768 / 900 / 1024 / 1100 / 1280 /
  1440 px. The nav row never overflows and the burger switches over at 1080px exactly.
- **Both themes** rendered and compared.

### Bugs found and fixed during verification

1. `useReveal` added its `in` class via `classList`, which React overwrites whenever
   `className` changes — the RAG diagram and any failed gallery image would have faded
   to invisible. Now React state.
2. Missing `ol` padding reset indented the Fix steps and the bots message-flow list.
   (Also fixed in the plain-HTML version.)
3. The kind badge stretched full-width in the stacked mobile header — needed `justify-self`.
4. Counters could stick on `0+` if `requestAnimationFrame` is starved. A timer now snaps
   them to the final value; the animation is decoration, the number is not.
5. Deep links smooth-scrolled the entire page before landing. Now instant.

### Known headless-only artifacts (not bugs)

Under `--virtual-time-budget`, Chrome produces very few animation frames (measured: 4
frames in 5s) and does not run smooth scrolls. So scroll-triggered IntersectionObservers
and rAF animations don't advance in automated screenshots. Both work normally in a real
browser — the count-up was confirmed reaching 4+ / 1M+ / ~40% / 90%+ once the fallback
timer was added.

## The previous version

`../portfolio/` is the original plain HTML/CSS/JS build. It still works, has no build
step, and does *not* have the problem log. Keep it until this one runs, then delete it.
