import { useState } from 'react'
import Card from './Card'
import FilterBar from './FilterBar'
import DataTable from './DataTable'
import Badge from './Badge'
import { useApp } from '../../context/appContext'

/* Inline SVG icons (no extra package needed) */
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

export default function UserTable({
  users = [],
  placeholder,
  onEdit,
}) {
  const { toggleUser, deleteUser } = useApp()

  const [q, setQ] = useState('')
  const [status, setStatus] = useState('All statuses')

  const filtered = users.filter((u) => {
    const matchesStatus =
      status === 'All statuses' || u.status === status

    const searchText =
      `${u.code || ''} ${u.name || ''} ${u.email || ''} ${
        u.mobile || ''
      }`.toLowerCase()

    return matchesStatus && searchText.includes(q.toLowerCase())
  })

  const handleDelete = async (user) => {
    const confirmed = window.confirm(
      `Delete user "${user.name}" (${user.code || `U-${user.id}`})? ` +
      'This action cannot be undone.'
    )

    if (!confirmed) return

    await deleteUser(user.id)
  }

  const rows = filtered.map((u) => {
    const isSuperAdmin = u.role === 'Super Admin'

    return [
      u.code || `U-${u.id}`,

      <>
        <b>{u.name}</b>
        <div className="sm mu">{u.email}</div>
      </>,

      u.mobile || '—',

      <Badge>{u.status || 'Active'}</Badge>,

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 8,
        }}
      >
        <button
          type="button"
          title="Edit user"
          aria-label={`Edit ${u.name}`}
          style={iconBtn('#1a56db', isSuperAdmin)}
          onClick={() => onEdit?.(u)}
          disabled={isSuperAdmin}
        >
          <EditIcon />
        </button>

        <button
          type="button"
          className="btn s"
          onClick={() => toggleUser(u.id)}
          disabled={isSuperAdmin}
        >
          {u.status === 'Active' ? 'Deactivate' : 'Activate'}
        </button>

        <button
          type="button"
          title="Delete user"
          aria-label={`Delete ${u.name}`}
          style={iconBtn('#d93025', isSuperAdmin)}
          onClick={() => handleDelete(u)}
          disabled={isSuperAdmin}
        >
          <DeleteIcon />
        </button>
      </div>,
    ]
  })

  return (
    <Card flush>
      <FilterBar
        placeholder={placeholder}
        search={q}
        onSearch={setQ}
        status={status}
        onStatus={setStatus}
      />

      <DataTable
        columns={[
          'ID',
          'Name',
          'Mobile',
          'Status',
          'Actions',
        ]}
        rows={rows}
      />
    </Card>
  )
}