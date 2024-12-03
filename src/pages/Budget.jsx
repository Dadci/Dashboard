// src/pages/Budget.jsx
import { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { addBudget, deleteBudget, editBudget } from '../store/budgetSlice'
import BudgetCard from "../components/BudgetCard"
import { 
    FiCoffee, FiCamera, FiShoppingBag, FiTruck, FiHome, FiBook, 
    FiMusic, FiMonitor, FiDollarSign, FiGrid, FiPackage, 
    FiBriefcase, FiSettings, FiShield, FiLifeBuoy, FiBell,
    FiTarget, FiList, FiFolder, FiStar
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

    return (
        <div className="w-full">
            <div className="border-b border-b-slate-300 p-6 flex justify-between items-center">
                <h2 className="text-xl text-slate-700 font-semibold">Budget</h2>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-slate-900 text-sm text-slate-100 px-4 py-2 rounded-lg hover:bg-slate-800"
                >
                    + Add New Budget
                </button>
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
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {budgets.map(budget => (
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