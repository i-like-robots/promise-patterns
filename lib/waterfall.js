'use strict'

function run(tasklist, prev) {
  return new Promise(function(resolve, reject) {
    tasklist.shift()(prev).then(function(data) {

      if (tasklist.length) {
        return run.call(null, tasklist, data)
      }

      return data
    }).then(resolve, reject)
  })
}

function waterfall(work) {

  if (Array.isArray(work)) {
    return run(work)
  }

  return Promise.reject(new TypeError('work must be an array'))
}

module.exports = waterfall
