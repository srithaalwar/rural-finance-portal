
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

  const loadBranches = useCallback(async () => {
    setBranches(await api('/branches'))
  }, [])

  const loadUsers = useCallback(async () => {
    setUsers(await api('/users'))
  }, [])

  // Load saved roles and their assigned permissions from the database
  const loadRoles = useCallback(async () => {
    const data = await api('/roles')
    const loadedRoles = data.roles || []

    setRoles(loadedRoles)

    setRolePerms(
      Object.fromEntries(
        loadedRoles.map((r) => [
          r.name,
          r.permissions || [],
        ])
      )
    )
  }, [])

  useEffect(() => {
    Promise.all([
      loadBranches(),
      loadUsers(),
      loadRoles(),
    ])
      .catch((e) => showToast(e.message, 'er'))
      .finally(() => setLoading(false))
  }, [loadBranches, loadUsers, loadRoles, showToast])

  const addBranch = async (form) => {
    try {
      const r = await api('/branches', {
        method: 'POST',
        body: form,
      })

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
      const r = await api('/users', {
        method: 'POST',
        body: form,
      })

      await Promise.all([
        loadUsers(),
        loadBranches(),
      ])

      showToast(`${r.message} · default password Welcome@123`)
      return true
    } catch (e) {
      showToast(e.message, 'er')
      return false
    }
  }

  const addRole = async (form) => {
    try {
      const result = await api('/roles', {
        method: 'POST',
        body: form,
      })

      await loadRoles()
      showToast(result.message)
      return true
    } catch (e) {
      showToast(e.message, 'er')
      return false
    }
  }
  
const updateRole = async (id, form) => {
  try {
    const result = await api(`/roles/${id}`, {
      method: 'PUT',
      body: form,
    })

    await loadRoles()
    showToast(result.message || 'Role updated successfully')
    return true
  } catch (e) {
    showToast(e.message, 'er')
    return false
  }
}

const deleteRole = async (id) => {
  try {
    const result = await api(`/roles/${id}`, {
      method: 'DELETE',
    })

    await loadRoles()
    showToast(result.message || 'Role deleted successfully')
    return true
  } catch (e) {
    showToast(e.message, 'er')
    return false
  }
}



  
const updateUser = async (id, form) => {
  try {
    const result = await api(`/users/${id}`, {
      method: 'PUT',
      body: form,
    })

    await Promise.all([loadUsers(), loadBranches()])

    showToast(result.message || 'User updated successfully')
    return true
  } catch (e) {
    showToast(e.message, 'er')
    return false
  }
}

const deleteUser = async (id) => {
  try {
    const result = await api(`/users/${id}`, {
      method: 'DELETE',
    })

    await Promise.all([loadUsers(), loadBranches()])

    showToast(result.message || 'User deleted successfully')
    return true
  } catch (e) {
    showToast(e.message, 'er')
    return false
  }
}


  const assignUserToBranch = async (userId, branchId, roleId) => {
  try {
    const result = await api(`/users/${userId}/assign`, {
      method: 'PATCH',
      body: {
        branchId: Number(branchId),
        roleId: Number(roleId),
      },
    })

    // Refresh both lists so the UI reflects the assignment.
    await Promise.all([loadUsers(), loadBranches()])

    showToast(result.message || 'User assigned successfully')
    return true
  } catch (e) {
    showToast(e.message, 'er')
    return false
  }
}


const unassignUserFromBranch = async (userId, branchId) => {
  try {
    const result = await api(`/users/${userId}/unassign`, {
      method: 'PATCH',
      body: {
        branchId: Number(branchId),
      },
    })

    await Promise.all([
      loadUsers(),
      loadBranches(),
    ])

    showToast(
      result.message || 'User removed from branch successfully'
    )

    return true
  } catch (e) {
    showToast(e.message, 'er')
    return false
  }
}


  const toggleUser = async (id) => {
    try {
      await api(`/users/${id}/toggle`, {
        method: 'PATCH',
      })

      await loadUsers()
    } catch (e) {
      showToast(e.message, 'er')
    }
  }

  const togglePermission = (role, perm) => {
    setRolePerms((p) => {
      const cur = p[role] || []

      return {
        ...p,
        [role]: cur.includes(perm)
          ? cur.filter((x) => x !== perm)
          : [...cur, perm],
      }
    })
  }

  const savePermissions = async (roleName) => {
    const role = roles.find((r) => r.name === roleName)

    if (!role) {
      showToast('Role not found', 'er')
      return
    }

    try {
      const r = await api(`/roles/${role.id}/permissions`, {
        method: 'PUT',
        body: {
          permissions: rolePerms[roleName] || [],
        },
      })

      showToast(r.message)
      await loadRoles()
    } catch (e) {
      showToast(e.message, 'er')
    }
  }

  return (
    <AppContext.Provider
      value={{
        branches,
        users,
        roles,
        rolePerms,
        addBranch,
        addUser,
        addRole,
        updateRole,
        deleteRole,
        toggleUser,
        togglePermission,
        savePermissions,
        assignUserToBranch,
         unassignUserFromBranch,
        showToast,
        updateUser,
        deleteUser,
      }}
    >
      {loading ? (
        <p style={{ padding: 24 }}>Loading…</p>
      ) : (
        children
      )}

      {toast && (
        <div className={`al ${toast.type} toast`}>
          {toast.type === 'ok' ? '✔' : '⚠'} {toast.msg}
        </div>
      )}
    </AppContext.Provider>
  )
}
