
import { useState } from 'react'
import PageHeader from '../components/common/PageHeader'
import UserTable from '../components/common/UserTable'
import Modal from '../components/common/Modal'
import { useApp } from '../context/appContext'

function UserModal({ user, onClose }) {
  const { addUser, updateUser } = useApp()
  const isEditing = Boolean(user)

  const [f, setF] = useState({
    name: user?.name || '',
    email: user?.email || '',
    mobile: user?.mobile || '',
  })

  const [saving, setSaving] = useState(false)

  const set = (key) => (e) => {
    setF((prev) => ({
      ...prev,
      [key]: e.target.value,
    }))
  }

  const submit = async () => {
    if (!f.name.trim() || !f.email.trim()) {
      alert('Please enter the name and email')
      return
    }

    setSaving(true)

    try {
      const payload = {
        name: f.name.trim(),
        email: f.email.trim(),
        mobile: f.mobile.trim(),
      }

      const ok = isEditing
        ? await updateUser(user.id, payload)
        : await addUser(payload)

      if (ok) onClose()
    } finally {
      setSaving(false)
    }
  }

  return (
    <Modal
      title={isEditing ? 'Edit User' : 'Add User'}
      okLabel={
        saving
          ? 'Saving...'
          : isEditing
            ? 'Save Changes'
            : 'Create User'
      }
      onOk={submit}
      onClose={onClose}
    >
      <div className="fm">
        <div className="f">
          <label>Full name</label>
          <input
            value={f.name}
            onChange={set('name')}
            placeholder="Enter full name"
          />
        </div>

        <div>
          <label>Email</label>
          <input
            type="email"
            value={f.email}
            onChange={set('email')}
            placeholder="Enter email address"
          />
        </div>

        <div>
          <label>Mobile</label>
          <input
            type="tel"
            value={f.mobile}
            onChange={set('mobile')}
            placeholder="Enter mobile number"
          />
        </div>

        {isEditing && (
          <p className="sm mu">
            Editing contact details will not change the user's
            assigned branch or role.
          </p>
        )}
      </div>
    </Modal>
  )
}

export default function Users() {
  const { users } = useApp()

  const [showAdd, setShowAdd] = useState(false)
  const [editingUser, setEditingUser] = useState(null)

  return (
    <>
      <PageHeader
        breadcrumb="Administration"
        title="Users"
        subtitle="Manage administrators, managers, clerks, cashiers and sales officers"
        actions={
          <button
            className="btn p"
            onClick={() => setShowAdd(true)}
          >
            + Add User
          </button>
        }
      />

      <UserTable
        users={users}
        placeholder="Search users…"
        onEdit={(user) => setEditingUser(user)}
      />

      {showAdd && (
        <UserModal onClose={() => setShowAdd(false)} />
      )}

      {editingUser && (
        <UserModal
          key={editingUser.id}
          user={editingUser}
          onClose={() => setEditingUser(null)}
        />
      )}
    </>
  )
}
