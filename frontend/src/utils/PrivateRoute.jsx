import React from 'react'
import { Navigate } from 'react-router-dom'
import { getToken, getRole } from '../services/auth'

export default function PrivateRoute({ allowedRoles = [], children }){
  const token = getToken()
  const role = getRole()
  if (!token) return <Navigate to="/login" replace />
  if (allowedRoles.length && !allowedRoles.includes(role)) return <Navigate to="/" replace />
  return children
}
