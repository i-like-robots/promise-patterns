const sinon = require('sinon')
const assert = require('assert')
const subject = require('../../lib/zip')

const sandbox = sinon.sandbox.create()

const createCallback = (value) => sandbox.stub().returns(Promise.resolve(value))

describe('Zip', () => {
  afterEach(() => {
    sandbox.reset()
  })

  describe('given an object', () => {
    const fixture = {
      '1': createCallback('one'),
      '2': createCallback('two'),
      '3': createCallback('three')
    }

    it('calls each task', () => (
      subject(fixture).then(() => {
        sinon.assert.calledOnce(fixture['1'])
        sinon.assert.calledOnce(fixture['2'])
        sinon.assert.calledOnce(fixture['3'])
      })
    ))

    it('resolves the results assigned to each key', () => (
      subject(fixture).then((results) => {
        assert.equal(results['1'], 'one')
        assert.equal(results['2'], 'two')
        assert.equal(results['3'], 'three')
      })
    ))
  })

  describe('given an object with mixed values', () => {
    const fixture = {
      '1': 'one',
      '2': Promise.resolve('two'),
      '3': () => 'three'
    }

    it('resolves the results assigned to each key', () => (
      subject(fixture).then((results) => {
        assert.equal(results['1'], 'one')
        assert.equal(results['2'], 'two')
        assert.equal(results['3'], 'three')
      })
    ))
  })

  describe('given an empty object', () => {
    const fixture = {}

    it('resolves with an empty object', () => (
      subject(fixture).then((result) => {
        assert.ok(typeof result === 'object')
      })
    ))
  })

  describe('given a non object', () => {
    const fixture = []

    it('rejects with a type error', () => (
      subject(fixture).catch((err) => {
        assert.ok(err instanceof TypeError)
      })
    ))
  })

  describe('when handling rejection', () => {
    const fixture = {
      '1': createCallback('one'),
      '2': createCallback('two'),
      '3': () => { throw new Error() }
    }

    it('passes any errors on to be caught', () => (
      subject(fixture).catch((err) => {
        assert.ok(err instanceof Error)
      })
    ))
  })
})
