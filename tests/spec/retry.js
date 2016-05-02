'use strict'

const sinon = require('sinon')
const assert = require('assert')
const subject = require('../../lib/retry')

describe('Retry', () => {

  describe('given a function', () => {

    it('passes on value when task resolves', () => {
      const task = sinon.stub().returns(Promise.resolve('success'))

      return subject(task).then(result => {
        assert.equal(result, 'success')
        assert.equal(task.callCount, 1)
      })
    })

    it('will retry when task rejects', () => {
      const task = sinon.stub()

      task.onCall(0).returns(Promise.reject())
      task.onCall(1).returns(Promise.reject())
      task.onCall(2).returns(Promise.resolve('success'))

      return subject(task).then(result => {
        assert.equal(result, 'success')
        assert.equal(task.callCount, 3)
      })
    })

    it('passes any errors to be caught when work rejects too many times', () => {
      const task = sinon.stub().returns(Promise.reject('failure'))

      return subject(task).catch(result => {
        assert.equal(result, 'failure')
        assert.equal(task.callCount, 4)
      })
    })

  })

  describe('given a non function', () => {

    it('rejects with a type error', () => {
      subject(null).catch(result => {
        assert.ok(result instanceof TypeError)
      })
    })

  })

})
