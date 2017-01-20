function resolve (value) {
  if (value instanceof Promise) {
    return value
  }

  if (typeof value === 'function') {
    // use a try/catch block in case the fn returns a simple value
    try {
      return resolve(value())
    } catch (err) {
      return Promise.reject(err)
    }
  }

  return Promise.resolve(value)
}

module.exports = resolve
