var assert = require('assert')
var Task = require('../fixtures/task')
var subject = require('../../lib/waterfall')

describe('Waterfall', function() {

  var work, tasks, fulfilled, rejected

  function run(tasks) {
    return subject(tasks).then(args => fulfilled = args, args => rejected = args)
  }

  beforeEach(function() {
    work = [ new Task(1), new Task(2), new Task(3) ]
    fulfilled = rejected = undefined
  })

  describe('given an array', function() {

    beforeEach(function() {
      tasks = [ work[0].fulfill, work[1].fulfill, work[2].fulfill ]
      // Make a duplicate array because the tasks array will be modified
      return run([].concat(tasks))
    })

    it('calls each task in order', function() {
      assert.ok(tasks[0].calledBefore(tasks[1]))
      assert.ok(tasks[1].calledBefore(tasks[2]))
    })

    it('passes each result to the next', function() {
      assert.ok(tasks[1].calledWith(work[0].value))
      assert.ok(tasks[2].calledWith(work[1].value))
    })

    it('returns the last result', function() {
      assert.equal(fulfilled, work[2].value)
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
      tasks = [ work[0].fulfill, work[1].reject, work[2].fulfill ]
      return run(tasks)
    })

    it('passes any errors on to be caught', function() {
      assert.ok(rejected instanceof Error)
    })

  })

})
