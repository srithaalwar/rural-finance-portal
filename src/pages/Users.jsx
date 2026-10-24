
import { useNavigate } from 'react-router-dom'
import PageHeader from '../components/common/PageHeader'
import UserTable from '../components/common/UserTable'
import { useApp } from '../context/appContext'

export default function Users() {
  const navigate = useNavigate()
  const { users = [] } = useApp()

  return (
    <>
      <PageHeader
        breadcrumb="Administration"
        title="Users"
        subtitle="Manage administrators, managers, clerks, cashiers and sales officers"
        actions={
          <button
            className="btn p"
            onClick={() => navigate('/users/new')}
          >
            + Add User
          </button>
        }
      />

      <UserTable
        users={users}
        placeholder="Search users…"
        onEdit={(user) =>
          navigate(`/users/edit/${user.id}`)
        }
      />
    </>
  )
}
