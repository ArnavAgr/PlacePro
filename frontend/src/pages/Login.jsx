import React, { useState } from 'react'
import { login, setToken, setRole } from '../services/auth'
import { useNavigate } from 'react-router-dom'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRoleState] = useState('STUDENT') // Default role is STUDENT
  const nav = useNavigate()

  async function submit(e) {
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
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      // background: 'var(--background)' // Removed to show body pattern
    }}>
      <div className="card" style={{ width: '100%', maxWidth: '400px', padding: '40px' }}>
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <img src="/src/assets/logo.png" alt="PlacePro Logo" style={{ height: '60px' }} />
        </div>
        <h2 style={{ textAlign: 'center', color: 'var(--primary)', marginBottom: '32px', marginTop: 0 }}>Login to PlacePro</h2>

        <form onSubmit={submit}>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', fontSize: '0.875rem' }}>Email Address</label>
            <input
              placeholder="name@example.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', fontSize: '0.875rem' }}>Password</label>
            <input
              placeholder="••••••••"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', fontSize: '0.875rem' }}>I am a...</label>
            <select value={role} onChange={e => setRoleState(e.target.value)}>
              <option value="STUDENT">Student</option>
              <option value="RECRUITER">Recruiter</option>
              <option value="PLACEMENT_CELL">Placement Cell</option>
            </select>
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Login</button>
        </form>

        <p style={{ marginTop: '24px', textAlign: 'center', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
          Don't have an account? <a href="/sign-up" style={{ color: 'var(--primary)', textDecoration: 'none', fontWeight: '600' }}>Sign up</a>
        </p>

        <div style={{ marginTop: '32px', padding: '16px', background: '#F8FAFC', borderRadius: '8px', fontSize: '0.75rem', color: '#64748B' }}>
          <strong>Demo Admin:</strong><br />
          placement@tiet.edu / Admin@123
        </div>
      </div>
    </div>
  )
}
