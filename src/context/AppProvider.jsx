import { useState, useCallback, useEffect } from 'react'
import { AppContext } from './appContext'
import { api } from '../api/client'

export default function AppProvider({ children }) {
  const [branches, setBranches] = useState([])
  const [users, setUsers] = useState([])
  const [roles, setRoles] = useState([])
  const [rolePerms, setRolePerms] = useState({})
  const [loading, setLoading] = useState(true)
  const [toast, setToast] = useState(null)

  const showToast = useCallback((msg, type = 'ok') => {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 2600)
  }, [])

  const loadBranches = useCallback(async () => setBranches(await api('/branches')), [])
  const loadUsers = useCallback(async () => setUsers(await api('/users')), [])
  const loadRoles = useCallback(async () => {
    const data = await api('/roles')
    setRoles(data.roles)
    setRolePerms(Object.fromEntries(data.roles.map((r) => [r.name, r.permissions])))
  }, [])

  useEffect(() => {
    Promise.all([loadBranches(), loadUsers(), loadRoles()])
      .catch((e) => showToast(e.message, 'er'))
      .finally(() => setLoading(false))
  }, [loadBranches, loadUsers, loadRoles, showToast])

  const addBranch = async (form) => {
    try {
      const r = await api('/branches', { method: 'POST', body: form })
      await loadBranches()
      showToast(r.message)
      return true
    } catch (e) {
      showToast(e.message, 'er')
      return false
    }
  }

  const addUser = async (form) => {
    try {
      const r = await api('/users', { method: 'POST', body: form })
      await Promise.all([loadUsers(), loadBranches()])
      showToast(`${r.message} · default password Welcome@123`)
      return true
    } catch (e) {
      showToast(e.message, 'er')
      return false
    }
  }

  const toggleUser = async (id) => {
    try {
      await api(`/users/${id}/toggle`, { method: 'PATCH' })
      await loadUsers()
    } catch (e) {
      showToast(e.message, 'er')
    }
  }

  const togglePermission = (role, perm) => {
    setRolePerms((p) => {
      const cur = p[role]
      return { ...p, [role]: cur.includes(perm) ? cur.filter((x) => x !== perm) : [...cur, perm] }
    })
  }

  const savePermissions = async (roleName) => {
    const role = roles.find((r) => r.name === roleName)
    try {
      const r = await api(`/roles/${role.id}/permissions`, {
        method: 'PUT',
        body: { permissions: rolePerms[roleName] },
      })
      showToast(r.message)
    } catch (e) {
      showToast(e.message, 'er')
    }
  }

  return (
    <AppContext.Provider
      value={{ branches, users, rolePerms, addBranch, addUser, toggleUser, togglePermission, savePermissions, showToast }}
    >
      {loading ? <p style={{ padding: 24 }}>Loading…</p> : children}
      {toast && <div className={`al ${toast.type} toast`}>{toast.type === 'ok' ? '✔' : '⚠'} {toast.msg}</div>}
    </AppContext.Provider>
  )
}