// src/pages/Transactions.jsx
import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { useDispatch } from 'react-redux'
import { deleteTransaction } from '../store/budgetSlice'
import { FiTrash2, FiSearch, FiX } from 'react-icons/fi'

const Transactions = () => {
    const dispatch = useDispatch()
    const budgets = useSelector(state => state.budgets.items)
    const [filters, setFilters] = useState({
        search: '',
        budget: 'all',
        startDate: '',
        endDate: ''
    })

    // Combine and flatten all transactions with budget info
    const allTransactions = budgets.flatMap(budget =>
        budget.transactions.map(transaction => ({
            ...transaction,
            budgetName: budget.name,
            budgetId: budget.id
        }))
    ).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .filter(transaction => {
        const matchesSearch = transaction.description.toLowerCase().includes(filters.search.toLowerCase())
        const matchesBudget = filters.budget === 'all' || transaction.budgetId === Number(filters.budget)
        const matchesDateRange = (!filters.startDate || new Date(transaction.createdAt) >= new Date(filters.startDate)) &&
                                (!filters.endDate || new Date(transaction.createdAt) <= new Date(filters.endDate))
        
        return matchesSearch && matchesBudget && matchesDateRange
    })

    const resetFilters = () => {
        setFilters({
            search: '',
            budget: 'all',
            startDate: '',
            endDate: ''
        })
    }

    return (
        <div className="w-full">
            <div className='border-b border-b-slate-300 p-6'>
                <h2 className="text-xl text-slate-700 font-semibold mb-4">Transactions</h2>
                
                {/* Filters */}
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="relative flex flex-1 items-center">
                        <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search transactions..."
                            className="w-full pl-10 p-2 text-sm border rounded-lg"
                            value={filters.search}
                            onChange={e => setFilters({...filters, search: e.target.value})}
                        />
                    </div>
                    <select
                        className="p-2 border text-sm rounded-lg"
                        value={filters.budget}
                        onChange={e => setFilters({...filters, budget: e.target.value})}
                    >
                        <option value="all">All Budgets</option>
                        {budgets.map(budget => (
                            <option key={budget.id} value={budget.id}>
                                {budget.name}
                            </option>
                        ))}
                    </select>
                    <input
                        type="date"
                        className="p-2 border text-sm rounded-lg"
                        value={filters.startDate}
                        onChange={e => setFilters({...filters, startDate: e.target.value})}
                    />
                    <input
                        type="date"
                        className="p-2 text-sm border rounded-lg"
                        value={filters.endDate}
                        onChange={e => setFilters({...filters, endDate: e.target.value})}
                    />
                    <button
                        onClick={resetFilters}
                        className="flex items-center text-sm gap-2 px-4 py-2 border rounded-lg hover:bg-slate-50"
                    >
                        <FiX /> Clear Filters
                    </button>
                </div>
            </div>

            <div className="p-6">
                {allTransactions.length > 0 ? (
                    <div className="bg-white rounded-xl p-6 border border-slate-300">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="border-b border-slate-200">
                                    <tr>
                                        <th className="text-left p-3 text-slate-600">Description</th>
                                        <th className="text-left p-3 text-slate-600">Budget</th>
                                        <th className="text-left p-3 text-slate-600">Amount</th>
                                        <th className="text-left p-3 text-slate-600">Date</th>
                                        <th className="text-left p-3 text-slate-600">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {allTransactions.map(transaction => (
                                        <tr key={transaction.id} className="border-b border-slate-100">
                                            <td className="p-3">{transaction.description}</td>
                                            <td className="p-3">{transaction.budgetName}</td>
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
                                                        budgetId: transaction.budgetId,
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
                        No transactions found
                    </div>
                )}
            </div>
        </div>
    )
}

export default Transactions