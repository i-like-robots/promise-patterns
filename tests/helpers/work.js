'use strict'

const Task = require('../fixtures/task')

function work (count) {
  const todo = []
  let i = 0

  while (i++ < count) {
    todo.push(new Task(i))
  }

  return todo
}

module.exports = work
