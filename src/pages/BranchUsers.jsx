import { useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import PageHeader from '../components/common/PageHeader'
import { useApp } from '../context/appContext'

const BRANCHES_PATH = '/branches'

const COLORS = [
  '#8e44ad', '#e84393', '#27ae60', '#e67e22',
  '#2980b9', '#16a085', '#d35400', '#c0392b',
]

const initials = (name = '') =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase() || '?'

const checkboxStyle = {
  width: 18,
  height: 18,
  minWidth: 18,
  margin: 0,
  padding: 0,
  flex: 'none',
  cursor: 'pointer',
  accentColor: '#1a56db',
}

const labelReset = {
  display: 'flex',
  alignItems: 'center',
  gap: 10,
  width: 'auto',
  margin: 0,
}

const sectionStyle = {
  border: '1px solid #e3eaf6',
  borderRadius: 8,
  background: '#f9fafc',
  padding: '16px 20px 20px',
  marginBottom: 22,
}

const sectionTitle = {
  fontSize: 16,
  fontWeight: 600,
  margin: '0 0 14px',
}

function Avatar({ user }) {
  return (
    <span
      style={{
        width: 26,
        height: 26,
        borderRadius: 5,
        background: COLORS[Number(user.id) % COLORS.length],
        color: '#fff',
        fontSize: 10,
        fontWeight: 700,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
      }}
    >
      {initials(user.name)}
    </span>
  )
}

/* Return this user's roleIds for the given branch.
   Prefer the branch-scoped map the API provides (branchRoleMap);
   fall back to the flat roleIds list only when the user is not in
   any other branch. */
const roleIdsForBranch = (user, branchId) => {
  if (!user) return []
  const map = user.branchRoleMap
  if (map && map[branchId] !== undefined) {
    const v = map[branchId]
    return Array.isArray(v) ? v.map(Number) : []
  }
  const branchIds = (user.branchIds || []).map(Number)
  if (branchIds.length > 0 && !branchIds.includes(branchId)) return []
  return (user.roleIds || []).map(Number)
}

const isMemberOfBranch = (user, branchId) =>
  (user?.branchIds || []).map(Number).includes(branchId)

export default function BranchUsers() {
  const navigate = useNavigate()
  const { id } = useParams()
  const branchId = Number(id)

  const {
    branches = [],
    users = [],
    roles = [],
    saveBranchMembers,
  } = useApp()

  const branch = branches.find((b) => Number(b.id) === branchId)

  // Branch-level roles only
  const branchRoles = useMemo(
    () =>
      roles.filter(
        (r) => !(r.isHqRole ?? r.is_hq_role) && r.name !== 'Super Admin'
      ),
    [roles]
  )

  // Users already in THIS branch when the page opened
  const originalIds = useMemo(
    () =>
      users
        .filter((u) => isMemberOfBranch(u, branchId))
        .map((u) => Number(u.id)),
    [users, branchId]
  )

  const [selected, setSelected] = useState(() => {
    const init = {}
    users
      .filter((u) => isMemberOfBranch(u, branchId))
      .forEach((u) => {
        const ids = roleIdsForBranch(u, branchId)
        init[Number(u.id)] = ids
      })
    return init
  })

  const [q, setQ] = useState('')
  const [saving, setSaving] = useState(false)

  if (!branch) {
    return (
      <>
        <PageHeader
          breadcrumb="Organization / Branches"
          title="Branch Not Found"
          subtitle="The requested branch could not be found."
        />
        <button
          type="button"
          className="btn p"
          onClick={() => navigate(BRANCHES_PATH)}
        >
          Back to Branches
        </button>
      </>
    )
  }

  // Every active user is selectable. Only inactive users are blocked.
  const getState = (u) => {
    if (u.status !== 'Active') {
      return { blocked: true, reason: 'Inactive' }
    }
    return { blocked: false }
  }

  const toggleUser = (userId) =>
    setSelected((prev) => {
      const next = { ...prev }
      if (next[userId] !== undefined) delete next[userId]
      else next[userId] = []
      return next
    })

  const toggleRole = (userId, roleId) =>
    setSelected((prev) => {
      const current = prev[userId] || []
      return {
        ...prev,
        [userId]: current.includes(roleId)
          ? current.filter((r) => r !== roleId)
          : [...current, roleId],
      }
    })

  const selectedIds = Object.keys(selected).map(Number)

  const allHaveRole = (roleId) =>
    selectedIds.length > 0 &&
    selectedIds.every((uid) => (selected[uid] || []).includes(roleId))

  const toggleRoleForAll = (roleId) =>
    setSelected((prev) => {
      const everyone = Object.keys(prev).map(Number)
      const hasAll = everyone.every((uid) =>
        (prev[uid] || []).includes(roleId)
      )
      const next = {}
      everyone.forEach((uid) => {
        const current = prev[uid] || []
        next[uid] = hasAll
          ? current.filter((r) => r !== roleId)
          : current.includes(roleId)
            ? current
            : [...current, roleId]
      })
      return next
    })

  const text = q.toLowerCase()

  const visibleUsers = users
    .filter((u) =>
      `${u.code || ''} ${u.name || ''} ${u.email || ''}`
        .toLowerCase()
        .includes(text)
    )
    .sort(
      (a, b) =>
        Number(getState(a).blocked) - Number(getState(b).blocked)
    )

  const handleSave = async () => {
    const members = Object.entries(selected).map(([userId, roleIds]) => ({
      userId: Number(userId),
      roleIds: [...new Set(roleIds.map(Number))],
    }))

    const withoutRole = members.filter((m) => m.roleIds.length === 0)
    if (withoutRole.length > 0) {
      const names = withoutRole
        .map((m) => users.find((u) => Number(u.id) === m.userId)?.name)
        .filter(Boolean)
        .join(', ')
      alert(`Select at least one role for: ${names}`)
      return
    }

    const removed = originalIds.filter(
      (uid) => selected[uid] === undefined
    )

    if (
      removed.length > 0 &&
      !window.confirm(
        `${removed.length} user(s) will be removed from ${branch.name}. ` +
        'They will keep any other branch memberships. Continue?'
      )
    ) {
      return
    }

    setSaving(true)
    try {
      const ok = await saveBranchMembers(branchId, members)
      if (ok) navigate(BRANCHES_PATH)
    } finally {
      setSaving(false)
    }
  }

  return (
    <>
      <PageHeader
        breadcrumb="Organization / Branches"
        title={`Manage Users — ${branch.name}`}
        subtitle="Select the users for this branch, then choose their roles"
        actions={
          <button
            type="button"
            className="btn s"
            onClick={() => navigate(BRANCHES_PATH)}
          >
            ← Back to Branches
          </button>
        }
      />

      <div
        style={{
          background: '#fff',
          width: '100%',
          minHeight: 'calc(100vh - 150px)',
          padding: '28px 36px',
          boxSizing: 'border-box',
          borderTop: '1px solid #e3eaf6',
        }}
      >
        {/* ───────── Section 1: users ───────── */}
        <div style={sectionStyle}>
          <h3 style={sectionTitle}>Select users</h3>

          <input
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search for user…"
            style={{
              width: '100%',
              boxSizing: 'border-box',
              marginBottom: 14,
            }}
          />

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
              gap: '6px 20px',
            }}
          >
            {visibleUsers.map((u) => {
              const uid = Number(u.id)
              const state = getState(u)
              const isChecked = selected[uid] !== undefined

              // Informative hint only — user is still selectable.
              const otherBranchHint =
                !state.blocked &&
                (u.branchIds || []).length > 0 &&
                !isMemberOfBranch(u, branchId)
                  ? `Also in ${u.branchName || 'another branch'}`
                  : null

              return (
                <label
                  key={u.id}
                  title={state.blocked ? state.reason : u.email}
                  style={{
                    ...labelReset,
                    padding: '6px 4px',
                    borderRadius: 6,
                    background: isChecked ? '#e8f0fe' : 'transparent',
                    opacity: state.blocked ? 0.5 : 1,
                    cursor: state.blocked ? 'not-allowed' : 'pointer',
                    minWidth: 0,
                  }}
                >
                  <input
                    type="checkbox"
                    style={{
                      ...checkboxStyle,
                      cursor: state.blocked ? 'not-allowed' : 'pointer',
                    }}
                    checked={isChecked}
                    disabled={state.blocked || saving}
                    onChange={() => toggleUser(uid)}
                  />

                  <Avatar user={u} />

                  <span style={{ minWidth: 0 }}>
                    <span style={{ display: 'block', fontWeight: 500 }}>
                      {u.name}
                    </span>
                    {state.blocked && (
                      <span
                        className="sm mu"
                        style={{ display: 'block', fontSize: 11 }}
                      >
                        {state.reason}
                      </span>
                    )}
                    {otherBranchHint && (
                      <span
                        className="sm mu"
                        style={{ display: 'block', fontSize: 11 }}
                      >
                        {otherBranchHint}
                      </span>
                    )}
                  </span>
                </label>
              )
            })}
          </div>

          {visibleUsers.length === 0 && (
            <p className="mu" style={{ textAlign: 'center', margin: '16px 0 0' }}>
              No users found.
            </p>
          )}

          <p className="sm mu" style={{ margin: '14px 0 0' }}>
            ({visibleUsers.length}/{users.length}) · {selectedIds.length}{' '}
            selected
          </p>
        </div>

        {/* ───────── Section 2: roles ───────── */}
        <div style={sectionStyle}>
          <h3 style={sectionTitle}>Roles</h3>

          {branchRoles.length === 0 && (
            <p className="sm" style={{ color: '#d93025', margin: 0 }}>
              No branch-level roles found. Create one in Roles &amp;
              Permissions first.
            </p>
          )}

          {branchRoles.length > 0 && selectedIds.length === 0 && (
            <p className="mu" style={{ margin: 0 }}>
              Select one or more users above to choose their roles.
            </p>
          )}

          {branchRoles.length > 0 && selectedIds.length > 0 && (
            <>
              {selectedIds.length > 1 && (
                <div
                  style={{
                    padding: '12px 14px',
                    marginBottom: 14,
                    background: '#fff',
                    border: '1px dashed #b9c9e6',
                    borderRadius: 8,
                  }}
                >
                  <div
                    className="sm"
                    style={{ fontWeight: 600, marginBottom: 10 }}
                  >
                    Set for all selected users ({selectedIds.length})
                  </div>

                  <div
                    style={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      gap: '10px 24px',
                    }}
                  >
                    {branchRoles.map((role) => (
                      <label
                        key={role.id}
                        style={{ ...labelReset, gap: 8, cursor: 'pointer' }}
                      >
                        <input
                          type="checkbox"
                          style={checkboxStyle}
                          checked={allHaveRole(Number(role.id))}
                          disabled={saving}
                          onChange={() =>
                            toggleRoleForAll(Number(role.id))
                          }
                        />
                        <span>{role.name}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {selectedIds.map((uid) => {
                const u = users.find((x) => Number(x.id) === uid)
                if (!u) return null

                const userRoles = selected[uid] || []

                return (
                  <div
                    key={uid}
                    style={{
                      padding: '12px 14px',
                      marginBottom: 10,
                      background: '#fff',
                      border: '1px solid #d8e3f5',
                      borderRadius: 8,
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 10,
                        marginBottom: 10,
                      }}
                    >
                      <Avatar user={u} />
                      <b>{u.name}</b>
                      <span className="sm mu">{u.email}</span>

                      {userRoles.length === 0 && (
                        <span
                          className="sm"
                          style={{ color: '#d93025', marginLeft: 'auto' }}
                        >
                          Select at least one role
                        </span>
                      )}
                    </div>

                    <div
                      style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: '10px 24px',
                      }}
                    >
                      {branchRoles.map((role) => (
                        <label
                          key={role.id}
                          style={{ ...labelReset, gap: 8, cursor: 'pointer' }}
                        >
                          <input
                            type="checkbox"
                            style={checkboxStyle}
                            checked={userRoles.includes(Number(role.id))}
                            disabled={saving}
                            onChange={() =>
                              toggleRole(uid, Number(role.id))
                            }
                          />
                          <span>{role.name}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                )
              })}
            </>
          )}
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', gap: 10 }}>
          <button
            type="button"
            className="btn p"
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </button>

          <button
            type="button"
            className="btn s"
            onClick={() => navigate(BRANCHES_PATH)}
            disabled={saving}
          >
            Cancel
          </button>
        </div>
      </div>
    </>
  )
}