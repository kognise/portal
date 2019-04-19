const protocolAndDomainRegex = /^(?:\w+:)?\/\/(\S+)$/
const domainRegex = /^[^\s\.]+\.\S{2,}$/


module.exports = (string) => {
  if (typeof string !== 'string') {
    return false
  }

  const match = string.match(protocolAndDomainRegex)
  if (!match) return false

  const everythingAfterProtocol = match[1]
  if (!everythingAfterProtocol) return false

  if (domainRegex.test(everythingAfterProtocol)) return true
  return false
}