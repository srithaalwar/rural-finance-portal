import { useNavigate } from 'react-router-dom'

export default function Login() {
  const navigate = useNavigate()
  const handleSubmit = (e) => {
    e.preventDefault()
    navigate('/dashboard')
  }

  return (
    <div className="lg">
      <form className="cd" onSubmit={handleSubmit}>
        <div className="logo" style={{ padding: '0 0 18px' }}><i>R</i>RURAL FINANCE</div>
        <h1>Super Admin Sign in</h1>
        <p className="mu">Full access to the entire organization.</p>
        <label>Email</label>
        <input type="email" defaultValue="srithajana@ruralfinance.bank" />
        <label>Password</label>
        <input type="password" defaultValue="password" />
        <div className="row" style={{ border: 0 }}>
          <span className="sm">
            <input type="checkbox" className="ck" style={{ width: 'auto' }} defaultChecked /> Remember me
          </span>
          <a className="sm b" style={{ color: 'var(--pr)', cursor: 'pointer' }}>Forgot password?</a>
        </div>
        <button className="btn p" style={{ width: '100%', justifyContent: 'center' }}>Sign in</button>
      </form>
    </div>
  )
}