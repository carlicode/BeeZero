import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'

const isAuthenticated = () => {
  try {
    return localStorage.getItem('auth.loggedIn') === 'true'
  } catch (e) {
    return false
  }
}

export default function ProtectedRoute({ children }) {
  const location = useLocation()
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }
  return children
}
