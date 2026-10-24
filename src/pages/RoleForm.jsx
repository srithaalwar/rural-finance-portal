
import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import PageHeader from '../components/common/PageHeader'
import Card from '../components/common/Card'
import { useApp } from '../context/appContext'
import {
  PERMISSION_GROUPS,
  ALL_PERMISSIONS,
} from '../data/mockData'

export default function RoleForm() {
  const navigate = useNavigate()
  const { id } = useParams()

  const { roles = [], addRole, updateRole } = useApp()

  const isEditing = Boolean(id)
  const role = isEditing
    ? roles.find((r) => String(r.id) === String(id))
    : null

  const isSuperAdmin = role?.name === 'Super Admin'

  // Key ensures form state resets when changing roles.
  if (isEditing && !role) {
    return (
      <>
        <PageHeader
          breadcrumb="Administration / Roles"
          title="Role Not Found"
          subtitle="The requested role could not be found."
        />
        <button
          className="btn p"
          onClick={() => navigate('/roles')}
        >
          Back to Roles
        </button>
      </>
    )
  }

  return (
    <RoleFormContent
      key={id || 'new'}
      role={role}
      isEditing={isEditing}
      isSuperAdmin={isSuperAdmin}
      addRole={addRole}
      updateRole={updateRole}
      navigate={navigate}
    />
  )
}

function RoleFormContent({
  role,
  isEditing,
  isSuperAdmin,
  addRole,
  updateRole,
  navigate,
}) {
  const [form, setForm] = useState({
    name: role?.name || '',
    description: role?.description || '',
    permissions: [...(role?.permissions || [])],
  })

  const [saving, setSaving] = useState(false)

  const setField = (key) => (event) => {
    setForm((previous) => ({
      ...previous,
      [key]: event.target.value,
    }))
  }

  const togglePermission = (permission) => {
    setForm((previous) => ({
      ...previous,
      permissions: previous.permissions.includes(permission)
        ? previous.permissions.filter(
            (item) => item !== permission
          )
        : [...previous.permissions, permission],
    }))
  }

  const submit = async (event) => {
    event.preventDefault()

    if (saving || isSuperAdmin) return

    if (!form.name.trim()) {
      alert('Please enter a role name')
      return
    }

    setSaving(true)

    try {
      const payload = {
        name: form.name.trim(),
        description: form.description.trim(),
        permissions: form.permissions,
      }

      const success = isEditing
        ? await updateRole(role.id, payload)
        : await addRole(payload)

      if (success) {
        navigate('/roles')
      }
    } catch (error) {
      console.error('Save role failed:', error)
      alert(error.message || 'Failed to save role')
    } finally {
      setSaving(false)
    }
  }

  return (
    <>
      <PageHeader
        breadcrumb="Administration / Roles & Permissions"
        title={isEditing ? 'Edit Role' : 'Add Role'}
        subtitle={
          isEditing
            ? 'Update role details and assigned permissions'
            : 'Create a role and assign its permissions'
        }
      />

      <form onSubmit={submit}>
        <div style={{ maxWidth: 1050, margin: '0 auto' }}>
          <Card>
            <h3 style={{ margin: '0 0 20px' }}>
              Role Information
            </h3>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns:
                  'repeat(auto-fit, minmax(250px, 1fr))',
                gap: 20,
              }}
            >
              <div className="f">
                <label>Role Name</label>
                <input
                  value={form.name}
                  onChange={setField('name')}
                  placeholder="Enter role name"
                  disabled={isSuperAdmin || saving}
                  required
                />
              </div>

              <div className="f">
                <label>Description</label>
                <input
                  value={form.description}
                  onChange={setField('description')}
                  placeholder="Enter role description"
                  disabled={saving}
                />
              </div>
            </div>
          </Card>

          <div style={{ marginTop: 20 }}>
            <Card>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: 12,
                  marginBottom: 20,
                }}
              >
                <div>
                  <h3 style={{ margin: '0 0 6px' }}>
                    Permissions
                  </h3>
                  <p className="sm mu" style={{ margin: 0 }}>
                    Select the permissions this role should have.
                  </p>
                </div>

                <span className="sm mu">
                  Selected: {form.permissions.length} /{' '}
                  {ALL_PERMISSIONS.length}
                </span>
              </div>

              {Object.entries(PERMISSION_GROUPS).map(
                ([group, permissions]) => (
                  <div
                    key={group}
                    style={{
                      border: '1px solid #d8e3f5',
                      borderRadius: 8,
                      padding: 20,
                      marginBottom: 16,
                    }}
                  >
                    <h4 style={{ margin: '0 0 18px' }}>
                      {group}
                    </h4>

                    <div
                      style={{
                        display: 'grid',
                        gridTemplateColumns:
                          'repeat(auto-fit, minmax(190px, 1fr))',
                        gap: 20,
                      }}
                    >
                      {permissions.map((permission) => (
                        <label
                          key={permission}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 10,
                            cursor: isSuperAdmin
                              ? 'not-allowed'
                              : 'pointer',
                          }}
                        >
                          <input
                            type="checkbox"
                            className="ck"
                            style={{ width: 'auto' }}
                            checked={form.permissions.includes(
                              permission
                            )}
                            onChange={() =>
                              togglePermission(permission)
                            }
                            disabled={isSuperAdmin || saving}
                          />

                          {permission}
                        </label>
                      ))}
                    </div>
                  </div>
                )
              )}
            </Card>
          </div>

          <div
            style={{
              display: 'flex',
              justifyContent: 'flex-end',
              gap: 12,
              marginTop: 24,
              marginBottom: 30,
            }}
          >
            <button
              type="button"
              className="btn s"
              onClick={() => navigate('/roles')}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="btn p"
              disabled={saving || isSuperAdmin}
            >
              {saving
                ? 'Saving...'
                : isEditing
                  ? 'Save Changes'
                  : 'Create Role'}
            </button>
          </div>
        </div>
      </form>
    </>
  )
}
