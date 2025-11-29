import React, { useState } from 'react'
import axios from '../services/auth'

export default function AdminCreateUser() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState('RECRUITER')
  const [companyName, setCompanyName] = useState('')

  async function submit(e) {
    e.preventDefault()
    try {
      const res = await axios.post('/admin/create-user', { email, password, role, companyName })
      alert('Created: ' + (res.data.userId || 'ok'))
    } catch (err) {
      alert('Error: ' + (err.response?.data?.error || err.message))
    }
  }

  return (
    <div style={{ maxWidth: 600 }}>
      <h3>Admin: Create User</h3>
      <form onSubmit={submit}>
        <input placeholder="email" value={email} onChange={e => setEmail(e.target.value)} />
        <input placeholder="password" value={password} onChange={e => setPassword(e.target.value)} />
        <select value={role} onChange={e => setRole(e.target.value)}>
          <option value="RECRUITER">RECRUITER</option>
          <option value="PLACEMENT_CELL">PLACEMENT_CELL</option>
        </select>
        {role === 'RECRUITER' && <input placeholder="companyName" value={companyName} onChange={e => setCompanyName(e.target.value)} />}
        <button>Create</button>
      </form>
    </div>
  )
}
