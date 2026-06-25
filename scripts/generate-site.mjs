import { mkdir, rm, writeFile } from 'node:fs/promises'

const product = {
  slug: 'stirling-pdf-space',
  brand: 'Stirling PDF Space',
  domain: 'stirling-pdf.space',
  origin: 'https://stirling-pdf.space',
  support: 'support@aigeamy.com',
  repo: 'https://github.com/Stirling-Tools/Stirling-PDF',
  officialSite: 'https://www.stirlingpdf.com/',
  officialDocs: 'https://docs.stirlingpdf.com/',
  relationship: 'Independent, unofficial workflow planner for Stirling PDF.',
  appVersion: '20260625-stirling-pdf-space-d1',
}

const root = new URL('../public/', import.meta.url)

const routes = [
  { path: '/', file: 'index.html', title: 'Stirling PDF Space - PDF workflow planner', description: 'Independent Stirling PDF workflow planner for merge, split, OCR, compress, redact, sign, API, and self-hosted PDF operations.' },
  { path: '/pdf-tools/', file: 'pdf-tools/index.html', title: 'Stirling PDF tools workflow planner', description: 'Plan merge, split, compress, OCR, convert, sign, redact, watermark, and metadata workflows before teams run PDF jobs.' },
  { path: '/self-host-stirling-pdf/', file: 'self-host-stirling-pdf/index.html', title: 'Self-host Stirling PDF checklist', description: 'A deployment checklist for authentication, storage, backups, updates, TLS, Docker, and operations around self-hosted Stirling PDF.' },
  { path: '/stirling-pdf-api/', file: 'stirling-pdf-api/index.html', title: 'Stirling PDF API automation guide', description: 'Map repeatable PDF jobs to API-style automation plans, batch queues, access controls, and evidence logs.' },
  { path: '/pdf-automation/', file: 'pdf-automation/index.html', title: 'PDF automation workflow planner', description: 'Design PDF automation paths for intake, conversion, OCR, redaction, approval, signature, and archive steps.' },
  { path: '/secure-pdf-workflows/', file: 'secure-pdf-workflows/index.html', title: 'Secure PDF workflow checklist', description: 'Plan secure PDF redaction, metadata, watermarking, password, retention, and review controls before production rollout.' },
  { path: '/pricing/', file: 'pricing/index.html', title: 'Stirling PDF Space pricing', description: 'Choose a one-time Stirling PDF Space planning package with Annual selected by default and Monthly available.' },
  { path: '/checkout/', file: 'checkout/index.html', title: 'Checkout - Stirling PDF Space', description: 'Start a secure Polar checkout for a Stirling PDF Space planning package.' },
  { path: '/success/', file: 'success/index.html', title: 'Payment success - Stirling PDF Space', description: 'Verify Polar checkout and unlock the Stirling PDF Space planner.' },
  { path: '/cancel/', file: 'cancel/index.html', title: 'Checkout canceled - Stirling PDF Space', description: 'Return to Stirling PDF Space pricing or adjust the selected package.' },
  { path: '/docs/', file: 'docs/index.html', title: 'Stirling PDF Space docs and source notes', description: 'Source notes, page matrix, API planning details, limits, and AI-readable context for Stirling PDF Space.' },
  { path: '/privacy/', file: 'privacy/index.html', title: 'Privacy - Stirling PDF Space', description: 'Privacy notes for the independent Stirling PDF Space workflow planner.' },
  { path: '/terms/', file: 'terms/index.html', title: 'Terms - Stirling PDF Space', description: 'Terms, refunds, limits, and support expectations for Stirling PDF Space.' },
  { path: '/changelog/', file: 'changelog/index.html', title: 'Changelog - Stirling PDF Space', description: 'Launch and verification notes for Stirling PDF Space.' },
  { path: '/404/', file: '404/index.html', title: 'Not found - Stirling PDF Space', description: 'The requested Stirling PDF Space page was not found.', noindex: true },
]

function esc(value) {
  return String(value).replace(/[&<>"']/g, (char) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  })[char])
}

function pageUrl(path) {
  return product.origin + path
}

function head(route, schema = '') {
  const canonical = pageUrl(route.path)
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${esc(route.title)}</title>
  <meta name="description" content="${esc(route.description)}">
  <meta name="robots" content="${route.noindex ? 'noindex,follow' : 'index,follow'}">
  <link rel="canonical" href="${canonical}">
  <meta property="og:title" content="${esc(route.title)}">
  <meta property="og:description" content="${esc(route.description)}">
  <meta property="og:type" content="website">
  <meta property="og:url" content="${canonical}">
  <meta property="og:image" content="${product.origin}/assets/pdf-workflow-dashboard.png">
  <meta name="twitter:card" content="summary_large_image">
  <link rel="icon" href="/favicon.svg" type="image/svg+xml">
  <link rel="manifest" href="/site.webmanifest">
  <link rel="stylesheet" href="/styles.css">
  ${schema}
  <script src="/app.js?v=${product.appVersion}" defer></script>
</head>`
}

function nav() {
  return `<header class="site-header">
  <a class="brand" href="/" aria-label="Stirling PDF Space home"><span class="brand-mark">SP</span><span>Stirling PDF Space</span></a>
  <nav aria-label="Primary navigation">
    <a href="/pdf-tools/">Tools</a>
    <a href="/self-host-stirling-pdf/">Self-host</a>
    <a href="/stirling-pdf-api/">API</a>
    <a href="/docs/">Docs</a>
    <a class="nav-pricing" href="/pricing/">Pricing</a>
  </nav>
</header>`
}

function footer() {
  return `<footer class="site-footer">
  <div>
    <strong>Stirling PDF Space</strong>
    <p>Independent, unofficial planner for teams evaluating Stirling PDF workflows. Official project references are kept in source notes, not conversion paths.</p>
  </div>
  <nav aria-label="Footer navigation">
    <a href="/pricing/">Pricing</a>
    <a href="/docs/">Docs</a>
    <a href="/privacy/">Privacy</a>
    <a href="/terms/">Terms</a>
    <a href="/changelog/">Changelog</a>
  </nav>
</footer>`
}

function shell(route, body, schema = '') {
  return `${head(route, schema)}
<body>
${nav()}
${body}
${footer()}
</body>
</html>
`
}

function planCards(mode = 'button') {
  const action = mode === 'link' ? 'a' : 'button'
  const href = mode === 'link' ? ' href="/checkout/?plan=starter&billing=annual"' : ''
  const hrefPro = mode === 'link' ? ' href="/checkout/?plan=pro&billing=annual"' : ''
  const hrefEnterprise = mode === 'link' ? ' href="/checkout/?plan=enterprise&billing=annual"' : ''
  return `<div class="plans" id="plans">
  <article class="plan" data-plan-card data-plan-id="starter" data-plan-name="Starter" data-monthly-display="9" data-monthly-due="9" data-annual-display="4.50" data-annual-due="54">
    <h2>Starter</h2>
    <p class="plan-price"><span data-plan-price>$4.50</span><span data-plan-period>/mo billed yearly</span></p>
    <p class="due" data-due-today>$54 due today</p>
    <p>One PDF workflow planning report for a solo builder or operations owner.</p>
    <ul><li>Core operation map</li><li>Risk notes</li><li>Launch checklist</li></ul>
    <${action} class="button primary" data-checkout-plan="starter" data-checkout-billing="annual"${href}>Checkout Starter annual</${action}>
  </article>
  <article class="plan featured" data-plan-card data-plan-id="pro" data-plan-name="Pro" data-monthly-display="29" data-monthly-due="29" data-annual-display="14.50" data-annual-due="174">
    <h2>Pro</h2>
    <p class="plan-price"><span data-plan-price>$14.50</span><span data-plan-period>/mo billed yearly</span></p>
    <p class="due" data-due-today>$174 due today</p>
    <p>Reviewable annual PDF operations plan, source notes, and rollout checklist.</p>
    <ul><li>Workflow planner unlock</li><li>API and self-host notes</li><li>Evidence checklist</li></ul>
    <${action} class="button primary" data-checkout-plan="pro" data-checkout-billing="annual"${hrefPro}>Checkout Pro annual</${action}>
  </article>
  <article class="plan" data-plan-card data-plan-id="enterprise" data-plan-name="Enterprise" data-monthly-display="59" data-monthly-due="59" data-annual-display="29.50" data-annual-due="354">
    <h2>Enterprise</h2>
    <p class="plan-price"><span data-plan-price>$29.50</span><span data-plan-period>/mo billed yearly</span></p>
    <p class="due" data-due-today>$354 due today</p>
    <p>Governance notes, deployment review, and stakeholder-ready PDF evidence.</p>
    <ul><li>Security controls</li><li>Retention map</li><li>Team rollout plan</li></ul>
    <${action} class="button primary" data-checkout-plan="enterprise" data-checkout-billing="annual"${hrefEnterprise}>Checkout Enterprise annual</${action}>
  </article>
</div>`
}

function billingTabs() {
  return `<div class="billing-tabs" data-billing-tabs data-default-billing="annual" role="tablist" aria-label="Billing period">
  <button type="button" data-billing-option="annual" role="tab" aria-selected="true">Annual <span>Save 50%</span></button>
  <button type="button" data-billing-option="monthly" role="tab" aria-selected="false">Monthly</button>
</div>`
}

function productData() {
  return `<script type="application/json" id="product-data">${JSON.stringify({
    slug: product.slug,
    brand: product.brand,
    domain: product.domain,
    canonicalOrigin: product.origin,
    defaultPlanId: 'pro',
    defaultBilling: 'annual',
  })}</script>`
}

function home() {
  const route = routes.find((item) => item.path === '/')
  const schema = `<script type="application/ld+json">${JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: product.brand,
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Web',
    url: product.origin + '/',
    description: route.description,
    offers: { '@type': 'Offer', priceCurrency: 'USD', price: '54', url: product.origin + '/pricing/' },
  })}</script>`
  return shell(route, `${productData()}
<main>
  <section class="hero" style="--hero-image:url('/assets/pdf-workflow-dashboard.png')">
    <div class="hero-copy">
      <p class="eyebrow">Independent, unofficial Stirling PDF companion</p>
      <h1>Stirling PDF Space</h1>
      <p class="hero-lede">Plan the PDF workflow before files hit production: merge, split, OCR, compress, convert, redact, sign, API automation, and self-host controls in one paid planner.</p>
      <div class="hero-actions">
        <a class="button primary" href="/pricing/">View pricing packages</a>
        <a class="button secondary" href="#planner">Preview the planner</a>
      </div>
    </div>
  </section>

  <section class="tool-band" id="planner">
    <div class="section-head">
      <p class="eyebrow">Pricing required</p>
      <h2>PDF workflow planner preview</h2>
      <p>The planner is gated until a package is selected and Polar checkout is verified. The preview shows the required inputs without returning a full production plan.</p>
    </div>
    <form class="planner" data-planner-form>
      <label>Workflow goal<textarea name="goal">Merge scanned HR packets, run OCR, redact personal data, and archive final PDFs.</textarea></label>
      <label>Scale<select name="scale"><option value="single">Single document</option><option value="list">Batch list</option><option value="large">Large team workflow</option></select></label>
      <label>Output<select name="output"><option value="checklist">Checklist</option><option value="json">Structured JSON</option><option value="policy">Policy brief</option></select></label>
      <label>Deployment<select name="deployment"><option value="cloud">Browser workflow</option><option value="api">API automation</option><option value="self_hosted">Self-hosted deployment</option></select></label>
      <button class="button primary" type="submit">Generate paid plan</button>
      <pre data-planner-output>{
  "status": "pricing_required",
  "next": "Choose a pricing package before using the planner.",
  "pricing": "/pricing/"
}</pre>
    </form>
  </section>

  <section class="section">
    <div class="section-head">
      <p class="eyebrow">Page matrix</p>
      <h2>Built for high-intent PDF operations searches</h2>
    </div>
    <div class="grid three">
      <article><h2>PDF tool planning</h2><p>Map merge, split, compress, OCR, conversion, signing, watermarking, and redaction jobs to repeatable operating steps.</p><a href="/pdf-tools/">Open PDF tools</a></article>
      <article><h2>Self-host review</h2><p>Check Docker, authentication, storage, updates, TLS, backups, and admin controls before a team deploys Stirling PDF.</p><a href="/self-host-stirling-pdf/">Review self-hosting</a></article>
      <article><h2>API automation</h2><p>Turn recurring PDF work into queue, API, and evidence patterns without bypassing the product-domain pricing path.</p><a href="/stirling-pdf-api/">Plan API use</a></article>
    </div>
  </section>
</main>`, schema)
}

function simpleRoute(path, eyebrow, h1, lead, cards, extra = '') {
  const route = routes.find((item) => item.path === path)
  return shell(route, `${productData()}
<main>
  <section class="page-hero">
    <p class="eyebrow">${eyebrow}</p>
    <h1>${h1}</h1>
    <p>${lead}</p>
    <div class="hero-actions"><a class="button primary" href="/pricing/">View pricing packages</a><a class="button secondary" href="/docs/">Read source notes</a></div>
  </section>
  <section class="section">
    <div class="grid three">
      ${cards.map((card) => `<article><h2>${card.title}</h2><p>${card.body}</p></article>`).join('\n      ')}
    </div>
  </section>
  ${extra}
</main>`)
}

function pricing() {
  const route = routes.find((item) => item.path === '/pricing/')
  const schema = `<script type="application/ld+json">${JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.brand,
    description: 'Independent Stirling PDF workflow planning reports, source notes, and rollout checklists.',
    offers: [
      ['Starter monthly', 9, '/checkout/?plan=starter&billing=monthly', 'One-time monthly access with no automatic renewal.'],
      ['Starter annual', 54, '/checkout/?plan=starter&billing=annual', 'Equivalent to $4.50 per month billed yearly; one-time payment with no automatic renewal.'],
      ['Pro monthly', 29, '/checkout/?plan=pro&billing=monthly', 'One-time monthly access with no automatic renewal.'],
      ['Pro annual', 174, '/checkout/?plan=pro&billing=annual', 'Equivalent to $14.50 per month billed yearly; one-time payment with no automatic renewal.'],
      ['Enterprise monthly', 59, '/checkout/?plan=enterprise&billing=monthly', 'One-time monthly access with no automatic renewal.'],
      ['Enterprise annual', 354, '/checkout/?plan=enterprise&billing=annual', 'Equivalent to $29.50 per month billed yearly; one-time payment with no automatic renewal.'],
    ].map(([name, price, url, description]) => ({
      '@type': 'Offer',
      name,
      price: String(price),
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock',
      url: product.origin + url,
      description,
    })),
  })}</script>`
  return shell(route, `${productData()}
<main>
  <section class="page-hero">
    <p class="eyebrow">Independent pricing packages</p>
    <h1>Choose a Stirling PDF Space package</h1>
    <p>Annual is selected by default and is 50% cheaper than Monthly. Payments are one-time and do not automatically renew.</p>
    ${billingTabs()}
  </section>
  <section class="section">${planCards('button')}<p class="notice">Feature gate: the workflow planner unlocks only after Polar checkout is verified. Functional API calls return payment required before access.</p><p data-checkout-status class="checkout-status" aria-live="polite"></p></section>
</main>`, schema)
}

function checkout() {
  const route = routes.find((item) => item.path === '/checkout/')
  return shell(route, `${productData()}
<main>
  <section class="page-hero">
    <p class="eyebrow">Secure checkout</p>
    <h1>Start Polar checkout</h1>
    <p>Select Annual or Monthly, then start checkout through this domain. The hosted payment window is provided by Polar after the product-domain API creates the checkout session.</p>
    ${billingTabs()}
  </section>
  <section class="section">${planCards('button')}<p data-checkout-status class="checkout-status" aria-live="polite">Choose a package to prepare secure Polar checkout.</p></section>
</main>`)
}

function success() {
  const route = routes.find((item) => item.path === '/success/')
  return shell(route, `${productData()}
<main>
  <section class="page-hero compact">
    <p class="eyebrow">Payment verification</p>
    <h1>Verify checkout and unlock access</h1>
    <p data-access-status class="checkout-status" aria-live="polite">Checking for a Polar checkout reference...</p>
    <div class="hero-actions"><a class="button primary" data-paid-planner-link aria-disabled="true" href="/#planner">Open planner</a><a class="button secondary" href="/pricing/">Back to pricing</a></div>
  </section>
</main>`)
}

function cancel() {
  const route = routes.find((item) => item.path === '/cancel/')
  return shell(route, `${productData()}
<main>
  <section class="page-hero compact">
    <p class="eyebrow">Checkout canceled</p>
    <h1>Return to package selection</h1>
    <p>No planner access was unlocked. Choose a package again when ready.</p>
    <div class="hero-actions"><a class="button primary" href="/pricing/">View pricing packages</a><a class="button secondary" href="/">Open planner preview</a></div>
  </section>
</main>`)
}

function docs() {
  const route = routes.find((item) => item.path === '/docs/')
  return shell(route, `${productData()}
<main>
  <section class="page-hero">
    <p class="eyebrow">Docs and source notes</p>
    <h1>Stirling PDF Space source map</h1>
    <p>This page explains what the planner covers, what it does not do, and how source facts are separated from conversion paths.</p>
  </section>
  <section class="section">
    <div class="table-wrap">
      <table>
        <thead><tr><th>Page</th><th>Primary intent</th><th>Next action</th><th>Source evidence</th></tr></thead>
        <tbody>
          <tr><td>Homepage</td><td>Stirling PDF planner and product entity</td><td>/pricing/</td><td>Upstream README, docs, and feature list</td></tr>
          <tr><td>PDF tools</td><td>Merge, split, OCR, compress, convert, redact, sign</td><td>/pricing/</td><td>Upstream tool categories and API docs</td></tr>
          <tr><td>Self-host checklist</td><td>Docker, authentication, storage, backups, updates</td><td>/pricing/</td><td>Upstream installation and production docs</td></tr>
          <tr><td>API automation</td><td>Queue, endpoint, and evidence planning</td><td>/pricing/</td><td>Upstream API documentation</td></tr>
        </tbody>
      </table>
    </div>
    <div class="notice"><strong>Source boundary:</strong> official site www.stirlingpdf.com, official docs docs.stirlingpdf.com, and GitHub repo github.com/Stirling-Tools/Stirling-PDF are treated as evidence. They are not checkout, demo, signup, or primary CTA destinations on this site.</div>
    <div class="notice"><strong>Facts JSON:</strong> /.well-known/stirling-pdf-space.json exposes the independent relationship, upstream facts, and planner capability names for AI and search systems.</div>
  </section>
</main>`)
}

function legal(path, title, lead, points) {
  const route = routes.find((item) => item.path === path)
  return shell(route, `${productData()}
<main>
  <section class="page-hero compact">
    <p class="eyebrow">Site policy</p>
    <h1>${title}</h1>
    <p>${lead}</p>
  </section>
  <section class="section"><div class="grid two">${points.map((point) => `<article><h2>${point.title}</h2><p>${point.body}</p></article>`).join('')}</div></section>
</main>`)
}

function notFound() {
  const route = routes.find((item) => item.path === '/404/')
  return shell(route, `${productData()}
<main>
  <section class="page-hero compact">
    <p class="eyebrow">404</p>
    <h1>Page not found</h1>
    <p>The requested Stirling PDF Space page is not available.</p>
    <div class="hero-actions"><a class="button primary" href="/">Return home</a><a class="button secondary" href="/pricing/">View pricing</a></div>
  </section>
</main>`)
}

const pages = new Map([
  ['index.html', home()],
  ['pdf-tools/index.html', simpleRoute('/pdf-tools/', 'Tool matrix', 'Plan PDF operations before production', 'Use this matrix to decide which PDF operation belongs in the workflow and which proof points should be checked before files are shared.', [
    { title: 'Merge and split', body: 'Bundle packets, separate page ranges, and keep ordering evidence for reviewable PDF operations.' },
    { title: 'OCR and conversion', body: 'Route scanned files, image PDFs, Office files, PDF/A output, and searchable text into a repeatable sequence.' },
    { title: 'Compress and secure', body: 'Balance file size, readability, metadata, watermarking, signing, redaction, and retention controls.' },
  ])],
  ['self-host-stirling-pdf/index.html', simpleRoute('/self-host-stirling-pdf/', 'Deployment checklist', 'Self-host Stirling PDF with operational guardrails', 'Review the operational questions that turn a useful open-source PDF toolkit into a production service.', [
    { title: 'Identity and access', body: 'Decide who can upload, process, download, administer, and audit PDFs before exposing the service.' },
    { title: 'Storage and backups', body: 'Plan file limits, temporary storage, retention windows, backup rules, and cleanup jobs.' },
    { title: 'Updates and observability', body: 'Track image versions, release notes, uptime, logs, error handling, and rollback plans.' },
  ])],
  ['stirling-pdf-api/index.html', simpleRoute('/stirling-pdf-api/', 'Automation', 'Map Stirling PDF API work into reliable jobs', 'The planner helps teams convert one-off PDF clicks into repeatable API-backed work without skipping access and evidence checks.', [
    { title: 'Endpoint selection', body: 'Match merge, split, convert, OCR, compression, security, and metadata tasks to operation groups.' },
    { title: 'Batch control', body: 'Design queue limits, retry policy, file size ceilings, status callbacks, and error messages.' },
    { title: 'Evidence logs', body: 'Capture input metadata, settings, output checksums, reviewer notes, and access records.' },
  ])],
  ['pdf-automation/index.html', simpleRoute('/pdf-automation/', 'Workflow design', 'Design PDF automation paths that teams can review', 'Use a single planning layer for intake, transformation, review, approval, signature, and archive steps.', [
    { title: 'Intake', body: 'Classify source PDFs, sensitivity, file size, expected outputs, and approval owners.' },
    { title: 'Transformation', body: 'Sequence OCR, conversion, merge, split, compress, watermark, and metadata changes.' },
    { title: 'Release', body: 'Confirm redaction, signatures, access, retention, and final archive evidence before distribution.' },
  ])],
  ['secure-pdf-workflows/index.html', simpleRoute('/secure-pdf-workflows/', 'Security review', 'Secure PDF workflows before sensitive files move', 'Security planning keeps redaction, metadata, passwords, watermarks, signatures, and retention from becoming afterthoughts.', [
    { title: 'Redaction permanence', body: 'Verify that hidden text, annotations, layers, metadata, and thumbnails do not leak sensitive data.' },
    { title: 'Access and retention', body: 'Set upload permissions, short-lived download windows, storage cleanup, and audit fields.' },
    { title: 'Review evidence', body: 'Keep operation settings, reviewer approvals, output checksums, and final delivery records.' },
  ])],
  ['pricing/index.html', pricing()],
  ['checkout/index.html', checkout()],
  ['success/index.html', success()],
  ['cancel/index.html', cancel()],
  ['docs/index.html', docs()],
  ['privacy/index.html', legal('/privacy/', 'Privacy', 'Stirling PDF Space stores only the operational events needed to run the planner, pricing flow, analytics, and support.', [
    { title: 'Document handling', body: 'The public planner is for workflow planning. Do not upload secrets, regulated records, or production files into support messages.' },
    { title: 'Analytics', body: 'Cloudflare D1 stores page views, CTA clicks, pricing toggles, checkout starts, paid gate hits, planner events, and referral signals.' },
    { title: 'Support', body: 'Support requests go to the listed contact address and should include receipts or non-sensitive workflow details only.' },
    { title: 'Source boundary', body: 'Official project facts are cited as evidence in source notes. Conversion and checkout paths remain on this domain.' },
  ])],
  ['terms/index.html', legal('/terms/', 'Terms', 'Use Stirling PDF Space as an independent planning companion, not as official Stirling PDF support or legal advice.', [
    { title: 'Relationship', body: 'This site is independent and unofficial. It does not represent the upstream project or its maintainers.' },
    { title: 'Payments', body: 'Payments are one-time and do not automatically renew. Annual means one year of coverage for the selected planning package.' },
    { title: 'Refunds', body: 'Contact support with the Polar receipt and issue details. Refund decisions depend on delivery state and abuse review.' },
    { title: 'Limits', body: 'Planner output is operational guidance. Teams remain responsible for security, privacy, legal, and production validation.' },
  ])],
  ['changelog/index.html', legal('/changelog/', 'Changelog', 'Launch notes and verification checkpoints for Stirling PDF Space.', [
    { title: '2026-06-25 initial build', body: 'Created the independent planner site, pricing gate, D1 analytics path, Polar checkout wiring, SEO files, source notes, and validation checks.' },
    { title: 'Page cluster', body: 'Added homepage, PDF tools, self-host, API automation, secure workflows, pricing, checkout, success, cancel, docs, legal, changelog, and 404 pages.' },
    { title: 'Production domain and search', body: 'Apex HTTPS, www redirect, robots, sitemap, Bing verification file, IndexNow key, GSC sitemap, Bing Webmaster, and IndexNow submissions were verified on launch day.' },
    { title: 'Remaining blocker', body: 'Polar checkout credentials are not configured yet, so checkout returns paymentConfigured:false instead of pretending payment is live.' },
    { title: 'Acceptance guard', body: 'Validation checks every HTML page for H1, canonical, og:url, analytics script, no visible outbound links, pricing-first flow, paid gate, and no stale template wording.' },
    { title: 'Iteration window', body: 'Day 3 reviews indexing, 404s, CTA events, checkout starts, paid-gate hits, and referral capture. Day 6 reviews GSC and Bing impressions and clicks after Polar is configured.' },
  ])],
  ['404/index.html', notFound()],
])

const styles = `:root{color-scheme:light;--ink:#172033;--muted:#5b6879;--line:#d9e2ea;--bg:#f7fafb;--panel:#fff;--teal:#0f766e;--blue:#2563eb;--amber:#b45309;--rose:#be123c;--green:#15803d;--shadow:0 18px 50px rgba(23,32,51,.11)}
*{box-sizing:border-box}html{scroll-behavior:smooth}body{margin:0;background:var(--bg);color:var(--ink);font-family:Inter,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",Arial,sans-serif;line-height:1.55}a{color:var(--blue);text-decoration:none}a:hover{text-decoration:underline}.site-header{position:sticky;top:0;z-index:20;display:flex;align-items:center;justify-content:space-between;gap:18px;min-height:64px;padding:0 clamp(16px,4vw,52px);border-bottom:1px solid rgba(217,226,234,.86);background:rgba(255,255,255,.92);backdrop-filter:blur(14px)}.brand{display:inline-flex;align-items:center;gap:10px;color:var(--ink);font-weight:850}.brand-mark{display:grid;place-items:center;width:34px;height:34px;border-radius:8px;background:linear-gradient(135deg,var(--teal),var(--blue));color:#fff;font-size:12px;letter-spacing:0}.site-header nav,.site-footer nav,.hero-actions{display:flex;align-items:center;gap:12px;flex-wrap:wrap}.site-header nav a{color:#344054;font-size:14px;font-weight:700}.nav-pricing{padding:8px 12px;border:1px solid var(--line);border-radius:8px;background:#fff}.hero{position:relative;min-height:600px;display:grid;align-items:end;padding:100px clamp(18px,5vw,76px) 64px;background-image:linear-gradient(90deg,rgba(8,18,34,.78),rgba(8,18,34,.34),rgba(8,18,34,.08)),var(--hero-image);background-size:cover;background-position:center}.hero-copy{max-width:760px;color:#fff}.eyebrow{margin:0 0 10px;color:var(--teal);font-weight:850;text-transform:uppercase;letter-spacing:.08em;font-size:12px}.hero .eyebrow{color:#9ff4ea}.hero h1,.page-hero h1{margin:0 0 14px;font-size:clamp(46px,7vw,82px);line-height:.98;letter-spacing:0}.hero-lede,.page-hero p{max-width:780px;color:inherit;font-size:18px}.button{display:inline-flex;align-items:center;justify-content:center;min-height:44px;padding:0 16px;border-radius:8px;border:1px solid var(--line);font-weight:820;cursor:pointer;background:#fff;color:var(--ink);text-align:center}.button.primary{border-color:transparent;background:var(--teal);color:#fff}.button.secondary{background:rgba(255,255,255,.88);color:var(--ink)}.page-hero{padding:76px clamp(18px,5vw,76px) 44px;background:#fff;border-bottom:1px solid var(--line)}.page-hero.compact{min-height:360px}.section,.tool-band{padding:54px clamp(18px,5vw,76px)}.section-head{max-width:800px;margin-bottom:22px}.section h2,.tool-band h2{margin:0 0 10px;font-size:28px;line-height:1.16;letter-spacing:0}.grid{display:grid;gap:16px}.grid.two{grid-template-columns:repeat(2,minmax(0,1fr))}.grid.three{grid-template-columns:repeat(3,minmax(0,1fr))}article,.planner,.plan,.notice,.table-wrap{border:1px solid var(--line);border-radius:8px;background:var(--panel);box-shadow:var(--shadow)}article,.plan,.notice{padding:20px}article h2,.plan h2{margin:0 0 8px;font-size:20px;line-height:1.22}.planner{display:grid;grid-template-columns:1.4fr repeat(3,minmax(150px,.6fr));gap:12px;padding:18px}.planner label{display:grid;gap:7px;color:#344054;font-size:13px;font-weight:760}.planner textarea,.planner select{width:100%;border:1px solid var(--line);border-radius:8px;background:#fff;color:var(--ink);font:inherit;padding:10px}.planner textarea{min-height:116px;resize:vertical}.planner button{align-self:end}.planner pre{grid-column:1/-1;min-height:150px;margin:0;padding:16px;overflow:auto;border-radius:8px;background:#111827;color:#d7fbe8;font-size:13px}.planner[data-locked="true"]{border-color:#f0c36a}.billing-tabs{display:inline-flex;gap:4px;padding:4px;border:1px solid var(--line);border-radius:8px;background:#eef6f7}.billing-tabs button{min-height:42px;padding:0 16px;border:0;border-radius:7px;background:transparent;color:var(--ink);font-weight:830;cursor:pointer}.billing-tabs button[aria-selected="true"]{background:#fff;color:var(--teal);box-shadow:0 8px 20px rgba(23,32,51,.12)}.billing-tabs span{color:var(--green);font-size:12px}.plans{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:16px}.plan.featured{border-color:rgba(15,118,110,.55);box-shadow:0 22px 70px rgba(15,118,110,.16)}.plan-price{margin:10px 0 2px;color:var(--ink)}.plan-price [data-plan-price]{font-size:42px;font-weight:900;letter-spacing:0}.due{margin:0 0 12px;color:var(--amber);font-weight:780}.plan ul{margin:14px 0 18px;padding-left:20px;color:#344054}.notice{margin-top:16px;border-left:4px solid var(--amber);box-shadow:none}.checkout-status{margin-top:16px;color:#344054;font-weight:760}.checkout-status[data-state="error"]{color:var(--rose)}.checkout-status[data-state="ok"]{color:var(--green)}.table-wrap{overflow:auto;padding:0}table{width:100%;border-collapse:collapse}th,td{padding:12px;border-bottom:1px solid var(--line);text-align:left;vertical-align:top}th{background:#f1f6f8;color:#344054}.site-footer{display:flex;justify-content:space-between;gap:24px;padding:34px clamp(18px,5vw,76px);border-top:1px solid var(--line);background:#fff;color:#344054}.site-footer p{max-width:640px;margin:8px 0 0}@media(max-width:920px){.site-header{align-items:flex-start;flex-direction:column;padding-top:12px;padding-bottom:12px}.hero{min-height:560px;padding-top:82px}.grid.two,.grid.three,.plans,.planner{grid-template-columns:1fr}.planner button{align-self:auto}.hero h1,.page-hero h1{font-size:44px}.site-footer{flex-direction:column}}@media(max-width:560px){.hero{min-height:620px}.hero-actions .button,.page-hero .button{width:100%}.site-header nav{gap:8px}.site-header nav a{font-size:13px}.plan-price [data-plan-price]{font-size:34px}}`

const favicon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="14" fill="#0f766e"/><path d="M17 14h20l10 10v26H17z" fill="#fff"/><path d="M37 14v11h10" fill="#dbeafe"/><path d="M23 35h18M23 42h14M23 28h10" stroke="#2563eb" stroke-width="4" stroke-linecap="round"/></svg>`

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${routes.filter((route) => !route.noindex).map((route) => `  <url><loc>${pageUrl(route.path)}</loc><lastmod>2026-06-25</lastmod><changefreq>weekly</changefreq><priority>${route.path === '/' ? '1.0' : route.path === '/pricing/' ? '0.8' : '0.7'}</priority></url>`).join('\n')}
</urlset>
`

const llms = `# Stirling PDF Space

Stirling PDF Space is an independent, unofficial workflow planner for teams evaluating Stirling PDF operations.

Canonical site: ${product.origin}/
Pricing path: ${product.origin}/pricing/
Planner access: paid access required after Polar checkout verification.
Facts JSON: ${product.origin}/.well-known/stirling-pdf-space.json

Core pages:
- ${product.origin}/pdf-tools/ explains PDF operation planning.
- ${product.origin}/self-host-stirling-pdf/ explains deployment review.
- ${product.origin}/stirling-pdf-api/ explains API automation planning.
- ${product.origin}/secure-pdf-workflows/ explains security and retention controls.

Relationship:
This site is independent and unofficial. Official upstream references are kept as final source notes in the public documentation repository and source notes page, not as conversion paths.

Official Sources:
- ${product.repo}
- ${product.officialDocs}
- ${product.officialSite}
`

const productJson = {
  slug: product.slug,
  brand: product.brand,
  domain: product.domain,
  canonicalOrigin: product.origin,
  relationship: 'independent_unofficial_reference',
  upstream: {
    repo: product.repo,
    docs: product.officialDocs,
    site: product.officialSite,
    license: 'Open-core; MIT for most repository code with listed subdirectory exceptions',
  },
  pricing: {
    defaultBilling: 'annual',
    plans: {
      starter: { monthly: 9, annualMonthlyEquivalent: 4.5, annualDueToday: 54 },
      pro: { monthly: 29, annualMonthlyEquivalent: 14.5, annualDueToday: 174 },
      enterprise: { monthly: 59, annualMonthlyEquivalent: 29.5, annualDueToday: 354 },
    },
    note: 'Payments are one-time and do not automatically renew.',
  },
  paths: {
    pricingPath: product.origin + '/pricing/',
    checkoutPath: product.origin + '/checkout/',
    accessPath: product.origin + '/api/access',
  },
}

async function write(rel, text) {
  const url = new URL(rel, root)
  await mkdir(new URL('.', url), { recursive: true })
  await writeFile(url, text)
}

for (const stale of ['assets/web-data-workflow.png']) {
  await rm(new URL(stale, root), { recursive: true, force: true })
}

for (const [file, html] of pages) await write(file, html)
await write('styles.css', styles)
await write('favicon.svg', favicon)
await write('site.webmanifest', `${JSON.stringify({
  name: product.brand,
  short_name: 'Stirling PDF',
  start_url: '/',
  display: 'standalone',
  background_color: '#f7fafb',
  theme_color: '#0f766e',
  icons: [{ src: '/favicon.svg', sizes: '64x64', type: 'image/svg+xml' }],
}, null, 2)}\n`)
await write('robots.txt', `User-agent: *\nAllow: /\nSitemap: ${product.origin}/sitemap.xml\n`)
await write('sitemap.xml', sitemap)
await write('llms.txt', llms)
await write('product.json', `${JSON.stringify(productJson, null, 2)}\n`)

console.log(`Generated ${pages.size} HTML pages for ${product.brand}.`)
