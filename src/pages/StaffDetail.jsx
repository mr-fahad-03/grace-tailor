"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { ArrowLeft, Plus, Calendar, Clock, DollarSign, X, Check, AlertCircle } from "lucide-react"
import axios from "axios"
import { formatDate, formatCurrency } from "../utils/formatDate"

const PaymentForm = ({ onClose, onSave }) => {
  const [formData, setFormData] = useState({
    amount: "",
    date: new Date().toISOString().split("T")[0],
    hoursWorked: "",
    notes: "",
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: name === "amount" || name === "hoursWorked" ? (value === "" ? "" : Number(value)) : value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      await onSave(formData)
      onClose()
    } catch (err) {
      console.error("Error saving payment:", err)
      setError(err.response?.data?.message || "Failed to save payment. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Add New Payment</h2>
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
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="amount">
              Amount
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <DollarSign size={16} className="text-gray-400" />
              </div>
              <input
                id="amount"
                name="amount"
                type="number"
                step="0.01"
                min="0"
                className="pl-10 shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-[#28414C]"
                placeholder="Payment Amount"
                value={formData.amount}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="date">
              Date
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Calendar size={16} className="text-gray-400" />
              </div>
              <input
                id="date"
                name="date"
                type="date"
                className="pl-10 shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-[#28414C]"
                value={formData.date}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="hoursWorked">
              Hours Worked
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Clock size={16} className="text-gray-400" />
              </div>
              <input
                id="hoursWorked"
                name="hoursWorked"
                type="number"
                step="0.5"
                min="0"
                className="pl-10 shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-[#28414C]"
                placeholder="Hours Worked"
                value={formData.hoursWorked}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="notes">
              Notes
            </label>
            <textarea
              id="notes"
              name="notes"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-[#28414C]"
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
              className="px-4 py-2 bg-[#28414C] text-white rounded-md hover:bg-[#28414C]/90 flex items-center"
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
                  Save Payment
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

const StaffDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [staff, setStaff] = useState(null)
  const [payments, setPayments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [showAddModal, setShowAddModal] = useState(false)
  const [totalPaid, setTotalPaid] = useState(0)
  const [totalHours, setTotalHours] = useState(0)

  useEffect(() => {
    const fetchStaffDetails = async () => {
      try {
        setLoading(true)

        // Fetch staff details
        const staffResponse = await axios.get(`/api/staff/${id}`)
        setStaff(staffResponse.data)

        // Fetch staff payments
        const paymentsResponse = await axios.get(`/api/staff-payments/staff/${id}`)
        setPayments(paymentsResponse.data)

        // Calculate totals
        const total = paymentsResponse.data.reduce((sum, payment) => sum + payment.amount, 0)
        const hours = paymentsResponse.data.reduce((sum, payment) => sum + (payment.hoursWorked || 0), 0)

        setTotalPaid(total)
        setTotalHours(hours)

        setError("")
      } catch (err) {
        console.error("Error fetching staff details:", err)
        setError("Failed to load staff details. Please try again.")
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchStaffDetails()
    }
  }, [id])

  const handleAddPayment = () => {
    setShowAddModal(true)
  }

  const handleSavePayment = async (paymentData) => {
    try {
      const response = await axios.post("/api/staff-payments", {
        staffId: id,
        ...paymentData,
      })

      // Add the new payment to the list
      setPayments([response.data, ...payments])

      // Update totals
      setTotalPaid(totalPaid + response.data.amount)
      setTotalHours(totalHours + (response.data.hoursWorked || 0))

      return response.data
    } catch (err) {
      console.error("Error saving payment:", err)
      throw err
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <svg
          className="animate-spin h-8 w-8 text-[#BCA784]"
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
        <span className="ml-2 text-[#BCA784]">Loading staff details...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded">
        <p>{error}</p>
        <button onClick={() => navigate(-1)} className="mt-2 px-4 py-2 bg-[#28414C] text-white rounded">
          Go Back
        </button>
      </div>
    )
  }

  if (!staff) {
    return (
      <div className="p-4 bg-yellow-100 border border-yellow-400 text-yellow-700 rounded">
        <p>Staff member not found</p>
        <button onClick={() => navigate(-1)} className="mt-2 px-4 py-2 bg-[#28414C] text-white rounded">
          Go Back
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-6 pb-16">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <button onClick={() => navigate(-1)} className="mr-4 p-2 rounded-full hover:bg-[#BCA784]/20">
            <ArrowLeft size={24} className="text-[#BCA784]" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-white">{staff.name}</h1>
            <p className="text-[#BCA784]">{staff.position}</p>
          </div>
        </div>
        <button
          onClick={handleAddPayment}
          className="p-2 rounded-full bg-[#BCA784] text-[#28414C] hover:bg-[#BCA784]/90"
        >
          <Plus size={24} />
        </button>
      </div>

      {/* Staff Info Card */}
      <div className="bg-[#28414C]/80 border border-[#BCA784]/20 rounded-lg p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h3 className="text-[#BCA784] font-semibold mb-2">Contact Information</h3>
            <div className="space-y-2">
              <div className="flex items-center text-gray-300">
                <span className="w-24 text-gray-400">Phone:</span>
                <span>{staff.phoneNumber}</span>
              </div>
              {staff.email && (
                <div className="flex items-center text-gray-300">
                  <span className="w-24 text-gray-400">Email:</span>
                  <span>{staff.email}</span>
                </div>
              )}
              {staff.address && (
                <div className="flex items-center text-gray-300">
                  <span className="w-24 text-gray-400">Address:</span>
                  <span>{staff.address}</span>
                </div>
              )}
            </div>
          </div>
          <div>
            <h3 className="text-[#BCA784] font-semibold mb-2">Employment Details</h3>
            <div className="space-y-2">
              <div className="flex items-center text-gray-300">
                <span className="w-24 text-gray-400">Position:</span>
                <span>{staff.position}</span>
              </div>
              <div className="flex items-center text-gray-300">
                <span className="w-24 text-gray-400">Salary:</span>
                <span>{formatCurrency(staff.salary)}</span>
              </div>
              <div className="flex items-center text-gray-300">
                <span className="w-24 text-gray-400">Joined:</span>
                <span>{formatDate(staff.joiningDate)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-[#28414C]/80 border border-[#BCA784]/20 rounded-lg p-4">
          <h3 className="text-gray-400 text-sm mb-1">Total Payments</h3>
          <p className="text-2xl font-bold text-[#BCA784]">{formatCurrency(totalPaid)}</p>
        </div>
        <div className="bg-[#28414C]/80 border border-[#BCA784]/20 rounded-lg p-4">
          <h3 className="text-gray-400 text-sm mb-1">Total Hours</h3>
          <p className="text-2xl font-bold text-[#BCA784]">{totalHours.toFixed(1)}</p>
        </div>
        <div className="bg-[#28414C]/80 border border-[#BCA784]/20 rounded-lg p-4">
          <h3 className="text-gray-400 text-sm mb-1">Average Rate</h3>
          <p className="text-2xl font-bold text-[#BCA784]">
            {totalHours > 0 ? formatCurrency(totalPaid / totalHours) : "N/A"}/hr
          </p>
        </div>
      </div>

      {/* Payment History */}
      <div>
        <h2 className="text-xl font-semibold text-white mb-4">Payment History</h2>

        {payments.length > 0 ? (
          <div className="space-y-4">
            {payments.map((payment) => (
              <div key={payment._id} className="bg-[#28414C]/80 border border-[#BCA784]/20 rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-[#BCA784] font-semibold">{formatCurrency(payment.amount)}</p>
                    <p className="text-sm text-gray-400">{formatDate(payment.date)}</p>
                  </div>
                  <div className="text-right">
                    {payment.hoursWorked && (
                      <p className="text-sm text-gray-300">
                        {payment.hoursWorked} hours ({formatCurrency(payment.amount / payment.hoursWorked)}/hr)
                      </p>
                    )}
                  </div>
                </div>
                {payment.notes && (
                  <div className="mt-2 pt-2 border-t border-[#BCA784]/20">
                    <p className="text-sm text-gray-400">{payment.notes}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-[#28414C]/80 border border-[#BCA784]/20 rounded-lg p-6 text-center">
            <p className="text-gray-300">No payment history found for this staff member.</p>
            <button
              onClick={handleAddPayment}
              className="mt-4 px-4 py-2 bg-[#BCA784] text-[#28414C] rounded-md hover:bg-[#BCA784]/90"
            >
              Add First Payment
            </button>
          </div>
        )}
      </div>

      {/* Add Payment Modal */}
      {showAddModal && <PaymentForm onClose={() => setShowAddModal(false)} onSave={handleSavePayment} />}
    </div>
  )
}

export default StaffDetail
