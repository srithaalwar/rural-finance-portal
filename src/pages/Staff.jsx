import { useState } from 'react'
import PageHeader from '../components/common/PageHeader'
import UserTable from '../components/common/UserTable'
import Modal from '../components/common/Modal'
import { useApp } from '../context/appContext'
import { HQ, HQ_ROLES, ROLES } from '../data/mockData'

const STAFF_ROLES = ROLES.slice(2)

function AddStaffModal({ onClose }) {
  const { addUser, branches } = useApp()
  const [f, setF] = useState({ name: '', email: '', mobile: '', role: STAFF_ROLES[0], branch: branches[0]?.name || '' })
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value })
  const atHq = HQ_ROLES.includes(f.role)

  const submit = () => {
    if (!f.name.trim()) return
    addUser({ name: f.name, email: f.email, mobile: f.mobile, role: f.role, location: atHq ? HQ : f.branch })
    onClose()
  }

  return (
    <Modal title="Add Staff Member" okLabel="Add Staff" onOk={submit} onClose={onClose}>
      <div className="fm">
        <div className="f">
          <label>Full name</label>
          <input value={f.name} onChange={set('name')} />
        </div>
        <div>
          <label>Email</label>
          <input value={f.email} onChange={set('email')} />
        </div>
        <div>
          <label>Mobile</label>
          <input value={f.mobile} onChange={set('mobile')} />
        </div>
        <div>
          <label>Role</label>
          <select value={f.role} onChange={set('role')}>
            {STAFF_ROLES.map((r) => <option key={r}>{r}</option>)}
          </select>
        </div>
        <div>
          <label>Branch</label>
          {atHq ? (
            <select disabled><option>{HQ}</option></select>
          ) : (
            <select value={f.branch} onChange={set('branch')}>
              {branches.map((b) => <option key={b.code}>{b.name}</option>)}
            </select>
          )}
        </div>
      </div>
    </Modal>
  )
}

export default function Staff() {
  const { users } = useApp()
  const [tab, setTab] = useState('All')
  const [show, setShow] = useState(false)

  const staff = users.filter(
    (u) => !['Super Admin', 'Admin'].includes(u.role) && (tab === 'All' || u.role === tab)
  )

  return (
    <>
      <PageHeader
        breadcrumb="Administration"
        title="Staff Members"
        subtitle="General managers, branch managers, clerks, cashiers and sales officers"
        actions={<button className="btn p" onClick={() => setShow(true)}>+ Add Staff</button>}
      />
      <div className="tabs">
        {['All', ...STAFF_ROLES].map((t) => (
          <a key={t} className={tab === t ? 'on' : ''} onClick={() => setTab(t)}>{t}</a>
        ))}
      </div>
      <UserTable users={staff} placeholder="Search staff…" />
      {show && <AddStaffModal onClose={() => setShow(false)} />}
    </>
  )
}