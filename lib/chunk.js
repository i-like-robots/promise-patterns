'use strict'

var series = require('./series')

function run(tasklist) {
  return function() {
    return Promise.all(tasklist.map(item => item.call(null)))
  }
}

function chunk(work, size) {
  size = size || 5

  if (Array.isArray(work)) {
    let slices = []

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
