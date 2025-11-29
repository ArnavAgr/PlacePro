import React, { useState } from 'react'
import { login, setToken, setRole } from '../services/auth'
import { useNavigate } from 'react-router-dom'

export default function Login(){
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRoleState] = useState('STUDENT') // Default role is STUDENT
  const nav = useNavigate()

  async function submit(e){
    e.preventDefault()
    try {
      const data = await login(email, password)
      if (data.role !== role) {
        alert(`Invalid role selected. You are a ${data.role}, not a ${role}.`)
        return
      }
      setToken(data.token)
      setRole(data.role)
      alert('Logged in as ' + data.role)

      // Redirect based on role
      if (data.role === 'PLACEMENT_CELL') {
        nav('/admin/create-user')
      } else if (data.role === 'RECRUITER') {
        nav('/recruiter/create-job')
      } else if (data.role === 'STUDENT') {
        nav('/jobs')
      } else {
        nav('/') // Fallback to home
      }
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
        <select value={role} onChange={e=>setRoleState(e.target.value)}>
          <option value="STUDENT">Student</option>
          <option value="RECRUITER">Recruiter</option>
          <option value="PLACEMENT_CELL">Placement Cell</option>
        </select>
        <button type="submit">Login</button>
      </form>
      <p>Use seeded admin: <code>placement@tiet.edu / Admin@123</code></p>
    </div>
  )
}
