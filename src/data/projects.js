// Every distinct `tags` value becomes its own filter chip automatically.
//
// Layout: the grid has 6 tracks. `feature: true` spans 3 (half width),
// otherwise a card spans 2 (a third). Rows tile flush when the spans in a
// row add up to 6, currently 3+3 then 2+2+2.
//
// `links` is optional: [{ label: 'Source', href: '…', icon: 'github' | 'external' }]
export const projects = [
  {
    index: '01',
    badge: 'PeLocal',
    badgeTone: '',
    title: 'Citizen Services Platform',
    feature: true,
    tags: ['Government', 'Microservices'],
    desc: `Three government departments (Tourism, Police, and Healthcare) running on one
           multi-tenant Spring Boot backend. Tenant-scoped routing, isolated data boundaries,
           and a shared service core so a new department onboards as configuration rather
           than a fork.`,
    bullets: [
      'Multi-tenant request routing across three departmental flows',
      'WhatsApp bot on Meta Cloud API with verified webhook ingestion',
      'Polyglot persistence: PostgreSQL transactions, MongoDB reporting',
    ],
    stack: ['Spring Boot', 'Multi-tenancy', 'Kafka', 'PostgreSQL', 'MongoDB', 'Meta Cloud API'],
  },
  {
    index: '02',
    badge: 'PeLocal',
    badgeTone: '',
    title: 'Conversational AI Backend',
    feature: true,
    tags: ['AI & LLM', 'Government'],
    desc: `A production Spring AI service that answers citizen queries from the department's
           own documents. pgvector retrieval grounds every response, and answers stream back
           token-by-token so the user sees the reply forming instead of waiting on a spinner.`,
    bullets: [
      'RAG pipeline over pgvector embeddings with semantic search',
      'Token-by-token LLM streaming over WebSocket and SSE',
      'Cut inbound support queries by roughly 40%',
    ],
    stack: ['Spring AI', 'RAG', 'pgvector', 'WebSocket', 'SSE', 'Embeddings'],
  },
  {
    index: '03',
    badge: 'PeLocal',
    badgeTone: '',
    title: 'Agent & Ticketing Platform',
    tags: ['Government', 'Microservices'],
    desc: `Agent-Supervisor backend with a four-role access model, live chat, and SLA
           automation. Escalations fire on their own, and supervisors get KPI reporting
           across the queue.`,
    stack: ['Spring Security', 'RBAC', 'SLA automation', 'WebSocket'],
  },
  {
    index: '04',
    badge: 'Newgen',
    badgeTone: 'alt',
    title: 'Video KYC Service',
    tags: ['Fintech', 'Media'],
    desc: `OpenVidu and FFmpeg media pipeline on AWS EC2 for compliance capture: recorded,
           processed, and archived KYC sessions meeting regulatory retention requirements.`,
    stack: ['Spring Boot', 'OpenVidu', 'FFmpeg', 'AWS EC2'],
  },
  {
    index: '05',
    badge: 'Newgen',
    badgeTone: 'alt',
    title: 'Document Processing Engine',
    tags: ['Documents', 'Media'],
    desc: `A PDF and media engine written from scratch against the spec, with no third-party
           library in the final build. It replaced the licensed iText dependency outright,
           removing ~$15K per year of licence cost along with the vendor risk that came
           with it.`,
    bullets: [
      'Page operations: create, insert, delete, remove, shuffle, split and merge',
      'Encrypt and decrypt with owner/user passwords and permission flags',
      'Annotations by hand: line, circle, rectangle, free text, links, watermarks',
      'True file type from magic-number headers, not the extension',
      'Image sequences to video, and video to extracted frames',
    ],
    stack: ['Core Java', 'PDF spec', 'Multithreading', 'FFmpeg', 'AWS EC2'],
  },
  {
    index: '06',
    badge: 'NPCI',
    badgeTone: 'alt2',
    title: 'NACH & BBPS Payment Rails',
    tags: ['Fintech', 'Microservices'],
    desc: `Core Java and Hibernate services sustaining 1M+ daily transactions on national
           payment infrastructure, with Redis caching and circuit breakers holding
           availability through peak load.`,
    stack: ['Core Java', 'Hibernate/JPA', 'Kafka', 'Redis', 'Swagger/OpenAPI'],
  },
]
