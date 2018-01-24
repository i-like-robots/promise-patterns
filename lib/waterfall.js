'use strict'

const settle = require('./shared/settle')

function run (tasklist, prev) {
  return new Promise((resolve, reject) => {
    if (tasklist.length === 0) {
      return resolve(tasklist)
    }

    settle(tasklist.shift(), prev).then(data => {
      if (tasklist.length) {
        return run(tasklist, data)
      }

      return data
    }).then(resolve, reject)
  })
}

function waterfall (work) {
  if (Array.isArray(work)) {
    return run(work)
  }

  return Promise.reject(new TypeError('work must be an array'))
}

module.exports = waterfall
