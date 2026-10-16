import { Link } from 'react-router-dom'
import PageHeader from '../components/common/PageHeader'
import Card from '../components/common/Card'
import KpiCard from '../components/common/KpiCard'
import DataTable from '../components/common/DataTable'
import Badge from '../components/common/Badge'
import { useApp } from '../context/appContext'
import { ROLES, todayLabel } from '../data/mockData'

const viewAll = (to) => (
  <Link className="b" style={{ color: 'var(--pr)' }} to={to}>View all →</Link>
)

export default function Dashboard() {
  const { users, branches } = useApp()
  const active = users.filter((u) => u.status === 'Active').length
  const admins = users.filter((u) => u.role === 'Admin').length

  const branchRows = branches.map((b) => {
    const mgr = users.find((u) => u.role === 'Branch Manager' && u.location === b.name)
    return [<b>{b.name}</b>, mgr ? mgr.name : '—', users.filter((u) => u.location === b.name).length]
  })

  const recentRows = users.slice(-4).reverse().map((u) => [
    <b>{u.name}</b>, <Badge>{u.role}</Badge>, u.location, <Badge>{u.status}</Badge>,
  ])

  return (
    <>
      <PageHeader
        breadcrumb="Main"
        title="Dashboard"
        subtitle={`Organization overview · ${todayLabel()}`}
        actions={
          <>
            <Link className="btn" to="/branches">+ Add Branch</Link>
            <Link className="btn" to="/admins">+ Add Admin</Link>
            <Link className="btn p" to="/staff">+ Add Staff</Link>
          </>
        }
      />

      <div className="g k4 m">
        <KpiCard label="Head Office" value="1" note="Fixed · cannot add more" />
        <KpiCard label="Branches" value={branches.length} note="All active" />
        <KpiCard label="Admins" value={admins} note="Head office" />
        <KpiCard label="Total Staff" value={users.length} note={`${active} active`} />
      </div>

      <div className="g k2 m">
        <Card title="Staff by role">
          {ROLES.map((r) => {
            const n = users.filter((u) => u.role === r).length
            return (
              <div key={r} style={{ margin: '10px 0' }}>
                <div className="sm" style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>{r}</span><b>{n}</b>
                </div>
                <div className="bar"><i style={{ width: `${Math.min(100, (n / users.length) * 200)}%` }} /></div>
              </div>
            )
          })}
        </Card>

        <Card title="Branches" action={viewAll('/branches')} flush>
          <DataTable columns={['Branch', 'Manager', 'Staff']} rows={branchRows} />
        </Card>
      </div>

      <Card title="Recent additions" action={viewAll('/staff')} flush>
        <DataTable columns={['Name', 'Role', 'Location', 'Status']} rows={recentRows} />
      </Card>
    </>
  )
}