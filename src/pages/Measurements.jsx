"use client"

import { useState, useEffect } from "react"
import { ArrowLeft, Save, AlertCircle } from "lucide-react"
import { useNavigate, useLocation } from "react-router-dom"
import axios from "axios"

const Measurements = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [customer, setCustomer] = useState(null)

  // Get customerId from query params
  const queryParams = new URLSearchParams(location.search)
  const customerId = queryParams.get("customerId")

  const [formData, setFormData] = useState({
    measurementNumber: "",
    customerName: "",
    phoneNumber: "",
    address: "",
    // Measurement details
    length: "",
    arm: "",
    teera: "",
    chest: "",
    neck: "",
    waist: "",
    pant: "",
    pancha: "",
    // Style options
    frontPocket: "no",
    sidePocket: "single",
    patti: "no",
    collar: "no",
    bain: "no",
    kuff: "no",
    ghera: "no",
    zip: "no",
    notes: "",
  })

  // Fetch customer data if customerId is provided
  useEffect(() => {
    const fetchCustomerData = async () => {
      if (!customerId) return

      try {
        const response = await axios.get(`/api/customers/${customerId}`)
        setCustomer(response.data)

        // Pre-fill form with customer data
        setFormData((prev) => ({
          ...prev,
          customerName: response.data.name || "",
          phoneNumber: response.data.phoneNumber || "",
          address: response.data.address || "",
          // Pre-fill measurements if they exist
          chest: response.data.measurements?.chest || "",
          waist: response.data.measurements?.waist || "",
          neck: response.data.measurements?.neck || "",
        }))
      } catch (err) {
        console.error("Error fetching customer:", err)
        setError("Failed to load customer data. Please try again.")
      }
    }

    fetchCustomerData()
  }, [customerId])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleRadioChange = (name, value) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      // Create the measurement object
      const measurementData = {
        measurementNumber: formData.measurementNumber || `M${new Date().getTime().toString().slice(-5)}`,
        length: formData.length,
        arm: formData.arm,
        teera: formData.teera,
        chest: formData.chest,
        neck: formData.neck,
        waist: formData.waist,
        pant: formData.pant,
        pancha: formData.pancha,
        frontPocket: formData.frontPocket,
        sidePocket: formData.sidePocket,
        patti: formData.patti,
        collar: formData.collar,
        bain: formData.bain,
        kuff: formData.kuff,
        ghera: formData.ghera,
        zip: formData.zip,
        notes: formData.notes,
        date: new Date().toISOString(),
      }

      if (customerId) {
        // If we have a customerId, update the customer with the new measurement
        await axios.post(`/api/customers/${customerId}/measurements`, measurementData)
        // Navigate back to customer detail page
        navigate(`/customers/${customerId}`)
      } else {
        // If no customerId, create a new customer with the measurement
        const customerData = {
          name: formData.customerName,
          phoneNumber: formData.phoneNumber,
          email: "",
          address: formData.address,
          measurements: {
            chest: formData.chest,
            waist: formData.waist,
            neck: formData.neck,
          },
          detailedMeasurements: [measurementData],
        }

        // Create the customer
        const response = await axios.post("/api/customers", customerData)

        // Navigate to the new customer's detail page
        navigate(`/customers/${response.data._id}`)
      }
    } catch (err) {
      console.error("Error saving measurement:", err)
      setError(err.response?.data?.message || "Failed to save measurement. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6 pb-16">
      <div className="flex items-center">
        <button onClick={() => navigate(-1)} className="mr-4 p-2 rounded-full hover:bg-[#BCA784]/20">
          <ArrowLeft size={24} className="text-[#BCA784]" />
        </button>
        <h1 className="text-2xl font-bold text-white">Add Measurement</h1>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded flex items-center">
          <AlertCircle size={18} className="mr-2" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Customer Information */}
        <div className="bg-[#28414C] rounded-lg p-6 space-y-4 border border-[#BCA784]/30">
          <div>
            <input
              type="text"
              name="measurementNumber"
              placeholder="Measurement Number"
              value={formData.measurementNumber}
              onChange={handleChange}
              className="w-full p-3 rounded-lg bg-[#28414C] border border-[#BCA784]/50 text-white placeholder-gray-400 focus:border-[#BCA784] focus:ring-1 focus:ring-[#BCA784]"
            />
          </div>

          <div>
            <input
              type="text"
              name="customerName"
              placeholder="Customer Name"
              value={formData.customerName}
              onChange={handleChange}
              className="w-full p-3 rounded-lg bg-[#28414C] border border-[#BCA784]/50 text-white placeholder-gray-400 focus:border-[#BCA784] focus:ring-1 focus:ring-[#BCA784]"
              required
              readOnly={!!customerId}
            />
          </div>

          <div>
            <input
              type="text"
              name="phoneNumber"
              placeholder="Customer Phone Number"
              value={formData.phoneNumber}
              onChange={handleChange}
              className="w-full p-3 rounded-lg bg-[#28414C] border border-[#BCA784]/50 text-white placeholder-gray-400 focus:border-[#BCA784] focus:ring-1 focus:ring-[#BCA784]"
              required
              readOnly={!!customerId}
            />
          </div>

          <div>
            <textarea
              name="address"
              placeholder="Enter Customer Address"
              value={formData.address}
              onChange={handleChange}
              rows={3}
              className="w-full p-3 rounded-lg bg-[#28414C] border border-[#BCA784]/50 text-white placeholder-gray-400 focus:border-[#BCA784] focus:ring-1 focus:ring-[#BCA784]"
              readOnly={!!customerId}
            />
          </div>
        </div>

        {/* Measurement Details */}
        <div>
          <h2 className="text-xl font-semibold text-[#BCA784] mb-4">Measurement Details</h2>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <input
                type="text"
                name="length"
                placeholder="Length"
                value={formData.length}
                onChange={handleChange}
                className="w-full p-3 rounded-lg bg-[#28414C] border border-[#BCA784]/50 text-white placeholder-gray-400 focus:border-[#BCA784] focus:ring-1 focus:ring-[#BCA784]"
              />
            </div>

            <div>
              <input
                type="text"
                name="arm"
                placeholder="Arm"
                value={formData.arm}
                onChange={handleChange}
                className="w-full p-3 rounded-lg bg-[#28414C] border border-[#BCA784]/50 text-white placeholder-gray-400 focus:border-[#BCA784] focus:ring-1 focus:ring-[#BCA784]"
              />
            </div>

            <div>
              <input
                type="text"
                name="teera"
                placeholder="Teera"
                value={formData.teera}
                onChange={handleChange}
                className="w-full p-3 rounded-lg bg-[#28414C] border border-[#BCA784]/50 text-white placeholder-gray-400 focus:border-[#BCA784] focus:ring-1 focus:ring-[#BCA784]"
              />
            </div>

            <div>
              <input
                type="text"
                name="chest"
                placeholder="Chest"
                value={formData.chest}
                onChange={handleChange}
                className="w-full p-3 rounded-lg bg-[#28414C] border border-[#BCA784]/50 text-white placeholder-gray-400 focus:border-[#BCA784] focus:ring-1 focus:ring-[#BCA784]"
              />
            </div>

            <div>
              <input
                type="text"
                name="neck"
                placeholder="Neck"
                value={formData.neck}
                onChange={handleChange}
                className="w-full p-3 rounded-lg bg-[#28414C] border border-[#BCA784]/50 text-white placeholder-gray-400 focus:border-[#BCA784] focus:ring-1 focus:ring-[#BCA784]"
              />
            </div>

            <div>
              <input
                type="text"
                name="waist"
                placeholder="Waist"
                value={formData.waist}
                onChange={handleChange}
                className="w-full p-3 rounded-lg bg-[#28414C] border border-[#BCA784]/50 text-white placeholder-gray-400 focus:border-[#BCA784] focus:ring-1 focus:ring-[#BCA784]"
              />
            </div>

            <div>
              <input
                type="text"
                name="pant"
                placeholder="Pant"
                value={formData.pant}
                onChange={handleChange}
                className="w-full p-3 rounded-lg bg-[#28414C] border border-[#BCA784]/50 text-white placeholder-gray-400 focus:border-[#BCA784] focus:ring-1 focus:ring-[#BCA784]"
              />
            </div>

            <div>
              <input
                type="text"
                name="pancha"
                placeholder="Pancha"
                value={formData.pancha}
                onChange={handleChange}
                className="w-full p-3 rounded-lg bg-[#28414C] border border-[#BCA784]/50 text-white placeholder-gray-400 focus:border-[#BCA784] focus:ring-1 focus:ring-[#BCA784]"
              />
            </div>
          </div>
        </div>

        {/* Style Options */}
        <div className="space-y-6">
          {/* Front Pocket */}
          <div>
            <h3 className="text-lg text-[#BCA784] mb-2">Front Pocket</h3>
            <div className="flex space-x-6">
              <label className="flex items-center">
                <div
                  className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${formData.frontPocket === "yes" ? "border-[#BCA784]" : "border-gray-400"}`}
                >
                  {formData.frontPocket === "yes" && <div className="w-3 h-3 rounded-full bg-[#BCA784]"></div>}
                </div>
                <span className="ml-2 text-white">Yes</span>
                <input
                  type="radio"
                  name="frontPocket"
                  value="yes"
                  checked={formData.frontPocket === "yes"}
                  onChange={() => handleRadioChange("frontPocket", "yes")}
                  className="hidden"
                />
              </label>

              <label className="flex items-center">
                <div
                  className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${formData.frontPocket === "no" ? "border-[#BCA784]" : "border-gray-400"}`}
                >
                  {formData.frontPocket === "no" && <div className="w-3 h-3 rounded-full bg-[#BCA784]"></div>}
                </div>
                <span className="ml-2 text-white">No</span>
                <input
                  type="radio"
                  name="frontPocket"
                  value="no"
                  checked={formData.frontPocket === "no"}
                  onChange={() => handleRadioChange("frontPocket", "no")}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          {/* Side Pocket */}
          <div>
            <h3 className="text-lg text-[#BCA784] mb-2">Side Pocket</h3>
            <div className="flex space-x-6">
              <label className="flex items-center">
                <div
                  className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${formData.sidePocket === "single" ? "border-[#BCA784]" : "border-gray-400"}`}
                >
                  {formData.sidePocket === "single" && <div className="w-3 h-3 rounded-full bg-[#BCA784]"></div>}
                </div>
                <span className="ml-2 text-white">Single</span>
                <input
                  type="radio"
                  name="sidePocket"
                  value="single"
                  checked={formData.sidePocket === "single"}
                  onChange={() => handleRadioChange("sidePocket", "single")}
                  className="hidden"
                />
              </label>

              <label className="flex items-center">
                <div
                  className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${formData.sidePocket === "double" ? "border-[#BCA784]" : "border-gray-400"}`}
                >
                  {formData.sidePocket === "double" && <div className="w-3 h-3 rounded-full bg-[#BCA784]"></div>}
                </div>
                <span className="ml-2 text-white">Double</span>
                <input
                  type="radio"
                  name="sidePocket"
                  value="double"
                  checked={formData.sidePocket === "double"}
                  onChange={() => handleRadioChange("sidePocket", "double")}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          {/* Patti */}
          <div>
            <h3 className="text-lg text-[#BCA784] mb-2">Patti</h3>
            <div className="flex space-x-6">
              <label className="flex items-center">
                <div
                  className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${formData.patti === "yes" ? "border-[#BCA784]" : "border-gray-400"}`}
                >
                  {formData.patti === "yes" && <div className="w-3 h-3 rounded-full bg-[#BCA784]"></div>}
                </div>
                <span className="ml-2 text-white">Yes</span>
                <input
                  type="radio"
                  name="patti"
                  value="yes"
                  checked={formData.patti === "yes"}
                  onChange={() => handleRadioChange("patti", "yes")}
                  className="hidden"
                />
              </label>

              <label className="flex items-center">
                <div
                  className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${formData.patti === "no" ? "border-[#BCA784]" : "border-gray-400"}`}
                >
                  {formData.patti === "no" && <div className="w-3 h-3 rounded-full bg-[#BCA784]"></div>}
                </div>
                <span className="ml-2 text-white">No</span>
                <input
                  type="radio"
                  name="patti"
                  value="no"
                  checked={formData.patti === "no"}
                  onChange={() => handleRadioChange("patti", "no")}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          {/* Collar */}
          <div>
            <h3 className="text-lg text-[#BCA784] mb-2">Collar</h3>
            <div className="flex space-x-6">
              <label className="flex items-center">
                <div
                  className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${formData.collar === "yes" ? "border-[#BCA784]" : "border-gray-400"}`}
                >
                  {formData.collar === "yes" && <div className="w-3 h-3 rounded-full bg-[#BCA784]"></div>}
                </div>
                <span className="ml-2 text-white">Yes</span>
                <input
                  type="radio"
                  name="collar"
                  value="yes"
                  checked={formData.collar === "yes"}
                  onChange={() => handleRadioChange("collar", "yes")}
                  className="hidden"
                />
              </label>

              <label className="flex items-center">
                <div
                  className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${formData.collar === "no" ? "border-[#BCA784]" : "border-gray-400"}`}
                >
                  {formData.collar === "no" && <div className="w-3 h-3 rounded-full bg-[#BCA784]"></div>}
                </div>
                <span className="ml-2 text-white">No</span>
                <input
                  type="radio"
                  name="collar"
                  value="no"
                  checked={formData.collar === "no"}
                  onChange={() => handleRadioChange("collar", "no")}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          {/* Bain */}
          <div>
            <h3 className="text-lg text-[#BCA784] mb-2">Bain</h3>
            <div className="flex space-x-6">
              <label className="flex items-center">
                <div
                  className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${formData.bain === "yes" ? "border-[#BCA784]" : "border-gray-400"}`}
                >
                  {formData.bain === "yes" && <div className="w-3 h-3 rounded-full bg-[#BCA784]"></div>}
                </div>
                <span className="ml-2 text-white">Yes</span>
                <input
                  type="radio"
                  name="bain"
                  value="yes"
                  checked={formData.bain === "yes"}
                  onChange={() => handleRadioChange("bain", "yes")}
                  className="hidden"
                />
              </label>

              <label className="flex items-center">
                <div
                  className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${formData.bain === "no" ? "border-[#BCA784]" : "border-gray-400"}`}
                >
                  {formData.bain === "no" && <div className="w-3 h-3 rounded-full bg-[#BCA784]"></div>}
                </div>
                <span className="ml-2 text-white">No</span>
                <input
                  type="radio"
                  name="bain"
                  value="no"
                  checked={formData.bain === "no"}
                  onChange={() => handleRadioChange("bain", "no")}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          {/* Kuff */}
          <div>
            <h3 className="text-lg text-[#BCA784] mb-2">Kuff</h3>
            <div className="flex space-x-6">
              <label className="flex items-center">
                <div
                  className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${formData.kuff === "yes" ? "border-[#BCA784]" : "border-gray-400"}`}
                >
                  {formData.kuff === "yes" && <div className="w-3 h-3 rounded-full bg-[#BCA784]"></div>}
                </div>
                <span className="ml-2 text-white">Yes</span>
                <input
                  type="radio"
                  name="kuff"
                  value="yes"
                  checked={formData.kuff === "yes"}
                  onChange={() => handleRadioChange("kuff", "yes")}
                  className="hidden"
                />
              </label>

              <label className="flex items-center">
                <div
                  className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${formData.kuff === "no" ? "border-[#BCA784]" : "border-gray-400"}`}
                >
                  {formData.kuff === "no" && <div className="w-3 h-3 rounded-full bg-[#BCA784]"></div>}
                </div>
                <span className="ml-2 text-white">No</span>
                <input
                  type="radio"
                  name="kuff"
                  value="no"
                  checked={formData.kuff === "no"}
                  onChange={() => handleRadioChange("kuff", "no")}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          {/* Ghera */}
          <div>
            <h3 className="text-lg text-[#BCA784] mb-2">Ghera</h3>
            <div className="flex space-x-6">
              <label className="flex items-center">
                <div
                  className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${formData.ghera === "yes" ? "border-[#BCA784]" : "border-gray-400"}`}
                >
                  {formData.ghera === "yes" && <div className="w-3 h-3 rounded-full bg-[#BCA784]"></div>}
                </div>
                <span className="ml-2 text-white">Yes</span>
                <input
                  type="radio"
                  name="ghera"
                  value="yes"
                  checked={formData.ghera === "yes"}
                  onChange={() => handleRadioChange("ghera", "yes")}
                  className="hidden"
                />
              </label>

              <label className="flex items-center">
                <div
                  className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${formData.ghera === "no" ? "border-[#BCA784]" : "border-gray-400"}`}
                >
                  {formData.ghera === "no" && <div className="w-3 h-3 rounded-full bg-[#BCA784]"></div>}
                </div>
                <span className="ml-2 text-white">No</span>
                <input
                  type="radio"
                  name="ghera"
                  value="no"
                  checked={formData.ghera === "no"}
                  onChange={() => handleRadioChange("ghera", "no")}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          {/* Zip */}
          <div>
            <h3 className="text-lg text-[#BCA784] mb-2">Zip</h3>
            <div className="flex space-x-6">
              <label className="flex items-center">
                <div
                  className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${formData.zip === "yes" ? "border-[#BCA784]" : "border-gray-400"}`}
                >
                  {formData.zip === "yes" && <div className="w-3 h-3 rounded-full bg-[#BCA784]"></div>}
                </div>
                <span className="ml-2 text-white">Yes</span>
                <input
                  type="radio"
                  name="zip"
                  value="yes"
                  checked={formData.zip === "yes"}
                  onChange={() => handleRadioChange("zip", "yes")}
                  className="hidden"
                />
              </label>

              <label className="flex items-center">
                <div
                  className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${formData.zip === "no" ? "border-[#BCA784]" : "border-gray-400"}`}
                >
                  {formData.zip === "no" && <div className="w-3 h-3 rounded-full bg-[#BCA784]"></div>}
                </div>
                <span className="ml-2 text-white">No</span>
                <input
                  type="radio"
                  name="zip"
                  value="no"
                  checked={formData.zip === "no"}
                  onChange={() => handleRadioChange("zip", "no")}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          {/* Notes */}
          <div>
            <h3 className="text-lg text-[#BCA784] mb-2">Additional Notes</h3>
            <textarea
              name="notes"
              placeholder="Add any additional notes here..."
              value={formData.notes}
              onChange={handleChange}
              rows={3}
              className="w-full p-3 rounded-lg bg-[#28414C] border border-[#BCA784]/50 text-white placeholder-gray-400 focus:border-[#BCA784] focus:ring-1 focus:ring-[#BCA784]"
            />
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full py-4 bg-[#BCA784] text-[#28414C] font-bold rounded-lg hover:bg-[#BCA784]/90 flex items-center justify-center"
          disabled={loading}
        >
          {loading ? (
            <>
              <svg
                className="animate-spin -ml-1 mr-2 h-5 w-5 text-[#28414C]"
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
              Saving...
            </>
          ) : (
            <>
              <Save size={20} className="mr-2" />
              Submit
            </>
          )}
        </button>
      </form>
    </div>
  )
}

export default Measurements
