import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import Login from "./pages/Login"
import Dashboard from "./pages/Dashboard"
import Orders from "./pages/Orders"
import Customers from "./pages/Customers"
import CustomerDetail from "./pages/CustomerDetail"
import StaffManagement from "./pages/StaffManagement"
import StaffDetail from "./pages/StaffDetail"
import IncomeManagement from "./pages/IncomeManagement"
import Measurements from "./pages/Measurements"
import Layout from "./components/Layout"
import { AuthProvider } from "./context/AuthContext"
import ProtectedRoute from "./components/ProtectedRoute"

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/customers" element={<Customers />} />
            <Route path="/customers/:id" element={<CustomerDetail />} />
            <Route path="/staff" element={<StaffManagement />} />
            <Route path="/staff/:id" element={<StaffDetail />} />
            <Route path="/income" element={<IncomeManagement />} />
            <Route path="/measurements" element={<Measurements />} />
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  )
}

export default App
