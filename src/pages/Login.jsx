import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api, setSession, clearSession } from '../api/client'

export default function Login() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('srithajana@ruralfinance.bank')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setBusy(true)
    clearSession()
    try {
      const data = await api('/auth/login', { method: 'POST', body: { email, password } })
      setSession(data.token, data.user)
      navigate('/dashboard')
    } catch (err) {
      setError(err.message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="lg">
      <form className="cd" onSubmit={handleSubmit}>
        <div className="logo" style={{ padding: '0 0 18px' }}><i>R</i>RURAL FINANCE</div>
        <h1>Super Admin Sign in</h1>
        <p className="mu">Full access to the entire organization.</p>
        {error && <div className="al er" style={{ marginTop: 12 }}>{error}</div>}
        <label>Email</label>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <label>Password</label>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter your password" />
        <div style={{ height: 16 }} />
        <button className="btn p" disabled={busy} style={{ width: '100%', justifyContent: 'center' }}>
          {busy ? 'Signing in…' : 'Sign in'}
        </button>
      </form>
    </div>
  )
}