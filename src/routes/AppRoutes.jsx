import { Routes, Route, Navigate } from 'react-router-dom'
import ProtectedRoute from './ProtectedRoute'
import AppLayout from '../components/layout/AppLayout'
import Login from '../pages/Login'
import Dashboard from '../pages/Dashboard'
import HeadOffice from '../pages/HeadOffice'
import Branches from '../pages/Branches'
import RolesPermissions from '../pages/RolesPermissions'
import Users from '../pages/Users';
import RoleForm from '../pages/RoleForm';
import UserForm from '../pages/UserForm';
import RoleDashboard from '../pages/RoleDashboard';
import BranchForm from '../pages/BranchForm'
import BranchUsers from '../pages/BranchUsers'

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />
      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/role-dashboard" element={<RoleDashboard />} />
          <Route path="/head-office" element={<HeadOffice />} />
          <Route path="/branches" element={<Branches />} />
          <Route path="/users" element={<Users />} />
          <Route
            path="/users/new"
            element={<UserForm />}
          />

          <Route
            path="/users/edit/:id"
            element={<UserForm />}
          />
          <Route path="/roles" element={<RolesPermissions />} />
          <Route
            path="/roles/add"
            element={<RoleForm />}
          />

          <Route
            path="/roles/edit/:id"
            element={<RoleForm />}
          />

          <Route path="/branchform" element={<BranchForm />} />
          <Route path="/manageusers/:id" element={<BranchUsers />} />
        </Route>
      </Route>
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  )
}