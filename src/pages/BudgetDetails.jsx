// src/pages/BudgetDetails.jsx
import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { addTransaction, deleteTransaction, deleteBudget } from '../store/budgetSlice'
import { FiTrash2 } from 'react-icons/fi'
import {
    FiCoffee, FiCamera, FiShoppingBag, FiTruck, FiHome, FiBook,
    FiMusic, FiMonitor, FiDollarSign, FiGrid, FiPackage,
    FiBriefcase, FiSettings, FiShield, FiLifeBuoy, FiBell,
    FiTarget, FiList, FiFolder, FiStar
} from 'react-icons/fi'
import { notify } from '../utils/toast'

const BudgetDetails = () => {
    const { id } = useParams()
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const budget = useSelector(state =>
        state.budgets.items.find(item => item.id === Number(id))
    )

    const icons = {
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
        FiFolder: <FiFolder size={24} />


    }

    const [newTransaction, setNewTransaction] = useState({
        description: '',
        amount: ''
    })

    const handleAddTransaction = () => {
        if (!newTransaction.amount || !newTransaction.description) return

        dispatch(addTransaction({
            budgetId: Number(id),
            amount: Number(newTransaction.amount),
            description: newTransaction.description
        }))
        setNewTransaction({ description: '', amount: '' })
        notify.success('Transaction added successfully')
    }

    const handleDeleteBudget = () => {
        if (window.confirm('Are you sure you want to delete this budget?')) {
            dispatch(deleteBudget(Number(id)))
            navigate('/budget')
            notify.success('Budget deleted successfully')
        }
    }

    if (!budget) return (
        <div className="w-full p-6 text-center">
            <h2 className="text-xl text-slate-700">Budget not found</h2>
        </div>
    )

    return (
        <div className="w-full">
            <div className="border-b border-b-slate-300 p-6 flex justify-between items-center">
                <h2 className="text-xl text-slate-700 font-semibold">Budget Details</h2>
                <button
                    onClick={() => navigate('/budget')}
                    className="text-sm text-slate-600 hover:text-slate-800"
                >
                    Back to Budgets
                </button>
            </div>

            <div className="p-6">
                <div className="flex md:flex-row flex-col gap-6">
                    {/* Budget Info */}
                    <div className="md:w-1/3">
                        <div className="bg-white rounded-xl p-6 border border-slate-300">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="bg-slate-100/20 text-2xl h-12 w-12 rounded-full flex justify-center items-center text-slate-600">
                                    {icons[budget.emoji]}
                                </div>
                                <h2 className="text-xl font-bold text-slate-800">{budget.name}</h2>
                            </div>
                            <div className="flex justify-between mb-2 text-slate-600">
                                <span>Budget: {budget.amount}€</span>
                                <span>Spent: {budget.spent}€</span>
                            </div>
                            <div className="w-full bg-slate-200 rounded-full h-2.5 mb-6">
                                <div
                                    className="bg-slate-800 h-2.5 rounded-full transition-all"
                                    style={{ width: `${(budget.spent / budget.amount) * 100}%` }}
                                />
                            </div>

                            {/* Transaction Form */}
                            <div className="space-y-4">
                                <input
                                    type="text"
                                    placeholder="Description"
                                    className="w-full p-2 border rounded-lg"
                                    value={newTransaction.description}
                                    onChange={e => setNewTransaction({
                                        ...newTransaction,
                                        description: e.target.value
                                    })}
                                />
                                <input
                                    type="number"
                                    placeholder="Amount"
                                    className="w-full p-2 border rounded-lg"
                                    value={newTransaction.amount}
                                    onChange={e => setNewTransaction({
                                        ...newTransaction,
                                        amount: e.target.value
                                    })}
                                />
                                <button
                                    onClick={handleAddTransaction}
                                    className="w-full bg-slate-900 text-white p-2 rounded-lg hover:bg-slate-800"
                                >
                                    Add Transaction
                                </button>
                                <button
                                    onClick={handleDeleteBudget}
                                    className="w-full border border-red-500 text-red-500 p-2 rounded-lg hover:bg-red-50 mt-4"
                                >
                                    Delete Budget
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Transactions List */}
                    <div className="md:w-2/3">
                        {budget.transactions?.length > 0 ? (
                            <div className="bg-white rounded-xl p-6 border border-slate-300">
                                <h3 className="text-xl font-bold mb-4 text-slate-800">Transactions</h3>
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead className="border-b border-slate-200">
                                            <tr>
                                                <th className="text-left p-3 text-slate-600">Description</th>
                                                <th className="text-left p-3 text-slate-600">Amount</th>
                                                <th className="text-left p-3 text-slate-600">Date</th>
                                                <th className="text-left p-3 text-slate-600">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {budget.transactions.map(transaction => (
                                                <tr key={transaction.id} className="border-b border-slate-100">
                                                    <td className="p-3">{transaction.description}</td>
                                                    <td className="p-3">
                                                        <span className="px-2 py-1 bg-slate-100 rounded-full text-sm">
                                                            {transaction.amount}€
                                                        </span>
                                                    </td>
                                                    <td className="p-3 text-slate-500">
                                                        {new Date(transaction.createdAt).toLocaleString()}
                                                    </td>
                                                    <td className="p-3">
                                                        <button
                                                            onClick={() => dispatch(deleteTransaction({
                                                                budgetId: budget.id,
                                                                transactionId: transaction.id
                                                            }))}
                                                            className="text-red-500 hover:text-red-700 p-1"
                                                        >
                                                            <FiTrash2 size={18} />
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        ) : (
                            <div className="bg-white rounded-xl p-6 border border-slate-300 text-center text-slate-500">
                                No transactions yet
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default BudgetDetails