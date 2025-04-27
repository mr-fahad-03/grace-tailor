"use client"

import { useState, useEffect } from "react"
import { Users, ShoppingBag, DollarSign, TrendingUp, AlertCircle } from "lucide-react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import axios from "axios"
import { formatCurrency, formatDate } from "../utils/formatDate"

const StatCard = ({ title, value, icon, color }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-4 flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-gray-500 text-sm">{title}</h3>
          <p className={`text-2xl font-bold ${color}`}>{value}</p>
        </div>
        <div className={`p-3 rounded-full ${color.replace("text", "bg")} bg-opacity-20`}>{icon}</div>
      </div>
      <div className="mt-auto">
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <div className={`h-full ${color.replace("text", "bg")}`} style={{ width: "70%" }}></div>
        </div>
      </div>
    </div>
  )
}

const Dashboard = () => {
  const [stats, setStats] = useState({
    customers: 0,
    orders: 0,
    income: 0,
    expenses: 0,
  })

  const [recentOrders, setRecentOrders] = useState([])
  const [monthlyData, setMonthlyData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true)

        // Fetch customer count
        const customersRes = await axios.get("/api/customers")

        // Fetch orders
        const ordersRes = await axios.get("/api/orders")
        const recentOrdersRes = await axios.get("/api/orders/stats/recent")

        // Fetch financial summary
        const financialRes = await axios.get("/api/transactions/stats/summary")

        // Set stats
        setStats({
          customers: customersRes.data.length,
          orders: ordersRes.data.length,
          income: financialRes.data.totalIncome,
          expenses: financialRes.data.totalExpense,
        })

        // Set recent orders
        setRecentOrders(recentOrdersRes.data)

        // Set monthly data
        setMonthlyData(financialRes.data.monthlyData)

        setError("")
      } catch (err) {
        console.error("Error fetching dashboard data:", err)
        setError("Failed to load dashboard data. Please try again.")
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <svg
          className="animate-spin h-8 w-8 text-purple-600"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
        <span className="ml-2 text-gray-600">Loading dashboard data...</span>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-[#BCA784]">Dashboard</h1>

      {/* Error Message */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded flex items-center">
          <AlertCircle size={18} className="mr-2" />
          <span>{error}</span>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Customers"
          value={stats.customers}
          icon={<Users size={24} className="text-purple-600" />}
          color="text-purple-600"
        />
        <StatCard
          title="Total Orders"
          value={stats.orders}
          icon={<ShoppingBag size={24} className="text-teal-500" />}
          color="text-teal-500"
        />
        <StatCard
          title="Total Income"
          value={formatCurrency(stats.income)}
          icon={<DollarSign size={24} className="text-yellow-500" />}
          color="text-yellow-500"
        />
        <StatCard
          title="Total Expenses"
          value={formatCurrency(stats.expenses)}
          icon={<TrendingUp size={24} className="text-red-500" />}
          color="text-red-500"
        />
      </div>

      {/* Charts */}
      <div className="bg-white rounded-lg shadow-md p-4">
        <h2 className="text-lg font-semibold mb-4">Income vs Expenses</h2>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthlyData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value) => formatCurrency(value)} />
              <Bar dataKey="income" fill="#8884d8" name="Income" />
              <Bar dataKey="expense" fill="#82ca9d" name="Expenses" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-lg shadow-md p-4">
        <h2 className="text-lg font-semibold mb-4">Recent Orders</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Order ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {recentOrders.length > 0 ? (
                recentOrders.map((order) => (
                  <tr key={order._id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      #{order._id.substring(order._id.length - 5)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.customerName}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatDate(order.createdAt)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatCurrency(order.price)}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                        ${
                          order.status === "completed"
                            ? "bg-green-100 text-green-800"
                            : order.status === "in-progress"
                              ? "bg-blue-100 text-blue-800"
                              : order.status === "delivered"
                                ? "bg-purple-100 text-purple-800"
                                : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="px-6 py-4 text-center text-sm text-gray-500">
                    No recent orders found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
