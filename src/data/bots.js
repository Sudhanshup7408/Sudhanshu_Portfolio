export const channels = [
  {
    icon: 'chat',
    title: 'WhatsApp bot',
    body: `Menu-driven flows plus free-text questions, on the Meta Cloud API. Session state,
           inactivity timeouts, and a return-to-menu control at every node.`,
  },
  {
    icon: 'window',
    title: 'Web bot',
    body: `An embeddable widget on the department portal, talking to the same backend as
           WhatsApp — one conversation engine, two front doors.`,
  },
  {
    icon: 'users',
    title: 'Live agent handoff',
    body: `When the bot can't resolve it — or the citizen just asks for a human — the thread
           moves to the Agent-Supervisor console with an SLA-tracked ticket attached.`,
  },
]

export const messageFlow = [
  ['Webhook lands', 'Meta Cloud API posts the inbound message to the ingress endpoint.'],
  ['Signature verified', "Anything that doesn't match the app secret is rejected before it's parsed."],
  ['Deduplicated by message ID', 'Meta retries on timeout — dedup is what stops a retry becoming a second reply.'],
  ['Published to Kafka', 'The HTTP call returns immediately; processing happens off the request thread.'],
  ['Tenant and session resolved', 'The consumer works out which department owns the number and loads the thread state.'],
  ['Menu node or RAG answer', 'Structured intents walk the flow tree; open questions go to retrieval.'],
  ['Reply dispatched', 'Back out through the Cloud API, or streamed token-by-token to the web widget.'],
]

// Mirrors the real routing tree: welcome → explore → beaches → region →
// grounded answer → live-agent handoff.
export const chatScript = [
  {
    from: 'in',
    text: 'Welcome to the <b>Goa Tourism Virtual Assistant</b>. I can help you explore places, find things to do, and more.',
    chips: ['Explore Goa', 'Travel Help', 'Stay & Accommodation', 'Chat with us'],
  },
  { from: 'out', text: 'Explore Goa' },
  {
    from: 'in',
    text: 'What would you like to see?',
    chips: ['Beaches', 'Heritage & Cultural Sites', 'Nature & Scenic Spots', 'Food & Dining'],
  },
  { from: 'out', text: 'Beaches' },
  { from: 'in', text: 'Pick a region.', chips: ['North Goa', 'South Goa'] },
  { from: 'out', text: 'North Goa' },
  {
    from: 'in',
    text: 'Goa beaches are a stunning stretch of golden sands along the Arabian Sea, offering a vibrant mix of lively shacks, water sports, and serene sunset views.',
    meta: 'retrieved from the Tourism knowledge base',
  },
  { from: 'out', text: 'Can I speak to someone?' },
  {
    from: 'in',
    text: 'Transferring you to a live agent now — a ticket has been raised and is SLA-tracked.',
    meta: 'handed to the Agent-Supervisor queue',
  },
]

// See public/images/README.md before publishing these — they are client work.
export const shots = [
  {
    src: 'images/whatsapp-citizen-services.jpg',
    alt: 'WhatsApp conversation with a government services bot showing a numbered menu of citizen, business and other application types, and a Back to Main Menu control.',
    title: 'Application tracking on WhatsApp',
    caption: 'Menu-driven service lookup with a return-to-menu control and inactivity timeout handling.',
  },
  {
    src: 'images/tourism-conversation-flow.png',
    alt: 'Conversation design flowchart for the tourism assistant, branching from a welcome node into explore, travel help, stay and accommodation, and live agent transfer paths.',
    title: 'Conversation design for the tourism assistant',
    caption: 'The flow tree behind the bot — every branch, fallback, and the escalation path to a live agent.',
  },
]

export const aiCapabilities = [
  {
    icon: 'search',
    title: 'Retrieval, not recall',
    body: `Documents are chunked, embedded, and stored in pgvector. Every answer is assembled
           from chunks actually retrieved for that question, which is what keeps the model
           from confidently inventing policy.`,
  },
  {
    icon: 'bolt',
    title: 'Streamed, not spinning',
    body: `Output is pushed token-by-token over WebSocket and SSE, so the reply renders as it
           is generated instead of landing as one delayed block.`,
  },
  {
    icon: 'grid',
    title: 'Tenant-scoped corpora',
    body: `Tourism, Police, and Healthcare share one service but never share a knowledge base —
           retrieval is filtered to the calling tenant before the prompt is built.`,
  },
  {
    icon: 'chat',
    title: 'Where users already are',
    body: `Delivered through WhatsApp on the Meta Cloud API — signature-verified webhooks,
           message dedup, and Kafka-backed processing so a retry never doubles a reply.`,
  },
]
