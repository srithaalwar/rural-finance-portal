
import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import PageHeader from '../components/common/PageHeader'
import Card from '../components/common/Card'
import { useApp } from '../context/appContext'

export default function UserForm() {
  const navigate = useNavigate()
  const { id } = useParams()

  const {
    users = [],
    addUser,
    updateUser,
  } = useApp()

  const isEditing = Boolean(id)

  const user = isEditing
    ? users.find((u) => String(u.id) === String(id))
    : null

  const [form, setForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    mobile: user?.mobile || '',
    password: '',
  })

  const [saving, setSaving] = useState(false)

  const setField = (field) => (event) => {
    setForm((prev) => ({
      ...prev,
      [field]: event.target.value,
    }))
  }

  const submit = async (event) => {
    event.preventDefault()

    if (!form.name.trim() || !form.email.trim()) {
      alert('Please enter the name and email')
      return
    }

    if (!isEditing && !form.password) {
      alert('Please enter a password')
      return
    }

    if (!isEditing && form.password.length < 8) {
      alert('Password must contain at least 8 characters')
      return
    }

    if (saving) return

    setSaving(true)

    try {
      const payload = {
        name: form.name.trim(),
        email: form.email.trim(),
        mobile: form.mobile.trim(),
      }

      if (!isEditing) {
        payload.password = form.password
      }

      const success = isEditing
        ? await updateUser(user.id, payload)
        : await addUser(payload)

      if (success) {
        navigate('/users')
      }
    } catch (error) {
      console.error('Save user failed:', error)
      alert(error.message || 'Failed to save user')
    } finally {
      setSaving(false)
    }
  }

  if (isEditing && !user) {
    return (
      <>
        <PageHeader
          breadcrumb="Administration / Users"
          title="User Not Found"
          subtitle="The requested user could not be found."
        />

        <button
          className="btn p"
          onClick={() => navigate('/users')}
        >
          Back to Users
        </button>
      </>
    )
  }

 
return (
  <>
    <PageHeader
      breadcrumb="Administration / Users"
      title={isEditing ? 'Edit User' : 'Add User'}
      subtitle={
        isEditing
          ? 'Update the user contact details'
          : 'Create a new user account'
      }
      actions={
        <button
          type="button"
          className="btn s"
          onClick={() => navigate('/users')}
        >
          ← Back to Users
        </button>
      }
    />

    {/* Centered form with a limited width */}
    <div
      style={{
        width: '100%',
        maxWidth: 760,
        margin: '24px auto',
      }}
    >
      <Card>
        <form onSubmit={submit}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: 18,
            }}
          >
            <div
              className="f"
              style={{ gridColumn: '1 / -1' }}
            >
              <label>Full Name</label>
              <input
                value={form.name}
                onChange={setField('name')}
                placeholder="Enter full name"
                autoComplete="name"
                required
              />
            </div>

            <div className="f">
              <label>Email</label>
              <input
                type="email"
                value={form.email}
                onChange={setField('email')}
                placeholder="Enter email address"
                autoComplete="email"
                required
              />
            </div>

            <div className="f">
              <label>Mobile</label>
              <input
                type="tel"
                value={form.mobile}
                onChange={setField('mobile')}
                placeholder="Enter mobile number"
                autoComplete="tel"
              />
            </div>

            {!isEditing && (
              <div
                className="f"
                style={{ gridColumn: '1 / -1' }}
              >
                <label>Password</label>
                <input
                  type="password"
                  value={form.password}
                  onChange={setField('password')}
                  placeholder="Enter password (minimum 8 characters)"
                  autoComplete="new-password"
                  minLength={8}
                  required
                />
                <p className="sm mu">
                  Password must contain at least 8 characters.
                </p>
              </div>
            )}
          </div>

          {isEditing && (
            <p className="sm mu" style={{ marginTop: 16 }}>
              Editing contact details will not change the user's
              password, assigned branch, or role.
            </p>
          )}

          <div
            style={{
              display: 'flex',
              justifyContent: 'flex-end',
              gap: 10,
              flexWrap: 'wrap',
              marginTop: 24,
              paddingTop: 18,
              borderTop: '1px solid #d8e3f5',
            }}
          >
            <button
              type="button"
              className="btn s"
              onClick={() => navigate('/users')}
              disabled={saving}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="btn p"
              disabled={saving}
            >
              {saving
                ? 'Saving...'
                : isEditing
                  ? 'Save Changes'
                  : 'Create User'}
            </button>
          </div>
        </form>
      </Card>
    </div>
  </>
)

}
