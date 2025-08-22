import React, { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'

const ENV_USER = import.meta.env.VITE_OPERATOR_USER || 'beezeroadmin'
const ENV_PASS = import.meta.env.VITE_OPERATOR_PASS || 'ThisPasswordIsBeeZero0000'

export default function Login() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const location = useLocation()

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')

    const isValid = username === ENV_USER && password === ENV_PASS
    if (!isValid) {
      setError('Usuario o contraseña inválidos')
      return
    }

    localStorage.setItem('auth.loggedIn', 'true')
    localStorage.setItem('auth.user', username)

    const to = location.state?.from?.pathname || '/'
    navigate(to, { replace: true })
  }

  return (
    <div className="auth-wrapper">
      <form className="card" onSubmit={handleSubmit}>
        <h1>Iniciar sesión</h1>
        <div className="form-group">
          <label>Usuario</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Usuario"
            autoFocus
          />
        </div>
        <div className="form-group">
          <label>Contraseña</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Contraseña"
          />
        </div>
        {error && <div className="error">{error}</div>}
        <button className="btn primary" type="submit">Entrar</button>
      </form>
    </div>
  )
}
