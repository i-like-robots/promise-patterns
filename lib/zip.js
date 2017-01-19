'use strict'

const pair = require('./shared/pair')

function zip (work) {
  if (typeof work === 'object') {
    const keys = Object.keys(work)
    return Promise.all(keys.map(key => work[key]())).then((results) => pair(results, keys))
  }

  return Promise.reject(new TypeError('work must be an object'))
}

module.exports = zip
