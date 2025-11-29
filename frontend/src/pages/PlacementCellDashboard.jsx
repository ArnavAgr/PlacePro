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
      <h2 style={{ marginBottom: '24px', color: 'var(--primary)' }}>Placement Cell Dashboard</h2>

      {/* Stats Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '24px', marginBottom: '32px' }}>
        <div className="card" style={{ textAlign: 'center' }}>
          <h3 style={{ fontSize: '2rem', color: 'var(--primary)', margin: '0 0 8px 0' }}>{stats?.totalStudents || 0}</h3>
          <p style={{ color: 'var(--text-muted)', margin: 0 }}>Total Students</p>
        </div>
        <div className="card" style={{ textAlign: 'center' }}>
          <h3 style={{ fontSize: '2rem', color: 'var(--primary)', margin: '0 0 8px 0' }}>{stats?.totalJobs || 0}</h3>
          <p style={{ color: 'var(--text-muted)', margin: 0 }}>Total Jobs</p>
        </div>
        <div className="card" style={{ textAlign: 'center' }}>
          <h3 style={{ fontSize: '2rem', color: 'var(--primary)', margin: '0 0 8px 0' }}>{stats?.totalApplications || 0}</h3>
          <p style={{ color: 'var(--text-muted)', margin: 0 }}>Applications</p>
        </div>
        <div className="card" style={{ textAlign: 'center' }}>
          <h3 style={{ fontSize: '2rem', color: 'var(--primary)', margin: '0 0 8px 0' }}>{stats?.totalOffers || 0}</h3>
          <p style={{ color: 'var(--text-muted)', margin: 0 }}>Offers</p>
        </div>
        <div className="card" style={{ textAlign: 'center' }}>
          <h3 style={{ fontSize: '2rem', color: 'var(--primary)', margin: '0 0 8px 0' }}>{stats?.placedStudents || 0}</h3>
          <p style={{ color: 'var(--text-muted)', margin: 0 }}>Placed</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '32px' }}>
        {/* Recent Offers */}
        <div className="card">
          <h3 style={{ marginTop: 0 }}>Recent Offers</h3>
          {offers.length === 0 ? (
            <p>No offers generated yet.</p>
          ) : (
            <table>
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
                    <td>
                      <span className={`badge ${offer.status === 'ACCEPTED' ? 'success' :
                          offer.status === 'REJECTED' ? 'danger' : 'warning'
                        }`}>
                        {offer.status}
                      </span>
                    </td>
                    <td>{new Date(offer.issuedOn).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Users Lists */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
          <div className="card">
            <h3 style={{ marginTop: 0 }}>Registered Students</h3>
            {students.length === 0 ? <p>No students found.</p> : (
              <table>
                <thead>
                  <tr>
                    <th>Email</th>
                    <th>Roll No</th>
                  </tr>
                </thead>
                <tbody>
                  {students.slice(0, 5).map(u => (
                    <tr key={u.id}>
                      <td>{u.email}</td>
                      <td>{u.student?.rollNo || 'N/A'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
            {students.length > 5 && <p style={{ textAlign: 'center', marginTop: '16px', color: 'var(--text-muted)' }}>Showing 5 of {students.length}</p>}
          </div>

          <div className="card">
            <h3 style={{ marginTop: 0 }}>Registered Recruiters</h3>
            {recruiters.length === 0 ? <p>No recruiters found.</p> : (
              <table>
                <thead>
                  <tr>
                    <th>Email</th>
                    <th>Company</th>
                  </tr>
                </thead>
                <tbody>
                  {recruiters.slice(0, 5).map(u => (
                    <tr key={u.id}>
                      <td>{u.email}</td>
                      <td>{u.recruiter?.companyName || 'N/A'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
            {recruiters.length > 5 && <p style={{ textAlign: 'center', marginTop: '16px', color: 'var(--text-muted)' }}>Showing 5 of {recruiters.length}</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
