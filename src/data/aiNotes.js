/* ─────────────────────────────────────────────────────────────────────────
   AI LEARNING: this is the file you edit to add to the /ai page.

   ⚠️  THE THREE NOTES BELOW ARE SEEDS, NOT YOUR WRITING.
   They describe how the technology behaves, which is checkable, and they
   deliberately make no claim about what you personally built or measured.
   Rewrite them in your own voice as you go, or delete them. Anything that
   sounds like a first-hand result should be something you actually saw.

   ── Schema ──────────────────────────────────────────────────────────────
   slug      string   URL fragment, kebab-case
   date      string   ISO yyyy-mm-dd, the day you wrote it
   tag       string   short topic label, becomes a filter chip
   title     string   what you learned, as a statement
   body      string   the note itself, a paragraph or two
   takeaway  string   one line: the thing worth remembering
   ───────────────────────────────────────────────────────────────────────── */
export const aiNotes = [
  {
    slug: 'chunking-decides-retrieval-quality',
    date: '2026-07-28',
    tag: 'RAG',
    title: 'Chunk size decides retrieval quality more than the model does',
    body: `A chunk is the unit of retrieval, so it is also the unit of failure. Chunks that
           are too large bury the answer among unrelated sentences and the similarity score
           drifts toward the document's general topic instead of the question. Chunks that
           are too small win on similarity but arrive without the surrounding sentence that
           made them mean anything, so the model has to guess the context back.

           The usual fix is overlap: repeat a slice of the previous chunk at the start of
           the next one, so a fact that straddles a boundary survives in at least one whole
           piece. Splitting on document structure (headings, list items, table rows) beats
           splitting on a fixed character count, because the structure already marks where
           one idea ends.`,
    takeaway: 'Tune the retriever before reaching for a bigger model. Most bad answers are bad chunks.',
  },
  {
    slug: 'embeddings-are-not-interchangeable',
    date: '2026-08-04',
    tag: 'Embeddings',
    title: 'You cannot mix embedding models inside one vector store',
    body: `Two embedding models produce vectors in two different spaces. Cosine similarity
           between a vector from model A and a vector from model B is a number, which is the
           dangerous part: nothing errors, the search just returns near-random neighbours.
           Changing the embedding model therefore means re-embedding the whole corpus, not
           only the new documents.

           This makes the model name worth storing next to every vector, alongside the
           dimension count. A mismatch then fails loudly at write time instead of quietly
           degrading answer quality weeks later, and a re-index becomes a filter over
           metadata rather than a full rebuild from source.`,
    takeaway: 'Store the embedding model and dimension as metadata. A silent space mismatch is the worst kind.',
  },
  {
    slug: 'streaming-changes-the-error-contract',
    date: '2026-08-11',
    tag: 'Streaming',
    title: 'Token streaming moves error handling after the status code',
    body: `A normal request fails before the response starts, so an exception maps cleanly to
           a 4xx or 5xx. A streamed response has already sent 200 OK and a header block by
           the time the model call can fail, so the transport has no status code left to
           spend. The failure has to travel inside the stream as a message the client knows
           how to read, and the client has to distinguish "the stream ended" from "the
           stream ended early".

           That makes a terminal event worth sending explicitly rather than relying on the
           socket closing. A final frame that says done, with a reason, lets the client tell
           a finished answer apart from a truncated one, and lets a retry resume instead of
           starting the whole generation again.`,
    takeaway: 'Once you stream, errors are payload, not status codes. Send an explicit terminal frame.',
  },
]

/* What you are working through right now. `state` is one of:
   'learning' (in progress) · 'next' (queued) · 'solid' (comfortable shipping it) */
export const aiLearning = [
  { topic: 'Spring AI advisors and chat memory',   state: 'learning' },
  { topic: 'pgvector index tuning: HNSW vs IVFFlat', state: 'learning' },
  { topic: 'Evaluating RAG answers automatically',  state: 'next' },
  { topic: 'Tool and function calling from Java',    state: 'next' },
  { topic: 'Embeddings and semantic search',         state: 'solid' },
  { topic: 'Token streaming over WebSocket and SSE', state: 'solid' },
  { topic: 'Prompt grounding and context assembly',  state: 'solid' },
]

/* Reference material worth going back to. Keep this short and opinionated. */
export const aiResources = [
  {
    label: 'Spring AI reference documentation',
    href: 'https://docs.spring.io/spring-ai/reference/',
    note: 'The advisors and vector store chapters are the parts worth reading twice.',
  },
  {
    label: 'pgvector',
    href: 'https://github.com/pgvector/pgvector',
    note: 'Index types and distance operators, straight from the source.',
  },
  {
    label: 'Anthropic prompt engineering guide',
    href: 'https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering/overview',
    note: 'Structure and grounding techniques that transfer to any provider.',
  },
]
