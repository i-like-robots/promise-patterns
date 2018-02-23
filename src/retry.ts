export interface Task {
  (): Promise<any>
}

function run (task: Task, retries: number): Promise<any> {
  return task().catch(err => {
    if (retries) {
      return run(task, retries - 1)
    } else {
      return Promise.reject(err)
    }
  })
}

function retry (task: Task, retries: number = 3): Promise<any> {
  if (typeof task === 'function') {
    return run(task, retries)
  } else {
    return Promise.reject(new TypeError('work must be a function'))
  }
}

export default retry
