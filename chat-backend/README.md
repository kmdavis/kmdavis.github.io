# Resume chat backend (Vercel)

This endpoint streams plain-text answers from Google-hosted Gemma 4 through the Vercel AI SDK. The browser never receives the Google API key. It accepts the page's `POST {"messages":[{"role":"user"|"assistant","content":"..."}]}` contract and returns response text as it streams.

In the chat input, Ctrl+Enter or Command+Enter sends a message; Enter inserts a newline. A waiting indicator remains visible until the response starts.

The chat is also available on the targeted resumes at `/resume/clickup/`, `/resume/customerio/`, `/resume/grafana/`, and `/resume/openai/`. Run `node resume/build.js` after editing their Markdown sources.

## Deploy

1. Publish the sanitized dossier at `https://kmdavis.github.io/resume/dossier-public.md`. It must be public plain UTF-8 text, non-empty, and no larger than 48 KiB. The endpoint fetches it on a cold instance and caches it in memory for five minutes.
2. The Vercel project `kevan-davis-projects/chat-backend` is linked locally. If recreating it, set its root to `chat-backend`, use the Other framework preset, and expose `api/chat.ts` at `/api/chat`.
3. Add `GOOGLE_GENERATIVE_AI_API_KEY` as a Vercel environment variable for Production (and Preview/Development if needed), using a Google AI Studio Gemini API key. Never commit this key or put it in browser code.
4. Deploy with `npx vercel --prod` from `chat-backend`. The site defaults to `https://chat-backend-iota-pearl.vercel.app/api/chat`; to use a different deployment, set `RESUME_CHAT_ENDPOINT` before running `node resume/build.js` from the repository root. Commit and publish the generated pages. The endpoint allows browser requests only from `https://kmdavis.github.io`.
5. Ensure the Google project/key has Gemini API access and quota for `gemma-4-26b-a4b-it`. Google currently documents `gemma-4-31b-it` and `gemma-4-26b-a4b-it` for Gemini API; this backend uses the latter. The curated dossier policy is passed as a system instruction rather than forged user content.

For local dependency setup run `npm ci` from `chat-backend`. For local Vercel emulation, install the Vercel CLI and run `vercel dev` from that directory; configure the key with `vercel env add GOOGLE_GENERATIVE_AI_API_KEY` or a local Vercel environment file kept out of version control. Production deployment can use the Vercel Git integration or `npm run deploy` after linking the project.

The backend uses pinned npm dependencies (`ai`, `@ai-sdk/google`, and Vercel's Node function types) recorded in `package-lock.json`; no frontend bundling or build step is required.

## Limits and abuse

The endpoint checks the exact page origin and CORS, accepts only POST JSON containing alternating user/assistant text messages (up to 20 messages, 4,000 characters each, 16,000 total, and 48 KiB request body), and caps model output at 700 tokens. These checks reduce accidental misuse, **not** provide authentication: Origin/CORS restrictions can be bypassed by scripts and direct HTTP clients. Anyone can consume the public endpoint and its Google quota. Monitor quota/charges and configure any provider-side limits available; for enforceable per-user protection, add authentication and rate limiting before exposing it widely. The Google key remains server-side, but usage can incur charges or exhaust quota. Model responses can be wrong; do not publish private material in the dossier.

Dossier load failures return 502; missing key returns 503. Streaming errors after headers have started terminate the stream; clients should handle incomplete responses. Vercel project creation, deployment, and secret setup require an operator; this repository does not contain credentials or an already-deployed endpoint.
