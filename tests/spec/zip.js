'use strict'

const assert = require('assert')
const work = require('../helpers/work')
const subject = require('../../lib/zip')

describe('Zip', () => {
  let todo, tasks, fulfilled, rejected

  function run (tasks) {
    return subject(tasks).then(
      args => { fulfilled = args || true },
      args => { rejected = args || true }
    )
  }

  beforeEach(() => {
    todo = work(3)
    fulfilled = rejected = undefined
  })

  describe('given an object', () => {
    beforeEach(() => {
      tasks = { one: todo[0].fulfill, two: todo[1].fulfill, three: todo[2].fulfill }
      return run(tasks)
    })

    it('calls each task', () => {
      assert.ok(tasks.one.calledOnce)
      assert.ok(tasks.two.calledOnce)
      assert.ok(tasks.three.calledOnce)
    })

    it('returns the results assigned to each key', () => {
      assert.equal(todo[0].value, fulfilled.one)
      assert.equal(todo[1].value, fulfilled.two)
      assert.equal(todo[2].value, fulfilled.three)
    })
  })

  describe('given an empty object', () => {
    beforeEach(() => {
      tasks = {}
      return run(tasks)
    })

    it('resolves with an empty object', () => {
      assert.ok(typeof fulfilled === 'object')
      assert.ok(rejected === undefined)
    })
  })

  describe('given a non object', () => {
    beforeEach(() => {
      tasks = ''
      return run(tasks)
    })

    it('rejects with a type error', () => {
      assert.ok(rejected instanceof TypeError)
    })
  })

  describe('when handling rejection', () => {
    beforeEach(() => {
      tasks = todo.map((item) => item.fulfill)
      tasks[1] = todo[1].reject
      return run(tasks)
    })

    it('passes any errors on to be caught', () => {
      assert.ok(rejected instanceof Error)
    })
  })
})
