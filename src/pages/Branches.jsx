
import { useState } from 'react'
import PageHeader from '../components/common/PageHeader'
import Card from '../components/common/Card'
import FilterBar from '../components/common/FilterBar'
import DataTable from '../components/common/DataTable'
import Badge from '../components/common/Badge'
import Modal from '../components/common/Modal'
import { useApp } from '../context/appContext'
import { HQ } from '../data/mockData'

function AddBranchModal({ onClose }) {
  const { addBranch } = useApp()

  const [f, setF] = useState({
    name: '',
    area: '',
    district: '',
  })

  const set = (key) => (e) =>
    setF((prev) => ({ ...prev, [key]: e.target.value }))

  const submit = async () => {
    if (!f.name.trim()) {
      alert('Please enter a branch name')
      return
    }

    if (await addBranch(f)) onClose()
  }

  return (
    <Modal
      title="Add Branch"
      okLabel="Create Branch"
      onOk={submit}
      onClose={onClose}
    >
      <div className="fm">
        <div className="f">
          <label>Branch name</label>
          <input
            value={f.name}
            onChange={set('name')}
            placeholder="e.g. Nandigama Branch"
          />
        </div>

        <div>
          <label>Village / area</label>
          <input value={f.area} onChange={set('area')} />
        </div>

        <div>
          <label>District</label>
          <input value={f.district} onChange={set('district')} />
        </div>

        <div className="f">
          <label>Parent office</label>
          <select disabled>
            <option>{HQ} (only one)</option>
          </select>
        </div>
      </div>
    </Modal>
  )
}


function ManageBranchUsersModal({ branch, onClose }) {
  const {
    users = [],
    roles = [],
    assignUserToBranch,
    unassignUserFromBranch,
  } = useApp()

  const [userId, setUserId] = useState('')
  const [roleId, setRoleId] = useState('')
  const [saving, setSaving] = useState(false)
  const [removingUserId, setRemovingUserId] = useState(null)

  const branchUsers = users.filter(
    (user) => Number(user.branchId) === Number(branch.id)
  )

  const unassignedUsers = users.filter(
    (user) =>
      user.roleId == null &&
      user.branchId == null &&
      user.status === 'Active'
  )

  const branchRoles = roles.filter((role) => {
    const isHqRole = role.isHqRole ?? role.is_hq_role
    return !isHqRole && role.name !== 'Super Admin'
  })

  const submit = async () => {
    if (!userId || !roleId) {
      alert('Please select a user and a role')
      return
    }

    setSaving(true)

    try {
      const ok = await assignUserToBranch(
        Number(userId),
        Number(branch.id),
        Number(roleId)
      )

      if (ok) {
        setUserId('')
        setRoleId('')
      }
    } finally {
      setSaving(false)
    }
  }

  const handleRemove = async (user) => {
    const confirmed = window.confirm(
      `Remove ${user.name} from ${branch.name}?\n\n` +
      'Their account will remain active, but their branch ' +
      'and role will be cleared. You can assign them to ' +
      'another branch afterward.'
    )

    if (!confirmed) return

    setRemovingUserId(user.id)

    try {
      await unassignUserFromBranch(user.id, branch.id)
    } finally {
      setRemovingUserId(null)
    }
  }

  return (
    <Modal
      title={`Manage Users — ${branch.name}`}
      okLabel={saving ? 'Assigning...' : 'Assign User'}
      onOk={submit}
      onClose={onClose}
    >
      <div className="fm">
        <div
          style={{
            gridColumn: '1 / -1',
            width: '100%',
            minWidth: 0,
            boxSizing: 'border-box',
          }}
        >
          <label
            style={{
              display: 'block',
              marginBottom: 10,
            }}
          >
            Existing users assigned to this branch (
            {branchUsers.length})
          </label>

          {branchUsers.length === 0 ? (
            <p className="mu">
              No users assigned yet.
            </p>
          ) : (
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                width: '100%',
                minWidth: 0,
                maxHeight: 240,
                overflowY: 'auto',
                overflowX: 'hidden',
                boxSizing: 'border-box',
                border: '1px solid #d8e3f5',
                borderRadius: 8,
              }}
            >
              {branchUsers.map((user) => (
                <div
                  key={user.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: 12,
                    width: '100%',
                    minWidth: 0,
                    boxSizing: 'border-box',
                    padding: 12,
                    borderBottom: '1px solid #d8e3f5',
                  }}
                >
                  <div
                    style={{
                      flex: '1 1 auto',
                      minWidth: 0,
                    }}
                  >
                    <b>{user.name}</b>

                    <div
                      className="sm mu"
                      style={{
                        marginTop: 4,
                        overflowWrap: 'anywhere',
                      }}
                    >
                      {user.email}
                    </div>
                  </div>

                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                      flexShrink: 0,
                      flexWrap: 'wrap',
                      justifyContent: 'flex-end',
                    }}
                  >
                    <Badge>
                      {user.role || 'Unassigned'}
                    </Badge>

                    <button
                      type="button"
                      className="btn s"
                      disabled={
                        removingUserId !== null ||
                        saving
                      }
                      onClick={() => handleRemove(user)}
                    >
                      {removingUserId === user.id
                        ? 'Removing...'
                        : 'Remove'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="f">
          <label>Add an existing user</label>

          <select
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            disabled={
              unassignedUsers.length === 0 || saving
            }
          >
            <option value="">
              Select an unassigned user
            </option>

            {unassignedUsers.map((user) => (
              <option
                key={user.id}
                value={String(user.id)}
              >
                {user.name} ({user.email})
              </option>
            ))}
          </select>

          {unassignedUsers.length === 0 && (
            <p className="sm mu">
              No unassigned active users available.
              Remove a user from another branch or create
              a user on the Users page.
            </p>
          )}
        </div>

        <div>
          <label>Role for this branch</label>

          <select
            value={roleId}
            onChange={(e) => setRoleId(e.target.value)}
            disabled={saving}
          >
            <option value="">Select a role</option>

            {branchRoles.map((role) => (
              <option
                key={role.id}
                value={String(role.id)}
              >
                {role.name}
              </option>
            ))}
          </select>

          {branchRoles.length === 0 && (
            <p className="sm mu">
              No branch-level roles found. Create a
              branch-level role in Roles & Permissions first.
            </p>
          )}
        </div>
      </div>
    </Modal>
  )
}


export default function Branches() {
  const { branches = [], users = [] } = useApp()

  const [showAdd, setShowAdd] = useState(false)
  const [selectedBranch, setSelectedBranch] = useState(null)
  const [q, setQ] = useState('')
  const [status, setStatus] = useState('All statuses')

  const filtered = branches.filter(
    (branch) =>
      (status === 'All statuses' || branch.status === status) &&
      `${branch.code || ''} ${branch.name || ''} ${
        branch.area || ''
      } ${branch.district || ''}`
        .toLowerCase()
        .includes(q.toLowerCase())
  )

  const rows = filtered.map((branch) => {
    const staffCount = users.filter(
      (user) => Number(user.branchId) === Number(branch.id)
    ).length

    return [
      branch.code || '—',
      <b>{branch.name}</b>,
      branch.area || '—',
      branch.district || '—',
      HQ,
      staffCount,
      branch.opened || '—',
      <Badge>{branch.status || 'Active'}</Badge>,
      <button
        className="btn p s"
        onClick={() => setSelectedBranch(branch)}
      >
        Manage Users
      </button>,
    ]
  })

  return (
    <>
      <PageHeader
        breadcrumb="Organization"
        title="Branches"
        subtitle={`${branches.length} branches under Head Office`}
        actions={
          <button
            className="btn p"
            onClick={() => setShowAdd(true)}
          >
            + Add Branch
          </button>
        }
      />

      <Card flush>
        <FilterBar
          placeholder="Search branches..."
          search={q}
          onSearch={setQ}
          status={status}
          onStatus={setStatus}
        />

        <DataTable
          columns={[
            'Code',
            'Branch',
            'Village / Area',
            'District',
            'Parent',
            'Staff',
            'Opened',
            'Status',
            'Actions',
          ]}
          rows={rows}
        />
      </Card>

      {showAdd && (
        <AddBranchModal onClose={() => setShowAdd(false)} />
      )}

      {selectedBranch && (
        <ManageBranchUsersModal
          branch={selectedBranch}
          onClose={() => setSelectedBranch(null)}
        />
      )}
    </>
  )
}
