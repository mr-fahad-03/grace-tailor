"use client"

import { createContext, useState, useContext, useEffect } from "react"
import axios from "axios"

const AuthContext = createContext()

export const useAuth = () => useContext(AuthContext)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    // Check if user is logged in
    const checkLoggedIn = async () => {
      try {
        const token = localStorage.getItem("token")
        if (token) {
          axios.defaults.headers.common["Authorization"] = `Bearer ${token}`
          const res = await axios.get("/api/auth/verify")
          setUser(res.data.user)
        }
      } catch (error) {
        console.error("Auth verification error:", error)
        localStorage.removeItem("token")
        delete axios.defaults.headers.common["Authorization"]
      }
      setLoading(false)
    }

    checkLoggedIn()
  }, [])

  const login = async (email, password) => {
    try {
      setError("")
      console.log("Attempting login with:", { email, password })

      // Make sure we're using the correct URL
      const apiUrl = axios.defaults.baseURL || "http://localhost:5000"
      console.log("API URL:", apiUrl)

      const res = await axios.post(`${apiUrl}/api/auth/login`, { email, password })
      console.log("Login response:", res.data)

      localStorage.setItem("token", res.data.token)
      axios.defaults.headers.common["Authorization"] = `Bearer ${res.data.token}`
      setUser(res.data.user)
      return true
    } catch (error) {
      console.error("Login error details:", error)
      const errorMessage = error.response?.data?.message || "Login failed. Please check your credentials."
      console.error("Login error message:", errorMessage)
      setError(errorMessage)
      return false
    }
  }

  const logout = () => {
    localStorage.removeItem("token")
    delete axios.defaults.headers.common["Authorization"]
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, error, setError }}>{children}</AuthContext.Provider>
  )
}
