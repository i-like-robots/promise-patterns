const assert = require('assert')
const work = require('../helpers/work')
const { waterfall: subject } = require('../../')

describe('Waterfall', () => {
  var todo, tasks, fulfilled, rejected

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

  describe('given an array', () => {
    beforeEach(() => {
      tasks = todo.map(item => item.fulfill)
      // Make a duplicate array because the tasks array will be modified
      return run([].concat(tasks))
    })

    it('calls each task in order', () => {
      assert.ok(tasks[0].calledBefore(tasks[1]))
      assert.ok(tasks[1].calledBefore(tasks[2]))
    })

    it('passes each result to the next', () => {
      assert.ok(tasks[1].calledWith(todo[0].value))
      assert.ok(tasks[2].calledWith(todo[1].value))
    })

    it('returns the last result', () => {
      assert.equal(fulfilled, todo[2].value)
    })
  })

  describe('given an empty array', () => {
    beforeEach(() => {
      tasks = []
      return run(tasks)
    })

    it('resolves with an empty array', () => {
      assert.ok(Array.isArray(fulfilled))
      assert.ok(rejected === undefined)
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
      tasks[1] = todo[1].reject
      return run(tasks)
    })

    it('passes any errors on to be caught', () => {
      assert.ok(rejected instanceof Error)
    })
  })
})
