import React from "react"
import ReactDOM from "react-dom/client"
import App from "./App"
import "./index.css"
import axios from "axios"

// Set base URL for API requests to the deployed backend
// Make sure there's no trailing slash
const apiBaseUrl = import.meta.env.VITE_API_URL || "https://grace-tailor-backend.vercel.app"
axios.defaults.baseURL = apiBaseUrl

// Add request interceptor for debugging
axios.interceptors.request.use(
  (config) => {
    // Log the complete URL being requested
    const fullUrl = config.baseURL + config.url
    console.log(`Making ${config.method.toUpperCase()} request to: ${fullUrl}`)
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
