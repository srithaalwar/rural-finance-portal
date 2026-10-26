import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import PageHeader from '../components/common/PageHeader'
import { useApp } from '../context/appContext'

/* Eye icons (inline SVG, no extra package needed) */
const EyeIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round"
    strokeLinejoin="round" aria-hidden="true">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
)

const EyeOffIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round"
    strokeLinejoin="round" aria-hidden="true">
    <path d="M17.94 17.94A10.94 10.94 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
    <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
    <path d="M14.12 14.12a3 3 0 1 1-4.24-4.24" />
    <line x1="1" y1="1" x2="23" y2="23" />
  </svg>
)

/* Password input with an eye button inside the field */
function PasswordInput({
  value,
  onChange,
  placeholder,
  autoComplete,
  show,
  onToggle,
  disabled,
  hasError,
  required,
}) {
  return (
    <div style={{ position: 'relative' }}>
      <input
        type={show ? 'text' : 'password'}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        autoComplete={autoComplete}
        minLength={8}
        required={required}
        disabled={disabled}
        style={{
          width: '100%',
          paddingRight: 42,
          boxSizing: 'border-box',
          borderColor: hasError ? '#d93025' : undefined,
        }}
      />
      <button
        type="button"
        onClick={onToggle}
        aria-label={show ? 'Hide password' : 'Show password'}
        title={show ? 'Hide password' : 'Show password'}
        style={{
          position: 'absolute',
          top: '50%',
          right: 10,
          transform: 'translateY(-50%)',
          background: 'none',
          border: 'none',
          padding: 4,
          cursor: 'pointer',
          color: '#6b7a90',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        {show ? <EyeOffIcon /> : <EyeIcon />}
      </button>
    </div>
  )
}

export default function UserForm() {
  const navigate = useNavigate()
  const { id } = useParams()

  const { users = [], addUser, updateUser } = useApp()

  const isEditing = Boolean(id)

  const user = isEditing
    ? users.find((u) => String(u.id) === String(id))
    : null

  const [form, setForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    mobile: user?.mobile || '',
    password: '',
    confirmPassword: '',
  })

  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [saving, setSaving] = useState(false)

  const setField = (field) => (event) => {
    setForm((prev) => ({ ...prev, [field]: event.target.value }))
  }

  const passwordsMismatch =
    form.confirmPassword.length > 0 &&
    form.password !== form.confirmPassword

  // In edit mode the password changes only if something is typed
  const changingPassword = !isEditing || form.password.length > 0

  const submit = async (event) => {
    event.preventDefault()

    if (!form.name.trim() || !form.email.trim()) {
      alert('Please enter the name and email')
      return
    }

    if (changingPassword) {
      if (!form.password) {
        alert('Please enter a password')
        return
      }
      if (form.password.length < 8) {
        alert('Password must contain at least 8 characters')
        return
      }
      if (!form.confirmPassword) {
        alert('Please confirm the password')
        return
      }
      if (form.password !== form.confirmPassword) {
        alert('Password and confirm password do not match')
        return
      }
    }

    if (saving) return
    setSaving(true)

    try {
      const payload = {
        name: form.name.trim(),
        email: form.email.trim(),
        mobile: form.mobile.trim(),
      }

      if (changingPassword) {
        payload.password = form.password
        payload.confirmPassword = form.confirmPassword
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
        <button className="btn p" onClick={() => navigate('/users')}>
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
            ? 'Update the user details'
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

      {/* Full white page: no card, no popup-style box */}
      <div
        style={{
          background: '#fff',
          width: '100%',
          minHeight: 'calc(100vh - 150px)',
          padding: '32px 36px',
          boxSizing: 'border-box',
          borderTop: '1px solid #e3eaf6',
        }}
      >
        <form onSubmit={submit}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: 22,
              maxWidth: 1000,
            }}
          >
            <div className="f" style={{ gridColumn: '1 / -1' }}>
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

            <div className="f">
              <label>{isEditing ? 'New Password' : 'Password'}</label>
              <PasswordInput
                value={form.password}
                onChange={setField('password')}
                placeholder={
                  isEditing
                    ? 'Leave blank to keep current'
                    : 'Minimum 8 characters'
                }
                autoComplete="new-password"
                show={showPassword}
                onToggle={() => setShowPassword((s) => !s)}
                disabled={saving}
                required={!isEditing}
              />
            </div>

            <div className="f">
              <label>
                {isEditing ? 'Confirm New Password' : 'Confirm Password'}
              </label>
              <PasswordInput
                value={form.confirmPassword}
                onChange={setField('confirmPassword')}
                placeholder={
                  isEditing ? 'Re-enter new password' : 'Re-enter password'
                }
                autoComplete="new-password"
                show={showConfirm}
                onToggle={() => setShowConfirm((s) => !s)}
                disabled={saving}
                hasError={passwordsMismatch}
                required={changingPassword}
              />
              {passwordsMismatch && (
                <p
                  className="sm"
                  role="alert"
                  style={{ color: '#d93025', marginTop: 6 }}
                >
                  Password and confirm password do not match.
                </p>
              )}
            </div>

            <p
              className="sm mu"
              style={{ gridColumn: '1 / -1', margin: 0 }}
            >
              {isEditing
                ? 'Stored passwords are encrypted and cannot be displayed. Leave both fields blank to keep the current password, or enter a new one (minimum 8 characters).'
                : 'Password must contain at least 8 characters.'}
            </p>
          </div>

          {isEditing && (
            <p className="sm mu" style={{ marginTop: 16 }}>
              Editing will not change the user's assigned branch or role.
            </p>
          )}

          <div
            style={{
              display: 'flex',
              justifyContent: 'flex-start',
              gap: 10,
              flexWrap: 'wrap',
              marginTop: 28,
              paddingTop: 20,
              borderTop: '1px solid #e3eaf6',
              maxWidth: 1000,
            }}
          >
            <button
              type="submit"
              className="btn p"
              disabled={saving || passwordsMismatch}
            >
              {saving
                ? 'Saving...'
                : isEditing
                  ? 'Save Changes'
                  : 'Create User'}
            </button>

            <button
              type="button"
              className="btn s"
              onClick={() => navigate('/users')}
              disabled={saving}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </>
  )
}