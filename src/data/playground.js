/* ─────────────────────────────────────────────────────────────────────────
   PLAYGROUND: the code the terminal actually compiles and runs.

   Execution is real. The buffer is POSTed to Wandbox, compiled and run on
   their machines, and the stdout/stderr you see is what the process printed.
   Nothing here is simulated, which is also why it needs a network round trip.

   `compiler` values come from https://wandbox.org/api/list.json. Pin them
   rather than using "head" so a toolchain bump upstream cannot change what a
   visitor sees.

   ⚠️  Java note: Wandbox writes the buffer to prog.java, so the entry class
   must NOT be declared public or javac rejects the filename mismatch.
   ───────────────────────────────────────────────────────────────────────── */
export const languages = [
  {
    id: 'java',
    label: 'Java',
    compiler: 'openjdk-jdk-22+36',
    version: 'OpenJDK 22',
    file: 'prog.java',
    blurb: 'Idempotency: the guard that stops a webhook retry becoming a second write.',
    code: `import java.util.*;
import java.util.concurrent.*;

class Main {
    // One key per event. add() returns false if we have seen it before,
    // which is the whole trick behind an at-least-once consumer.
    static final Set<String> seen = ConcurrentHashMap.newKeySet();

    static boolean firstTime(String key) {
        return seen.add(key);
    }

    public static void main(String[] args) {
        // Meta retries on timeout, so the same message ID arrives twice.
        String[] delivery = { "evt-1", "evt-2", "evt-1", "evt-3", "evt-2" };

        int applied = 0, deduped = 0;
        for (String key : delivery) {
            if (firstTime(key)) {
                applied++;
                System.out.println("applied  " + key);
            } else {
                deduped++;
                System.out.println("skipped  " + key + "   (duplicate)");
            }
        }

        System.out.printf("%n%d delivered, %d applied, %d deduped%n",
                          delivery.length, applied, deduped);
    }
}
`,
  },
  {
    id: 'python',
    label: 'Python',
    compiler: 'cpython-3.12.7',
    version: 'CPython 3.12',
    file: 'prog.py',
    blurb: 'A token bucket, the rate limiter that shapes burst traffic without dropping it.',
    code: `import time

class TokenBucket:
    """capacity = burst you tolerate, rate = tokens refilled per second."""

    def __init__(self, capacity, rate):
        self.capacity = capacity
        self.rate = rate
        self.tokens = float(capacity)
        self.stamp = 0.0

    def take(self, now, n=1):
        # Refill lazily from elapsed time instead of running a timer.
        self.tokens = min(self.capacity, self.tokens + (now - self.stamp) * self.rate)
        self.stamp = now
        if self.tokens >= n:
            self.tokens -= n
            return True
        return False


bucket = TokenBucket(capacity=5, rate=2)   # burst 5, then 2 per second
allowed = denied = 0

for i in range(12):
    now = i * 0.25                          # a request every 250ms
    if bucket.take(now):
        allowed += 1
        print(f"t={now:4.2f}s  pass   tokens left {bucket.tokens:.2f}")
    else:
        denied += 1
        print(f"t={now:4.2f}s  THROTTLE")

print(f"\\n{allowed} allowed, {denied} throttled")
`,
  },
  {
    id: 'javascript',
    label: 'JavaScript',
    compiler: 'nodejs-20.17.0',
    version: 'Node 20',
    file: 'prog.js',
    blurb: 'Exponential backoff with jitter, so a thousand clients do not retry in lockstep.',
    code: `// Retry a flaky call. Jitter is the part people leave out, and it is the
// part that stops every client retrying on the same tick after an outage.
function delayFor(attempt, base = 100, cap = 2000) {
  const exp = Math.min(cap, base * 2 ** attempt);
  return Math.round(exp / 2 + Math.random() * (exp / 2));   // full jitter
}

let calls = 0;
async function flakyCall() {
  calls++;
  if (calls < 4) throw new Error("503 upstream unavailable");
  return "OK";
}

async function withRetry(fn, attempts = 6) {
  for (let i = 0; i < attempts; i++) {
    try {
      const out = await fn();
      console.log(\`attempt \${i + 1}  succeeded -> \${out}\`);
      return out;
    } catch (err) {
      if (i === attempts - 1) throw err;
      const wait = delayFor(i);
      console.log(\`attempt \${i + 1}  failed (\${err.message}) retrying in \${wait}ms\`);
      await new Promise((r) => setTimeout(r, wait));
    }
  }
}

withRetry(flakyCall).then((r) => console.log(\`\\nresolved after \${calls} calls: \${r}\`));
`,
  },
  {
    id: 'go',
    label: 'Go',
    compiler: 'go-1.23.2',
    version: 'Go 1.23',
    file: 'prog.go',
    blurb: 'A bounded worker pool: concurrency you can actually reason about.',
    code: `package main

import (
	"fmt"
	"sync"
)

// Unbounded goroutines are how you turn a traffic spike into an outage.
// A fixed pool over one channel gives you a hard ceiling instead.
func main() {
	const workers = 3

	jobs := make(chan int, 10)
	results := make(chan string, 10)

	var wg sync.WaitGroup
	for w := 1; w <= workers; w++ {
		wg.Add(1)
		go func(id int) {
			defer wg.Done()
			for j := range jobs {
				results <- fmt.Sprintf("worker %d handled job %d -> %d", id, j, j*j)
			}
		}(w)
	}

	for j := 1; j <= 8; j++ {
		jobs <- j
	}
	close(jobs)

	wg.Wait()
	close(results)

	n := 0
	for r := range results {
		fmt.Println(r)
		n++
	}
	fmt.Printf("\\n%d jobs drained by %d workers\\n", n, workers)
}
`,
  },
  {
    id: 'sql',
    label: 'SQL',
    compiler: 'sqlite-3.46.1',
    version: 'SQLite 3.46',
    file: 'prog.sql',
    blurb: 'Deduplicating an at-least-once ledger with a window function.',
    code: `-- An at-least-once pipeline writes the same event more than once.
-- Keeping the earliest row per key is a ranking problem, not a DELETE loop.
CREATE TABLE ledger (
  id        INTEGER PRIMARY KEY,
  event_key TEXT    NOT NULL,
  amount    INTEGER NOT NULL,
  received  TEXT    NOT NULL
);

INSERT INTO ledger (event_key, amount, received) VALUES
  ('evt-1', 250, '2026-08-01 10:00:00'),
  ('evt-2', 400, '2026-08-01 10:00:04'),
  ('evt-1', 250, '2026-08-01 10:00:09'),   -- retry
  ('evt-3', 125, '2026-08-01 10:00:11'),
  ('evt-2', 400, '2026-08-01 10:00:15');   -- retry

.headers on
.mode column

SELECT 'all rows as delivered' AS stage;
SELECT event_key, amount, received FROM ledger ORDER BY id;

SELECT '' AS '';
SELECT 'deduped, earliest wins' AS stage;
WITH ranked AS (
  SELECT *, ROW_NUMBER() OVER (
           PARTITION BY event_key ORDER BY received, id
         ) AS rn
  FROM ledger
)
SELECT event_key, amount, received FROM ranked WHERE rn = 1 ORDER BY event_key;

SELECT '' AS '';
SELECT COUNT(*) AS delivered, COUNT(DISTINCT event_key) AS settled FROM ledger;
`,
  },
  {
    id: 'bash',
    label: 'Bash',
    compiler: 'bash',
    version: 'Bash 5.2',
    file: 'prog.sh',
    blurb: 'The readiness gate a deploy waits on before it shifts traffic.',
    code: `#!/usr/bin/env bash
set -uo pipefail

# Stand-in for: curl -sf http://svc/actuator/health
# Reports OUT_OF_SERVICE twice, then UP, the way a pod does while it warms up.
#
# The attempt number is passed in rather than kept in a global, because
# body=$(probe) runs the function in a subshell: any counter it incremented
# there is discarded when that subshell exits, and the loop never advances.
probe() {
  local n=$1
  if [ "$n" -ge 3 ]; then
    echo '{"status":"UP"}'
    return 0
  fi
  echo '{"status":"OUT_OF_SERVICE"}'
  return 1
}

deadline=6
for ((i = 1; i <= deadline; i++)); do
  if body=$(probe "$i"); then
    echo "probe $i  ready    $body"
    echo
    echo "health gate passed after $i probes"
    exit 0
  fi
  echo "probe $i  waiting  $body"
  sleep 0.2
done

echo
echo "never became ready within $deadline probes" >&2
exit 1
`,
  },
]

export const WANDBOX_ENDPOINT = 'https://wandbox.org/api/compile.json'
