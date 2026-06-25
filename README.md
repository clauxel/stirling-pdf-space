# Stirling PDF Space

Independent, unofficial Stirling PDF workflow planner for `stirling-pdf.space`.

The site helps teams plan PDF operations around merge, split, OCR, compression, conversion, redaction, signing, API automation, and self-hosted deployment. It does not provide official Stirling PDF support and does not send primary CTAs to upstream or third-party product pages.

## Source Notes

- Official site: https://www.stirlingpdf.com/
- Official docs: https://docs.stirlingpdf.com/
- Upstream repo: https://github.com/Stirling-Tools/Stirling-PDF
- License summary used by this site: open-core; most repository code is MIT with listed subdirectory exceptions.

## Pages

- `/` - paid planner preview and product entity
- `/pdf-tools/` - PDF operation matrix
- `/self-host-stirling-pdf/` - self-host checklist
- `/stirling-pdf-api/` - API automation planning
- `/pdf-automation/` - workflow design
- `/secure-pdf-workflows/` - redaction, metadata, retention, and security review
- `/pricing/` - Annual/Monthly packages with Annual selected by default
- `/checkout/` - own-domain Polar checkout start
- `/docs/` - source notes and page matrix

## Verification

Run:

```bash
npm test
```

Validation covers static SEO, canonical and Open Graph URLs, one H1 per page, no visible outbound CTA links, D1 analytics storage behavior, paid planner gate, Polar checkout wiring, access-token unlock, facts JSON, 404 handling, pricing tabs, and stale-template text.

## Deployment

Cloudflare Worker deployment is configured in `wrangler.toml` for `stirling-pdf.space` and `www.stirling-pdf.space`. Production completion requires Cloudflare zone/DNS/HTTPS, D1 binding, Polar checkout secrets, apex/www verification, GSC, Bing, IndexNow, public GitHub repo, independent docs repo, registry update, and live user-flow validation.
