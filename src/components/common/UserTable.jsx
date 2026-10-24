
import { useState } from 'react'
import Card from './Card'
import FilterBar from './FilterBar'
import DataTable from './DataTable'
import Badge from './Badge'
import { useApp } from '../../context/appContext'

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
          gap: 6,
        }}
      >
        <button
          type="button"
          className="btn s"
          onClick={() => onEdit?.(u)}
          disabled={isSuperAdmin}
        >
          Edit
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
          className="btn s"
          onClick={() => handleDelete(u)}
          disabled={isSuperAdmin}
        >
          Delete
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
