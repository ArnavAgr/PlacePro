import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from '../services/auth';

export default function PlacementCellDashboard() {
  const [stats, setStats] = useState(null);
  const [offers, setOffers] = useState([]);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const [statsRes, offersRes, usersRes] = await Promise.all([
          axios.get('/reports/stats'),
          axios.get('/offers/all'),
          axios.get('/admin/users')
        ]);
        setStats(statsRes.data);
        setOffers(offersRes.data);
        setUsers(usersRes.data);
      } catch (err) {
        console.error(err);
        // alert('Failed to fetch data');
      }
    }
    fetchData();
  }, []);

  const students = users.filter(u => u.role === 'STUDENT');
  const recruiters = users.filter(u => u.role === 'RECRUITER');

  return (
    <div className="dashboard-container">
      <h2>Placement Cell Dashboard</h2>
      <nav className="dashboard-nav">
        <Link to="/admin/create-user">Manage Users</Link>
        <Link to="/admin/approve-jobs">Approve Jobs</Link>
      </nav>
      <div className="dashboard-content">
        <div className="stats-grid">
          <div className="stat-card">
            <h3>Total Students</h3>
            <p>{stats?.totalStudents || 0}</p>
          </div>
          <div className="stat-card">
            <h3>Total Jobs</h3>
            <p>{stats?.totalJobs || 0}</p>
          </div>
          <div className="stat-card">
            <h3>Applications</h3>
            <p>{stats?.totalApplications || 0}</p>
          </div>
          <div className="stat-card">
            <h3>Offers</h3>
            <p>{stats?.totalOffers || 0}</p>
          </div>
          <div className="stat-card">
            <h3>Placed</h3>
            <p>{stats?.placedStudents || 0}</p>
          </div>
        </div>

        <div className="users-section">
          <h3>Registered Students</h3>
          {students.length === 0 ? <p>No students found.</p> : (
            <table className="data-table">
              <thead>
                <tr>
                  <th>Email</th>
                  <th>Roll No</th>
                  <th>Branch</th>
                  <th>CGPA</th>
                </tr>
              </thead>
              <tbody>
                {students.map(u => (
                  <tr key={u.id}>
                    <td>{u.email}</td>
                    <td>{u.student?.rollNo || 'N/A'}</td>
                    <td>{u.student?.branch || 'N/A'}</td>
                    <td>{u.student?.cgpa || 'N/A'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          <h3>Registered Recruiters</h3>
          {recruiters.length === 0 ? <p>No recruiters found.</p> : (
            <table className="data-table">
              <thead>
                <tr>
                  <th>Email</th>
                  <th>Company Name</th>
                </tr>
              </thead>
              <tbody>
                {recruiters.map(u => (
                  <tr key={u.id}>
                    <td>{u.email}</td>
                    <td>{u.recruiter?.companyName || 'N/A'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <h3>Recent Offers</h3>
        {offers.length === 0 ? (
          <p>No offers generated yet.</p>
        ) : (
          <table className="offers-table">
            <thead>
              <tr>
                <th>Student</th>
                <th>Company</th>
                <th>Role</th>
                <th>Status</th>
                <th>Issued On</th>
              </tr>
            </thead>
            <tbody>
              {offers.map(offer => (
                <tr key={offer.id}>
                  <td>{offer.application.student.user.email}</td>
                  <td>{offer.application.job.postedBy?.companyName || 'N/A'}</td>
                  <td>{offer.application.job.title}</td>
                  <td>{offer.status}</td>
                  <td>{new Date(offer.issuedOn).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
