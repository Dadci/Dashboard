import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    items: []
}

export const goalSlice = createSlice({
    name: 'goals',
    initialState,
    reducers: {
        addGoal: (state, action) => {
            state.items.push({
                id: Date.now(),
                ...action.payload,
                currentAmount: 0, // Track actual amount
                progress: 0,
                createdAt: new Date().toISOString(),
                isCompleted: false
            })
        },
        updateGoalProgress: (state, action) => {
            const { id, amount } = action.payload
            const goal = state.items.find(g => g.id === id)
            if (goal) {
                goal.currentAmount = Math.min(goal.currentAmount + Number(amount), goal.targetAmount)
                goal.progress = (goal.currentAmount / goal.targetAmount) * 100
                goal.isCompleted = goal.progress >= 100
            }
        },
        deleteGoal: (state, action) => {
            state.items = state.items.filter(item => item.id !== action.payload)
        },
        updateGoal: (state, action) => {
            const index = state.items.findIndex(item => item.id === action.payload.id)
            if (index !== -1) {
                state.items[index] = {
                    ...state.items[index],
                    ...action.payload
                }
            }
        }
    }
})

export const { addGoal, updateGoalProgress, deleteGoal, updateGoal } = goalSlice.actions
export default goalSlice.reducer