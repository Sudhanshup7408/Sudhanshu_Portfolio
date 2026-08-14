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
           WhatsApp. One conversation engine, two front doors.`,
  },
  {
    icon: 'users',
    title: 'CRM tool',
    body: `The Agent-Supervisor console staff actually work in: a four-role access model, live
           chat on the open thread, and SLA automation that escalates on its own.`,
  },
  {
    icon: 'swap',
    title: 'Live agent handoff',
    body: `When the bot cannot resolve it, or the citizen just asks for a human, the thread
           moves into the CRM with an SLA-tracked ticket already attached.`,
  },
]

export const messageFlow = [
  ['Webhook lands', 'Meta Cloud API posts the inbound message to the ingress endpoint.'],
  ['Signature verified', "Anything that doesn't match the app secret is rejected before it's parsed."],
  ['Deduplicated by message ID', 'Meta retries on timeout, so dedup is what stops a retry becoming a second reply.'],
  ['Published to Kafka', 'The HTTP call returns immediately; processing happens off the request thread.'],
  ['Tenant and session resolved', 'The consumer works out which department owns the number and loads the thread state.'],
  ['Menu node or RAG answer', 'Structured intents walk the flow tree; open questions go to retrieval.'],
  ['Reply dispatched', 'Back out through the Cloud API, or streamed token-by-token to the web widget.'],
]

// Illustrative, department-agnostic walkthrough: menu → intent → slot fill →
// grounded answer → live-agent handoff. Deliberately carries no client copy.
export const chatAssistant = { name: 'Citizen Services Assistant', avatar: 'CS' }

export const chatScript = [
  {
    from: 'in',
    text: 'Welcome to <b>Citizen Services</b>. What can I help you with?',
    chips: ['Track an application', 'Apply for a service', 'Talk to an agent'],
  },
  { from: 'out', text: 'Track an application' },
  {
    from: 'in',
    text: 'Which department is it with?',
    chips: ['Tourism', 'Police', 'Healthcare'],
  },
  { from: 'out', text: 'Tourism' },
  { from: 'in', text: 'Send me the reference number and I\'ll pull up the status.' },
  { from: 'out', text: 'REF-4821' },
  {
    from: 'in',
    text: 'REF-4821 is <b>under review</b>, submitted 12 days ago. The published turnaround for this service is 15 working days.',
    meta: 'retrieved from the department knowledge base',
  },
  { from: 'out', text: 'Can I speak to someone?' },
  {
    from: 'in',
    text: 'Transferring you to a live agent now. A ticket has been raised and is SLA-tracked.',
    meta: 'handed to the Agent-Supervisor queue',
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
    body: `Tourism, Police, and Healthcare share one service but never share a knowledge base.
           Retrieval is filtered to the calling tenant before the prompt is built.`,
  },
  {
    icon: 'chat',
    title: 'Where users already are',
    body: `Delivered through WhatsApp on the Meta Cloud API: signature-verified webhooks,
           message dedup, and Kafka-backed processing so a retry never doubles a reply.`,
  },
]
