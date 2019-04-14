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
const history = 50

const latencyChart = new Chart(document.getElementById('latency-chart'), {
  type: 'line',
  data: {
    labels: [],
    datasets: [{
      label: 'Portal Latency',
      backgroundColor: 'transparent',
      borderColor: '#ff6384',
      data: []
    },
    {
      label: 'Stats Latency',
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
            return `${value}ms`
          },
          suggestedMin: 0
        }
      }]
    }
  }
})

const networkChart = new Chart(document.getElementById('network-chart'), {
  type: 'line',
  data: {
    labels: [],
    datasets: [{
      label: 'TX',
      backgroundColor: 'transparent',
      borderColor: '#ff6384',
      data: []
    },
    {
      label: 'RX',
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
    }
  }
})

const diskChart = new Chart(document.getElementById('disk-chart'), {
  type: 'line',
  data: {
    labels: [],
    datasets: [{
      label: 'Disk Writes',
      backgroundColor: 'transparent',
      borderColor: '#ff6384',
      data: []
    },
    {
      label: 'Disk Reads',
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
    }
  }
})

const socket = io({ path: '/stats/io' })
socket.on('stats', ({ usedMemory, freeMemory, portalLatency, statsLatency, readIo, writeIo, networkRx, networkTx }) => {
  console.log('> Got stats')
  const now = new Date().toLocaleTimeString()

  if (memoryChart.data.datasets[0].data.length >= history) {
    memoryChart.data.labels.splice(0, 1)
    memoryChart.data.datasets[0].data.splice(0, 1)
    memoryChart.data.datasets[1].data.splice(0, 1)
  }

  memoryChart.data.labels.push(now)
  memoryChart.data.datasets[0].data.push(usedMemory)
  memoryChart.data.datasets[1].data.push(freeMemory)

  memoryPieChart.data.datasets[0].data[0] = usedMemory
  memoryPieChart.data.datasets[0].data[1] = freeMemory

  if (latencyChart.data.datasets[0].data.length >= history) {
    latencyChart.data.labels.splice(0, 1)
    latencyChart.data.datasets[0].data.splice(0, 1)
    latencyChart.data.datasets[1].data.splice(0, 1)
  }

  latencyChart.data.labels.push(now)
  latencyChart.data.datasets[0].data.push(portalLatency)
  latencyChart.data.datasets[1].data.push(statsLatency)

  if (diskChart.data.datasets[0].data.length >= history) {
    diskChart.data.labels.splice(0, 1)
    diskChart.data.datasets[0].data.splice(0, 1)
    diskChart.data.datasets[1].data.splice(0, 1)
  }

  diskChart.data.labels.push(now)
  diskChart.data.datasets[0].data.push(writeIo)
  diskChart.data.datasets[1].data.push(readIo)

  if (networkChart.data.datasets[0].data.length >= history) {
    networkChart.data.labels.splice(0, 1)
    networkChart.data.datasets[0].data.splice(0, 1)
    networkChart.data.datasets[1].data.splice(0, 1)
  }

  networkChart.data.labels.push(now)
  networkChart.data.datasets[0].data.push(networkTx)
  networkChart.data.datasets[1].data.push(networkRx)

  memoryChart.update()
  memoryPieChart.update()
  latencyChart.update()
  diskChart.update()
  networkChart.update()
})