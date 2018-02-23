function pair (results: Array<any>, keys: Array<string>): object {
  return results.reduce((map, value, i) => {
    map[keys[i]] = value
    return map
  }, {})
}

export default pair
