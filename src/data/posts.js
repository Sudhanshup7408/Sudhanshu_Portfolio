/* ═══════════════════════════════════════════════════════════════════════
   CHALLENGES: write-ups of things that broke and what fixed them.
   This is the file you edit to "post" a new entry.

   ⚠️  THE THREE ENTRIES BELOW ARE STILL DRAFTS
   They were seeded from build logs and screenshots in your Downloads folder.
   Internal service names have been replaced with <service> placeholders, so
   nothing here identifies a client or a colleague, so it is safe to publish in
   the sense of leaking nothing.

   What is NOT settled: the *symptoms* are real and quoted verbatim, but the
   root causes, fix steps and outcomes are the most likely explanation for
   those symptoms. They are not a record of what you actually did, and only you
   know that. Read each `cause`, `fix` and `outcome` and either correct it or
   delete the entry. Do not present a reconstruction as your own debugging.

   ── Schema ────────────────────────────────────────────────────────────
   slug        string    URL fragment: #challenges/<slug> deep-links to the entry
   title       string    the symptom, as you'd describe it to a colleague
   date        string    ISO yyyy-mm-dd, used for sorting (newest first)
   kind        string    badge text: 'Production incident' | 'Build' | 'Bug' | 'Performance'
   tone        string    badge colour: 'red' | 'amber' | 'blue' | 'green'
   tags        string[]  every distinct value becomes a filter chip
   summary     string    one line, shown collapsed; make it the hook
   symptom     string    what you observed
   evidence    ?{label, body}   optional verbatim log/error block
   cause       string    the actual root cause
   fix         string[]  the steps you took, in order
   code        ?{label, body}   optional code or config block
   outcome     string    what changed afterwards, measured if you can
   takeaway    string    the transferable lesson, the part worth reading
   ─────────────────────────────────────────────────────────────────────── */

export const posts = [
  {
    slug: 'spring-profile-placeholder',
    title: 'The app shipped with @spring.profiles.active@ as its profile name',
    date: '2026-05-05',
    kind: 'Build',
    tone: 'amber',
    tags: ['Spring Boot', 'Maven', 'Config'],
    summary:
      'A Maven placeholder never got substituted, so the container booted with a literal token where the profile name should have been.',
    symptom:
      'The service failed to start in UAT. Locally it ran fine; the difference only showed up in the packaged jar.',
    evidence: {
      label: 'kubectl logs <service>-uat',
      body: `APPLICATION FAILED TO START

Description:

Failed to bind properties under 'spring.profiles.active' to java.util.Set<java.lang.String>:

    Property: spring.profiles.active
    Value: "@spring.profiles.active@"
    Origin: class path resource [application.properties] - 5:24
    Reason: java.lang.IllegalStateException: Profile '@spring.profiles.active@'
            must start and end with a letter or digit`,
    },
    cause:
      'application.properties used the @…@ placeholder syntax that spring-boot-starter-parent configures for Maven resource filtering. Filtering was not applied to the packaged resources, so the literal token was copied into the jar untouched. It only surfaced at runtime, in the environment furthest from a debugger.',
    fix: [
      'Confirmed the build inherits spring-boot-starter-parent, which sets the Maven resource delimiter to @ instead of the default ${…}.',
      'Enabled filtering on src/main/resources so the placeholder is substituted at package time.',
      'Added a safe default in the properties file so a missing value degrades to a known profile instead of an unparseable one.',
      'Unpacked the built jar in CI and asserted the property no longer contains an @. That is the check that would have caught this before the deploy.',
    ],
    code: {
      label: 'pom.xml',
      body: `<build>
  <resources>
    <resource>
      <directory>src/main/resources</directory>
      <filtering>true</filtering>
    </resource>
  </resources>
</build>

<!-- and the guard that made it a build failure instead of a 3am page -->
<!-- unzip -p target/app.jar BOOT-INF/classes/application.properties | grep -q '@' && exit 1 -->`,
    },
    outcome:
      'The UAT pod came up on the next deploy, and the CI check now fails the build rather than the pod.',
    takeaway:
      'A build-time placeholder that silently fails to resolve does not break the build; it breaks the runtime, in the environment where you have the least visibility. Assert on the packaged artifact, not on the source.',
  },

  {
    slug: 'maven-repackage-zip-end-header',
    title: 'BUILD FAILURE: “zip END header not found” during repackage',
    date: '2026-05-05',
    kind: 'Build',
    tone: 'amber',
    tags: ['Maven', 'Jenkins', 'CI/CD'],
    summary:
      'A pipeline that had been green for weeks started failing at the repackage step, with nothing in the source having changed.',
    symptom:
      'spring-boot-maven-plugin:repackage failed reading an archive it had just written. Re-running the job sometimes succeeded, which pointed away from the code.',
    evidence: {
      label: 'Jenkins console',
      body: `[ERROR] Failed to execute goal
        org.springframework.boot:spring-boot-maven-plugin:3.3.1:repackage
        (repackage) on project <service>:
        Execution repackage of goal
        org.springframework.boot:spring-boot-maven-plugin:3.3.1:repackage failed:
        Error reading archive file -> [Help 1]

BUILD FAILURE
Total time:  01:26 min`,
    },
    cause:
      'The jar being repackaged was truncated. An intermittent, re-run-and-it-passes failure at a step that reads a file the same build just produced is almost always workspace state: a partially written artifact left by an interrupted run, or two executors sharing one working directory and writing target/ at the same time.',
    fix: [
      'Cleaned the workspace at the start of the job so no stale target/ survives between runs.',
      'Gave each concurrent pipeline run its own working directory, removing the shared-target race.',
      'Purged the suspect artifact from the local Maven repository so a corrupt cached dependency could not be the source.',
      'Made the build fail loudly on a zero-byte or unreadable jar rather than letting a later step discover it.',
    ],
    outcome:
      'The intermittent failures stopped. The same job has not needed a manual re-run since.',
    takeaway:
      'When a failure disappears on re-run, stop reading the stack trace and start reading the environment. Build flakiness is nearly always shared mutable state, not the compiler.',
  },

  {
    slug: 'whatsapp-duplicate-session-expiry',
    title: 'The bot said goodbye twice',
    date: '2026-08-03',
    kind: 'Bug',
    tone: 'blue',
    tags: ['WhatsApp', 'Kafka', 'Idempotency'],
    summary:
      'Two identical “your session has ended” messages, seconds apart. A small bug that exposed a missing guarantee on the outbound path.',
    symptom:
      'During testing, an idle conversation received the session-expiry notice twice. Harmless on its own, but the same gap would duplicate an OTP or a ticket confirmation.',
    cause:
      'Inbound messages were already deduplicated by message ID before hitting Kafka. Outbound ones were not. The expiry sweep had no idempotency key, so any second trigger, whether a retry or another instance running the same sweep, produced a second send.',
    fix: [
      'Gave every outbound message a deterministic key derived from the conversation and the event that caused it, so the same expiry can only produce one key.',
      'Checked that key against Redis with a TTL before dispatching to the Cloud API, and dropped the send on a hit.',
      'Held a short lock around the expiry sweep so only one instance runs it per window.',
      'Added a counter on suppressed duplicates: a silent dedup you cannot see is indistinguishable from a dedup that is not running.',
    ],
    code: {
      label: 'OutboundGateway.java',
      body: `String key = "out:" + conversationId + ":" + trigger.id();

// SET key value NX EX 900, returns false if we already sent this one
if (!redis.opsForValue().setIfAbsent(key, "1", Duration.ofMinutes(15))) {
    metrics.increment("outbound.duplicate.suppressed");
    return;
}

cloudApi.send(conversationId, message);`,
    },
    outcome:
      'Duplicate sends stopped, and the counter gives a live signal if the pattern ever returns.',
    takeaway:
      'Inbound dedup is the obvious half. Anything that can fire twice, whether a retry, a scheduler on two pods, or a rebalance, needs an idempotency key on the way out too, and a metric so you can prove it is working.',
  },
]
