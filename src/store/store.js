// src/store/store.js
import { configureStore } from '@reduxjs/toolkit'
import budgetsReducer from './budgetSlice'
import recurringReducer from './recurringSlice'
import goalReducer from './goalSlice'
import { loadState, saveState } from '../utils/localStorage'
import throttle from 'lodash/throttle'

const persistedState = loadState();

export const store = configureStore({
    reducer: {
        budgets: budgetsReducer,
        recurring: recurringReducer,
        goals: goalReducer


    },
    preloadedState: persistedState
})

// Save state to localStorage whenever it changes
// Throttle to prevent too many writes
store.subscribe(throttle(() => {
    saveState({
        budgets: store.getState().budgets,
        recurring: store.getState().recurring,
        goals: store.getState().goals
    });
}, 1000));

export default store