import React from 'react'
import { Routes, Route, Link } from 'react-router-dom'
import Login from './pages/Login'
import Home from './pages/Home'
import AdminCreateUser from './pages/AdminCreateUser'
import CreateJob from './pages/CreateJob'
import JobsList from './pages/JobsList'
import PrivateRoute from './utils/PrivateRoute'
import { getRole, logout } from './services/auth'

export default function App(){
  return (
    <div style={{ padding: 20 }}>
      <nav style={{ marginBottom: 20 }}>
        <Link to="/">Home</Link> {' | '}
        <Link to="/jobs">Jobs</Link> {' | '}
        {!getRole() ? <Link to="/login">Login</Link> : <button onClick={()=>{ logout(); window.location.href='/' }}>Logout</button>}
        {' | '}
        {getRole() === 'PLACEMENT_CELL' && <Link to="/admin/create-user">Admin</Link>}
        {getRole() === 'RECRUITER' && <Link to="/recruiter/create-job">Create Job</Link>}
      </nav>

      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/login" element={<Login/>} />
        <Route path="/jobs" element={<JobsList/>} />
        <Route path="/admin/create-user" element={
          <PrivateRoute allowedRoles={['PLACEMENT_CELL']}><AdminCreateUser/></PrivateRoute>
        }/>
        <Route path="/recruiter/create-job" element={
          <PrivateRoute allowedRoles={['RECRUITER']}><CreateJob/></PrivateRoute>
        }/>
      </Routes>
    </div>
  )
}
