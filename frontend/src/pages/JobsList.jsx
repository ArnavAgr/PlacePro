import React, {useState, useEffect} from 'react'
import axios from '../services/auth'

export default function JobsList(){
  const [jobs,setJobs] = useState([])

  useEffect(()=>{
    async function load(){
      const res = await axios.get('/api/jobs')
      setJobs(res.data)
    }
    load()
  },[])

  return (
    <div>
      <h3>Active Jobs</h3>
      {jobs.length === 0 && <p>No jobs found</p>}
      <ul>
        {jobs.map(j => (
          <li key={j.id}>
            <strong>{j.title}</strong> — {j.eligibility} <br/>
            <small>{j.description}</small>
          </li>
        ))}
      </ul>
    </div>
  )
}
