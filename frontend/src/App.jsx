import React, { useEffect, useState } from 'react';
import { Routes, Route, Navigate, Link } from 'react-router-dom';
import axios, { getRole, logout } from './services/auth';
import PrivateRoute from './components/PrivateRoute';
import Layout from './components/Layout';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import StudentSignUp from './pages/StudentSignUp';
import StudentDashboard from './pages/StudentDashboard';
import RecruiterDashboard from './pages/RecruiterDashboard';
import PlacementCellDashboard from './pages/PlacementCellDashboard';
import JobsList from './pages/JobsList';
import CreateJob from './pages/CreateJob';
import AdminCreateUser from './pages/AdminCreateUser';
import ManageApplications from './pages/ManageApplications';
import ApproveJobs from './pages/ApproveJobs';

export default function App() {
  const [role, setRole] = useState(getRole());

  useEffect(() => {
    function handleAuthChange() {
      setRole(getRole());
    }
    window.addEventListener('auth-change', handleAuthChange);
    return () => window.removeEventListener('auth-change', handleAuthChange);
  }, []);

  return (
    <Layout>
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
    </Layout>
  );
}
