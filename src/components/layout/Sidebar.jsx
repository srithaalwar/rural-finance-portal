
import { NavLink, useNavigate } from 'react-router-dom'
import { clearSession, getUser } from '../../api/client'

export default function Sidebar({ open, onNavigate }) {
  const user = getUser()
  const navigate = useNavigate()

  const isSuperAdmin = user?.role === 'Super Admin'

  const NAV = [
    ['MAIN', [['Dashboard', isSuperAdmin ? '/dashboard' : '/role-dashboard', '🏠']]],
    ...(isSuperAdmin
      ? [
          [
            'ORGANIZATION',
            [
              ['Head Office', '/head-office', '🏛'],
              ['Branches', '/branches', '🏬'],
            ],
          ],
          [
            'ADMINISTRATION',
            [
              ['Users', '/users', '👥'],
              ['Roles & Permissions', '/roles', '🪪'],
            ],
          ],
        ]
      : []),
    ['SYSTEM', [['Logout', '/login', '⏻']]],
  ]

  const handleNavigation = (to) => {
    if (to === '/login') {
      clearSession()
      navigate('/login', { replace: true })
      return
    }

    navigate(to)
    onNavigate?.()
  }

  return (
    <aside className={`sidebar ${open ? 'open' : ''}`}>
      <div className="logo">
        <i>R</i>RURAL FINANCE
      </div>

      {NAV.map(([group, items]) => (
        <div key={group}>
          <div className="ng">{group}</div>

          {items.map(([label, to, icon]) => (
            <NavLink
              key={to}
              to={to}
              onClick={(event) => {
                if (label === 'Logout') {
                  event.preventDefault()
                  handleNavigation(to)
                } else {
                  onNavigate?.()
                }
              }}
              className={({ isActive }) =>
                `nl ${isActive ? 'active' : ''}`
              }
            >
              <span>{icon}</span>
              {label}
            </NavLink>
          ))}
        </div>
      ))}
    </aside>
  )
}
