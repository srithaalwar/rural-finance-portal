import { Navigate, Outlet } from 'react-router-dom'
import { getToken } from '../api/client'
import AppProvider from '../context/AppProvider'

export default function ProtectedRoute() {
  if (!getToken()) return <Navigate to="/login" replace />
  return (
    <AppProvider>
      <Outlet />
    </AppProvider>
  )
}