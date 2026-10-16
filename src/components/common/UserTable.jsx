import { useState } from 'react'
import Card from './Card'
import FilterBar from './FilterBar'
import DataTable from './DataTable'
import Badge from './Badge'
import { useApp } from '../../context/appContext'

export default function UserTable({ users, placeholder }) {
  const { toggleUser } = useApp()
  const [q, setQ] = useState('')
  const [status, setStatus] = useState('All statuses')

  const filtered = users.filter(
    (u) =>
      (status === 'All statuses' || u.status === status) &&
      `${u.id} ${u.name} ${u.email} ${u.mobile} ${u.role} ${u.location}`.toLowerCase().includes(q.toLowerCase())
  )

  const rows = filtered.map((u) => [
    u.id,
    <>
      <b>{u.name}</b>
      <div className="sm mu">{u.email}</div>
    </>,
    u.mobile,
    <Badge>{u.role}</Badge>,
    u.location,
    <Badge>{u.status}</Badge>,
    <button className="btn s" onClick={() => toggleUser(u.id)}>
      {u.status === 'Active' ? 'Deactivate' : 'Activate'}
    </button>,
  ])

  return (
    <Card flush>
      <FilterBar placeholder={placeholder} search={q} onSearch={setQ} status={status} onStatus={setStatus} />
      <DataTable columns={['ID', 'Name', 'Mobile', 'Role', 'Location', 'Status', 'Actions']} rows={rows} />
    </Card>
  )
}