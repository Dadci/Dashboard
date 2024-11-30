// src/store/store.js
import { configureStore } from '@reduxjs/toolkit'
import budgetsReducer from './budgetSlice'
import { loadState, saveState } from '../utils/localStorage'
import throttle from 'lodash/throttle'

const persistedState = loadState();

export const store = configureStore({
    reducer: {
        budgets: budgetsReducer,
    },
    preloadedState: persistedState
})

// Save state to localStorage whenever it changes
// Throttle to prevent too many writes
store.subscribe(throttle(() => {
    saveState({
        budgets: store.getState().budgets
    });
}, 1000));

export default store