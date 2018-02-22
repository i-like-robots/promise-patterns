# Promise Patterns

![Build status](https://api.travis-ci.org/i-like-robots/promise-patterns.png)

Utility functions to help compose promise based code.

## Installation

```bash
npm install -S promise-patterns
```

## Methods

### series(work:Array|Object)

Resolves each item in the given array or object of `work` in series (each item will be resolved when the previous has completed). If an item is a function it will be called and its value resolved. The fulfilled callback will receive an array of the results or an object with each key assigned the resolved value.

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

Resolves each item in the given array of `work` in series (each item will be resolved when the previous has completed). If an item is a function it will be called with the value of the previous. The fulfilled callback will receive the final result. This function can be considered equivalent to `Promise.resolve(promise1).then(promise2).then(promise3)` but is useful for composing a dynamic chain.

```js
const { waterfall } = require('promise-patterns')
const work = []

function fetchImageSet () {
  return fetch('http://localhost/api/imageSet/123')
    .then((res) => res.ok ? res.json() : Promise.reject(res.status))
}

function fetchFirstImage (data) {
  return fetch(`http://localhost/api/image/${data.images[0]}`)
}

waterfall([ fetchImageSet, fetchFirstImage ])
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

retry(attemptToFetch, 3)
  .then((data) => console.log(data)) // [Object]
  .catch(() => console.error('Number of attempts to fetch exceeded'))
```

### zip(work:Object)

This can be considered equivalent to `Promise.all` but the function accepts an object of `work` and will return an object when all values are resolved instead of an array. Values may be simple types, promises or functions. Functions will be called and simple types will be wrapped as a promise.

```js
const { zip } = require('promise-patterns')

function fetchVideoData () {
  return fetch('http://api.videos.com/video/123456')
    .then((res) => res.ok ? res.json : Promise.reject(res.status))
}

function fetchVideoRenditions () {
  return fetch('http://api.videos.com/video/123456/rendition')
    .then((res) => res.ok ? res.json : Promise.reject(res.status))
}

zip({
  video: fetchVideoData,
  renditions: fetchVideoRenditions
})
  .then(({ video, renditions }) => console.log(video, renditions)) // [Object] [Object]
```
