# Images: notes (not deployed)

> Kept at the project root on purpose. Anything inside `public/` is copied
> verbatim into `dist/` and served publicly; this file must not be.

## What ships

**No client images at all.** `public/` contains `resume.pdf` and `_redirects`,
nothing else.

Everything that used to be a screenshot is now drawn in code:

| Visual | Where it lives |
|---|---|
| Conversation flow tree | `src/components/FlowDiagram.jsx`, inline SVG |
| RAG request path | `src/components/AiSection.jsx`, inline SVG |
| WhatsApp conversation | `src/components/BotsSection.jsx`, animated from `data/bots.js` |
| The four platform builds | `src/components/Carousel.jsx`, from `data/builds.js` |

Drawn visuals theme with the site, scale without going fuzzy, stay readable to
screen readers, and cannot leak a client detail someone forgot to crop.

## History

Two client screenshots were previously in `public/images/`:

- `whatsapp-citizen-services.jpg`, a real WhatsApp thread with a bot built for a
  state government client. It was anonymised (bot name, owning organisation and
  verified badge painted over) and shipped for a while as
  `citizen-services-bot.jpg`. It has since been removed entirely.
- `tourism-conversation-flow.png`, the client's own conversation-design
  document. Replaced by `FlowDiagram.jsx`.

The originals are still in `~/Downloads` and are **not** in git history for this
repo. Keep it that way.

## If you ever add one back

Drop the file in `public/images/`, then add an entry to a `shots` array and a
gallery component to render it. The old gallery, lightbox and their CSS were
deleted when the last image went, so this means writing them again rather than
uncommenting something.

**Anonymise first.** Check for bot or product names, organisation names and
logos, verified badges, real reference numbers, personal names, phone numbers,
internal hostnames, URLs, and file paths.

Prefer drawing it. A diagram you control beats a screenshot you have to redact.

## Deliberately not included

From the same source folder, these were left out:

- **An official state emblem.** A government emblem on a personal site implies
  endorsement or official affiliation.
- **Jenkins build logs and `kubectl` output.** These contained internal
  repository paths, service names, and a colleague's username. The Challenges
  entries quote the error text only, with service names replaced by
  `<service>`.
- **An email thread.** Real names and addresses of client-side staff.
- **An earlier revision of the conversation flow.** Annotated with third-party
  API dependencies and unconfirmed integrations.
