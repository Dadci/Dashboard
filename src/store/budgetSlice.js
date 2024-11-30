// src/store/budgetsSlice.js
import { createSlice } from '@reduxjs/toolkit'
import { FiCoffee } from 'react-icons/fi'

const initialState = {
  items: []  // Empty initial state since we'll load from localStorage
}

export const budgetsSlice = createSlice({
  name: 'budgets',
  initialState,
  reducers: {
    addBudget: (state, action) => {
      state.items.push({
        id: Date.now(),
        ...action.payload
      })
    },
    editBudget: (state, action) => {
      const index = state.items.findIndex(item => item.id === action.payload.id)
      if (index !== -1) {
        state.items[index] = action.payload
      }
    },
    deleteBudget: (state, action) => {
      state.items = state.items.filter(item => item.id !== action.payload)
    },
    addTransaction: (state, action) => {
      const { budgetId, amount, description } = action.payload
      const budget = state.items.find(item => item.id === budgetId)
      if (budget) {
        const newTransaction = {
          id: Date.now(),
          amount,
          description,
          createdAt: new Date().toISOString()
        }
        budget.transactions.push(newTransaction)
        budget.spent += amount
      }
    },
    deleteTransaction: (state, action) => {
      const { budgetId, transactionId } = action.payload
      const budget = state.items.find(item => item.id === budgetId)
      if (budget) {
        const transaction = budget.transactions.find(t => t.id === transactionId)
        if (transaction) {
          budget.spent -= transaction.amount
          budget.transactions = budget.transactions.filter(t => t.id !== transactionId)
        }
      }
    }
  }
})

export const { addBudget, editBudget, deleteBudget, addTransaction, deleteTransaction } = budgetsSlice.actions
export default budgetsSlice.reducer