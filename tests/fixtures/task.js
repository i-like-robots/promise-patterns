var sinon = require('sinon')

function success(value) {
  return new Promise((resolve, reject) => resolve(value))
}

function fail(value) {
  return new Promise((resolve, reject) => reject(new Error(value)))
}

function Task(value) {
  this.value = value

  this.fulfill = sinon.stub().returns(success(value))
  this.reject = sinon.stub().returns(fail('Failure'))
}

module.exports = Task
