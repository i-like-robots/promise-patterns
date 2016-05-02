'use strict'

function run(task, retries) {
  return task().catch(err => {
    if (retries) {
      return run(task, retries -1)
    } else {
      throw err
    }
  })
}

function retry(task, retries) {
  retries = retries || 3

  if (typeof task === 'function') {
    return run(task, retries)
  } else {
    return Promise.reject(new TypeError('work must be a function'))
  }
}

module.exports = retry
