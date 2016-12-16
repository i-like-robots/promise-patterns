# Promise Patterns ![Build status](https://api.travis-ci.org/i-like-robots/promise-patterns.png)

Utility functions to help compose promise based code. Loosely inspired by the [Async package](https://github.com/caolan/async).

## Installation

```bash
npm install --save promise-patterns
```

## Methods

### series(work:Array|Object)

Executes each function in the given array or object of `work` in series (each function will be called when the previous has finished). Each function _must_ return a promise or a resolved value. The fulfilled callback will receive an array of the results or an object with each key assigned the resolved value.

```js
const { series } = require('promise-patterns')

function saveItem () {
  return fetch('http://localhost/api/item', { method: 'POST', body: { ... } })
}

function notifySaveSuccess () {
  return fetch('http://localhost/notifications', { method: 'PUT' })
}

series([ saveItem, notifySaveSuccess ])
  .then((result) => console.log(result)) // [ [Object], [Object] ]
```

### waterfall(work:Array)

Executes each function in the given array of `work` in series (each function will be called when the previous has finished) and passes the result of the previous to the next. Each function _must_ return a promise or a resolved value. The fulfilled callback will receive the final result. This function can be considered equivalent to `promise1.then(promise2).then(promise3)` but is useful for composing a dynamic chain.

```js
const { waterfall } = require('promise-patterns')
const work = []

function getImageSet () {
  return fetch('http://localhost/api/imageSet/123')
    .then((res) => res.ok ? res.json() : Promise.reject(res.status))
}

function getFirstImage (data) {
  return fetch(`http://localhost/api/image/${data.images[0]}`)
}

waterfall([ getImageSet, getFirstImage ])
  .then((result) => console.log(result)) // [Object]
```

### chunk(work:Array, size:Number = 5)

Splits the given array of `work` into chunks of the maximum given `size` and executes each chunk in series. The functions within a chunk will be executed in parallel. Each function _must_ return a promise or a resolved value. The fulfilled callback will receive a single array of all of the results. This can be considered equivalent to `Promise.all` but is useful for throttling tasks.

```js
const { chunk } = require('promise-patterns')
const work = []

let i = 0

while (i++ < 12) {
  work.push(() => (
    fetch(`http://localhost/api/item/${i}`)
      .then(res => res.json())
  ))
}

chunk(workToDo, 3)
  .then((res) => console.log(res)) // [[Object],[Object],[Object],...]
```

### retry(task:Function, retries:Number = 3)

If the given `task` function rejects when called then this method will call it again up to the specified number of `retries`.

```js
const { retry } = require('promise-patterns')

function attemptToFetch () {
  return fetch('http://flakey-provider.com/api/item')
    .then((res) => res.ok ? res.json() : Promise.reject(res.status))
}

promiseRetry(attemptToFetch, 3)
  .then((data) => console.log(data)) // [Object]
  .catch(() => console.error('Number of attempts to fetch exceeded'))
```
