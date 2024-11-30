// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Layout from "./components/Layout"
import Dashboard from "./pages/Dashboard"
import Budget from "./pages/Budget"
import BudgetDetails from "./pages/BudgetDetails"
import Transactions from "./pages/Transactions"
import { Provider } from 'react-redux'
import store from './store/store'


function App() {
  return (
    <Provider store={store}>
      <Router>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/budget" element={<Budget />} />
            <Route path="/budget/:id" element={<BudgetDetails />} />
            <Route path="/transactions" element={<Transactions />} />
          </Route>
        </Routes>
      </Router>
    </Provider>

  )
}

export default App