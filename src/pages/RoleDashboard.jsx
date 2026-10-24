
import { useNavigate } from 'react-router-dom'
import PageHeader from '../components/common/PageHeader'
import Card from '../components/common/Card'
import { getUser } from '../api/client'

export default function RoleDashboard() {
  const navigate = useNavigate()
  const user = getUser()

  return (
    <>
      <PageHeader
        breadcrumb="Main"
        title={`${user?.role || 'User'} Dashboard`}
        subtitle={`Welcome, ${user?.name || 'User'}`}
      />

      <Card>
        <div style={{ padding: 20 }}>
          <h3>Welcome, {user?.name || 'User'}!</h3>

          <p className="mu">
            Role: {user?.role || 'Not assigned'}
          </p>

          <p>
            Your dashboard is being prepared. Your role-specific
            features will appear here.
          </p>
        </div>
      </Card>
    </>
  )
}
