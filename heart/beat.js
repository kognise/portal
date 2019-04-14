(async () => {
  const e = `https://portal.kognise.dev/heart`
  let session

  async function updateSession() {
    const res = await fetch(`${e}/register`)
    session = await res.text()
  }

  async function beat() {
    const res = await fetch(`${e}/beat/${session}`)
    if (!res.ok) {
      await updateSession()
    }
  }

  await updateSession()
  setInterval(beat, 1000)

  window.addEventListener('beforeunload', async () => {
    await fetch(`${e}/deregister/${session}`)
  })
})()