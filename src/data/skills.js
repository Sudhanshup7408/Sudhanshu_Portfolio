// `hot` marks a tag for accent highlighting.
export const skills = [
  {
    icon: 'code',
    title: 'Languages',
    tags: ['Java (8/11/17)', 'SQL', 'Bash/Shell', 'Core Java', 'Multithreading',
           'Concurrency', 'OOP', 'SOLID'],
    hot: [],
  },
  {
    icon: 'box',
    title: 'Frameworks',
    tags: ['Spring Boot', 'Spring MVC', 'Spring Security', 'Spring Data JPA',
           'Hibernate/JPA', 'REST APIs', 'gRPC'],
    hot: ['Spring Boot'],
  },
  {
    icon: 'nodes',
    title: 'Architecture',
    tags: ['Microservices', 'Event-Driven', 'Distributed Systems', 'API Gateway', 'CQRS', 'Saga'],
    hot: ['Microservices'],
  },
  {
    icon: 'swap',
    title: 'Messaging',
    tags: ['Apache Kafka', 'RabbitMQ', 'WebSocket', 'Server-Sent Events', 'Webhooks',
           'Async Processing'],
    hot: ['Apache Kafka'],
  },
  {
    icon: 'db',
    title: 'Databases',
    tags: ['PostgreSQL', 'MySQL', 'MongoDB', 'Redis', 'Schema Design', 'Indexing',
           'Query Optimization'],
    hot: ['PostgreSQL'],
  },
  {
    icon: 'cloud',
    title: 'DevOps & Cloud',
    tags: ['Docker', 'Kubernetes', 'Jenkins', 'CI/CD', 'AWS (EC2, S3, IAM)', 'Nginx',
           'Linux', 'Maven', 'Git'],
    hot: ['Docker', 'Kubernetes'],
  },
  {
    icon: 'pulse',
    title: 'Observability',
    tags: ['Prometheus', 'Grafana', 'ELK Stack', 'Elasticsearch', 'Logstash', 'Kibana',
           'Alerting', 'RCA'],
    hot: [],
  },
  {
    icon: 'lock',
    title: 'Security',
    tags: ['OAuth 2.0', 'JWT', 'RBAC', 'SSO', 'OWASP Top 10', 'SonarQube', 'Checkmarx',
           'SAST', 'TLS/SSL'],
    hot: ['OAuth 2.0'],
  },
  {
    icon: 'spark',
    title: 'AI / LLM',
    tags: ['Spring AI', 'RAG', 'LLM APIs', 'pgvector', 'Embeddings', 'Semantic Search'],
    hot: ['Spring AI', 'RAG'],
  },
  {
    // Built the Newgen document engine without any of these, then knows them
    // well enough to have replaced one. Both facts are worth listing.
    icon: 'doc',
    title: 'Documents & Media',
    tags: ['PDF spec', 'iText', 'PDFBox', 'FFmpeg', 'Annotations', 'PDF encryption',
           'Magic-number detection', 'Image/Video transcode', 'DOCX to PDF'],
    hot: ['PDF spec'],
  },
  {
    icon: 'check',
    title: 'Testing',
    tags: ['JUnit 5', 'Mockito', 'TDD', 'JaCoCo', 'JMeter', 'Integration Testing',
           'Code Coverage'],
    hot: [],
  },
  {
    icon: 'clock',
    title: 'Practices',
    tags: ['Agile/Scrum', 'System Design', 'Code Review', 'Production Support',
           'Incident Management'],
    hot: [],
  },
]
