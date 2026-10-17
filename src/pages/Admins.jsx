import { useState } from 'react'
import PageHeader from '../components/common/PageHeader'
import UserTable from '../components/common/UserTable'
import Modal from '../components/common/Modal'
import { useApp } from '../context/appContext'
import { HQ } from '../data/mockData'

function AddAdminModal({ onClose }) {
  const { addUser } = useApp()
  const [f, setF] = useState({ name: '', email: '', mobile: '' })
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value })

  const submit = async () => {
    if (!f.name.trim() || !f.email.trim()) return
    if (await addUser({ ...f, role: 'Admin' })) onClose()
  }

  return (
    <Modal title="Add Admin" okLabel="Create Admin" onOk={submit} onClose={onClose}>
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
          <select disabled><option>Admin</option></select>
        </div>
        <div>
          <label>Location</label>
          <select disabled><option>{HQ}</option></select>
        </div>
      </div>
    </Modal>
  )
}

export default function Admins() {
  const { users } = useApp()
  const [show, setShow] = useState(false)
  const admins = users.filter((u) => ['Super Admin', 'Admin'].includes(u.role))

  return (
    <>
      <PageHeader
        breadcrumb="Administration"
        title="Admins"
        subtitle="Head-office administrators managed by Super Admin"
        actions={<button className="btn p" onClick={() => setShow(true)}>+ Add Admin</button>}
      />
      <UserTable users={admins} placeholder="Search admins…" />
      {show && <AddAdminModal onClose={() => setShow(false)} />}
    </>
  )
}