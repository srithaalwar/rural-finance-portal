import PageHeader from '../components/common/PageHeader'
import Card from '../components/common/Card'
import DataTable from '../components/common/DataTable'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/appContext'
import { ALL_PERMISSIONS } from '../data/mockData'

/* Inline SVG icons (same as UserTable) */
const EditIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round"
    strokeLinejoin="round" aria-hidden="true">
    <path d="M12 20h9" />
    <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z" />
  </svg>
)

const DeleteIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round"
    strokeLinejoin="round" aria-hidden="true">
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
    <path d="M10 11v6" />
    <path d="M14 11v6" />
    <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
  </svg>
)

const iconBtn = (color, disabled) => ({
  background: 'none',
  border: '1px solid #d8e3f5',
  borderRadius: 6,
  padding: 6,
  cursor: disabled ? 'not-allowed' : 'pointer',
  color,
  opacity: disabled ? 0.4 : 1,
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
})

export default function RolesPermissions() {
  const navigate = useNavigate()
  const { roles = [], deleteRole } = useApp()

  const getPermissionCount = (role) =>
    (role.permissions || []).length

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

    if (confirmed) {
      await deleteRole(role.id)
    }
  }

  const roleRows = roles.map((role) => {
    const isSuperAdmin = role.name === 'Super Admin'

    return [
      <span
        key={`name-${role.id}`}
        style={{ fontWeight: 600 }}
      >
        {role.name}
      </span>,

      role.description || '—',

      `${getPermissionCount(role)} / ${ALL_PERMISSIONS.length}`,

      <div
        key={`actions-${role.id}`}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          flexWrap: 'wrap',
        }}
      >
        <button
          type="button"
          title="Edit role"
          aria-label={`Edit ${role.name}`}
          style={iconBtn('#1a56db', isSuperAdmin)}
          disabled={isSuperAdmin}
          onClick={() => navigate(`/roles/edit/${role.id}`)}
        >
          <EditIcon />
        </button>

        <button
          type="button"
          title="Delete role"
          aria-label={`Delete ${role.name}`}
          style={iconBtn('#d93025', isSuperAdmin)}
          disabled={isSuperAdmin}
          onClick={() => handleDeleteRole(role)}
        >
          <DeleteIcon />
        </button>
      </div>,
    ]
  })

  return (
    <>
      <PageHeader
        breadcrumb="Administration"
        title="Roles & Permissions"
        subtitle="Manage saved roles and their permissions"
        actions={
          <button
            type="button"
            className="btn p"
            onClick={() => navigate('/roles/add')}
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
    </>
  )
}