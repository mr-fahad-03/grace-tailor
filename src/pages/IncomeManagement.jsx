"use client"

import { useState, useEffect } from "react"
import { DollarSign, TrendingUp, TrendingDown, Plus, X, Check, AlertCircle } from "lucide-react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts"
import { formatCurrency, formatDate } from "../utils/formatDate"
import axios from "axios"
import { Edit, Trash2 } from "lucide-react"

const TransactionForm = ({ transaction, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    description: "",
    amount: "",
    date: "",
    type: "income",
    category: "",
    notes: "",
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    if (transaction) {
      // Format date for input field (YYYY-MM-DD)
      const formattedDate = transaction.date ? new Date(transaction.date).toISOString().split("T")[0] : ""

      setFormData({
        description: transaction.description || "",
        amount: transaction.amount || "",
        date: formattedDate,
        type: transaction.type || "income",
        category: transaction.category || "",
        notes: transaction.notes || "",
      })
    } else {
      // Set today's date for new transactions
      setFormData((prev) => ({
        ...prev,
        date: new Date().toISOString().split("T")[0],
      }))
    }
  }, [transaction])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: name === "amount" ? (value === "" ? "" : Number.parseFloat(value)) : value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      let response
      if (transaction) {
        response = await axios.put(`/api/transactions/${transaction._id}`, formData)
      } else {
        response = await axios.post("/api/transactions", formData)
      }
      onSave(response.data)
      onClose()
    } catch (err) {
      console.error("Error saving transaction:", err)
      setError(err.response?.data?.message || "Failed to save transaction. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">{transaction ? "Edit Transaction" : "Add New Transaction"}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={20} />
          </button>
        </div>

        {error && (
          <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded flex items-center">
            <AlertCircle size={16} className="mr-2" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">
              Description
            </label>
            <input
              id="description"
              name="description"
              type="text"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Transaction Description"
              value={formData.description}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="amount">
              Amount
            </label>
            <input
              id="amount"
              name="amount"
              type="number"
              step="0.01"
              min="0"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Amount"
              value={formData.amount}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="date">
              Date
            </label>
            <input
              id="date"
              name="date"
              type="date"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-purple-500"
              value={formData.date}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="type">
              Type
            </label>
            <select
              id="type"
              name="type"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-purple-500"
              value={formData.type}
              onChange={handleChange}
              required
            >
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="category">
              Category
            </label>
            <input
              id="category"
              name="category"
              type="text"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Category"
              value={formData.category}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="notes">
              Notes
            </label>
            <textarea
              id="notes"
              name="notes"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Additional notes"
              value={formData.notes}
              onChange={handleChange}
              rows={3}
            />
          </div>

          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded-md hover:bg-gray-100"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 flex items-center"
              disabled={loading}
            >
              {loading ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Saving...
                </>
              ) : (
                <>
                  <Check size={18} className="mr-1" />
                  {transaction ? "Update" : "Create"}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

const IncomeManagement = () => {
  const [transactions, setTransactions] = useState([])
  const [summary, setSummary] = useState({
    totalIncome: 0,
    totalExpense: 0,
    netIncome: 0,
    monthlyData: [],
  })
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState("all") // all, income, expense
  const [showAddModal, setShowAddModal] = useState(false)
  const [currentTransaction, setCurrentTransaction] = useState(null)
  const [error, setError] = useState("")

  const fetchFinancialData = async () => {
    try {
      setLoading(true)

      // Fetch transactions
      const transactionsRes = await axios.get("/api/transactions")
      setTransactions(transactionsRes.data)

      // Fetch financial summary
      const summaryRes = await axios.get("/api/transactions/stats/summary")
      setSummary(summaryRes.data)

      setError("")
    } catch (err) {
      console.error("Error fetching financial data:", err)
      setError("Failed to load financial data. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchFinancialData()
  }, [])

  const filteredTransactions = transactions.filter((transaction) => {
    if (filter === "all") return true
    return transaction.type === filter
  })

  const handleAddTransaction = () => {
    setCurrentTransaction(null)
    setShowAddModal(true)
  }

  const handleEditTransaction = (transaction) => {
    setCurrentTransaction(transaction)
    setShowAddModal(true)
  }

  const handleDeleteTransaction = async (id) => {
    if (window.confirm("Are you sure you want to delete this transaction?")) {
      try {
        await axios.delete(`/api/transactions/${id}`)
        setTransactions(transactions.filter((transaction) => transaction._id !== id))
        // Refresh summary data after deletion
        const summaryRes = await axios.get("/api/transactions/stats/summary")
        setSummary(summaryRes.data)
      } catch (err) {
        console.error("Error deleting transaction:", err)
        alert("Failed to delete transaction. Please try again.")
      }
    }
  }

  const handleSaveTransaction = async (savedTransaction) => {
    if (currentTransaction) {
      // Update existing transaction
      setTransactions(
        transactions.map((transaction) => (transaction._id === savedTransaction._id ? savedTransaction : transaction)),
      )
    } else {
      // Add new transaction
      setTransactions([savedTransaction, ...transactions])
    }

    // Refresh summary data after adding/updating
    try {
      const summaryRes = await axios.get("/api/transactions/stats/summary")
      setSummary(summaryRes.data)
    } catch (err) {
      console.error("Error refreshing summary data:", err)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-[#BCA784]">Income Management</h1>
        <button
          onClick={handleAddTransaction}
          className="flex items-center px-4 py-2 text-[#28414C] bg-[#BCA784] rounded-md"
        >
          <Plus size={18} className="mr-1" />
          Add Transaction
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded flex items-center">
          <AlertCircle size={18} className="mr-2" />
          <span>{error}</span>
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Income</p>
              <h3 className="text-xl font-bold text-green-600">{formatCurrency(summary.totalIncome)}</h3>
            </div>
            <div className="p-3 rounded-full bg-green-100">
              <TrendingUp size={24} className="text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Expenses</p>
              <h3 className="text-xl font-bold text-red-600">{formatCurrency(summary.totalExpense)}</h3>
            </div>
            <div className="p-3 rounded-full bg-red-100">
              <TrendingDown size={24} className="text-red-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Net Income</p>
              <h3 className={`text-xl font-bold ${summary.netIncome >= 0 ? "text-green-600" : "text-red-600"}`}>
                {formatCurrency(summary.netIncome)}
              </h3>
            </div>
            <div className={`p-3 rounded-full ${summary.netIncome >= 0 ? "bg-green-100" : "bg-red-100"}`}>
              <DollarSign size={24} className={summary.netIncome >= 0 ? "text-green-600" : "text-red-600"} />
            </div>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="bg-white rounded-lg shadow p-4">
        <h2 className="text-lg font-semibold mb-4">Monthly Income vs Expenses</h2>
        {loading ? (
          <div className="h-80 flex items-center justify-center">
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
            <span className="ml-2 text-gray-600">Loading chart data...</span>
          </div>
        ) : (
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={summary.monthlyData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => formatCurrency(value)} />
                <Legend />
                <Bar dataKey="income" fill="#8884d8" name="Income" />
                <Bar dataKey="expense" fill="#82ca9d" name="Expenses" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* Transactions */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Recent Transactions</h2>
          <div className="flex space-x-2">
            <button
              onClick={() => setFilter("all")}
              className={`px-3 py-1 text-sm rounded-md ${filter === "all" ? "bg-purple-100 text-purple-800" : "bg-gray-100 text-gray-800"}`}
            >
              All
            </button>
            <button
              onClick={() => setFilter("income")}
              className={`px-3 py-1 text-sm rounded-md ${filter === "income" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}`}
            >
              Income
            </button>
            <button
              onClick={() => setFilter("expense")}
              className={`px-3 py-1 text-sm rounded-md ${filter === "expense" ? "bg-red-100 text-red-800" : "bg-gray-100 text-gray-800"}`}
            >
              Expenses
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Description
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan="5" className="px-6 py-4 text-center">
                    <div className="flex justify-center items-center">
                      <svg
                        className="animate-spin h-5 w-5 text-purple-600"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      <span className="ml-2">Loading transactions...</span>
                    </div>
                  </td>
                </tr>
              ) : filteredTransactions.length > 0 ? (
                filteredTransactions.map((transaction) => (
                  <tr key={transaction._id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{transaction.description}</div>
                      {transaction.notes && <div className="text-xs text-gray-500">{transaction.notes}</div>}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                        {transaction.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(transaction.date)}
                    </td>
                    <td
                      className={`px-6 py-4 whitespace-nowrap text-sm font-medium text-right ${
                        transaction.type === "income" ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {transaction.type === "income" ? "+" : "-"}
                      {formatCurrency(transaction.amount)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleEditTransaction(transaction)}
                        className="text-indigo-600 hover:text-indigo-900 mr-3"
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        onClick={() => handleDeleteTransaction(transaction._id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="px-6 py-4 text-center text-sm text-gray-500">
                    No transactions found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Transaction Modal */}
      {showAddModal && (
        <TransactionForm
          transaction={currentTransaction}
          onClose={() => setShowAddModal(false)}
          onSave={handleSaveTransaction}
        />
      )}
    </div>
  )
}

export default IncomeManagement
