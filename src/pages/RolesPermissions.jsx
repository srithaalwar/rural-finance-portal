
import PageHeader from '../components/common/PageHeader'
import Card from '../components/common/Card'
import DataTable from '../components/common/DataTable'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/appContext'
import { ALL_PERMISSIONS } from '../data/mockData'

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
          gap: 6,
          flexWrap: 'wrap',
        }}
      >
        <button
          type="button"
          className="btn s"
          disabled={isSuperAdmin}
          onClick={() =>
            navigate(`/roles/edit/${role.id}`)
          }
        >
          Edit
        </button>

        <button
          type="button"
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
