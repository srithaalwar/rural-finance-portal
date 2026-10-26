import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import PageHeader from '../components/common/PageHeader'
import Card from '../components/common/Card'
import FilterBar from '../components/common/FilterBar'
import DataTable from '../components/common/DataTable'
import Badge from '../components/common/Badge'
import { useApp } from '../context/appContext'
import { HQ } from '../data/mockData'

export default function Branches() {
  const navigate = useNavigate()
  const { branches = [], users = [] } = useApp()

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
        type="button"
        className="btn p s"
        onClick={() => navigate(`/manageusers/${branch.id}`)}
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
            type="button"
            className="btn p"
            onClick={() => navigate('/branchform')}
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
    </>
  )
}