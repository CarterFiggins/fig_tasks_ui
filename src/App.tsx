import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
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

const API_BASE = 'http://localhost:3017'

function App() {
  const [loggedIn, setLoggedIn] = useState(false)
  const [tasks, setTasks] = useState<Task[]>([])
  const [error, setError] = useState<string | null>(null)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loginError, setLoginError] = useState<string | null>(null)

  useEffect(() => {
    if (!loggedIn) return

    fetch(`${API_BASE}/api/tasks`, { credentials: 'include' })
      .then((res) => {
        if (!res.ok) throw new Error(`Request failed: ${res.status}`)
        return res.json()
      })
      .then((data: Task[]) => setTasks(data))
      .catch((err) => setError(err.message))
  }, [loggedIn])

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault()
    setLoginError(null)

    const res = await fetch(`${API_BASE}/api/login`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    })

    if (!res.ok) {
      const data = await res.json().catch(() => ({}))
      setLoginError(data.error || `Login failed: ${res.status}`)
      return
    }

    setLoggedIn(true)
  }

  const handleLogout = async () => {
    await fetch(`${API_BASE}/api/logout`, { method: 'POST', credentials: 'include' })
    setLoggedIn(false)
    setTasks([])
  }

  if (!loggedIn) {
    return (
      <div>
        <h1>Log in</h1>
        <form onSubmit={handleLogin}>
          <div>
            <label>
              Email
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </label>
          </div>
          <div>
            <label>
              Password
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </label>
          </div>
          <button type="submit">Log in</button>
        </form>
        {loginError && <p>{loginError}</p>}
      </div>
    )
  }

  return (
    <div>
      <h1>Tasks</h1>
      <button onClick={handleLogout}>Log out</button>
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
