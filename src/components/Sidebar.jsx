"use client"

import { Link, useLocation } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import { LayoutDashboard, ShoppingBag, Users, UserCog, DollarSign, X, Ruler } from "lucide-react"

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const location = useLocation()
  const { user, logout } = useAuth()

  const navItems = [
    { path: "/dashboard", name: "Dashboard", icon: <LayoutDashboard size={20} /> },
    { path: "/orders", name: "Orders", icon: <ShoppingBag size={20} /> },
    { path: "/customers", name: "Customers", icon: <Users size={20} /> },
    { path: "/staff", name: "Staff Management", icon: <UserCog size={20} /> },
    { path: "/income", name: "Income Management", icon: <DollarSign size={20} /> },
    { path: "/measurements", name: "Measurements", icon: <Ruler size={20} /> },
  ]

  return (
    <>
      {/* Mobile sidebar backdrop */}
      {isOpen && <div className="fixed inset-0 z-20 bg-black bg-opacity-50 lg:hidden" onClick={toggleSidebar}></div>}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-30 w-64 bg-[#28414C] shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Sidebar header */}
          <div className="flex items-center justify-between p-4 border-b border-[#BCA784]/30">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 rounded-full bg-[#BCA784] flex items-center justify-center text-[#28414C]">
                <img src="/tailor-logo.png" alt=""  />
              </div>
              <div>
                <h3 className="font-medium text-white">Hameed Hussain</h3>
                <p className="text-xs text-gray-400">Shop Owner</p>
              </div>
            </div>
            <button onClick={toggleSidebar} className="text-gray-400 hover:text-white lg:hidden">
              <X size={20} />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto py-4">
            <ul className="space-y-1">
              {navItems.map((item) => (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className={`flex items-center px-4 py-3 text-gray-300 hover:bg-[#BCA784]/20 hover:text-[#BCA784] ${
                      location.pathname === item.path
                        ? "bg-[#BCA784]/20 text-[#BCA784] border-l-4 border-[#BCA784]"
                        : ""
                    }`}
                  >
                    <span className="mr-3">{item.icon}</span>
                    <span>{item.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Sidebar footer */}
          <div className="p-4 border-t border-[#BCA784]/30">
            <button
              onClick={logout}
              className="w-full px-4 py-2 text-sm text-[#28414C] bg-[#BCA784] rounded-md hover:bg-[#BCA784]/90"
            >
              Logout
            </button>
          </div>
        </div>
      </aside>
    </>
  )
}

export default Sidebar
