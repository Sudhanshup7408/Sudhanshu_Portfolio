# Images — notes (not deployed)

> Kept at the project root on purpose. Anything inside `public/` is copied
> verbatim into `dist/` and served publicly; this file must not be.

Screenshots shown in the **Conversational bots** section (`#bots` → "From the build").

| File | Shown as |
|---|---|
| `whatsapp-citizen-services.jpg` | Application tracking on WhatsApp |
| `tourism-conversation-flow.png` | Conversation design for the tourism assistant |

## Adding another screenshot

Drop the file in this folder and copy one `<figure class="card shot">` block in
`index.html` inside `.shots-grid`. Three things to update:

- `data-full="images/your-file.png"` — the version the lightbox opens
- the `<img src>` — same path
- the `alt` text — describe what the screenshot *shows*, not "screenshot of app"

The `onerror` handler on each `<img>` swaps in a dashed placeholder naming the missing
file, so a wrong path degrades to a visible to-do rather than a broken-image icon.

Thumbnails are cropped to 16:10 from the top, so put the important part near the top of
the image. The lightbox shows the full uncropped file.

## Before you publish these

Both current images are **client work for a government project**. Check with PeLocal
that you're allowed to show them publicly — conversation-design documents in particular
are usually internal deliverables. Deleting a `<figure class="card shot">` block from
`index.html` removes one cleanly; deleting both leaves the "From the build" heading,
so remove `.shots-grid` and the `.shots-title` heading together.

## Deliberately not included

From the same source folder, these were left out on purpose:

- **Government of Goa emblem** — an official state emblem on a personal site implies
  endorsement or official affiliation. Name the department in text instead.
- **Jenkins build logs and `kubectl` output** — these contained internal repository
  paths, service names, and a colleague's username.
- **A client email thread** — real names and addresses of client-side staff.
- **The earlier tourism flow revision** — annotated with third-party API dependencies
  and unconfirmed integrations. The Beta1 revision that is included is cleaner.
