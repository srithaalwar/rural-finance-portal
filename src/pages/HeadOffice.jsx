import PageHeader from '../components/common/PageHeader'
import Card from '../components/common/Card'
import Badge from '../components/common/Badge'
import { useApp } from '../context/appContext'
import { HQ } from '../data/mockData'

export default function HeadOffice() {
  const { users } = useApp()
  const details = {
    Name: HQ,
    Code: 'HO-001',
    Address: 'Plot 12, Banjara Hills, Hyderabad',
    District: 'Hyderabad',
    State: 'Telangana',
    'Opening date': '01 Jan 2020',
    Status: <Badge>Active</Badge>,
  }

  return (
    <>
      <PageHeader breadcrumb="Organization" title="Head Office" subtitle="Only one head office exists in the organization" />
      <div className="al in">
        🔒 There is only <b>one</b>&nbsp;Head Office. It cannot be added or deleted — only edited.
      </div>

      <div className="g k2">
        <Card title="Head Office details" action={<button className="btn s">Edit</button>}>
          <dl className="kv">
            {Object.entries(details).map(([k, v]) => (
              <div key={k} style={{ display: 'contents' }}>
                <dt>{k}</dt>
                <dd>{v}</dd>
              </div>
            ))}
          </dl>
        </Card>

        <Card title="Head office team">
          {users.filter((u) => u.location === HQ).map((u) => (
            <div className="row" key={u.id}>
              <span>
                <b>{u.name}</b>
                <div className="sm mu">{u.email}</div>
              </span>
              <Badge>{u.role}</Badge>
            </div>
          ))}
        </Card>
      </div>
    </>
  )
}