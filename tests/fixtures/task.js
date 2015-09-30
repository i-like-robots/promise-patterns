var sinon = require('sinon')

function success(value) {
  return new Promise(function(resolve, reject) {
    setTimeout(() => resolve(value), 100)
  })
}

function fail(value) {
  return new Promise(function(resolve, reject) {
    setTimeout(() => reject(new Error(value)), 100)
  })
}

function Task(value) {
  this.value = value

  this.fulfill = sinon.spy(success.bind(null, value))
  this.reject = sinon.spy(fail.bind(null, 'Failure'))
}

module.exports = Task
