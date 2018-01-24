'use strict'

const pair = require('./shared/pair')
const settle = require('./shared/settle')

function run (tasklist, args) {
  return new Promise((resolve, reject) => {
    if (tasklist.length === 0) {
      return resolve(tasklist)
    }

    settle(tasklist.shift()).then(data => {
      args = args || []
      args.push(data)

      if (tasklist.length) {
        return run(tasklist, args)
      }

      return args
    }).then(resolve, reject)
  })
}

function series (work) {
  if (Array.isArray(work)) {
    return run(work)
  }

  if (typeof work === 'object') {
    const keys = Object.keys(work)
    return run(keys.map(key => work[key])).then(results => pair(results, keys))
  }

  return Promise.reject(new TypeError('work must be an array or object'))
}

module.exports = series
