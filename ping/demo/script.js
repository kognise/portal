const setupLocationField = document.getElementById('setup-location')
const setupResult = document.getElementById('setup-result')
document.getElementById('setup-form').addEventListener('submit', async (event) => {
  event.preventDefault()

  if (!setupLocationField.value) {
    setupResult.innerText = 'You must provide a URL to ping!'
    return
  }
  const location = setupLocationField.value
  setupLocationField.value = ''

  const res = await fetch(`/ping/${encodeURIComponent(location)}`)
  switch(res.status) {
    case 201: {
      const stopCode = await res.text()
      setupResult.innerHTML = `Success! Your website is now being pinged. Your stop code is <code>${stopCode}</code>. <strong>You'll need this to stop pinging your site.</strong>`
      break
    }
    case 409: {
      setupResult.innerText = 'Lucky for you, that site is already being pinged by us.'
      break
    }
    case 400: {
      setupResult.innerText = `Sorry, that doesn't seem to be a valid URL.`
      break
    }
    default: {
      setupResult.innerText = 'Our servers pulled an oopsie whoopsie! Please try again later.'
    }
  }
})

const stopLocationField = document.getElementById('stop-location')
const stopCodeField = document.getElementById('stop-code')
const stopResult = document.getElementById('stop-result')
document.getElementById('stop-form').addEventListener('submit', async (event) => {
  event.preventDefault()

  if (!stopLocationField.value || !stopCodeField.value) {
    stopResult.innerText = 'You must provide a URL and stop code.'
    return
  }
  const location = stopLocationField.value
  stopLocationField.value = ''
  const stopCode = stopCodeField.value
  stopCodeField.value = ''

  const res = await fetch(`/ping/${encodeURIComponent(location)}/stop/${encodeURIComponent(stopCode)}`)
  switch(res.status) {
    case 204: {
      stopResult.innerText = `We've stopped pinging that website.`
      break
    }
    case 403: {
      stopResult.innerText = `It looks like you entered an incorrect stop code.`
      break
    }
    case 404: {
      stopResult.innerText = `We aren't pinging that site yet! Sorry.`
      break
    }
    case 400: {
      stopResult.innerText = `Sorry, your URL or stop code seems to be invalid.`
      break
    }
    default: {
      stopResult.innerText = 'Our servers pulled an oopsie whoopsie! Please try again later.'
    }
  }
})