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
- Production deployment: Cloudflare Worker deployed as version `1087d61a-e3a7-4cda-9fdb-9add7f482305`; workers.dev runtime and homepage return 200; `ANALYTICS_DB` is bound to D1 `stirling-pdf-space-analytics` (`fbd3d7b9-c4e8-486e-add4-16cc7700f4ec`).
- Production D1 verification: POST to `/api/analytics` returned `stored:true` with `sinks:["d1"]`; remote D1 query found `codex_d1_verify_stirling_pdf_space` with AI referral classification.
- Cloudflare custom-domain status: zone exists with apex/www proxied A records and Worker routes; Spaceship nameservers were updated to `archer.ns.cloudflare.com` and `sydney.ns.cloudflare.com`.
- Production custom-domain verification: apex HTTPS returns 200, www HTTPS returns 301 to apex, homepage/runtime/robots/sitemap/Bing verification file/IndexNow key are live, and no registrar parking response is present.
- Search submission: GSC domain property `sc-domain:stirling-pdf.space` and URL-prefix property `https://stirling-pdf.space/` are `siteOwner`; sitemap submissions returned `204`; Bing Webmaster AddSite/VerifySite/SubmitFeed/SubmitUrlbatch returned 200 and the site is verified; IndexNow accepted 14 sitemap URLs with HTTP 202.
- Payment configuration: under Owner authorization, six Polar products/checkout links were created or reused for Starter/Pro/Enterprise monthly and annual plans. Cloudflare Worker secrets were configured by name only, `/api/runtime` reports `paymentConfigured:true`, all six `/api/checkout` plan/billing combinations return `200` with a `buy.polar.sh` checkout URL, and Chrome CDP click validation of `Checkout Pro annual` opened the Polar hosted checkout. No real payment was made.
- GitHub: public repo `clauxel/stirling-pdf-space` created and pushed; initial public HEAD `3a86db1`.
- Independent public docs repo: `clauxel/stirling-pdf-space-docs` created and pushed; initial public HEAD `3c56c0e`; docs `npm test` passed.
