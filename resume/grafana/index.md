# Kevan Maxwell Davis
**Staff Software Engineer | AI Agents, Evaluation & Developer Tools**

Denver, Colorado, USA | [i.am.kevan.davis@gmail.com](mailto:i.am.kevan.davis@gmail.com) | [817-791-3542](tel:+18177913542) | [linkedin.com/in/kevanmdavis](https://www.linkedin.com/in/kevanmdavis)

## Professional Summary
Staff Software Engineer with 20 years in software development, including five years at Staff level at Shopify. Builds practical AI agents and evaluation workflows that connect models, APIs, and human reviewers. Experienced with multi-agent routing, model-provider abstractions, latency and reliability tradeoffs, developer-facing MCP/CLI interfaces, and systematic evaluation. Turns experimental workflows into reusable tools for technical and nontechnical users.

## Core Skills
**Agents and LLMs:** Vercel AI SDK, Pi (RPC/extensions), MCP, OpenAI, Anthropic, Gemini, multi-agent councils, routing and aggregation, model fallbacks, evaluation and validation, human escalation, multimodal AI

**Development:** TypeScript, JavaScript, Node.js, React, API design, CLI tooling, shared libraries, asynchronous workflows, HTTP/service integrations, PostgreSQL, MySQL, Prisma

**Infrastructure:** Docker, Kubernetes; working familiarity with AWS and GCP

## Professional Experience
### Shopify | Staff Software Engineer | 2021–November 2026
- Re-architected **Shopp-E**, an internal multimodal platform, as an isomorphic TypeScript platform on **Vercel AI SDK**, with reusable interfaces to multiple AI providers for web, CLI, and MCP clients. Developed a model registry tracking capabilities, limits, and costs; the system generated **100,000+ images**, with daily generation frequently exceeding **1,000** and sometimes **2,000**.
- Implemented asynchronous generation jobs, provider fallbacks during outages, and remote polling for multi-minute video requests, making multiple image, video, speech, and music providers accessible through common interfaces.
- Built a working **multi-agent code review** pipeline: low-cost classifiers identified change characteristics and selected specialized security, accessibility, API, and developer-experience reviewers; an aggregator created consolidated findings, guided PR tours, and diagrams. Piloted with a handful of engineers.
- Developed a Pi extension that used a council of fast models, within a millisecond-scale time budget, to assess shell commands and web fetches and present human override when needed.
- Built agent-facing retrieval and interface tools, including HTML-to-Markdown extraction (preferring site-provided Markdown), a rich Markdown editor with attachment previews, and extensible confirm/ask/modal/toast surfaces for the collaborative Pi IDE.
- Created an AI-driven Liquid template migration prototype with structure-aware patches and an iterative validation pipeline (parsing, render screenshots, vision-model judgments, human review). Achieved **about 90% success on a small curated benchmark** spanning five representative template types and five merchant configurations; led a six-engineer production development effort that was canceled before launch, with no customer templates migrated.
- Added coverage calculation and rule-inheritance visualizations for configurable multichannel product mapping, shipped in Shopify Editions in 2026.


<!-- pagebreak -->

## Professional Experience (continued)

### Shopify | Senior Software Engineer | May 2019–2021
- Co-developed the developer API prototype for Shopify's sandboxed Checkout UI Extensions and collaborated on integration with remote UI; core design principles informed the eventual production platform.
- Helped develop native B2B commerce and post-checkout upsell capabilities; named co-inventor on [U.S. Patent 11,403,658](https://patents.google.com/patent/US11403658B1/en) (2022).

### Handshake (acquired by Shopify) | Senior Developer / Engineer | October 2014–May 2019
- Contributed to a React-based modernization of a B2B commerce platform with self-service ordering and configurable catalogs, working on a small frontend team.

### Gilt Groupe | Web Developer → Senior Web Developer | April 2009–August 2014
- Developed core UI libraries, cart and checkout experiences, build tooling, and frontend infrastructure; supported responsive design and mentoring.

**Earlier:** Web Developer, Mindspark (2008–2009); Developer, Tyler Technologies (2006–2008); UTA AI Lab Research Assistant (through 2006).


## Education
**University of Texas at Arlington** | B.S., Computer Science
