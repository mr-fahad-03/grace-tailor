import { Link, useLocation } from "react-router-dom"
import { LayoutDashboard, ShoppingBag, Users, UserCog, DollarSign, Ruler } from "lucide-react"

const MobileNavbar = () => {
  const location = useLocation()

  const navItems = [
    { path: "/dashboard", name: "Home", icon: <LayoutDashboard size={20} /> },
    { path: "/orders", name: "Orders", icon: <ShoppingBag size={20} /> },
    { path: "/customers", name: "Customers", icon: <Users size={20} /> },
    { path: "/staff", name: "Staff", icon: <UserCog size={20} /> },
    { path: "/income", name: "Income", icon: <DollarSign size={20} /> },
    { path: "/measurements", name: "Measure", icon: <Ruler size={20} /> },
  ]

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-[#28414C] border-t border-[#BCA784]/30 md:hidden z-10">
      <div className="flex justify-around items-center h-16">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex flex-col items-center justify-center w-full h-full ${
              location.pathname === item.path ? "text-[#BCA784]" : "text-gray-400"
            }`}
          >
            {item.icon}
            <span className="text-xs mt-1">{item.name}</span>
          </Link>
        ))}
      </div>
    </div>
  )
}

export default MobileNavbar
