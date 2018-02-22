import pair from './concerns/pair'
import settle from './concerns/settle'

function zip (work) {
  if (typeof work === 'object') {
    const keys = Object.keys(work)
    const promises = keys.map((key) => settle(work[key]))

    return Promise.all(promises)
      .then((results) => pair(results, keys))
  }

  return Promise.reject(new TypeError('work must be an object'))
}

export default zip
