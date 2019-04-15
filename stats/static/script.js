const globalOptions = {
  maintainAspectRatio: false,
  legend: {
    position: 'top',
    labels: {
      fontColor: 'white'
    }
  }
}
const ticksOptions = {
  fontColor: 'white',
  showLabelBackdrop: false
}
const moreScaleOptions = {
  pointLabels: {
    fontColor: 'white'
  },
  gridLines: {
    color: '#ffffff4f'
  },
  angleLines: {
    color: 'white'
  }
}
const numberOptions = {
  scales: {
    yAxes: [{
      ticks: {
        callback(value) {
          return value.toLocaleString()
        },
        beginAtZero: true,
        ...ticksOptions
      },
      ...moreScaleOptions
    }],
    xAxes: [{
      ticks: {
        ...ticksOptions
      },
      ...moreScaleOptions
    }]
  },
  ...globalOptions
}
const bytesOptions = {
  scales: {
    yAxes: [{
      ticks: {
        callback(value) {
          return formatBytes(value)
        },
        beginAtZero: true,
        ...ticksOptions
      },
      ...moreScaleOptions
    }],
    xAxes: [{
      ticks: {
        ...ticksOptions
      },
      ...moreScaleOptions
    }]
  },
  ...globalOptions
}

const sessionsChart = new Chart(document.getElementById('sessions-chart'), {
  type: 'line',
  data: {
    labels: [],
    datasets: [{
      label: 'Active Sessions',
      backgroundColor: 'transparent',
      borderColor: '#36a2eb',
      data: []
    }]
  },
  options: numberOptions
})

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
  options: bytesOptions
})
const memoryPieChart = new Chart(document.getElementById('memory-pie-chart'), {
  type: 'pie',
  data: {
    labels: [ 'Free Memory', 'Used Memory' ],
    datasets: [{
      backgroundColor: [ '#63ff84', '#ff6384' ],
      data: [ 0, 0 ]
    }]
  },
  options: {
    tooltips: {
      callbacks: {
        label: function(tooltipItem, data) {
          return formatBytes(data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index])
        }
      }
    },
    ...globalOptions
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
          beginAtZero: true,
          suggestedMax: 1000,
          ...ticksOptions
        },
        ...moreScaleOptions
      }],
      xAxes: [{
        ticks: {
          ...ticksOptions
        },
        ...moreScaleOptions
      }]
    },
    ...globalOptions
  }
})

const networkChart = new Chart(document.getElementById('network-chart'), {
  type: 'line',
  data: {
    labels: [],
    datasets: [{
      label: 'TX (bytes)',
      backgroundColor: 'transparent',
      borderColor: '#ff6384',
      data: []
    },
    {
      label: 'RX (bytes)',
      backgroundColor: 'transparent',
      borderColor: '#63ff84',
      data: []
    }]
  },
  options: bytesOptions
})

const packetsChart = new Chart(document.getElementById('packets-chart'), {
  type: 'line',
  data: {
    labels: [],
    datasets: [{
      label: 'TX (packets)',
      backgroundColor: 'transparent',
      borderColor: '#ff6384',
      data: []
    },
    {
      label: 'RX (packets)',
      backgroundColor: 'transparent',
      borderColor: '#63ff84',
      data: []
    }]
  },
  options: numberOptions
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
  options: bytesOptions
})

const storageChart = new Chart(document.getElementById('storage-chart'), {
  type: 'pie',
  data: {
    labels: [ 'Free Storage', 'Used Storage' ],
    datasets: [{
      backgroundColor: [ '#63ff84', '#ff6384' ],
      data: [ 0, 0 ]
    }]
  },
  options: {
    tooltips: {
      callbacks: {
        label: function(tooltipItem, data) {
          return formatBytes(data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index])
        }
      }
    },
    ...globalOptions
  }
})

const socket = io({ path: '/stats/io' })
socket.on('stats', ({ usedMemory, freeMemory, portalLatency, statsLatency, readIo, writeIo, networkRx, networkTx, storageUsed, storageFree, packetsRx, packetsTx, sessions }) => {
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

  memoryPieChart.data.datasets[0].data[0] = freeMemory
  memoryPieChart.data.datasets[0].data[1] = usedMemory

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

  if (packetsChart.data.datasets[0].data.length >= history) {
    packetsChart.data.labels.splice(0, 1)
    packetsChart.data.datasets[0].data.splice(0, 1)
    packetsChart.data.datasets[1].data.splice(0, 1)
  }

  packetsChart.data.labels.push(now)
  packetsChart.data.datasets[0].data.push(packetsTx)
  packetsChart.data.datasets[1].data.push(packetsRx)

  if (sessionsChart.data.datasets[0].data.length >= history) {
    sessionsChart.data.labels.splice(0, 1)
    sessionsChart.data.datasets[0].data.splice(0, 1)
  }

  sessionsChart.data.labels.push(now)
  sessionsChart.data.datasets[0].data.push(sessions)

  storageChart.data.datasets[0].data[0] = storageFree
  storageChart.data.datasets[0].data[1] = storageUsed

  memoryChart.update()
  memoryPieChart.update()
  latencyChart.update()
  diskChart.update()
  networkChart.update()
  packetsChart.update()
  storageChart.update()
  sessionsChart.update()
})