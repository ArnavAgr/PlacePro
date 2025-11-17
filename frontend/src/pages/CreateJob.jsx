import React, {useState} from 'react'
import axios from '../services/auth'

export default function CreateJob(){
  const [title,setTitle] = useState('')
  const [description,setDescription] = useState('')
  const [eligibility,setEligibility] = useState('')
  const [deadline,setDeadline] = useState('')

  async function submit(e){
    e.preventDefault()
    try {
      const res = await axios.post('/api/jobs', { title, description, eligibility, deadline })
      alert('Job created: ' + (res.data.id || JSON.stringify(res.data)))
    } catch (err) {
      alert('Error: ' + (err.response?.data?.error || err.message))
    }
  }

  return (
    <div style={{ maxWidth: 700 }}>
      <h3>Create Job (Recruiter)</h3>
      <form onSubmit={submit}>
        <input value={title} onChange={e=>setTitle(e.target.value)} placeholder="Title" />
        <textarea value={description} onChange={e=>setDescription(e.target.value)} placeholder="Description" />
        <input value={eligibility} onChange={e=>setEligibility(e.target.value)} placeholder="Eligibility" />
        <input value={deadline} onChange={e=>setDeadline(e.target.value)} placeholder="Deadline (ISO e.g. 2025-12-01T00:00:00Z)" />
        <button>Create Job</button>
      </form>
    </div>
  )
}
