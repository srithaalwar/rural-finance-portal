export default function Header({ onMenu }) {
  return (
    <header className="topbar">
      <button className="btn menu-btn s" onClick={onMenu}>☰</button>
      <input style={{ maxWidth: 380 }} placeholder="Search staff, branches…" />
      <span style={{ flex: 1 }} />
      <span className="bd er">Super Admin · All access</span>
      <div className="hm" style={{ textAlign: 'right' }}>
        <div className="b">Srithajana</div>
        <div className="sm mu">Head Office</div>
      </div>
      <div className="av">SJ</div>
    </header>
  )
}