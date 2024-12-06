// src/store/recurringSlice.js
import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  items: [],
  income: [] 
}

export const recurringSlice = createSlice({
  name: 'recurring',
  initialState,
  reducers: {
    addRecurring: (state, action) => {
      state.items.push({
        id: Date.now(),
        ...action.payload,
        nextDue: new Date(action.payload.startDate).toISOString(),
        isActive: true
      })
    },
    addIncome: (state, action) => {
      state.income.push({
        id: Date.now(),
        ...action.payload,
        nextDue: new Date(action.payload.startDate).toISOString(),
        isActive: true
      })
    },
    toggleRecurring: (state, action) => {
      const item = state.items.find(i => i.id === action.payload)
      if (item) item.isActive = !item.isActive
    },
    updateNextDue: (state, action) => {
      const { id, nextDue } = action.payload
      const item = state.items.find(i => i.id === id)
      if (item) item.nextDue = nextDue
    },
    deleteRecurring: (state, action) => {
      state.items = state.items.filter(item => item.id !== action.payload)
    }
  }
})

export const { addRecurring, addIncome, toggleRecurring, updateNextDue, deleteRecurring } = recurringSlice.actions
export default recurringSlice.reducer