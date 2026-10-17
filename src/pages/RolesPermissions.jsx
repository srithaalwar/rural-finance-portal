import { useState } from 'react'
import PageHeader from '../components/common/PageHeader'
import Card from '../components/common/Card'
import { useApp } from '../context/appContext'
import { ROLES, HQ_ROLES, ROLE_DESC, PERMISSION_GROUPS, ALL_PERMISSIONS } from '../data/mockData'

export default function RolesPermissions() {
  const { users, rolePerms, togglePermission, savePermissions } = useApp()
  const [role, setRole] = useState('Admin')
  const locked = role === 'Super Admin'

  return (
    <>
      <PageHeader
        breadcrumb="Administration"
        title="Roles & Permissions"
        subtitle="Super Admin has all access and is locked"
      />

      <div className="roles-grid">
        <div className="cd" style={{ padding: 8 }}>
          {ROLES.map((r) => (
            <div key={r} className={`rl-item ${role === r ? 'on' : ''}`} onClick={() => setRole(r)}>
              {r}
              <span className="sm mu" style={{ marginLeft: 'auto' }}>
                {users.filter((u) => u.role === r).length}
              </span>
            </div>
          ))}
        </div>

        <div>
          <Card
            title={role}
            action={!locked && <button className="btn p s" onClick={() => savePermissions(role)}>Save</button>}
          >
            <p className="mu" style={{ margin: 0 }}>
              {ROLE_DESC[role]} · Works at: <b>{HQ_ROLES.includes(role) ? 'Head Office' : 'A branch'}</b> ·{' '}
              {rolePerms[role].length} of {ALL_PERMISSIONS.length} permissions
            </p>
            {locked && (
              <div className="al in" style={{ margin: '12px 0 0' }}>
                🔒 Super Admin always has all permissions. These cannot be changed.
              </div>
            )}
          </Card>

          {Object.entries(PERMISSION_GROUPS).map(([group, perms]) => (
            <div key={group} style={{ marginTop: 16 }}>
              <Card title={group}>
                <div className="pm">
                  {perms.map((p) => (
                    <label key={p}>
                      <input
                        type="checkbox"
                        className="ck"
                        style={{ width: 'auto' }}
                        checked={rolePerms[role].includes(p)}
                        disabled={locked}
                        onChange={() => togglePermission(role, p)}
                      />
                      {p}
                    </label>
                  ))}
                </div>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}