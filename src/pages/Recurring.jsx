// src/pages/Recurring.jsx
import { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { addRecurring, addIncome, toggleRecurring, deleteRecurring } from '../store/recurringSlice'
import { FiPlus, FiTrash2, FiToggleLeft, FiToggleRight, FiDollarSign, FiArrowUpCircle, FiArrowDownCircle } from 'react-icons/fi'

const Recurring = () => {
    const dispatch = useDispatch()
    const recurring = useSelector(state => state.recurring?.items || [])
    const income = useSelector(state => state.recurring?.income || [])
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [newItem, setNewItem] = useState({
        description: '',
        amount: '',
        type: 'expense',
        frequency: 'monthly',
        startDate: new Date().toISOString().split('T')[0],
        category: ''
    })

    const handleSubmit = () => {
        if (!newItem.description || !newItem.amount) return
        
        if (newItem.type === 'income') {
            dispatch(addIncome({
                ...newItem,
                amount: Number(newItem.amount)
            }))
        } else {
            dispatch(addRecurring({
                ...newItem,
                amount: Number(newItem.amount)
            }))
        }
        
        setIsModalOpen(false)
        setNewItem({
            description: '',
            amount: '',
            type: 'expense',
            frequency: 'monthly',
            startDate: new Date().toISOString().split('T')[0],
            category: ''
        })
    }

    const calculateMonthlyAmount = (items) => {
        return items
            .filter(item => item.isActive)
            .reduce((sum, item) => {
                const amount = Number(item.amount)
                switch(item.frequency) {
                    case 'weekly': return sum + (amount * 4)
                    case 'yearly': return sum + (amount / 12)
                    default: return sum + amount
                }
            }, 0)
    }

    const monthlyIncome = calculateMonthlyAmount(income)
    const monthlyExpenses = calculateMonthlyAmount(recurring)

    const EmptyState = ({ type }) => (
        <div className="flex flex-col items-center justify-center p-8 text-center">
            <div className="bg-slate-100 p-4 rounded-full mb-4">
                <FiDollarSign size={48} className="text-slate-400" />
            </div>
            <h3 className="text-xl font-semibold text-slate-700 mb-2">
                No {type} items
            </h3>
            <p className="text-slate-500 mb-6 max-w-sm">
                {type === 'income' 
                    ? "Add your regular income sources like salary or investments"
                    : "Add your recurring expenses like rent or subscriptions"}
            </p>
            <button
                onClick={() => setIsModalOpen(true)}
                className="flex items-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-lg hover:bg-slate-800"
            >
                <FiPlus size={20} />
                Add {type === 'income' ? 'Income' : 'Expense'}
            </button>
        </div>
    )

    return (
        <div className="w-full">
            <div className="border-b border-b-slate-300 p-6 flex justify-between items-center">
                <h2 className="text-xl text-slate-700 font-semibold">Recurring Bills</h2>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-slate-900 text-sm text-slate-100 px-4 py-2 rounded-lg hover:bg-slate-800"
                >
                    <FiPlus className="inline mr-2" /> Add New
                </button>
            </div>

            <div className="p-6">
                <div className="grid grid-cols-12 gap-6">
                    {/* Left Column - Summary Cards (30%) */}
                    <div className="col-span-12 md:col-span-3 space-y-4">
                        {/* Monthly Income Card */}
                        <div className="bg-white rounded-xl border border-slate-300 p-4">
                            <div className="flex items-center gap-4">
                                <div className="bg-emerald-500 bg-opacity-10 p-3 rounded-full text-emerald-500">
                                    <FiArrowUpCircle size={24} />
                                </div>
                                <div>
                                    <h3 className="text-sm text-slate-500">Monthly Income</h3>
                                    <p className="text-2xl font-bold text-slate-800">{monthlyIncome}€</p>
                                </div>
                            </div>
                        </div>

                        {/* Monthly Expenses Card */}
                        <div className="bg-white rounded-xl border border-slate-300 p-4">
                            <div className="flex items-center gap-4">
                                <div className="bg-red-500 bg-opacity-10 p-3 rounded-full text-red-500">
                                    <FiArrowDownCircle size={24} />
                                </div>
                                <div>
                                    <h3 className="text-sm text-slate-500">Monthly Expenses</h3>
                                    <p className="text-2xl font-bold text-slate-800">{monthlyExpenses}€</p>
                                </div>
                            </div>
                        </div>

                        {/* Net Monthly Card */}
                        <div className="bg-white rounded-xl border border-slate-300 p-4">
                            <div className="flex items-center gap-4">
                                <div className="bg-blue-500 bg-opacity-10 p-3 rounded-full text-blue-500">
                                    <FiDollarSign size={24} />
                                </div>
                                <div>
                                    <h3 className="text-sm text-slate-500">Net Monthly</h3>
                                    <p className="text-2xl font-bold text-slate-800">{monthlyIncome - monthlyExpenses}€</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Combined Table (70%) */}
                    <div className="col-span-12 md:col-span-9">
                        <div className="bg-white rounded-xl border border-slate-300">
                            <div className="p-6">
                                <h3 className="text-lg font-semibold mb-6">Recurring Items</h3>
                                {(income.length > 0 || recurring.length > 0) ? (
                                    <div className="space-y-6">
                                        {/* Income Section */}
                                        <div className="space-y-2">
                                            <h4 className="text-sm font-medium text-slate-500 uppercase tracking-wider mb-4">Income</h4>
                                            {income.map(item => (
                                                <div key={item.id} 
                                                    className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border-l-4 border-emerald-500">
                                                    <div className="flex items-center gap-4">
                                                        <div className="flex flex-col">
                                                            <span className="font-medium">{item.description}</span>
                                                            <span className="text-sm text-slate-500">
                                                                Next: {new Date(item.nextDue).toLocaleDateString()} • {item.frequency}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-4">
                                                        <span className="font-semibold text-emerald-600">+€{item.amount}</span>
                                                        <button 
                                                            onClick={() => dispatch(toggleRecurring(item.id))}
                                                            className={`${item.isActive ? 'text-emerald-500' : 'text-slate-400'}`}
                                                        >
                                                            {item.isActive ? <FiToggleRight size={24} /> : <FiToggleLeft size={24} />}
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        {/* Expenses Section */}
                                        <div className="space-y-2">
                                            <h4 className="text-sm font-medium text-slate-500 uppercase tracking-wider mb-4">Expenses</h4>
                                            {recurring.map(item => (
                                                <div key={item.id} 
                                                    className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border-l-4 border-red-500">
                                                    <div className="flex items-center gap-4">
                                                        <div className="flex flex-col">
                                                            <span className="font-medium">{item.description}</span>
                                                            <span className="text-sm text-slate-500">
                                                                Next: {new Date(item.nextDue).toLocaleDateString()} • {item.frequency}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-4">
                                                        <span className="font-semibold text-red-600">-€{item.amount}</span>
                                                        <button 
                                                            onClick={() => dispatch(toggleRecurring(item.id))}
                                                            className={`${item.isActive ? 'text-red-500' : 'text-slate-400'}`}
                                                        >
                                                            {item.isActive ? <FiToggleRight size={24} /> : <FiToggleLeft size={24} />}
                                                        </button>
                                                        <button onClick={() => dispatch(deleteRecurring(item.id))} className="text-red-500">
                                                            <FiTrash2 />
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ) : (
                                    <EmptyState type="recurring" />
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Add New Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg w-96">
                        <h3 className="text-lg font-semibold mb-6">Add Recurring Item</h3>
                        <div className="space-y-4">
                            <select
                                className="w-full p-2 border rounded-lg"
                                value={newItem.type}
                                onChange={e => setNewItem({ ...newItem, type: e.target.value })}
                            >
                                <option value="expense">Expense</option>
                                <option value="income">Income</option>
                            </select>
                            <input
                                type="text"
                                placeholder="Description"
                                className="w-full p-2 border rounded-lg"
                                value={newItem.description}
                                onChange={e => setNewItem({ ...newItem, description: e.target.value })}
                            />
                            <input
                                type="number"
                                placeholder="Amount"
                                className="w-full p-2 border rounded-lg"
                                value={newItem.amount}
                                onChange={e => setNewItem({ ...newItem, amount: e.target.value })}
                            />
                            <select
                                className="w-full p-2 border rounded-lg"
                                value={newItem.frequency}
                                onChange={e => setNewItem({ ...newItem, frequency: e.target.value })}
                            >
                                <option value="monthly">Monthly</option>
                                <option value="weekly">Weekly</option>
                                <option value="yearly">Yearly</option>
                            </select>
                            <input
                                type="date"
                                className="w-full p-2 border rounded-lg"
                                value={newItem.startDate}
                                onChange={e => setNewItem({ ...newItem, startDate: e.target.value })}
                            />
                            <div className="flex gap-2 mt-6">
                                <button
                                    onClick={handleSubmit}
                                    className="flex-1 bg-slate-900 text-white px-4 py-2 rounded-lg hover:bg-slate-800"
                                >
                                    Add Item
                                </button>
                                <button
                                    onClick={() => setIsModalOpen(false)}
                                    className="flex-1 border px-4 py-2 rounded-lg hover:bg-slate-50"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Recurring