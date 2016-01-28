var assert = require('assert')
var work = require('../helpers/work')
var subject = require('../../lib/chunk')

describe('Chunk', function() {

  var todo, tasks, fulfilled, rejected

  function run(tasks) {
    return subject(tasks, 3).then(
      args => fulfilled = args || true,
      args => rejected = args || true
    )
  }

  beforeEach(function() {
    todo = work(9)
    fulfilled = rejected = undefined
  })

  describe('given an array', function() {

    beforeEach(function() {
      tasks = todo.map(item => item.fulfill)
      // Make a duplicate array because the tasks array will be modified
      return run([].concat(tasks))
    })

    it('calls each chunk in order', function() {
      assert.ok(tasks[0].calledBefore(tasks[3]))
      assert.ok(tasks[3].calledBefore(tasks[6]))
    })

    it('collects each result', function() {
      assert(Array.isArray(fulfilled))
      assert.equal(fulfilled.length, todo.length)
    })

    it('returns the results in order', function() {
      assert.equal(todo[0].value, fulfilled[0])
      assert.equal(todo[1].value, fulfilled[1])
      assert.equal(todo[2].value, fulfilled[2])
    })

  })

  describe('given an empty array', function() {

    beforeEach(function() {
      tasks = []
      return run(tasks)
    })

    it('resolves successfully', function() {
      assert.ok(Array.isArray(fulfilled))
      assert.ok(rejected === undefined)
    })

  })

  describe('given a non array', function() {

    beforeEach(function() {
      tasks = ''
      return run(tasks)
    })

    it('rejects with a type error', function() {
      assert.ok(rejected instanceof TypeError)
    })

  })

  describe('when handling rejection', function() {

    beforeEach(function() {
      tasks = todo.map(item => item.fulfill)
      tasks[5] = todo[5].reject
      return run(tasks)
    })

    it('passes any errors on to be caught', function() {
      assert.ok(rejected instanceof Error)
    })

  })

})
