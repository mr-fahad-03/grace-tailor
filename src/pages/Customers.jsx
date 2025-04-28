"use client"

import { useState, useEffect } from "react"
import { Edit, Trash2, Plus, Search, Phone, Mail, MapPin, X, Check, AlertCircle, Ruler } from "lucide-react"
import { formatDate } from "../utils/formatDate"
import axios from "axios"
import { useNavigate } from "react-router-dom"

const CustomerForm = ({ customer, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: "",
    phoneNumber: "",
    email: "",
    address: "",
    measurements: {
      chest: "",
      waist: "",
      hips: "",
      inseam: "",
      shoulder: "",
      sleeve: "",
      neck: "",
    },
    notes: "",
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const navigate = useNavigate()

  useEffect(() => {
    if (customer) {
      setFormData({
        name: customer.name || "",
        phoneNumber: customer.phoneNumber || "",
        email: customer.email || "",
        address: customer.address || "",
        measurements: {
          chest: customer.measurements?.chest || "",
          waist: customer.measurements?.waist || "",
          hips: customer.measurements?.hips || "",
          inseam: customer.measurements?.inseam || "",
          shoulder: customer.measurements?.shoulder || "",
          sleeve: customer.measurements?.sleeve || "",
          neck: customer.measurements?.neck || "",
        },
        notes: customer.notes || "",
      })
    }
  }, [customer])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleMeasurementChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      measurements: {
        ...prev.measurements,
        [name]: value,
      },
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      let response
      if (customer) {
        response = await axios.put(`/api/customers/${customer._id}`, formData)
      } else {
        response = await axios.post("/api/customers", formData)
      }
      onSave(response.data)
      onClose()
    } catch (err) {
      console.error("Error saving customer:", err)
      setError(err.response?.data?.message || "Failed to save customer. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleEditDetailedMeasurements = () => {
    if (customer && customer._id) {
      navigate(`/measurements?customerId=${customer._id}`)
      onClose()
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">{customer ? "Edit Customer" : "Add New Customer"}</h2>
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
                Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-[#28414C]"
                placeholder="Customer Name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="phoneNumber">
                Phone Number
              </label>
              <input
                id="phoneNumber"
                name="phoneNumber"
                type="text"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-[#28414C]"
                placeholder="Phone Number"
                value={formData.phoneNumber}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-[#28414C]"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
              />
            </div>

            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="address">
                Address
              </label>
              <input
                id="address"
                name="address"
                type="text"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-[#28414C]"
                placeholder="Address"
                value={formData.address}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-lg font-semibold">Basic Measurements</h3>
              {customer && customer._id && (
                <button
                  type="button"
                  onClick={handleEditDetailedMeasurements}
                  className="flex items-center text-sm px-3 py-1 bg-[#28414C] text-white rounded hover:bg-[#28414C]/90"
                >
                  <Ruler size={16} className="mr-1" />
                  Edit Detailed Measurements
                </button>
              )}
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="chest">
                  Chest
                </label>
                <input
                  id="chest"
                  name="chest"
                  type="text"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-[#28414C]"
                  placeholder="Chest"
                  value={formData.measurements.chest}
                  onChange={handleMeasurementChange}
                />
              </div>

              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="waist">
                  Waist
                </label>
                <input
                  id="waist"
                  name="waist"
                  type="text"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-[#28414C]"
                  placeholder="Waist"
                  value={formData.measurements.waist}
                  onChange={handleMeasurementChange}
                />
              </div>

              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="hips">
                  Hips
                </label>
                <input
                  id="hips"
                  name="hips"
                  type="text"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-[#28414C]"
                  placeholder="Hips"
                  value={formData.measurements.hips}
                  onChange={handleMeasurementChange}
                />
              </div>

              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="inseam">
                  Inseam
                </label>
                <input
                  id="inseam"
                  name="inseam"
                  type="text"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-[#28414C]"
                  placeholder="Inseam"
                  value={formData.measurements.inseam}
                  onChange={handleMeasurementChange}
                />
              </div>

              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="shoulder">
                  Shoulder
                </label>
                <input
                  id="shoulder"
                  name="shoulder"
                  type="text"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-[#28414C]"
                  placeholder="Shoulder"
                  value={formData.measurements.shoulder}
                  onChange={handleMeasurementChange}
                />
              </div>

              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="sleeve">
                  Sleeve
                </label>
                <input
                  id="sleeve"
                  name="sleeve"
                  type="text"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-[#28414C]"
                  placeholder="Sleeve"
                  value={formData.measurements.sleeve}
                  onChange={handleMeasurementChange}
                />
              </div>

              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="neck">
                  Neck
                </label>
                <input
                  id="neck"
                  name="neck"
                  type="text"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-[#28414C]"
                  placeholder="Neck"
                  value={formData.measurements.neck}
                  onChange={handleMeasurementChange}
                />
              </div>
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

          {customer && customer.detailedMeasurements && customer.detailedMeasurements.length > 0 && (
            <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-lg font-semibold text-gray-700">Detailed Measurements Available</h3>
                <span className="text-sm bg-green-100 text-green-800 px-2 py-1 rounded">
                  {customer.detailedMeasurements.length} measurement(s)
                </span>
              </div>
              <p className="text-sm text-gray-600">
                This customer has detailed measurements. Click the "Edit Detailed Measurements" button above to view and
                edit all measurement details including Length, Arm, Teera, and style selections.
              </p>
            </div>
          )}

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
                  {customer ? "Update" : "Create"}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

const Customers = () => {
  const [customers, setCustomers] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [showAddModal, setShowAddModal] = useState(false)
  const [currentCustomer, setCurrentCustomer] = useState(null)
  const [error, setError] = useState("")
  const navigate = useNavigate()

  const fetchCustomers = async () => {
    try {
      setLoading(true)
      const response = await axios.get("/api/customers")
      setCustomers(response.data)
      setError("")
    } catch (err) {
      console.error("Error fetching customers:", err)
      setError("Failed to load customers. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCustomers()
  }, [])

  const filteredCustomers = customers.filter(
    (customer) =>
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.phoneNumber.includes(searchTerm) ||
      (customer.email && customer.email.toLowerCase().includes(searchTerm.toLowerCase())),
  )

  const handleAddCustomer = () => {
    setCurrentCustomer(null)
    setShowAddModal(true)
  }

  const handleEditCustomer = (customer) => {
    setCurrentCustomer(customer)
    setShowAddModal(true)
  }

  const handleDeleteCustomer = async (id) => {
    if (window.confirm("Are you sure you want to delete this customer?")) {
      try {
        await axios.delete(`/api/customers/${id}`)
        setCustomers(customers.filter((customer) => customer._id !== id))
      } catch (err) {
        console.error("Error deleting customer:", err)
        alert("Failed to delete customer. Please try again.")
      }
    }
  }

  const handleAddMeasurement = () => {
    navigate("/measurements")
  }

  const handleViewCustomer = (id) => {
    navigate(`/customers/${id}`)
  }

  const handleSaveCustomer = (savedCustomer) => {
    if (currentCustomer) {
      // Update existing customer
      setCustomers(customers.map((customer) => (customer._id === savedCustomer._id ? savedCustomer : customer)))
    } else {
      // Add new customer
      setCustomers([savedCustomer, ...customers])
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
        <span className="ml-2 text-[#BCA784]">Loading customers...</span>
      </div>
    )
  }

  return (
    <div className="space-y-6 pb-16">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-white">Customers</h1>
        <div className="flex space-x-2">
          <button
            onClick={handleAddMeasurement}
            className="flex items-center px-4 py-2 bg-[#BCA784] text-[#28414C] rounded-md hover:bg-[#BCA784]/90"
          >
            <Ruler size={18} className="mr-1" />
            Add Measurement
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search size={18} className="text-gray-400" />
        </div>
        <input
          type="text"
          placeholder="Search customers..."
          className="pl-10 pr-4 py-2 w-full border rounded-md focus:outline-none focus:ring-2 focus:ring-[#BCA784] bg-[#28414C]/50 border-[#BCA784]/30 text-white placeholder-gray-400"
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

      {/* Customers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCustomers.length > 0 ? (
          filteredCustomers.map((customer) => (
            <div
              key={customer._id}
              className="bg-[#28414C]/80 border border-[#BCA784]/20 rounded-lg shadow p-4 cursor-pointer"
              onClick={() => handleViewCustomer(customer._id)}
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-semibold text-white">{customer.name}</h3>
                  <p className="text-sm text-gray-400">Customer since {formatDate(customer.createdAt)}</p>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      handleEditCustomer(customer)
                    }}
                    className="text-[#BCA784] hover:text-[#BCA784]/80"
                  >
                    <Edit size={18} />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      handleDeleteCustomer(customer._id)
                    }}
                    className="text-red-400 hover:text-red-300"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>

              <div className="mt-4 space-y-2">
                <div className="flex items-center text-sm text-gray-300">
                  <Phone size={16} className="text-[#BCA784] mr-2" />
                  <span>{customer.phoneNumber}</span>
                </div>
                {customer.email && (
                  <div className="flex items-center text-sm text-gray-300">
                    <Mail size={16} className="text-[#BCA784] mr-2" />
                    <span>{customer.email}</span>
                  </div>
                )}
                {customer.address && (
                  <div className="flex items-center text-sm text-gray-300">
                    <MapPin size={16} className="text-[#BCA784] mr-2" />
                    <span>{customer.address}</span>
                  </div>
                )}
              </div>

              <div className="mt-4 pt-4 border-t border-[#BCA784]/20">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-400">Total Orders</span>
                  <span className="text-sm font-medium bg-[#BCA784] text-[#28414C] px-2 py-1 rounded-full">
                    {customer.orderCount || 0}
                  </span>
                </div>
                {Array.isArray(customer.detailedMeasurements) && customer.detailedMeasurements.length > 0 ? (
                  <div className="mt-2 text-sm text-[#BCA784]">
                    {customer.detailedMeasurements.length} measurement(s) available
                  </div>
                ) : customer.measurements ? (
                  <div className="mt-2 text-sm text-[#BCA784]">1 measurement available</div>
                ) : (
                  <div className="mt-2 text-sm text-gray-400">No measurements</div>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-8 text-gray-400">No customers found</div>
        )}
      </div>

      {/* Add/Edit Customer Modal */}
      {showAddModal && (
        <CustomerForm customer={currentCustomer} onClose={() => setShowAddModal(false)} onSave={handleSaveCustomer} />
      )}
    </div>
  )
}

export default Customers
