import React from 'react'
import { Routes, Route, Link } from 'react-router-dom'
import Login from './pages/Login'
import Home from './pages/Home'
import AdminCreateUser from './pages/AdminCreateUser'
import CreateJob from './pages/CreateJob'
import JobsList from './pages/JobsList'
import PrivateRoute from './utils/PrivateRoute'
import { getRole, logout } from './services/auth'
import StudentSignUp from './pages/StudentSignUp'
import StudentDashboard from './pages/StudentDashboard';
import RecruiterDashboard from './pages/RecruiterDashboard';
import PlacementCellDashboard from './pages/PlacementCellDashboard';
import ManageApplications from './pages/ManageApplications';
import ApproveJobs from './pages/ApproveJobs';

export default function App() {
  const [role, setRole] = React.useState(getRole());

  React.useEffect(() => {
    function handleAuthChange() {
      setRole(getRole());
    }
    window.addEventListener('auth-change', handleAuthChange);
    return () => window.removeEventListener('auth-change', handleAuthChange);
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <nav style={{ marginBottom: 20 }}>
        <Link to="/">Home</Link> {' | '}
        {role === 'STUDENT' && <Link to="/student/dashboard">Dashboard</Link>}
        {role === 'RECRUITER' && <Link to="/recruiter/dashboard">Dashboard</Link>}
        {role === 'PLACEMENT_CELL' && <Link to="/placement-cell/dashboard">Dashboard</Link>}
        {!role ? (
          <>
            <Link to="/login">Login</Link> {' | '}
            <Link to="/sign-up">Sign Up</Link>
          </>
        ) : (
          <button onClick={() => { logout(); window.location.href = '/'; }}>Logout</button>
        )}
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/sign-up" element={<StudentSignUp />} />
        <Route path="/student/dashboard" element={
          <PrivateRoute allowedRoles={['STUDENT']}><StudentDashboard /></PrivateRoute>
        } />
        <Route path="/recruiter/dashboard" element={
          <PrivateRoute allowedRoles={['RECRUITER']}><RecruiterDashboard /></PrivateRoute>
        } />
        <Route path="/placement-cell/dashboard" element={
          <PrivateRoute allowedRoles={['PLACEMENT_CELL']}><PlacementCellDashboard /></PrivateRoute>
        } />
        <Route path="/jobs" element={
          <PrivateRoute allowedRoles={['STUDENT']}><JobsList /></PrivateRoute>
        } />

        {/* ... */}

        <Route path="/admin/create-user" element={
          <PrivateRoute allowedRoles={['PLACEMENT_CELL']}><AdminCreateUser /></PrivateRoute>
        } />
        <Route path="/admin/approve-jobs" element={
          <PrivateRoute allowedRoles={['PLACEMENT_CELL']}><ApproveJobs /></PrivateRoute>
        } />
        <Route path="/recruiter/create-job" element={
          <PrivateRoute allowedRoles={['RECRUITER']}><CreateJob /></PrivateRoute>
        } />
        <Route path="/recruiter/jobs/:jobId/applications" element={
          <PrivateRoute allowedRoles={['RECRUITER']}><ManageApplications /></PrivateRoute>
        } />
      </Routes>
    </div>
  );
}
