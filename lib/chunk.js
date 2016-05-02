'use strict'

const series = require('./series')

function run (tasklist) {
  return () => {
    return Promise.all(tasklist.map(item => item()))
  }
}

function chunk (work, size) {
  size = size || 5

  if (Array.isArray(work)) {
    const slices = []

    while (work.length) {
      slices.push(work.splice(0, size))
    }

    return series(slices.map(run)).then(results => {
      return Array.prototype.concat.apply([], results)
    })
  }

  return Promise.reject(new TypeError('work must be an array'))
}

module.exports = chunk
