/* ─────────────────────────────────────────────────────────────────────────
   THE FOUR THINGS I BUILT on the citizen services platform, as carousel slides.

   These replaced the client screenshot that used to sit in "From the build".
   Every claim here is drawn from work already described in data/projects.js and
   data/experience.js. If you change a number in one place, change it in both.

   Each slide is deliberately the same shape: the problem, what I built, what
   changed. A carousel is only worth the interaction if the slides compare.
   ───────────────────────────────────────────────────────────────────────── */
export const builds = [
  {
    id: 'whatsapp-bot',
    index: '01',
    icon: 'chat',
    kind: 'Channel',
    title: 'WhatsApp bot',
    sub: 'Meta Cloud API · menu-driven flows',
    problem: `Citizens needed to reach three separate departments, and the only channel they
              reliably already had installed was WhatsApp. Meta's webhooks retry on timeout,
              so a naive handler answers the same message twice.`,
    built: `Signature-verified webhook ingestion that returns immediately and publishes to
            Kafka, so processing never blocks the HTTP call. Message-ID dedup before any
            side effect, session state with inactivity timeouts, and a return-to-menu
            control at every node of the flow tree.`,
    result: `One inbound number per department, served by shared code. A retried delivery is
             recognised and dropped instead of producing a duplicate reply.`,
    metrics: [
      ['Ingestion', 'signature-verified'],
      ['Delivery', 'at-least-once, deduped'],
      ['Transport', 'Kafka off-thread'],
    ],
    stack: ['Spring Boot', 'Meta Cloud API', 'Kafka', 'Redis'],
  },
  {
    id: 'web-bot',
    index: '02',
    icon: 'window',
    kind: 'Channel',
    title: 'Web bot',
    sub: 'Embeddable widget · same backend',
    problem: `The departmental portals needed the same assistant on the web. Rebuilding the
              conversation logic per channel would have meant two flow trees drifting apart
              the moment either one changed.`,
    built: `An embeddable widget that speaks to the identical conversation engine behind
            WhatsApp. The channel is a transport detail resolved at the edge: flows, slot
            filling, and escalation rules are defined once and shared.`,
    result: `Two front doors, one engine. A change to a flow ships to both channels at the
             same time because there is only one definition of it.`,
    metrics: [
      ['Front doors', 'WhatsApp + web'],
      ['Flow definitions', 'one, shared'],
      ['Streaming', 'WebSocket / SSE'],
    ],
    stack: ['Spring Boot', 'WebSocket', 'SSE', 'REST'],
  },
  {
    id: 'crm-tool',
    index: '03',
    icon: 'users',
    kind: 'Internal tool',
    title: 'CRM tool',
    sub: 'Agent & supervisor console · SLA automation',
    problem: `A bot that cannot escalate is a dead end. Staff needed somewhere to pick up the
              threads the bot could not resolve, and supervisors needed to see whether the
              queue was actually being worked.`,
    built: `The Agent-Supervisor console: a four-role access model over Spring Security,
            live chat on the open thread, and SLA automation that escalates on its own
            rather than waiting for someone to notice. KPI reporting sits on top of the
            same queue data.`,
    result: `Every handoff arrives as a ticket with its SLA clock already running, and
             breaches escalate without a human watching the timer.`,
    metrics: [
      ['Access model', 'four roles, RBAC'],
      ['Escalation', 'automatic on SLA'],
      ['Reporting', 'queue-level KPIs'],
    ],
    stack: ['Spring Security', 'RBAC', 'WebSocket', 'PostgreSQL'],
  },
  {
    id: 'rag-assistant',
    index: '04',
    icon: 'spark',
    kind: 'AI',
    title: 'RAG assistant',
    sub: 'Spring AI · pgvector retrieval',
    problem: `Most inbound questions were already answered somewhere in a department's own
              published documents. An ungrounded model would have invented policy, which on
              a government channel is worse than not answering.`,
    built: `A Spring AI service that chunks and embeds source documents into pgvector, then
            answers only from chunks actually retrieved for that question. Retrieval is
            filtered to the calling tenant before the prompt is assembled, and answers
            stream back token-by-token instead of landing as one delayed block.`,
    result: `Roughly 40% fewer inbound support queries, with each answer traceable to the
             documents it was built from.`,
    metrics: [
      ['Support queries', '~40% fewer'],
      ['Grounding', 'retrieved chunks only'],
      ['Isolation', 'per-tenant corpora'],
    ],
    stack: ['Spring AI', 'pgvector', 'RAG', 'Embeddings'],
  },
]
