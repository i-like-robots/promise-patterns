# Promise Patterns ![Build status](https://api.travis-ci.org/i-like-robots/promise-patterns.png)

Utility functions to help compose promise based code. Inspired by the [Async package](https://github.com/caolan/async).

## Installation

```bash
npm install --save promise-patterns
```

## API

### series(work:Array|Object)

Executes each function in the given array or object of `work` in series (each function will be called when the previous has finished). Each function must return a promise or a resolved value. The fulfilled callback will receive an array of the results or an object with each key assigned the resolved value.

```js
var promiseSeries = require('promise-patterns').series

function getApi1() {
  return fetch('http://localhost/api1.json')
    .then(res => res.json())
}

function getApi2() {
  return fetch('http://localhost/api2.json')
    .then(res => res.json())
}

promiseSeries([ getApi1, getApi2 ])
  .then(res => console.log(res)) // [[Object], [Object]]

promiseSeries({ api1: getApi1, api2: getApi2 })
  .then(res => console.log(res)) // { api1: [Object], api2: [Object] } 
```

### waterfall(work:Array)

Executes each function in the given array of `work` in series (each function will be called when the previous has finished) and passes the result of the previous to the next. Each function must return a promise or a resolved value. The fulfilled callback will receive the final result. This function can be considered equivalent to `promise1.then(promise2).then(promise3)` but is useful for composing a dynamic chain.

```js
var promiseWaterfall = require('promise-patterns').waterfall
var workToDo = []

for (let i of [1, 2, 3]) {
  workToDo.push(function(previous) {
    return fetch(`http://localhost/endpoint-${i}.json?exclude=${previous.id}`)
      .then(res => res.json())
  })
}

promiseWaterfall(workToDo)
  .then(res => console.log(res)) // [Object] 
```

### chunk(work:Array, size:Number = 5)

Splits the given array of `work` into chunks of the maximum given `size` and executes each chunk in series. The functions within a chunk will be executed in parallel. Each function must return a promise or a resolved value. The fulfilled callback will receive a single array of all of the results. This can be considered equivalent to `Promise.all` but is useful for throttling tasks.

```js
var promiseChunk = require('promise-patterns').chunk
var workToDo = []
var i = 0

while (i++ < 12) {
  workToDo.push(function() {
    return fetch(`http://localhost/endpoint-${i}.json`)
      .then(res => res.json())
  })
}

promiseChunk(workToDo, 3)
  .then(res => console.log(res)) // [[Object],[Object],[Object],...]
```
