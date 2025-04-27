"use client"

import { useState, useEffect } from "react"
import {
  Edit,
  Trash2,
  Plus,
  Search,
  Phone,
  Mail,
  MapPin,
  DollarSign,
  Calendar,
  X,
  Check,
  AlertCircle,
} from "lucide-react"
import { formatDate, formatCurrency } from "../utils/formatDate"
import axios from "axios"
import { useNavigate } from "react-router-dom"

const StaffForm = ({ staff, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: "",
    phoneNumber: "",
    email: "",
    address: "",
    position: "",
    salary: "",
    joiningDate: "",
    notes: "",
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    if (staff) {
      // Format date for input field (YYYY-MM-DD)
      const formattedDate = staff.joiningDate ? new Date(staff.joiningDate).toISOString().split("T")[0] : ""

      setFormData({
        name: staff.name || "",
        phoneNumber: staff.phoneNumber || "",
        email: staff.email || "",
        address: staff.address || "",
        position: staff.position || "",
        salary: staff.salary || "",
        joiningDate: formattedDate,
        notes: staff.notes || "",
      })
    }
  }, [staff])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: name === "salary" ? (value === "" ? "" : Number.parseFloat(value)) : value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      let response
      if (staff) {
        response = await axios.put(`/api/staff/${staff._id}`, formData)
      } else {
        response = await axios.post("/api/staff", formData)
      }
      onSave(response.data)
      onClose()
    } catch (err) {
      console.error("Error saving staff:", err)
      setError(err.response?.data?.message || "Failed to save staff member. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">{staff ? "Edit Staff Member" : "Add New Staff Member"}</h2>
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
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
              Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Staff Name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="phoneNumber">
              Phone Number
            </label>
            <input
              id="phoneNumber"
              name="phoneNumber"
              type="text"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Phone Number"
              value={formData.phoneNumber}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="address">
              Address
            </label>
            <input
              id="address"
              name="address"
              type="text"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Address"
              value={formData.address}
              onChange={handleChange}
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="position">
              Position
            </label>
            <input
              id="position"
              name="position"
              type="text"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Position"
              value={formData.position}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="salary">
              Salary
            </label>
            <input
              id="salary"
              name="salary"
              type="number"
              step="0.01"
              min="0"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Salary"
              value={formData.salary}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="joiningDate">
              Joining Date
            </label>
            <input
              id="joiningDate"
              name="joiningDate"
              type="date"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-purple-500"
              value={formData.joiningDate}
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
                  {staff ? "Update" : "Create"}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

const StaffManagement = () => {
  const [staff, setStaff] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [showAddModal, setShowAddModal] = useState(false)
  const [currentStaff, setCurrentStaff] = useState(null)
  const [error, setError] = useState("")
  const navigate = useNavigate()

  const fetchStaff = async () => {
    try {
      setLoading(true)
      const response = await axios.get("/api/staff")
      setStaff(response.data)
      setError("")
    } catch (err) {
      console.error("Error fetching staff:", err)
      setError("Failed to load staff data. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchStaff()
  }, [])

  const filteredStaff = staff.filter(
    (person) =>
      person.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      person.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
      person.phoneNumber.includes(searchTerm),
  )

  const handleAddStaff = () => {
    setCurrentStaff(null)
    setShowAddModal(true)
  }

  const handleEditStaff = (person) => {
    setCurrentStaff(person)
    setShowAddModal(true)
  }

  const handleDeleteStaff = async (id) => {
    if (window.confirm("Are you sure you want to delete this staff member?")) {
      try {
        await axios.delete(`/api/staff/${id}`)
        setStaff(staff.filter((person) => person._id !== id))
      } catch (err) {
        console.error("Error deleting staff:", err)
        alert("Failed to delete staff member. Please try again.")
      }
    }
  }

  const handleViewStaff = (id) => {
    navigate(`/staff/${id}`)
  }

  const handleSaveStaff = (savedStaff) => {
    if (currentStaff) {
      // Update existing staff
      setStaff(staff.map((person) => (person._id === savedStaff._id ? savedStaff : person)))
    } else {
      // Add new staff
      setStaff([savedStaff, ...staff])
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-[#BCA784]">Staff Management</h1>
        <button
          onClick={handleAddStaff}
          className="flex items-center px-4 py-2 bg-[#BCA784] text-[#28414C] rounded-md hover:bg-purple-700"
        >
          <Plus size={18} className="mr-1" />
          Add Staff
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search size={18} className="text-gray-400" />
        </div>
        <input
          type="text"
          placeholder="Search staff..."
          className="pl-10 pr-4 py-2 w-full border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded flex items-center">
          <AlertCircle size={18} className="mr-2" />
          <span>{error}</span>
        </div>
      )}

      {/* Staff List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading ? (
          <div className="col-span-full flex justify-center items-center py-8">
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
            <span className="ml-2 text-gray-600">Loading staff data...</span>
          </div>
        ) : filteredStaff.length > 0 ? (
          filteredStaff.map((person) => (
            <div
              key={person._id}
              className="bg-white rounded-lg shadow p-4 cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => handleViewStaff(person._id)}
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{person.name}</h3>
                  <p className="text-sm font-medium text-purple-600">{person.position}</p>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      handleEditStaff(person)
                    }}
                    className="text-indigo-600 hover:text-indigo-900"
                  >
                    <Edit size={18} />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      handleDeleteStaff(person._id)
                    }}
                    className="text-red-600 hover:text-red-900"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>

              <div className="mt-4 space-y-2">
                <div className="flex items-center text-sm">
                  <Phone size={16} className="text-gray-400 mr-2" />
                  <span>{person.phoneNumber}</span>
                </div>
                {person.email && (
                  <div className="flex items-center text-sm">
                    <Mail size={16} className="text-gray-400 mr-2" />
                    <span>{person.email}</span>
                  </div>
                )}
                {person.address && (
                  <div className="flex items-center text-sm">
                    <MapPin size={16} className="text-gray-400 mr-2" />
                    <span>{person.address}</span>
                  </div>
                )}
              </div>

              <div className="mt-4 pt-4 border-t space-y-2">
                <div className="flex justify-between items-center">
                  <div className="flex items-center text-sm">
                    <DollarSign size={16} className="text-gray-400 mr-2" />
                    <span>Salary</span>
                  </div>
                  <span className="text-sm font-medium">{formatCurrency(person.salary)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center text-sm">
                    <Calendar size={16} className="text-gray-400 mr-2" />
                    <span>Joined</span>
                  </div>
                  <span className="text-sm">{formatDate(person.joiningDate)}</span>
                </div>
              </div>

              {person.notes && (
                <div className="mt-4 pt-4 border-t">
                  <p className="text-sm text-gray-500">{person.notes}</p>
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-8 text-gray-500">No staff members found</div>
        )}
      </div>

      {/* Add/Edit Staff Modal */}
      {showAddModal && (
        <StaffForm staff={currentStaff} onClose={() => setShowAddModal(false)} onSave={handleSaveStaff} />
      )}
    </div>
  )
}

export default StaffManagement
