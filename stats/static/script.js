const memoryChart = new Chart(document.getElementById('memory-chart'), {
  type: 'line',
  data: {
    labels: [],
    datasets: [{
      label: 'Memory Usage',
      backgroundColor: 'transparent',
      borderColor: '#ff6384',
      data: []
    }]
  },
  options: {
    scales: {
      yAxes: [{
        ticks: {
          callback(value) {
            return formatBytes(value)
          },
          suggestedMin: 0
        }
      }]
    }
  }
})

function formatBytes(bytes, decimals = 2) {
  if (bytes < 1) return `${bytes} Bytes`
  if (bytes === 1) return `1 Byte`

  const k = 1024
  const dm = decimals < 0 ? 0 : decimals
  const sizes = [ 'Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB' ]

  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i]
}

const socket = io({ path: '/stats/io' })
socket.on('stats', ({ usedMemory }) => {
  console.log('> Got stats')
  memoryChart.data.labels.push(new Date().toLocaleString())
  memoryChart.data.datasets[0].data.push(usedMemory)
  memoryChart.update()
})