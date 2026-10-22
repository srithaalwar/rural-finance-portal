
import { useState } from 'react'
import PageHeader from '../components/common/PageHeader'
import Card from '../components/common/Card'
import DataTable from '../components/common/DataTable'
import Modal from '../components/common/Modal'
import { useApp } from '../context/appContext'
import {
  HQ,
  PERMISSION_GROUPS,
  ALL_PERMISSIONS,
} from '../data/mockData'

function AddRoleModal({ onClose, role = null }) {
  const { addRole, updateRole } = useApp()
  const isEditing = Boolean(role)
  const isSuperAdmin = role?.name === 'Super Admin'

  const [f, setF] = useState({
    name: role?.name || '',
    description: role?.description || '',
    isHqRole: role?.isHqRole ?? role?.is_hq_role ?? true,
  })

  const [saving, setSaving] = useState(false)

  const set = (key) => (e) => {
    const value =
      key === 'isHqRole'
        ? e.target.value === 'HQ'
        : e.target.value

    setF((prev) => ({
      ...prev,
      [key]: value,
    }))
  }

  const submit = async () => {
    if (!f.name.trim()) {
      alert('Please enter a role name')
      return
    }

    setSaving(true)

    try {
      const payload = {
        name: f.name.trim(),
        description: f.description.trim(),
        isHqRole: f.isHqRole,
      }

      const ok = isEditing
        ? await updateRole(role.id, payload)
        : await addRole(payload)

      if (ok) onClose()
    } finally {
      setSaving(false)
    }
  }

  return (
    <Modal
      title={isEditing ? 'Edit Role' : 'Add Role'}
      okLabel={
        saving
          ? 'Saving...'
          : isEditing
            ? 'Save Changes'
            : 'Create Role'
      }
      onOk={submit}
      onClose={onClose}
    >
      <div className="fm">
        <div className="f">
          <label>Role Name</label>
          <input
            value={f.name}
            onChange={set('name')}
            placeholder="Enter role name"
            disabled={isSuperAdmin}
          />
        </div>

        <div>
          <label>Description</label>
          <input
            value={f.description}
            onChange={set('description')}
            placeholder="Enter role description"
          />
        </div>

        <div>
          <label>Role Location</label>
          <select
            value={f.isHqRole ? 'HQ' : 'BRANCH'}
            onChange={set('isHqRole')}
            disabled={isSuperAdmin}
          >
            <option value="HQ">{HQ}</option>
            <option value="BRANCH">Branch</option>
          </select>
        </div>

        {isEditing && (
          <p className="sm mu">
            Changing a role's location may affect existing user
            assignments. Check assignments before saving.
          </p>
        )}
      </div>
    </Modal>
  )
}

export default function RolesPermissions() {
  const {
    roles = [],
    rolePerms = {},
    togglePermission,
    savePermissions,
    deleteRole,
  } = useApp()

  const [roleName, setRoleName] = useState('Admin')
  const [showAdd, setShowAdd] = useState(false)
  const [editingRole, setEditingRole] = useState(null)

  const selectedRole =
    roles.find((r) => r.name === roleName) || roles[0]

  const activeRole = selectedRole?.name || ''
  const locked = activeRole === 'Super Admin'
  const permissions = rolePerms[activeRole] || []

  const getPermissionCount = (role) =>
    (rolePerms[role.name] || role.permissions || []).length

  const handleDeleteRole = async (role) => {
    if (role.name === 'Super Admin') {
      alert('Super Admin cannot be deleted')
      return
    }

    if (Number(role.userCount) > 0) {
      alert(
        `This role is assigned to ${role.userCount} user(s). ` +
        'Reassign those users before deleting the role.'
      )
      return
    }

    const confirmed = window.confirm(
      `Delete the "${role.name}" role? This cannot be undone.`
    )

    if (!confirmed) return

    const ok = await deleteRole(role.id)

    if (ok && roleName === role.name) {
      setRoleName('Admin')
    }
  }

  const roleRows = roles.map((role) => {
    const isSuperAdmin = role.name === 'Super Admin'

    return [
      <span style={{ fontWeight: 600 }}>{role.name}</span>,
      role.description || '—',
      (role.isHqRole ?? role.is_hq_role)
        ? 'Head Office'
        : 'Branch',
      `${getPermissionCount(role)} / ${ALL_PERMISSIONS.length}`,
      <div
        style={{
          display: 'flex',
          gap: 6,
          flexWrap: 'wrap',
        }}
      >
        <button
          className="btn s"
          disabled={isSuperAdmin}
          onClick={() => setEditingRole(role)}
        >
          Edit
        </button>

        <button
          className="btn s"
          disabled={isSuperAdmin}
          onClick={() => handleDeleteRole(role)}
        >
          Delete
        </button>
      </div>,
    ]
  })

  return (
    <>
      <PageHeader
        breadcrumb="Administration"
        title="Roles & Permissions"
        subtitle="Manage saved roles and configure their permissions"
        actions={
          <button
            className="btn p"
            onClick={() => setShowAdd(true)}
          >
            + Add Role
          </button>
        }
      />

      <Card flush>
        <div style={{ padding: '16px 16px 0' }}>
          <h3 style={{ margin: 0, fontSize: 16 }}>
            Saved Roles
          </h3>
        </div>

        <DataTable
          columns={[
            'Role Name',
            'Description',
            'Location',
            'Permissions',
            'Actions',
          ]}
          rows={roleRows}
        />

        {roles.length === 0 && (
          <p
            className="mu"
            style={{
              padding: 20,
              textAlign: 'center',
            }}
          >
            No roles found. Click Add Role to create one.
          </p>
        )}
      </Card>

      {selectedRole && (
        <div className="roles-grid" style={{ marginTop: 16 }}>
          <div className="cd" style={{ padding: 8 }}>
            {roles.map((role) => (
              <div
                key={role.id}
                className={`rl-item ${
                  activeRole === role.name ? 'on' : ''
                }`}
                onClick={() => setRoleName(role.name)}
                style={{ cursor: 'pointer' }}
              >
                {role.name}

                <span
                  className="sm mu"
                  style={{ marginLeft: 'auto' }}
                >
                  {getPermissionCount(role)} / {ALL_PERMISSIONS.length}
                </span>
              </div>
            ))}
          </div>

          <div>
            <Card
              title={activeRole}
              action={
                !locked && (
                  <button
                    className="btn p s"
                    onClick={() => savePermissions(activeRole)}
                  >
                    Save
                  </button>
                )
              }
            >
              <p className="mu" style={{ margin: 0 }}>
                {selectedRole.description || 'No description'}
                {' · '}
                Works at:{' '}
                <b>
                  {(selectedRole.isHqRole ?? selectedRole.is_hq_role)
                    ? 'Head Office'
                    : 'A branch'}
                </b>
                {' · '}
                {permissions.length} of {ALL_PERMISSIONS.length}{' '}
                permissions
              </p>

              {locked && (
                <div
                  className="al in"
                  style={{ margin: '12px 0 0' }}
                >
                  🔒 Super Admin permissions cannot be changed.
                </div>
              )}
            </Card>

            {Object.entries(PERMISSION_GROUPS).map(
              ([group, perms]) => (
                <div key={group} style={{ marginTop: 16 }}>
                  <Card title={group}>
                    <div className="pm">
                      {perms.map((permission) => (
                        <label key={permission}>
                          <input
                            type="checkbox"
                            className="ck"
                            style={{ width: 'auto' }}
                            checked={permissions.includes(permission)}
                            disabled={locked}
                            onChange={() =>
                              togglePermission(activeRole, permission)
                            }
                          />
                          {permission}
                        </label>
                      ))}
                    </div>
                  </Card>
                </div>
              )
            )}
          </div>
        </div>
      )}

      {showAdd && (
        <AddRoleModal onClose={() => setShowAdd(false)} />
      )}

      {editingRole && (
        <AddRoleModal
          key={editingRole.id}
          role={editingRole}
          onClose={() => setEditingRole(null)}
        />
      )}
    </>
  )
}
