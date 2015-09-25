'use strict'

var pair = require('./shared/pair')

function run(tasklist, args) {
  return new Promise(function(resolve, reject) {
    tasklist.shift()().then(function(data) {
      args = args || []
      args.push(data)

      if (tasklist.length) {
        return run.call(null, tasklist, args)
      }

      return args
    }).then(resolve, reject)
  })
}

function series(work) {

  if (Array.isArray(work)) {
    return run(work)
  }

  if (typeof work === 'object') {
    let keys = Object.keys(work)
    return run(keys.map(key => work[key])).then(results => pair(results, keys))
  }

  return Promise.reject(new TypeError('work must be an array or object'))
}

module.exports = series
