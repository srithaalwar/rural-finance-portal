import { useState, useEffect } from 'react'
import PageHeader from '../components/common/PageHeader'
import Card from '../components/common/Card'
import Badge from '../components/common/Badge'
import { api } from '../api/client'

export default function HeadOffice() {
  const [data, setData] = useState(null)

  useEffect(() => {
    api('/head-office').then(setData).catch(() => setData({ office: null, team: [] }))
  }, [])

  if (!data) return <p>Loading…</p>

  const { office, team } = data
  const details = office && {
    Name: office.name,
    Code: office.code,
    Address: office.address,
    District: office.district,
    State: office.state,
    'Opening date': office.openedOn,
    Status: <Badge>{office.status}</Badge>,
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
            {details && Object.entries(details).map(([k, v]) => (
              <div key={k} style={{ display: 'contents' }}>
                <dt>{k}</dt>
                <dd>{v}</dd>
              </div>
            ))}
          </dl>
        </Card>

        <Card title="Head office team">
          {team.map((u) => (
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