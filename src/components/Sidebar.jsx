// src/components/Sidebar.jsx
import { NavLink } from 'react-router-dom'
import { FiGrid, FiDollarSign, FiRepeat } from 'react-icons/fi'
import Logo from '../assets/logo.svg'

const Sidebar = () => {
    const menuItems = [
        { name: 'Overview', icon: <FiGrid size={20} />, path: '/' },
        { name: 'Budget', icon: <FiDollarSign size={20} />, path: '/budget' },
        { name: 'Transactions', icon: <FiRepeat size={20} />, path: '/transactions' },
    ]

    return (
        <div className='flex flex-col h-auto w-64 px-4 py-6'>
            <div className='flex flex-row items-center gap-2 border-b border-b-slate-200 pb-4'>
                <img src={Logo} alt='logo' className='h-12 w-12' />
                <h1 className='text-2xl font-semibold text-slate-800'>Budgetify</h1>
            </div>

            <nav className='flex flex-col gap-2 mt-6'>
                {menuItems.map((item) => (
                    <NavLink
                        key={item.name}
                        to={item.path}
                        end={item.path === '/'}
                        className={({ isActive }) =>
                            `flex items-center gap-3 text-sm p-3 rounded-lg cursor-pointer transition-all duration-200 ${
                                isActive
                                    ? 'bg-slate-900 text-slate-100'
                                    : 'text-slate-700 hover:bg-slate-300'
                            }`
                        }
                    >
                        {item.icon}
                        <span className='font-medium'>{item.name}</span>
                    </NavLink>
                ))}
            </nav>
        </div>
    )
}

export default Sidebar