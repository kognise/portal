const setupLocationField = document.getElementById('setup-location')
const setupResult = document.getElementById('setup-result')
document.getElementById('setup-form').addEventListener('submit', async (event) => {
  event.preventDefault()

  if (!setupLocationField.value) {
    setupResult.innerText = ''
    return
  }
  const location = setupLocationField.value
  setupLocationField.value = ''

  const res = await fetch(`/ping/${encodeURIComponent(location)}`)
  switch(res.status) {
    case 201: {
      setupResult.innerText = 'Success! Your website is now being pinged.'
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
const stopResult = document.getElementById('stop-result')
document.getElementById('stop-form').addEventListener('submit', async (event) => {
  event.preventDefault()

  if (!stopLocationField.value) {
    stopResult.innerText = ''
    return
  }
  const location = stopLocationField.value
  stopLocationField.value = ''

  const res = await fetch(`/ping/${encodeURIComponent(location)}/stop`)
  switch(res.status) {
    case 200: {
      stopResult.innerText = `If we were before, we've stopped pinging that website.`
      break
    }
    case 400: {
      stopResult.innerText = `Sorry, that doesn't seem to be a valid URL.`
      break
    }
    default: {
      stopResult.innerText = 'Our servers pulled an oopsie whoopsie! Please try again later.'
    }
  }
})