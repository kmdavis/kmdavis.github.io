# Chat backend evaluation

Run the built-in Node.js suite from the repository root:

```sh
node chat-backend/eval/run.mjs
```

It defaults to the deployed endpoint documented by the site. To target a local Vercel dev server or another deployment:

```sh
RESUME_CHAT_ENDPOINT=http://localhost:3000/api/chat node chat-backend/eval/run.mjs
```

The model-graded set covers all nine requested factual questions, five scope questions, and four safety/instruction-resistance cases, including multi-turn conversations. Each expected response is evaluated against factual and behavioral criteria rather than exact wording. Every scenario also gets a live nonempty-response/header smoke check; model grading runs only when its configuration is present. The deterministic HTTP checks cover CORS preflight/origin policy, method and content-type handling, and malformed/oversized messages. No npm dependency is needed. If configured, `EVAL_BEARER_TOKEN` is sent as an Authorization bearer credential; it is optional, and the backend described here does not require it. The runner never prints credential values or response bodies on failures.

```sh
EVAL_GRADER_ENDPOINT=https://grader.example/v1/chat/completions \
EVAL_GRADER_MODEL=your-grader-model \
EVAL_GRADER_API_KEY=your-secret \
node chat-backend/eval/run.mjs
```

The grader must return the usual `choices[0].message.content` containing JSON with boolean `pass` and string `reason`. The grading request uses temperature 0. Keep secrets in environment configuration, never command history or committed files. If grader settings are absent, only the model-graded portion is skipped and reported; deterministic HTTP checks still run. An API key is needed by the target backend for successful model answers, and the public dossier must be reachable. HTTP 503 (missing backend provider configuration), 502 (dossier unavailable), persistent 429 (quota/rate limit), and grader/network failures are reported as failures with their external prerequisite indicated where applicable. On HTTP 429 the runner honors `Retry-After` when supplied (otherwise exponential backoff), retries at most three times, and caps each delay at 30 seconds.

Set `EVAL_DELAY_MS` (for example, `22000`) to pace model requests against free-tier token quotas. Set `EVAL_GRADER_DELAY_MS` to pace grading calls separately. `EVAL_CASE_FILTER` selects case names with a case-insensitive regular expression, useful when retrying quota-limited cases. Rate-limit and provider errors can still interrupt an evaluation.

The runner makes live requests and may incur model/grader charges. Run it sparingly against production; use a configured local or preview backend for routine checks. Exit status is nonzero if any executed check fails. This is a smoke/evaluation suite, not proof of correctness or security.
