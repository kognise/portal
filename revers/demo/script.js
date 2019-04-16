const field = document.getElementById('string')
const result = document.getElementById('result')
field.addEventListener('keyup', async () => {
  const string = field.value
  if (!string) {
    result.innerText = '-'
    return
  }
  const res = await fetch(`/revers/${encodeURIComponent(string)}`)
  const text = await res.text()
  result.innerText = text
})