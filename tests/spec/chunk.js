const assert = require('assert')
const work = require('../helpers/work')
const { chunk: subject } = require('../../')

describe('Chunk', () => {
  let todo, tasks, fulfilled, rejected

  function run (tasks) {
    return subject(tasks, 3).then(
      args => { fulfilled = args || true },
      args => { rejected = args || true }
    )
  }

  beforeEach(() => {
    todo = work(9)
    fulfilled = rejected = undefined
  })

  describe('given an array', () => {
    beforeEach(() => {
      tasks = todo.map(item => item.fulfill)
      // Make a duplicate array because the tasks array will be modified
      return run(tasks.slice(0))
    })

    it('calls each chunk in order', () => {
      assert.ok(tasks[0].calledBefore(tasks[3]))
      assert.ok(tasks[3].calledBefore(tasks[6]))
    })

    it('collects each result', () => {
      assert(Array.isArray(fulfilled))
      assert.equal(fulfilled.length, todo.length)
    })

    it('returns the results in order', () => {
      assert.equal(todo[0].value, fulfilled[0])
      assert.equal(todo[1].value, fulfilled[1])
      assert.equal(todo[2].value, fulfilled[2])
    })
  })

  describe('given a non array', () => {
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
      tasks = todo.map(item => item.fulfill)
      tasks[5] = todo[5].reject
      return run(tasks)
    })

    it('passes any errors on to be caught', () => {
      assert.ok(rejected instanceof Error)
    })
  })
})
