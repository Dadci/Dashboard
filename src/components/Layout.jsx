// src/components/Layout.jsx
import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'

const Layout = () => {
  return (
    <div className="flex flex-row items-stretch justify-start flex-nowrap h-screen bg-slate-200 gap-4">
      <Sidebar />
      <main className="flex bg-slate-100 h-auto grow my-2 mr-2 border border-slate-300 rounded-xl overflow-hidden">
        <Outlet />
      </main>
    </div>
  )
}

export default Layout