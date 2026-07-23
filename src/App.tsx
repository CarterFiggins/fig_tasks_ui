import { useEffect, useState } from 'react'
import './App.css'

interface Task {
  id: number
  title: string
  notes: string | null
  recurring: number | null
  due_date: string | null
  position: number
  archived_at: string | null
}

function App() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetch('http://localhost:3017/api/tasks')
      .then((res) => {
        if (!res.ok) throw new Error(`Request failed: ${res.status}`)
        return res.json()
      })
      .then((data: Task[]) => setTasks(data))
      .catch((err) => setError(err.message))
  }, [])

  return (
    <div>
      <h1>Tasks</h1>
      {error && <p>Error loading tasks: {error}</p>}
      <ul>
        {tasks.map((task) => (
          <li key={task.id}>
            {task.title}
            {task.recurring != null && ` (every ${task.recurring} days)`}
            {task.notes && ` — ${task.notes}`}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default App
