import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import PageHeader from '../components/common/PageHeader'
import { useApp } from '../context/appContext'
import { HQ } from '../data/mockData'

export default function BranchForm() {
  const navigate = useNavigate()
  const { addBranch } = useApp()

  const [form, setForm] = useState({ name: '', area: '', district: '' })
  const [saving, setSaving] = useState(false)

  const setField = (key) => (e) =>
    setForm((prev) => ({ ...prev, [key]: e.target.value }))

  const submit = async (e) => {
    e.preventDefault()

    if (!form.name.trim()) {
      alert('Please enter a branch name')
      return
    }

    if (saving) return
    setSaving(true)

    try {
      const ok = await addBranch({
        name: form.name.trim(),
        area: form.area.trim(),
        district: form.district.trim(),
      })

      if (ok) navigate('/branches')
    } finally {
      setSaving(false)
    }
  }

  return (
    <>
      <PageHeader
        breadcrumb="Organization / Branches"
        title="Add Branch"
        subtitle="Create a new branch under Head Office"
        actions={
          <button
            type="button"
            className="btn s"
            onClick={() => navigate('/branches')}
          >
            ← Back to Branches
          </button>
        }
      />

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
              <label>Branch name</label>
              <input
                value={form.name}
                onChange={setField('name')}
                placeholder="e.g. Nandigama Branch"
                required
              />
            </div>

            <div className="f">
              <label>Village / area</label>
              <input
                value={form.area}
                onChange={setField('area')}
                placeholder="Enter village or area"
              />
            </div>

            <div className="f">
              <label>District</label>
              <input
                value={form.district}
                onChange={setField('district')}
                placeholder="Enter district"
              />
            </div>

            <div className="f" style={{ gridColumn: '1 / -1' }}>
              <label>Parent office</label>
              <select disabled>
                <option>{HQ} (only one)</option>
              </select>
            </div>
          </div>

          <div
            style={{
              display: 'flex',
              gap: 10,
              marginTop: 28,
              paddingTop: 20,
              borderTop: '1px solid #e3eaf6',
              maxWidth: 1000,
            }}
          >
            <button type="submit" className="btn p" disabled={saving}>
              {saving ? 'Saving...' : 'Create Branch'}
            </button>

            <button
              type="button"
              className="btn s"
              onClick={() => navigate('/branches')}
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