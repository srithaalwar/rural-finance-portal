
import { getUser } from '../../api/client'

export default function Header({ onMenu }) {
  const user = getUser()

  const initials = (user?.name || 'User')
    .split(' ')
    .map((word) => word[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

  const isSuperAdmin = user?.role === 'Super Admin'

  return (
    <header className="topbar">
      <button
        className="btn menu-btn s"
        onClick={onMenu}
      >
        ☰
      </button>

      <input
        style={{ maxWidth: 380 }}
        placeholder="Search staff, branches…"
      />

      <span style={{ flex: 1 }} />

      {isSuperAdmin && (
        <span className="bd er">
          Super Admin · All access
        </span>
      )}

      <div className="hm" style={{ textAlign: 'right' }}>
        <div className="b">
          {user?.name || 'User'}
        </div>

        <div className="sm mu">
          {user?.role || 'Unassigned'}
        </div>
      </div>

      <div className="av">
        {initials}
      </div>
    </header>
  )
}
