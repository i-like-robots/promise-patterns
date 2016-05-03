'use strict'

function pair (results, keys) {
  return results.reduce((map, value, i) => {
    map[keys[i]] = value
    return map
  }, {})
}

module.exports = pair
