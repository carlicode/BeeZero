import React, { useEffect, useState } from 'react'
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import Login from './pages/Login.jsx'
import Orders from './pages/Orders.jsx'

export default function App() {
  const navigate = useNavigate()
  const [theme, setTheme] = useState(() => localStorage.getItem('ui.theme') || 'dark')

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('ui.theme', theme)
  }, [theme])

  const toggleTheme = () => setTheme((t) => (t === 'dark' ? 'light' : 'dark'))

  const handleLogout = () => {
    localStorage.removeItem('auth.loggedIn')
    localStorage.removeItem('auth.user')
    navigate('/login', { replace: true })
  }

  const loggedIn = localStorage.getItem('auth.loggedIn') === 'true'
  const user = localStorage.getItem('auth.user')

  return (
    <div className="app-container">
      <header className="app-header">
        <div className="brand">Gestión de Pedidos</div>
        <div className="user-area">
          <button
            className="btn icon-btn"
            onClick={toggleTheme}
            title={theme === 'dark' ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
            aria-label={theme === 'dark' ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
          >
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>
          {loggedIn && (
            <>
              <span className="user-name">{user}</span>
              <button className="btn" onClick={handleLogout}>Salir</button>
            </>
          )}
        </div>
      </header>

      <main className="app-main">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Orders />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to={loggedIn ? '/' : '/login'} replace />} />
        </Routes>
      </main>

      <footer className="app-footer">© {new Date().getFullYear()} Pedidos</footer>
    </div>
  )
}
