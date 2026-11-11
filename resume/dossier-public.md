# Kevan Maxwell Davis — Public Career Dossier

This document is a factual, expanded career reference for public use and resume-chatbot context. It preserves useful career detail beyond a concise resume while distinguishing confirmed information, estimates, and unresolved attribution. It does not reproduce private interview context or confidential internal implementation details.

## Career overview

Kevan Maxwell Davis is a software engineer with a frontend and product-platform background who has worked on commerce products, developer tools, and applied AI. He joined Handshake on October 1, 2014; Shopify acquired Handshake in May 2019, and he continued at Shopify until November 3, 2026. He recalls more than 12 years across the two companies. His target positioning is Staff AI Product Engineer; that is a career direction, not a confirmed formal job title. He prefers hands-on individual-contributor work and welcomes mentoring and technical leadership without a people-management focus.

He recalls joining Handshake as a Senior Developer or Senior Engineer (exact title uncertain), remaining at Senior level through the acquisition, and being promoted to Staff around early 2021 (exact month uncertain). Shopify payroll titles and exact dates should be verified before use. His formal title was not necessarily “AI Engineer.”

## Shopify | May 2019–November 3, 2026

### Applied AI products and developer tools

**Shopp-E, multimodal creation platform.** Shopp-E began as another person's hackdays project; Davis joined later to improve it, then undertook a major rearchitecture. He rebuilt it as a reusable, isomorphic TypeScript library using Vercel AI SDK, with web, CLI, and MCP interfaces. A shared model abstraction supported multiple models and modalities. Capabilities included image generation and later video, speech, and music, as well as automatic titling, chat, and image-prompt reverse engineering. It served colleagues beyond engineering, including marketing and design. More than 100,000 images were generated; internal usage recollection is frequently over 1,000 generated daily and sometimes over 2,000, not a verified or necessarily current metric. Do not claim original creation of Shopp-E or present these usage figures as exact, current measurements.

**AI-assisted Liquid email-template migration.** Davis personally designed a prototype for applying changes to customized Liquid templates using structure-aware patches and iterative rendering/validation. He recalls about 90% success on a small, curated benchmark covering five representative template types and five merchant configurations: one default control, two translated, one heavily customized, and one rewritten from scratch. This does not imply 25 tests; the success figure and benchmark are recollected, not independently verified. Evaluation combined syntax checks, rendered-output comparisons, and human review. He later led a six-engineer production development effort. It was canceled before launch; no real-world migrations or savings should be claimed. The underlying feature and internal project details are omitted.

**AI code-review specialist council.** Davis built an experimental workflow influenced by existing code-review efforts, not an original invention of AI code review. Lightweight classifiers routed pull requests to relevant specialist agents such as security, accessibility, API design, and developer experience. Aggregated findings informed guided reviews and diagrams for human reviewers. A handful of engineers tried it; no measured adoption or effectiveness is available. Screenshot capture was experimental and unreliable.

**Pi coding-agent extensions and Pi IDE collaboration.** Davis built extensions for command and web-fetch review with human override, web-to-Markdown retrieval, rendered Markdown editing, attachment previews, and extensible interaction surfaces. Effectiveness and deployment of safety checks are not established; do not present them as proven security enforcement. He collaborated with others on Pi IDE, focusing on extension UI surfaces. He also contributed plugin support to an internal chat application; a separate integration prototype did not ship.

### Commerce platforms and product engineering

**Checkout UI Extensions.** Davis collaborated with a principal engineer on a React-oriented checkout extensibility prototype. Davis primarily owned developer-facing extension API design and developer experience, while the colleague focused on sandbox internals. Foundational developer-facing concepts largely carried into the eventual production platform, though architecture and APIs evolved. Another team productionized the system. Do not claim sole creation or production delivery.

**Post-purchase offers.** Davis contributed to Shopify's first-party post-checkout upsell system and is a named co-inventor on U.S. Patent 11,403,658 B1, “Systems and methods for providing post-transaction offers,” granted in 2022. Do not attribute particular patent claims or sole invention without further evidence.

**Bundles.** Davis joined after the initial prototype phase. His contribution included extending the UI extension approach to the Admin product details page and building the first Bundles card there as a UI extension. He also contributed checkout changes and first-party Admin work, and mentored junior engineers and an intern. Do not claim sole authorship of the product.

**Multichannel commerce.** Davis developed product-field coverage calculations/visualizations and explanations of rule inheritance for channel-specific product mappings. He prototyped bulk-editor improvements; another person completed the production bulk editor. The team reported a late-2026 launch; adoption metrics are unavailable. Do not imply that mappings were AI-generated.

**Other Shopify work.** After the acquisition, Davis worked on native B2B commerce initiatives including Business Customers and Payment Terms. He also championed and prototyped checkout extensibility with a colleague. He contributed to Combined Listings and add-on products, but individual ownership and impact are not sufficiently specified for stronger claims.

## Handshake | October 1, 2014–May 2019

Handshake was a multitenant B2B commerce platform for manufacturers, wholesalers, and distributors, supporting product catalogs, inventory, ordering, and self-service storefront/checkout. Davis worked on the React frontend transition, though leadership, rollout, and outcomes are not established. He directly recalls work on customizable catalog capabilities and self-service B2B ordering, as one of a small frontend team. He did not work on Handshake Direct Mobile/native mobile app or the Square payments integration. Shopify acquired Handshake in May 2019; candidate recollection gives May 8, while public reporting may give another specific day, so month/year is safest absent verification. Avoid attributing company-level growth or product milestones to his individual work.

## Earlier experience

### Gilt Groupe | April 2009–August 2014

Worked as Web Developer and later Senior Web Developer (promotion timing/title details not fully specified). Contributions included work across teams and projects on the ecommerce site and supporting infrastructure; primary development of the frontend asset-management system through four or five major rewrites; primary development of an evolving cart dialog; widely used foundation/library modules; build tools for the Lots Of Small Apps initiative; responsive-design work; two generations of checkout; code-quality tools and practices; and mentoring junior engineers. He advocated JavaScript, CSS, and HTML best practices and participated in Gilt Tech community activity. Historical code sample references exist, but their current availability and public suitability have not been confirmed.

### Mindspark Interactive Networks (IAC CAP) | March 2008–March 2009

Worked with multidisciplinary web, systems, and design teams on Webfetti, iWon, and Zwinky Cuties. Used JSTL, JSP, JavaScript, jQuery, Flash, and Flex; collaborated on browser-compatible UI; used Google Analytics/Urchin for user-flow analysis; developed a Flash 10 clipboard capability in response to security changes; handled concurrent feature, defect, and maintenance work; and improved XHTML/JavaScript quality. The source reports projects delivered under budget but gives no amounts or attribution detail.

### Tyler Technologies | June 2006–February 2008

Developer on Courts & Justice, working with Case Management and Law Enforcement teams in an Agile/Scrum setting. Technologies included HTML, VBScript, AJAX, XML, XSL, XPath, SQL Server/stored procedures, server-side COM+, C#, and VB6 maintenance; tools included Visual SourceSafe, AccuRev, Jira, and Rally.

### University of Texas at Arlington AI Lab | through May 2006

Research Assistant in a cognitive-architecture combat-simulation testbed. Work included state-vector logging of interactive objects and Quake 3 engine simulation environments. Exact employment start date is not specified.

## Education and technical experience

**University of Texas at Arlington:** Bachelor of Science in Computer Science; graduation year not specified. Historical dossier also mentions service as treasurer of the student ACM chapter; omit unless Davis confirms relevance.

**Recent/currently relevant stack (candidate-reported):** TypeScript, JavaScript, React, CSS Modules, Vercel AI SDK, Pi RPC/extensions, MCP, Shopify Quick AI, OpenAI, Anthropic, Gemini, Node.js, Ruby on Rails, Remix, Prisma, MySQL, PostgreSQL, Docker, and Kubernetes. He describes moderate familiarity with Docker/Kubernetes and limited AWS/GCP exposure. Past Java and Scala experience is historical, not a current strength he wishes to emphasize. Earlier skills included CSS/LESS, BDD/TDD, Git, Jira, Photoshop, responsive design, REST, Ruby, and Scala; recency/level varies.

## Public patent reference

- U.S. Patent 11,403,658 B1, “Systems and methods for providing post-transaction offers,” Shopify Inc., granted August 2, 2022; Davis is a named co-inventor: https://patents.google.com/patent/US11403658B1/en

## Accuracy notes and omissions

- Dates and formal titles for Handshake/Shopify transitions and the Staff promotion are partly approximate; confirm against employment records before representing exact dates.
- Some project numbers are candidate recollections rather than independently verified metrics: Shopp-E's more than 100,000 generated images and recalled daily usage (frequently over 1,000, sometimes over 2,000; not necessarily current), and Liquid migration's roughly 90% result on a small curated benchmark. The Liquid migration was canceled before launch and did not reach merchants.
- Team-level product scope is distinguished from Davis's contributions. Historical/non-public employer details, internal metrics, infrastructure/security/operational specifics, named colleagues, and internal management events are omitted.
- The source dossier's private interview motivations and targeting notes are not reproduced. Speculative wording and unverified claims are omitted or qualified.
- Omitted personal data not needed here includes legacy contact details and unconfirmed location/contact information; use the current resume page for public contact details.
- No graduation year, complete title chronology, exact team dates, or adoption/impact metrics are available for several projects; none have been inferred.
