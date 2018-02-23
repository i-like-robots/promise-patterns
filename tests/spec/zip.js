const sinon = require('sinon')
const assert = require('assert')
const { zip: subject } = require('../../')

const createCallback = (value) => sinon.stub().resolves(value)

describe('Zip', () => {
  describe('given an object', () => {
    let fixture

    beforeEach(() => {
      fixture = {
        '1': createCallback('one'),
        '2': createCallback('two'),
        '3': createCallback('three')
      }
    })

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
    let fixture

    beforeEach(() => {
      fixture = {
        '1': 'one',
        '2': Promise.resolve('two'),
        '3': () => 'three'
      }
    })

    it('resolves the results assigned to each key', () => (
      subject(fixture).then((results) => {
        assert.equal(results['1'], 'one')
        assert.equal(results['2'], 'two')
        assert.equal(results['3'], 'three')
      })
    ))
  })

  describe('given a non object', () => {
    it('rejects with a type error', () => (
      subject([]).catch((err) => {
        assert.ok(err instanceof TypeError)
      })
    ))
  })

  describe('when handling rejection', () => {
    let fixture

    beforeEach(() => {
      fixture = {
        '1': createCallback('one'),
        '2': createCallback('two'),
        '3': () => { throw new Error() }
      }
    })

    it('passes any errors on to be caught', () => (
      subject(fixture).catch((err) => {
        assert.ok(err instanceof Error)
      })
    ))
  })
})
