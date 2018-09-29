interface Task {
  id: number
  timestamp: Date,
  fn: () => void
}

let tasks: Task[] = []

setInterval(() => {
  tasks.forEach(task => {
    if (task.timestamp.getTime() <= Date.now()) {
      task.fn()
      tasks = tasks.filter(t => t.timestamp.getTime() >= Date.now())
    }
  })
}, 1000)

export function scheduleTask(id: number, time: Date, callback: () => void) {
  if (tasks.some(task => task.id === id)) {
    return
  }
  tasks.push({
    id,
    timestamp: time,
    fn: callback
  })
}