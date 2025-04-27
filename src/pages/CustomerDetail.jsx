"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { ArrowLeft, Plus, Search } from "lucide-react"
import axios from "axios"

const CustomerDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [customer, setCustomer] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    const fetchCustomerDetails = async () => {
      try {
        setLoading(true)
        const response = await axios.get(`/api/customers/${id}`)
        setCustomer(response.data)
        setError("")
      } catch (err) {
        console.error("Error fetching customer details:", err)
        setError("Failed to load customer details. Please try again.")
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchCustomerDetails()
    }
  }, [id])

  const handleAddMeasurement = () => {
    navigate(`/measurements?customerId=${id}`)
  }

  // Get all measurements from the customer
  const getAllMeasurements = () => {
    if (!customer) return []

    const measurements = []

    // Add detailed measurements if they exist
    if (customer.detailedMeasurements && customer.detailedMeasurements.length > 0) {
      measurements.push(...customer.detailedMeasurements)
    }

    // If there are no measurements but there's a basic measurement, create a synthetic one
    if (measurements.length === 0 && customer.measurements) {
      measurements.push({
        measurementNumber: "M1",
        chest: customer.measurements.chest || "",
        waist: customer.measurements.waist || "",
        neck: customer.measurements.neck || "",
        hips: customer.measurements.hips || "",
        shoulder: customer.measurements.shoulder || "",
        sleeve: customer.measurements.sleeve || "",
        inseam: customer.measurements.inseam || "",
        // Default values for other fields
        frontPocket: "no",
        sidePocket: "single",
        patti: "no",
        collar: "no",
        bain: "no",
        kuff: "no",
        ghera: "no",
        zip: "no",
      })
    }

    return measurements
  }

  const filteredMeasurements = getAllMeasurements().filter((measurement) => {
    if (!searchTerm) return true

    // Search in all fields
    return (
      (measurement.measurementNumber &&
        measurement.measurementNumber.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (customer?.name && customer.name.toLowerCase().includes(searchTerm.toLowerCase()))
    )
  })

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
        <span className="ml-2 text-[#BCA784]">Loading customer details...</span>
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

  if (!customer) {
    return (
      <div className="p-4 bg-yellow-100 border border-yellow-400 text-yellow-700 rounded">
        <p>Customer not found</p>
        <button onClick={() => navigate(-1)} className="mt-2 px-4 py-2 bg-[#28414C] text-white rounded">
          Go Back
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-4 pb-16">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <button onClick={() => navigate(-1)} className="mr-4 p-2 rounded-full hover:bg-[#BCA784]/20">
            <ArrowLeft size={24} className="text-[#BCA784]" />
          </button>
          <h1 className="text-2xl font-bold text-white">{customer.name}</h1>
        </div>
        <button
          onClick={handleAddMeasurement}
          className="p-2 rounded-full bg-[#BCA784] text-[#28414C] hover:bg-[#BCA784]/90"
        >
          <Plus size={24} />
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search size={18} className="text-gray-400" />
        </div>
        <input
          type="text"
          placeholder="Search measurements..."
          className="pl-10 pr-4 py-2 w-full border rounded-md focus:outline-none focus:ring-2 focus:ring-[#BCA784] bg-[#28414C]/50 border-[#BCA784]/30 text-white placeholder-gray-400"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Measurements */}
      <div className="space-y-4">
        {filteredMeasurements.length > 0 ? (
          filteredMeasurements.map((measurement, index) => (
            <div key={index} className="bg-[#BCA784] rounded-lg p-4 text-[#28414C]">
              <div className="space-y-4">
                {/* Customer Info */}
                <div>
                  <div className="flex justify-between items-center">
                    <span className="text-[#28414C]/70">Measurement No.</span>
                    <span className="font-medium">{measurement.measurementNumber || `M${index + 1}`}</span>
                  </div>
                  <div className="flex justify-between items-center mt-1">
                    <span className="text-[#28414C]/70">Customer Name</span>
                    <span className="font-medium">{customer.name}</span>
                  </div>
                  <div className="flex justify-between items-center mt-1">
                    <span className="text-[#28414C]/70">Phone No.</span>
                    <span className="font-medium">{customer.phoneNumber}</span>
                  </div>
                  <div className="flex justify-between items-center mt-1">
                    <span className="text-[#28414C]/70">Address</span>
                    <span className="font-medium">{customer.address || "N/A"}</span>
                  </div>
                </div>

                {/* Measurements */}
                <div>
                  <h3 className="font-bold text-lg border-b border-[#28414C]/30 pb-1 mb-2">Measurements</h3>
                  <div className="space-y-1">
                    <div className="flex justify-between items-center">
                      <span className="text-[#28414C]/70">Length</span>
                      <span className="font-medium">{measurement.length || "N/A"}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-[#28414C]/70">Arm</span>
                      <span className="font-medium">{measurement.arm || "N/A"}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-[#28414C]/70">Teera</span>
                      <span className="font-medium">{measurement.teera || "N/A"}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-[#28414C]/70">Chest</span>
                      <span className="font-medium">{measurement.chest || "N/A"}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-[#28414C]/70">Neck</span>
                      <span className="font-medium">{measurement.neck || "N/A"}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-[#28414C]/70">Waist</span>
                      <span className="font-medium">{measurement.waist || "N/A"}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-[#28414C]/70">Pant</span>
                      <span className="font-medium">{measurement.pant || "N/A"}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-[#28414C]/70">Pancha</span>
                      <span className="font-medium">{measurement.pancha || "N/A"}</span>
                    </div>
                  </div>
                </div>

                {/* Selections */}
                <div>
                  <h3 className="font-bold text-lg border-b border-[#28414C]/30 pb-1 mb-2">Selections</h3>
                  <div className="space-y-1">
                    <div className="flex justify-between items-center">
                      <span className="text-[#28414C]/70">Front Pocket</span>
                      <span className="font-medium">{measurement.frontPocket === "yes" ? "Yes" : "No"}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-[#28414C]/70">Side Pocket</span>
                      <span className="font-medium">{measurement.sidePocket === "single" ? "Single" : "Double"}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-[#28414C]/70">Patti</span>
                      <span className="font-medium">{measurement.patti === "yes" ? "Yes" : "No"}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-[#28414C]/70">Collar</span>
                      <span className="font-medium">{measurement.collar === "yes" ? "Yes" : "No"}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-[#28414C]/70">Bain</span>
                      <span className="font-medium">{measurement.bain === "yes" ? "Yes" : "No"}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-[#28414C]/70">Cuff</span>
                      <span className="font-medium">{measurement.kuff === "yes" ? "Yes" : "No"}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-[#28414C]/70">Ghera</span>
                      <span className="font-medium">{measurement.ghera === "yes" ? "Yes" : "No"}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-[#28414C]/70">Zip</span>
                      <span className="font-medium">{measurement.zip === "yes" ? "Yes" : "No"}</span>
                    </div>
                  </div>
                </div>
                {measurement.notes && (
                  <div>
                    <h3 className="font-bold text-lg border-b border-[#28414C]/30 pb-1 mb-2 mt-4">Additional Notes</h3>
                    <p className="text-sm">{measurement.notes}</p>
                  </div>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="bg-[#28414C]/80 border border-[#BCA784]/20 rounded-lg p-6 text-center">
            <p className="text-gray-300">No measurements found for this customer.</p>
            <button
              onClick={handleAddMeasurement}
              className="mt-4 px-4 py-2 bg-[#BCA784] text-[#28414C] rounded-md hover:bg-[#BCA784]/90"
            >
              Add Measurement
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default CustomerDetail
