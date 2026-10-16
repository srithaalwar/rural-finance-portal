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
  const [f, setF] = useState({ name: '', area: '', district: '' })
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value })

  const submit = () => {
    if (!f.name.trim()) return
    addBranch(f)
    onClose()
  }

  return (
    <Modal title="Add Branch" okLabel="Create Branch" onOk={submit} onClose={onClose}>
      <div className="fm">
        <div className="f">
          <label>Branch name</label>
          <input value={f.name} onChange={set('name')} placeholder="e.g. Nandigama Branch" />
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
          <select disabled><option>{HQ} (only one)</option></select>
        </div>
      </div>
    </Modal>
  )
}

export default function Branches() {
  const { branches, users } = useApp()
  const [show, setShow] = useState(false)
  const [q, setQ] = useState('')
  const [status, setStatus] = useState('All statuses')

  const filtered = branches.filter(
    (b) =>
      (status === 'All statuses' || b.status === status) &&
      `${b.code} ${b.name} ${b.area} ${b.district}`.toLowerCase().includes(q.toLowerCase())
  )

  const rows = filtered.map((b) => [
    b.code,
    <b>{b.name}</b>,
    b.area,
    b.district,
    HQ,
    users.filter((u) => u.location === b.name).length,
    b.opened,
    <Badge>{b.status}</Badge>,
  ])

  return (
    <>
      <PageHeader
        breadcrumb="Organization"
        title="Branches"
        subtitle={`${branches.length} branches under Head Office`}
        actions={<button className="btn p" onClick={() => setShow(true)}>+ Add Branch</button>}
      />
      <Card flush>
        <FilterBar placeholder="Search branches…" search={q} onSearch={setQ} status={status} onStatus={setStatus} />
        <DataTable
          columns={['Code', 'Branch', 'Village / Area', 'District', 'Parent', 'Staff', 'Opened', 'Status']}
          rows={rows}
        />
      </Card>
      {show && <AddBranchModal onClose={() => setShow(false)} />}
    </>
  )
}