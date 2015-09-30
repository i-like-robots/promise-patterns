'use strict'

var Task = require('../fixtures/task')

function work(count) {
  var todo = []
  var i = 0

  while (i++ < count) {
    todo.push(new Task(i))
  }

  return todo
}

module.exports = work
