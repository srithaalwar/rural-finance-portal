import { Routes, Route, Navigate } from 'react-router-dom'
import AppLayout from '../components/layout/AppLayout'
import Login from '../pages/Login'
import Dashboard from '../pages/Dashboard'
import HeadOffice from '../pages/HeadOffice'
import Branches from '../pages/Branches'
import Admins from '../pages/Admins'
import Staff from '../pages/Staff'
import RolesPermissions from '../pages/RolesPermissions'

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />
      <Route element={<AppLayout />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/head-office" element={<HeadOffice />} />
        <Route path="/branches" element={<Branches />} />
        <Route path="/admins" element={<Admins />} />
        <Route path="/staff" element={<Staff />} />
        <Route path="/roles" element={<RolesPermissions />} />
      </Route>
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  )
}