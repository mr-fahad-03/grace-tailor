"use client"

import { useAuth } from "../context/AuthContext"
import { Menu, Search, Settings } from "lucide-react"

const Header = ({ toggleSidebar }) => {
  const { user, logout } = useAuth()

  return (
    <header className="bg-[#28414C] text-white shadow-md">
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center">
          <button onClick={toggleSidebar} className="mr-4 text-white focus:outline-none lg:hidden">
            <Menu size={24} />
          </button>
          <h1 className="text-xl font-semibold">Grace Tailor</h1>
        </div>

        <div className="flex items-center space-x-4">
          <button className="hidden md:block">
          
          </button>
          <div className="relative">
            <div className="flex items-center space-x-2">             
              <button className="text-white rounded-full p-1 hover:bg-[#BCA784]/20">
                <Settings size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
