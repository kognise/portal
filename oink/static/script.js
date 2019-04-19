const field = document.getElementById('str')
const result = document.getElementById('result')
field.addEventListener('keyup', async () => {
  const string = field.value
  if (!string) {
    result.innerText = '-'
    return
  }
  const res = await fetch(`/oink/translate/${encodeURIComponent(string)}`)
  const text = await res.text()
  result.innerText = text
})