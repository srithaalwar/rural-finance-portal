
import { NavLink } from 'react-router-dom'
import { clearSession } from '../../api/client'

const NAV = [
  ['MAIN', [['Dashboard', '/dashboard', '🏠']]],
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
  ['SYSTEM', [['Logout', '/login', '⏻']]],
]

export default function Sidebar({ open, onNavigate }) {
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
              onClick={() => {
                if (to === '/login') clearSession()
                onNavigate()
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
