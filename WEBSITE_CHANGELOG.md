# WEBSITE_CHANGELOG

## 2026-06-25

- Scope: initial build for `stirling-pdf.space` using the open-source-code website build workflow.
- Repo input: `Stirling-Tools/Stirling-PDF`.
- Positioning: independent, unofficial Stirling PDF workflow and deployment planner rather than an official service clone.
- Implemented pages: homepage planner preview, PDF tools, self-host checklist, API automation, PDF automation, secure PDF workflows, pricing, checkout, success, cancel, docs/source notes, privacy, terms, changelog, and 404.
- Implemented assets: generated hero bitmap, favicon, web manifest, robots.txt, sitemap.xml, llms.txt, product.json, and facts JSON endpoint.
- Implemented runtime: Cloudflare Worker static serving, canonical redirect logic, `/api/runtime`, `/api/planner`, `/api/analytics`, `/api/checkout`, `/api/access`, and `/.well-known/stirling-pdf-space.json`.
- Implemented payment rule: independent `/pricing/` page, Annual/Monthly tabs, Annual selected by default, Annual 50% cheaper than Monthly, one-time/no automatic renewal copy, own-domain checkout API, Polar checkout wiring, and paid planner gate.
- Implemented data rule: `/api/analytics` writes durable events to Cloudflare D1 when `ANALYTICS_DB` is bound and reports `stored:true` only after D1 insertion.
- Local verification: `npm test` passed; browser verification passed for desktop homepage, mobile homepage, pricing Annual default, Monthly toggle, and unpaid planner-to-pricing gate.
- Production deployment: Cloudflare Worker deployed as version `a6c1d159-ae07-4819-9588-1597fd343352`; workers.dev runtime and homepage return 200; `ANALYTICS_DB` is bound to D1 `stirling-pdf-space-analytics` (`fbd3d7b9-c4e8-486e-add4-16cc7700f4ec`).
- Production D1 verification: POST to `/api/analytics` returned `stored:true` with `sinks:["d1"]`; remote D1 query found `codex_d1_verify_stirling_pdf_space` with AI referral classification.
- Cloudflare custom-domain status: zone exists with apex/www proxied A records and Worker routes; Spaceship nameservers were updated to `archer.ns.cloudflare.com` and `sydney.ns.cloudflare.com`.
- Production blocker: public resolvers return `SERVFAIL` because the parent `.space` zone still publishes DS `23293 13 2 2212AF87BF18A3D18942E3C7643372C30FD51C7BF390BEF5A7D99949 6D90DF04` while Cloudflare DNSSEC is disabled. Spaceship API exposed nameserver metadata but no DNSSEC/DS endpoint, so DS removal/update requires registrar UI or another authorized path before HTTPS/GSC/Bing/IndexNow can complete.
- Payment blocker: Polar access/API/checkouts were not found in Keychain or environment under the standard names. `/api/checkout` safely returns 503 `paymentConfigured:false` instead of fake checkout success.
- Search/distribution: pending until the production domain resolves without DNSSEC SERVFAIL.
- Independent public docs repo: local docs repo and `npm test` passed; public GitHub push pending.
