import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import Header from './Header'

export default function AppLayout() {
  const [open, setOpen] = useState(false)
  return (
    <div className="app">
      <Sidebar open={open} onNavigate={() => setOpen(false)} />
      <main className="main">
        <Header onMenu={() => setOpen((o) => !o)} />
        <div className="page">
          <Outlet />
        </div>
      </main>
    </div>
  )
}