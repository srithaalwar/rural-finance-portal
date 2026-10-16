import { useState, useCallback } from 'react'
import { AppContext } from './appContext'
import { initialBranches, initialUsers, initialRolePermissions, todayLabel } from '../data/mockData'

export default function AppProvider({ children }) {
  const [branches, setBranches] = useState(initialBranches)
  const [users, setUsers] = useState(initialUsers)
  const [rolePerms, setRolePerms] = useState(initialRolePermissions)
  const [toast, setToast] = useState(null)

  const showToast = useCallback((msg) => {
    setToast(msg)
    setTimeout(() => setToast(null), 2400)
  }, [])

  const addBranch = ({ name, area, district }) => {
    setBranches((b) => [
      ...b,
      {
        code: `BR-${String(b.length + 1).padStart(2, '0')}`,
        name: name.trim(),
        area: area || '—',
        district: district || '—',
        opened: todayLabel(),
        status: 'Active',
      },
    ])
    showToast('Branch created under Head Office')
  }

  const addUser = ({ name, email, mobile, role, location }) => {
    setUsers((u) => [
      ...u,
      {
        id: `U-${String(u.length + 1).padStart(3, '0')}`,
        name: name.trim(),
        email: email || '—',
        mobile: mobile || '—',
        role,
        location,
        status: 'Active',
      },
    ])
    showToast(`${role} added to ${location}`)
  }

  const toggleUser = (id) => {
    const target = users.find((x) => x.id === id)
    if (target.role === 'Super Admin') return showToast('Super Admin cannot be deactivated')
    setUsers((list) =>
      list.map((x) => (x.id === id ? { ...x, status: x.status === 'Active' ? 'Inactive' : 'Active' } : x))
    )
  }

  const togglePermission = (role, perm) => {
    setRolePerms((p) => {
      const cur = p[role]
      return { ...p, [role]: cur.includes(perm) ? cur.filter((x) => x !== perm) : [...cur, perm] }
    })
  }

  return (
    <AppContext.Provider
      value={{ branches, users, rolePerms, addBranch, addUser, toggleUser, togglePermission, showToast }}
    >
      {children}
      {toast && <div className="al ok toast">✔ {toast}</div>}
    </AppContext.Provider>
  )
}