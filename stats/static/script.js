const memoryChart = new Chart(document.getElementById('memory-chart'), {
  type: 'line',
  data: {
    labels: [],
    datasets: [{
      label: 'Used Memory',
      backgroundColor: 'transparent',
      borderColor: '#ff6384',
      data: []
    },
    {
      label: 'Free Memory',
      backgroundColor: 'transparent',
      borderColor: '#63ff84',
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
    },
    maintainAspectRatio: false
  }
})
const memoryPieChart = new Chart(document.getElementById('memory-pie-chart'), {
  type: 'pie',
  data: {
    labels: [ 'Used Memory', 'Free Memory' ],
    datasets: [{
      backgroundColor: [ '#ff6384', '#63ff84' ],
      data: [ 0, 0 ]
    }]
  },
  options: {
    maintainAspectRatio: false
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
const history = 100

const socket = io({ path: '/stats/io' })
socket.on('stats', ({ usedMemory, freeMemory }) => {
  console.log('> Got stats')

  memoryChart.data.labels.push(new Date().toLocaleTimeString())
  memoryChart.data.datasets[0].data.push(usedMemory)
  memoryChart.data.datasets[1].data.push(freeMemory)

  if (memoryChart.data.datasets[0].data.length > history) {
    memoryChart.data.datasets[0].data.shift()
    memoryChart.data.datasets[1].data.shift()
  }

  memoryPieChart.data.datasets[0].data[0] = usedMemory
  memoryPieChart.data.datasets[0].data[1] = freeMemory

  memoryChart.update()
  memoryPieChart.update()
})