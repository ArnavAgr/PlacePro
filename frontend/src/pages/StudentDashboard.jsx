import React, { useEffect, useState } from 'react';
import axios from '../services/auth';
import { Link } from 'react-router-dom';
import './Dashboard.css';

export default function StudentDashboard() {
  const [applications, setApplications] = useState([]);
  const [resume, setResume] = useState(null);
  const [studentProfile, setStudentProfile] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const [appRes, profileRes] = await Promise.all([
          axios.get('/applications'),
          axios.get('/students/profile')
        ]);
        setApplications(appRes.data);
        setStudentProfile(profileRes.data);
      } catch (err) {
        console.error(err);
        // alert('Failed to fetch data');
      }
    }
    fetchData();
  }, []);

  async function uploadResume(e) {
    e.preventDefault();
    if (!resume) return alert('Please select a file');

    const formData = new FormData();
    formData.append('resume', resume);
    try {
      const res = await axios.post('/students/upload-resume', formData);
      alert('Resume uploaded successfully');
      setStudentProfile(prev => ({ ...prev, resumeFilePath: res.data.filePath }));
    } catch (err) {
      console.error(err);
      alert('Failed to upload resume');
    }
  }

  async function updateProfile(cgpa, skills) {
    try {
      await axios.put('/students/profile', { cgpa, skills });
      alert('Profile updated successfully');
      // Refresh profile
      const res = await axios.get('/students/profile');
      setStudentProfile(res.data);
    } catch (err) {
      console.error(err);
      alert('Failed to update profile');
    }
  }

  return (
    <div className="dashboard-container">
      <h2>Student Dashboard</h2>
      <nav className="dashboard-nav">
        <Link to="/jobs">View Available Jobs</Link>
        {/* <Link to="/student/applications">Track Applications</Link> */}
      </nav>
      <div className="dashboard-content">
        <p>Welcome, {studentProfile?.user?.email}!</p>

        <div className="section">
          <h3>Profile Details</h3>
          <div className="profile-info">
            <p><strong>Roll No:</strong> {studentProfile?.rollNo || 'N/A'}</p>
            <p><strong>Branch:</strong> {studentProfile?.branch || 'N/A'}</p>
            <p><strong>CGPA:</strong> {studentProfile?.cgpa || 'N/A'}</p>
            <p><strong>Skills:</strong> {studentProfile?.skills || 'N/A'}</p>
            <button onClick={() => {
              const newCgpa = prompt('Enter new CGPA:', studentProfile?.cgpa || '');
              const newSkills = prompt('Enter skills (comma separated):', studentProfile?.skills || '');
              if (newCgpa !== null && newSkills !== null) updateProfile(newCgpa, newSkills);
            }}>Edit Profile</button>
          </div>

          <h3>Resume</h3>
          {studentProfile?.resumeFilePath ? (
            <div className="resume-status success">
              <p>✅ Resume Uploaded</p>
              <small>Path: {studentProfile.resumeFilePath}</small>
            </div>
          ) : (
            <div className="resume-status warning">
              <p>⚠️ No resume uploaded. You cannot apply to jobs without a resume.</p>
            </div>
          )}

          <form onSubmit={uploadResume} className="upload-form">
            <input
              type="file"
              accept=".pdf"
              onChange={e => setResume(e.target.files[0])}
            />
            <button type="submit">Upload / Replace Resume</button>
          </form>
        </div>

        <div className="section">
          <h3>Your Applications</h3>
          {applications.length === 0 ? (
            <p>No applications found.</p>
          ) : (
            <ul className="app-list">
              {applications.map(app => (
                <li key={app.id} className={`app-item ${app.status.toLowerCase()}`}>
                  <div className="app-info">
                    <strong>{app.job.title}</strong>
                    <span className="status-badge">{app.status}</span>
                  </div>
                  <small>Applied on: {new Date(app.appliedAt).toLocaleDateString()}</small>
                  {app.status === 'OFFERED' && app.offer && (
                    <div className="offer-actions">
                      <p><strong>Offer Received!</strong></p>
                      <button onClick={() => respondToOffer(app.offer.id, 'ACCEPTED')}>Accept</button>
                      <button onClick={() => respondToOffer(app.offer.id, 'REJECTED')}>Reject</button>
                    </div>
                  )}
                  {app.status === 'ACCEPTED' && <p className="success-text">Offer Accepted! 🎉</p>}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

async function respondToOffer(offerId, status) {
  try {
    await axios.put(`/offers/${offerId}/respond`, { status });
    alert(`Offer ${status.toLowerCase()} successfully`);
    window.location.reload(); // Simple reload to refresh state
  } catch (err) {
    console.error(err);
    alert('Failed to respond to offer');
  }
}
