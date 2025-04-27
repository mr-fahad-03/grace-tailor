import React from "react"
import ReactDOM from "react-dom/client"
import App from "./App"
import "./index.css"
import axios from "axios"

// Set base URL for API requests
axios.defaults.baseURL = import.meta.env.VITE_API_URL || "http://localhost:5000"

// Add request interceptor for debugging
axios.interceptors.request.use(
  (config) => {
    console.log(`Making ${config.method.toUpperCase()} request to: ${config.baseURL}${config.url}`)
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
