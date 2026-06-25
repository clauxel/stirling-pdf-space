(() => {
  const data = {
    slug: 'stirling-pdf-space',
    brand: 'Stirling PDF Space',
    domain: 'stirling-pdf.space',
    defaultPlanId: 'pro',
    defaultBilling: 'annual',
    ...JSON.parse(document.getElementById('product-data')?.textContent || '{}'),
  }

  function postEvent(event, extra = {}) {
    fetch('/api/analytics', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ event, path: location.pathname, product: data.slug, ...extra }),
    }).catch(() => {})
  }

  postEvent('page_view', { referrer: document.referrer || '' })

  function openCentered(url) {
    const width = Math.min(920, Math.max(520, Math.round(window.innerWidth * 0.72)))
    const height = Math.min(780, Math.max(620, Math.round(window.innerHeight * 0.82)))
    const left = Math.max(0, Math.round((window.screen.width - width) / 2))
    const top = Math.max(0, Math.round((window.screen.height - height) / 2))
    const popup = window.open(url, 'polarCheckout', `popup=yes,width=${width},height=${height},left=${left},top=${top}`)
    if (!popup) window.location.href = url
    else popup.focus()
  }

  function setCheckoutStatus(message, isError = false) {
    document.querySelectorAll('[data-checkout-status]').forEach((node) => {
      node.textContent = message
      node.dataset.state = isError ? 'error' : 'ok'
    })
  }

  function accessToken() {
    try { return window.localStorage.getItem('stirlingPdfSpaceAccessToken') || '' } catch { return '' }
  }

  function setAccessToken(token) {
    try {
      if (token) window.localStorage.setItem('stirlingPdfSpaceAccessToken', token)
    } catch {}
  }

  function hasPaidAccess() {
    return Boolean(accessToken())
  }

  function pricingUrl() {
    return '/pricing/?feature=planner#plans'
  }

  function billingLabel(billing) {
    return billing === 'monthly' ? 'monthly' : 'annual'
  }

  function money(value) {
    const number = Number(value)
    if (!Number.isFinite(number)) return '$0'
    return '$' + number.toLocaleString('en-US', {
      minimumFractionDigits: Number.isInteger(number) ? 0 : 2,
      maximumFractionDigits: 2,
    })
  }

  function updateCheckoutAction(node, planName, planId, billing) {
    const label = billingLabel(billing)
    node.dataset.checkoutBilling = label
    node.textContent = `Checkout ${planName} ${label}`
    if (node.matches('a')) node.href = `/checkout/?plan=${encodeURIComponent(planId)}&billing=${encodeURIComponent(label)}`
  }

  function setBillingMode(mode, track = true) {
    const billing = mode === 'monthly' ? 'monthly' : 'annual'
    document.querySelectorAll('[data-billing-option]').forEach((button) => {
      button.setAttribute('aria-selected', button.dataset.billingOption === billing ? 'true' : 'false')
    })
    document.querySelectorAll('[data-plan-card]').forEach((card) => {
      const planId = card.dataset.planId || 'pro'
      const planName = card.dataset.planName || planId
      const display = card.dataset[`${billing}Display`]
      const due = card.dataset[`${billing}Due`]
      card.querySelectorAll('[data-plan-price]').forEach((node) => { node.textContent = money(display) })
      card.querySelectorAll('[data-plan-period]').forEach((node) => {
        node.textContent = billing === 'annual' ? '/mo billed yearly' : '/mo'
      })
      card.querySelectorAll('[data-due-today]').forEach((node) => {
        node.textContent = `${money(due)} due today`
      })
      card.querySelectorAll('[data-checkout-plan]').forEach((node) => {
        updateCheckoutAction(node, planName, planId, billing)
      })
    })
    document.querySelectorAll('[data-checkout-link-plan], [data-checkout-plan]').forEach((node) => {
      const planId = node.dataset.checkoutLinkPlan || node.dataset.checkoutPlan
      if (!planId) return
      const card = document.querySelector(`[data-plan-card][data-plan-id="${planId}"]`)
      updateCheckoutAction(node, card?.dataset.planName || planId, planId, billing)
    })
    if (track) postEvent('billing_toggle', { billing })
  }

  async function startCheckout(planId, billing) {
    setCheckoutStatus('Preparing secure Polar checkout...')
    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ planId, billing }),
      })
      const payload = await response.json().catch(() => ({}))
      postEvent('polar_checkout_begin', { provider: 'polar', planId, billing, configured: Boolean(payload.paymentConfigured) })
      if (response.ok && payload.checkoutUrl) {
        setCheckoutStatus(`Opening Polar checkout for ${payload.planId} ${payload.billing}.`)
        openCentered(payload.checkoutUrl)
        return
      }
      const message = payload.error || payload.message || 'Polar checkout is not configured for this plan yet.'
      setCheckoutStatus(message, true)
    } catch {
      setCheckoutStatus('Secure checkout could not be reached. Please try again or contact support.', true)
    }
  }

  function localPlan(fields) {
    const goal = fields.goal.toLowerCase()
    const scale = fields.scale
    const output = fields.output
    const deployment = fields.deployment
    const endpoints = []
    if (/merge|combine|packet|appendix|bundle|join/.test(goal)) endpoints.push('merge')
    if (/split|extract|range|separate|chapter|invoice/.test(goal)) endpoints.push('split')
    if (/convert|office|word|excel|powerpoint|image|html|markdown|pdf\/a|pdfa/.test(goal)) endpoints.push('convert')
    if (/ocr|scan|searchable|accessibility|text layer/.test(goal)) endpoints.push('ocr')
    if (/compress|reduce|file size|email|portal|optimi[sz]e/.test(goal)) endpoints.push('compress')
    if (/redact|watermark|metadata|privacy|sensitive|secure|password/.test(goal)) endpoints.push('redact')
    if (/sign|signature|certify|validate|certificate/.test(goal)) endpoints.push('sign')
    if (/api|automation|queue|batch|script|webhook/.test(goal) || scale === 'large') endpoints.push('api')
    if (/self|docker|server|sso|auth|storage|backup|network|kubernetes/.test(goal) || deployment === 'self_hosted') endpoints.push('self_host')
    if (!endpoints.length) endpoints.push('merge', 'compress', 'redact')
    const unique = [...new Set(endpoints)]
    return {
      ok: true,
      product: data.brand || 'Stirling PDF Space',
      status: 'planner_ready_offline',
      recommendedEndpoints: unique.map((name) => ({ name })),
      outputMode: output === 'json' ? 'structured JSON plan with operation metadata' : output,
      deploymentPath: deployment === 'self_hosted' ? 'self-host deployment checklist first' : 'browser or API workflow checklist first',
      nextSteps: [
        'Run a representative sample PDF through the planned operation order.',
        'Verify readability, file size, OCR quality, redaction permanence, and metadata before sharing.',
        'Add authentication, rate limits, storage retention, backups, and operation logs before production automation.',
      ],
      compliance: [
        'Classify document sensitivity before upload, storage, API automation, or retention.',
        deployment === 'self_hosted'
          ? 'Review the upstream license and open-core boundary before redistributing modified builds or packaged services.'
          : 'Use official Stirling PDF docs as source evidence, then keep planning support checkout on stirling-pdf.space.',
      ],
    }
  }

  async function planner(fields) {
    const token = accessToken()
    if (!token) {
      return {
        ok: false,
        requiresPayment: true,
        status: 'pricing_required',
        pricingPath: pricingUrl(),
        message: 'Choose a pricing package and complete Polar checkout before using the planner.',
      }
    }
    try {
      const response = await fetch('/api/planner', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(fields),
      })
      const payload = await response.json().catch(() => ({}))
      if (response.status === 402 || payload.requiresPayment) return payload
      if (response.ok) return payload
    } catch {}
    return localPlan(fields)
  }

  function formFields(form) {
    return {
      goal: form.querySelector('[name="goal"]')?.value || '',
      scale: form.querySelector('[name="scale"]')?.value || 'single',
      output: form.querySelector('[name="output"]')?.value || 'checklist',
      deployment: form.querySelector('[name="deployment"]')?.value || 'cloud',
      posture: form.querySelector('[name="posture"]')?.value || 'standard',
    }
  }

  const form = document.querySelector('[data-planner-form]')
  const plannerOutput = document.querySelector('[data-planner-output]')
  if (form && !hasPaidAccess()) {
    form.dataset.locked = 'true'
    if (plannerOutput) {
      plannerOutput.textContent = JSON.stringify({
        status: 'pricing_required',
        next: 'Choose a pricing package before using the planner.',
        pricing: '/pricing/',
      }, null, 2)
    }
  } else if (form) {
    form.dataset.locked = 'false'
  }

  form?.addEventListener('submit', async (event) => {
    event.preventDefault()
    const output = document.querySelector('[data-planner-output]')
    const fields = formFields(form)
    if (!hasPaidAccess()) {
      postEvent('pricing_required', { feature: 'planner' })
      window.location.href = pricingUrl()
      return
    }
    if (output) output.textContent = JSON.stringify({ status: 'planning', goal: fields.goal }, null, 2)
    const result = await planner(fields)
    if (result?.requiresPayment) {
      postEvent('pricing_required', { feature: 'planner_api' })
      window.location.href = result.pricingPath || pricingUrl()
      return
    }
    if (output) output.textContent = JSON.stringify(result, null, 2)
    postEvent('planner_submit', { scale: fields.scale, output: fields.output, deployment: fields.deployment })
  })

  async function claimAccessFromCheckout() {
    const status = document.querySelector('[data-access-status]')
    if (!status) return
    const params = new URLSearchParams(window.location.search)
    const checkoutId = params.get('checkout_id') || params.get('checkoutId')
    const planId = params.get('planId') || params.get('plan') || data.defaultPlanId || 'pro'
    const billing = params.get('billing') || data.defaultBilling || 'annual'
    if (!checkoutId) {
      status.textContent = 'No Polar checkout reference was returned. Keep your receipt and contact support if access is missing.'
      status.dataset.state = 'error'
      return
    }
    status.textContent = 'Verifying Polar checkout before unlocking the planner...'
    try {
      const response = await fetch('/api/access', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ checkoutId, planId, billing }),
      })
      const payload = await response.json().catch(() => ({}))
      if (response.ok && payload.accessToken) {
        setAccessToken(payload.accessToken)
        status.textContent = 'Payment verified. The planner is unlocked on this browser.'
        status.dataset.state = 'ok'
        document.querySelectorAll('[data-paid-planner-link]').forEach((link) => {
          link.removeAttribute('aria-disabled')
          link.href = '/#planner'
        })
        return
      }
      status.textContent = payload.error || 'Payment could not be verified yet. Keep your Polar receipt and contact support.'
      status.dataset.state = 'error'
    } catch {
      status.textContent = 'Payment verification could not be reached. Keep your Polar receipt and contact support.'
      status.dataset.state = 'error'
    }
  }

  claimAccessFromCheckout()

  const billingTabs = document.querySelector('[data-billing-tabs]')
  if (billingTabs) {
    billingTabs.querySelectorAll('[data-billing-option]').forEach((button) => {
      button.addEventListener('click', () => setBillingMode(button.dataset.billingOption || 'annual'))
    })
    setBillingMode(billingTabs.dataset.defaultBilling || 'annual', false)
  }

  document.querySelectorAll('[data-checkout-plan]').forEach((button) => {
    button.addEventListener('click', () => {
      startCheckout(button.dataset.checkoutPlan || 'pro', button.dataset.checkoutBilling || 'annual')
    })
  })

  document.querySelectorAll('a[href^="/"]').forEach((link) => {
    link.addEventListener('click', () => postEvent('link_click', { target: link.getAttribute('href') }))
  })
})()
