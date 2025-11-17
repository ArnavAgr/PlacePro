import React, { useState } from 'react'
import { login, setToken, setRole } from '../services/auth'
import { useNavigate } from 'react-router-dom'

export default function Login(){
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const nav = useNavigate()

  async function submit(e){
    e.preventDefault()
    try {
      const data = await login(email, password)
      setToken(data.token)
      setRole(data.role)
      alert('Logged in as ' + data.role)
      nav('/')
    } catch (err) {
      console.error(err)
      alert('Login failed: ' + (err.response?.data?.error || err.message))
    }
  }

  return (
    <div style={{ maxWidth: 480 }}>
      <h3>Login</h3>
      <form onSubmit={submit}>
        <input placeholder="email" value={email} onChange={e=>setEmail(e.target.value)} />
        <input placeholder="password" type="password" value={password} onChange={e=>setPassword(e.target.value)} />
        <button type="submit">Login</button>
      </form>
      <p>Use seeded admin: <code>placement@tiet.edu / Admin@123</code></p>
    </div>
  )
}
