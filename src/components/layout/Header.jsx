import { getUser } from '../../api/client'

export default function Header({ onMenu }) {
  const user = getUser()
  const initials = (user?.name || 'SA').split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase()

  return (
    <header className="topbar">
      <button className="btn menu-btn s" onClick={onMenu}>☰</button>
      <input style={{ maxWidth: 380 }} placeholder="Search staff, branches…" />
      <span style={{ flex: 1 }} />
      <span className="bd er">Super Admin · All access</span>
      <div className="hm" style={{ textAlign: 'right' }}>
        <div className="b">{user?.name}</div>
        <div className="sm mu">Head Office</div>
      </div>
      <div className="av">{initials}</div>
    </header>
  )
}