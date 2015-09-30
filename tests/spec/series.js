var assert = require('assert')
var work = require('../helpers/work')
var subject = require('../../lib/series')

describe('Series', function() {

  var todo, tasks, fulfilled, rejected

  function run(tasks) {
    return subject(tasks).then(args => fulfilled = args, args => rejected = args)
  }

  beforeEach(function() {
    todo = work(3)
    fulfilled = rejected = undefined
  })

  describe('given an array', function() {

    beforeEach(function() {
      tasks = todo.map(item => item.fulfill)
      // Make a duplicate array because the tasks array will be modified
      return run([].concat(tasks))
    })

    it('calls each task in order', function() {
      assert.ok(tasks[0].calledBefore(tasks[1]))
      assert.ok(tasks[1].calledBefore(tasks[2]))
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

  describe('given an object', function() {

    beforeEach(function() {
      tasks = { one: todo[0].fulfill, two: todo[1].fulfill, three: todo[2].fulfill }
      return run(tasks)
    })

    it('calls each task in order', function() {
      assert.ok(tasks.one.calledBefore(tasks.two))
      assert.ok(tasks.two.calledBefore(tasks.three))
    })

    it('collects each result', function() {
      assert.equal(typeof fulfilled, 'object')
      assert.equal(Object.keys(fulfilled).length, Object.keys(todo).length)
    })

    it('returns the results assigned to each key', function() {
      assert.equal(todo[0].value, fulfilled.one)
      assert.equal(todo[1].value, fulfilled.two)
      assert.equal(todo[2].value, fulfilled.three)
    })

  })

  describe('given a non array or object', function() {

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
      tasks[1] = todo[1].reject
      return run(tasks)
    })

    it('passes any errors on to be caught', function() {
      assert.ok(rejected instanceof Error)
    })

  })

})
