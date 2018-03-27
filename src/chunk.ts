import settle from './concerns/settle'
import series from './series'

function run (tasklist: Array<any>) {
  return () => Promise.all(tasklist.map(settle))
}

function chunk (work: Array<any>, size: number = 5) {
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

export default chunk
