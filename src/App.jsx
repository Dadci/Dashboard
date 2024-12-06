// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Layout from "./components/Layout"
import Dashboard from "./pages/Dashboard"
import Budget from "./pages/Budget"
import BudgetDetails from "./pages/BudgetDetails"
import Transactions from "./pages/Transactions"
import Recurring from './pages/Recurring'
import { Provider } from 'react-redux'
import store from './store/store'
import { Toaster } from 'react-hot-toast'

function App() {
  return (
    <Provider store={store}>
      <Toaster position='top-right' />
      <Router>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/budget" element={<Budget />} />
            <Route path="/budget/:id" element={<BudgetDetails />} />
            <Route path="/transactions" element={<Transactions />} />
            <Route path="/recurring" element={<Recurring />} /> {/* Move inside Layout */}
          </Route>
        </Routes>
      </Router>
    </Provider>
  )
}

export default App