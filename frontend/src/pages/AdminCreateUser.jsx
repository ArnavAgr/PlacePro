import React, { useState } from 'react';
import axios from '../services/auth';
import { useAlert } from '../context/AlertContext';

export default function AdminCreateUser() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('RECRUITER');
  const [companyName, setCompanyName] = useState('');
  const { showAlert } = useAlert();

  async function submit(e) {
    e.preventDefault();
    try {
      await axios.post('/admin/create-user', { email, password, role, companyName });
      showAlert('User created successfully', 'success');
      setEmail('');
      setPassword('');
      setCompanyName('');
    } catch (err) {
      console.error(err);
      showAlert('Failed to create user', 'error');
    }
  }

  return (
    <div className="card" style={{ maxWidth: '600px', margin: '0 auto' }}>
      <h3 style={{ marginTop: 0, color: 'var(--primary)' }}>Create New User</h3>
      <form onSubmit={submit}>
        <div style={{ marginBottom: '12px' }}>
          <label style={{ display: 'block', marginBottom: '4px' }}>Email</label>
          <input
            required
            type="email"
            placeholder="user@example.com"
            value={email}
            onChange={e => setEmail(e.target.value)}
            style={{ width: '100%' }}
          />
        </div>
        <div style={{ marginBottom: '12px' }}>
          <label style={{ display: 'block', marginBottom: '4px' }}>Password</label>
          <input
            required
            type="password"
            placeholder="******"
            value={password}
            onChange={e => setPassword(e.target.value)}
            style={{ width: '100%' }}
          />
        </div>
        <div style={{ marginBottom: '12px' }}>
          <label style={{ display: 'block', marginBottom: '4px' }}>Role</label>
          <select
            value={role}
            onChange={e => setRole(e.target.value)}
            style={{ width: '100%' }}
          >
            <option value="RECRUITER">Recruiter</option>
            <option value="PLACEMENT_CELL">Placement Cell</option>
          </select>
        </div>
        {role === 'RECRUITER' && (
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '4px' }}>Company Name</label>
            <input
              required
              placeholder="e.g. Google, Microsoft"
              value={companyName}
              onChange={e => setCompanyName(e.target.value)}
              style={{ width: '100%' }}
            />
          </div>
        )}
        <button className="btn btn-primary" style={{ width: '100%' }}>Create User</button>
      </form>
    </div>
  );
}
