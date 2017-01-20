const pair = require('./shared/pair')
const resolve = require('./shared/resolve')

function zip (work) {
  if (typeof work === 'object') {
    const keys = Object.keys(work)
    const promises = keys.map((key) => resolve(work[key]))

    return Promise.all(promises)
      .then((results) => pair(results, keys))
  }

  return Promise.reject(new TypeError('work must be an object'))
}

module.exports = zip
