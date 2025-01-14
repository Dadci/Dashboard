// src/pages/Budget.jsx
import { useState, useMemo } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { addBudget, deleteBudget, editBudget } from '../store/budgetSlice'
import BudgetCard from "../components/BudgetCard"
import {
    FiCoffee, FiCamera, FiShoppingBag, FiTruck, FiHome, FiBook,
    FiMusic, FiMonitor, FiDollarSign, FiGrid, FiPackage,
    FiBriefcase, FiSettings, FiShield, FiLifeBuoy, FiBell,
    FiTarget, FiList, FiFolder, FiStar, FiMenu, FiTrash2, FiChevronUp, FiChevronDown
} from 'react-icons/fi'
import EmptyState from '../components/EmptyState'
import { notify } from '../utils/toast'

const Budget = () => {
    const dispatch = useDispatch()
    const budgets = useSelector(state => state.budgets.items)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [newBudget, setNewBudget] = useState({
        name: '',
        amount: '',
        spent: 0,
        transactions: [],
        emoji: 'FiCoffee'
    })
    const [viewLayout, setViewLayout] = useState('grid')
    const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'asc' })

    const icons = {
        // Essential Categories
        FiHome: <FiHome size={24} />,           // Housing/Rent
        FiTruck: <FiTruck size={24} />,         // Transportation
        FiShield: <FiShield size={24} />,       // Insurance
        FiLifeBuoy: <FiLifeBuoy size={24} />,   // Healthcare
        FiBriefcase: <FiBriefcase size={24} />, // Work

        // Lifestyle Categories
        FiCoffee: <FiCoffee size={24} />,       // Dining/Coffee
        FiMusic: <FiMusic size={24} />,         // Entertainment
        FiShoppingBag: <FiShoppingBag size={24} />, // Shopping
        FiStar: <FiStar size={24} />,           // Personal
        FiBell: <FiBell size={24} />,           // Subscriptions

        // Tech Categories
        FiSettings: <FiSettings size={24} />,    // Electronics
        FiMonitor: <FiMonitor size={24} />,     // Devices
        FiGrid: <FiGrid size={24} />,           // Services

        // Other Categories
        FiBook: <FiBook size={24} />,           // Education
        FiCamera: <FiCamera size={24} />,       // Photography
        FiTarget: <FiTarget size={24} />,       // Goals
        FiDollarSign: <FiDollarSign size={24} />, // Investments
        FiList: <FiList size={24} />,           // Bills
        FiPackage: <FiPackage size={24} />,     // Shopping
        FiFolder: <FiFolder size={24} />        // Miscellaneous
    }

    const iconCategories = {
        Essential: {
            FiHome: "Housing/Rent",
            FiTruck: "Transportation",
            FiShield: "Insurance",
            FiLifeBuoy: "Healthcare",
            FiBriefcase: "Work"
        },
        Lifestyle: {
            FiCoffee: "Dining/Coffee",
            FiMusic: "Entertainment",
            FiShoppingBag: "Shopping",
            FiStar: "Personal",
            FiBell: "Subscriptions"
        },
        Tech: {
            FiSettings: "Electronics",
            FiMonitor: "Devices",
            FiGrid: "Services"
        },
        Other: {
            FiBook: "Education",
            FiCamera: "Photography",
            FiTarget: "Goals",
            FiDollarSign: "Investments",
            FiList: "Bills",
            FiPackage: "Shopping",
            FiFolder: "Miscellaneous"
        }
    }

    const handleAddBudget = () => {
        if (!newBudget.name || !newBudget.amount) return

        dispatch(addBudget({
            ...newBudget,
            amount: Number(newBudget.amount),
            spent: 0,
            transactions: []
        }))
        setIsModalOpen(false)
        setNewBudget({
            name: '',
            amount: '',
            spent: 0,
            transactions: [],
            emoji: 'FiCoffee'
        })
        notify.success('Budget created successfully')
    }

    const LayoutToggle = ({ layout, setLayout }) => (
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg">
            <button
                onClick={() => setLayout('grid')}
                className={`p-2 rounded ${layout === 'grid' ? 'bg-white shadow' : 'hover:bg-white/50'}`}
                title="Grid view"
            >
                <FiGrid size={16} />
            </button>
            <button
                onClick={() => setLayout('list')}
                className={`p-2 rounded ${layout === 'list' ? 'bg-white shadow' : 'hover:bg-white/50'}`}
                title="List view"
            >
                <FiList size={16} />
            </button>
            <button
                onClick={() => setLayout('table')}
                className={`p-2 rounded ${layout === 'table' ? 'bg-white shadow' : 'hover:bg-white/50'}`}
                title="Table view"
            >
                <FiMenu size={16} />
            </button>
        </div>
    )

    const sortedBudgets = useMemo(() => {
        return [...budgets].sort((a, b) => {
            switch (sortConfig.key) {
                case 'name':
                    return sortConfig.direction === 'asc' 
                        ? a.name.localeCompare(b.name)
                        : b.name.localeCompare(a.name)
                case 'amount':
                    return sortConfig.direction === 'asc'
                        ? a.amount - b.amount
                        : b.amount - a.amount
                case 'progress':
                    const progressA = (a.spent / a.amount) * 100
                    const progressB = (b.spent / b.amount) * 100
                    return sortConfig.direction === 'asc'
                        ? progressA - progressB
                        : progressB - progressA
                default:
                    return 0
            }
        })
    }, [budgets, sortConfig])

    const ListView = ({ budgets, onEdit, onDelete }) => (
        <div className="space-y-2">
            {budgets.map(budget => (
                <div
                    key={budget.id}
                    className="bg-white rounded-xl border border-slate-200 p-4 hover:shadow-md transition-all cursor-pointer group relative"
                    onClick={() => navigate(`/budget/${budget.id}`)}
                >
                    <div className="flex items-start gap-4">
                        <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                                <div className="bg-slate-100 p-2 rounded">
                                    {icons[budget.emoji]}
                                </div>
                                <span className="font-medium text-lg">{budget.name}</span>
                                {budget.spent >= budget.amount && (
                                    <span className="px-2 py-0.5 text-xs rounded-full bg-red-100 text-red-700">
                                        Exceeded
                                    </span>
                                )}
                            </div>
                            <p className="text-sm text-slate-500">
                                {budget.transactions?.length || 0} transactions
                            </p>
                        </div>

                        <div className="flex flex-col items-end gap-2">
                            <div className="text-right">
                                <div className="text-xs text-slate-500">Budget</div>
                                <div className="font-bold text-lg">€{budget.amount}</div>
                            </div>
                            <div className="w-32">
                                <div className="flex justify-between text-sm mb-1">
                                    <span>€{budget.spent}</span>
                                    <span className="text-slate-500">
                                        {Math.round((budget.spent/budget.amount) * 100)}%
                                    </span>
                                </div>
                                <div className="w-full bg-slate-100 rounded-full h-2">
                                    <div
                                        className={`${budget.spent/budget.amount >= 0.9 ? 'bg-red-500' : 'bg-blue-500'} h-2 rounded-full transition-all`}
                                        style={{ width: `${(budget.spent/budget.amount) * 100}%` }}
                                    />
                                </div>
                            </div>

                            <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onDelete(budget.id);
                                    }}
                                    className="p-2 hover:bg-red-50 rounded-full text-red-500"
                                >
                                    <FiTrash2 />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    )

    const TableView = ({ budgets, onEdit, onDelete }) => {
        const handleSort = (key) => {
            setSortConfig(prev => ({
                key,
                direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
            }))
        }

        const totalAmount = budgets.reduce((sum, budget) => sum + budget.amount, 0)
        const totalSpent = budgets.reduce((sum, budget) => sum + budget.spent, 0)
        const averageProgress = Math.round(budgets.reduce((sum, budget) => 
            sum + ((budget.spent/budget.amount) * 100), 0) / budgets.length)

        return (
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                <table className="w-full">
                    <thead className="bg-slate-50">
                        <tr>
                            <th className="text-left p-4 text-sm font-medium text-slate-500">
                                <button
                                    className="flex items-center gap-1 hover:text-slate-700"
                                    onClick={() => handleSort('name')}
                                >
                                    Name
                                    {sortConfig.key === 'name' && (
                                        sortConfig.direction === 'asc' ? <FiChevronUp /> : <FiChevronDown />
                                    )}
                                </button>
                            </th>
                            <th className="text-left p-4 text-sm font-medium text-slate-500">Category</th>
                            <th className="text-left p-4 text-sm font-medium text-slate-500">
                                <button
                                    className="flex items-center gap-1 hover:text-slate-700"
                                    onClick={() => handleSort('amount')}
                                >
                                    Budget
                                    {sortConfig.key === 'amount' && (
                                        sortConfig.direction === 'asc' ? <FiChevronUp /> : <FiChevronDown />
                                    )}
                                </button>
                            </th>
                            <th className="text-left p-4 text-sm font-medium text-slate-500">Spent</th>
                            <th className="text-left p-4 text-sm font-medium text-slate-500">
                                <button
                                    className="flex items-center gap-1 hover:text-slate-700"
                                    onClick={() => handleSort('progress')}
                                >
                                    Progress
                                    {sortConfig.key === 'progress' && (
                                        sortConfig.direction === 'asc' ? <FiChevronUp /> : <FiChevronDown />
                                    )}
                                </button>
                            </th>
                            <th className="text-right p-4 text-sm font-medium text-slate-500">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {budgets.map(budget => (
                            <tr key={budget.id} className="border-b border-slate-100 hover:bg-slate-50">
                                <td className="p-4">{budget.name}</td>
                                <td className="p-4">
                                    <div className="flex items-center gap-2">
                                        <div className="bg-slate-100 p-2 rounded">
                                            {icons[budget.emoji]}
                                        </div>
                                        <span>{iconCategories[Object.keys(iconCategories).find(cat =>
                                            Object.keys(iconCategories[cat]).includes(budget.emoji)
                                        )][budget.emoji]}</span>
                                    </div>
                                </td>
                                <td className="p-4">€{budget.amount}</td>
                                <td className="p-4">€{budget.spent}</td>
                                <td className="p-4">
                                    <div className="flex items-center gap-2">
                                        <div className="w-24 bg-slate-200 rounded-full h-2">
                                            <div
                                                className={`${budget.spent / budget.amount >= 0.9 ? 'bg-red-500' : 'bg-blue-500'} h-2 rounded-full`}
                                                style={{ width: `${(budget.spent / budget.amount) * 100}%` }}
                                            />
                                        </div>
                                        <span className="text-sm">{Math.round((budget.spent / budget.amount) * 100)}%</span>
                                    </div>
                                </td>
                                <td className="p-4 text-right">
                                    <button
                                        onClick={() => dispatch(deleteBudget(budget.id))}
                                        className="text-red-500 hover:text-red-700"
                                    >
                                        <FiTrash2 />
                                    </button>
                                </td>
                            </tr>
                        ))}
                        <tr className="bg-slate-50 font-medium">
                            <td className="p-4">Total ({budgets.length})</td>
                            <td className="p-4"></td>
                            <td className="p-4">€{totalAmount}</td>
                            <td className="p-4">€{totalSpent}</td>
                            <td className="p-4">{averageProgress}% avg</td>
                            <td className="p-4"></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        )
    }

    return (
        <div className="w-full">
            <div className="border-b border-b-slate-300 p-6">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl text-slate-700 font-semibold">Budget</h2>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="bg-slate-900 text-sm text-slate-100 px-4 py-2 rounded-lg hover:bg-slate-800"
                    >
                        + Add New Budget
                    </button>
                </div>
                {budgets.length > 0 && (
                    <div className="flex justify-end">
                        <LayoutToggle layout={viewLayout} setLayout={setViewLayout} />
                    </div>
                )}
            </div>

            <div className="p-6">
                {budgets.length === 0 ? (
                    <EmptyState
                        icon={FiDollarSign}
                        title="No budgets created"
                        description="Start by creating a budget to track your expenses in different categories."
                        actionLabel="Create Your First Budget"
                        onAction={() => setIsModalOpen(true)}
                    />
                ) : (
                    <>
                        {viewLayout === 'grid' && (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {sortedBudgets.map(budget => (
                                    <BudgetCard
                                        key={budget.id}
                                        {...budget}
                                        transactions={budget.transactions?.length || 0}
                                        onDelete={() => dispatch(deleteBudget(budget.id))}
                                        onEdit={(updatedBudget) => dispatch(editBudget(updatedBudget))}
                                    />
                                ))}
                            </div>
                        )}

                        {viewLayout === 'list' && (
                            <ListView
                                budgets={sortedBudgets}
                                onEdit={(updatedBudget) => dispatch(editBudget(updatedBudget))}
                                onDelete={(id) => dispatch(deleteBudget(id))}
                            />
                        )}

                        {viewLayout === 'table' && (
                            <TableView
                                budgets={sortedBudgets}
                                onEdit={(updatedBudget) => dispatch(editBudget(updatedBudget))}
                                onDelete={(id) => dispatch(deleteBudget(id))}
                            />
                        )}
                    </>
                )}
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg w-96">
                        <h3 className="text-lg font-semibold mb-6">Add New Budget</h3>

                        <div className="space-y-4">
                            {/* Icon Selection */}
                            <div className="flex flex-col space-y-2">
                                <label className="text-sm font-medium text-slate-700">
                                    Category Icon
                                </label>
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="bg-slate-100 p-3 rounded-lg">
                                        {icons[newBudget.emoji]}
                                    </div>
                                    <select
                                        className="flex-1 p-2 border rounded-lg text-sm"
                                        value={newBudget.emoji}
                                        onChange={e => setNewBudget({ ...newBudget, emoji: e.target.value })}
                                    >
                                        {Object.entries(iconCategories).map(([category, icons]) => (
                                            <optgroup label={category} key={category}>
                                                {Object.entries(icons).map(([key, label]) => (
                                                    <option value={key} key={key}>
                                                        {label}
                                                    </option>
                                                ))}
                                            </optgroup>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {/* Budget Name */}
                            <div className="flex flex-col space-y-2">
                                <label className="text-sm font-medium text-slate-700">
                                    Budget Name
                                </label>
                                <input
                                    type="text"
                                    placeholder="Enter budget name"
                                    className="w-full p-2 border text-sm rounded-lg"
                                    value={newBudget.name}
                                    onChange={e => setNewBudget({ ...newBudget, name: e.target.value })}
                                />
                            </div>

                            {/* Amount */}
                            <div className="flex flex-col space-y-2">
                                <label className="text-sm font-medium text-slate-700">
                                    Amount
                                </label>
                                <input
                                    type="number"
                                    placeholder="Enter amount"
                                    className="w-full text-sm p-2 border rounded-lg"
                                    value={newBudget.amount}
                                    onChange={e => setNewBudget({ ...newBudget, amount: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="flex gap-2 mt-6">
                            <button
                                onClick={handleAddBudget}
                                className="flex-1 bg-slate-900 text-white text-sm px-4 py-2 rounded-lg hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed"
                                disabled={!newBudget.name || !newBudget.amount}
                            >
                                Add Budget
                            </button>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="flex-1 border text-sm border-slate-300 px-4 py-2 rounded-lg hover:bg-slate-50"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Budget