import pair from './concerns/pair'
import settle from './concerns/settle'

function run (tasklist: Array<any>, args: Array<any> = []): Promise<Array<any>> {
  return new Promise((resolve, reject) => {
    if (tasklist.length === 0) {
      return resolve(args)
    }

    settle(tasklist.shift()).then((data) => {
      args.push(data)

      if (tasklist.length) {
        return run(tasklist, args)
      }

      return args
    }).then(resolve, reject)
  })
}

function series (work: Array<any>|object): Promise<Array<any>|object> {
  if (Array.isArray(work)) {
    return run(work)
  }

  if (typeof work === 'object') {
    const keys = Object.keys(work)
    return run(keys.map(key => work[key])).then((results) => pair(results, keys))
  }

  return Promise.reject(new TypeError('work must be an array or object'))
}

export default series
