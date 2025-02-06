import { NavLink } from "react-router-dom";
import {
  Package,
  DollarSign,
  Globe,
  ClipboardList,
  Box,
  Users,
  LogOut,
  LayoutDashboard,
  Settings2,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

const Sidebar = () => {
  const { logout } = useAuth();
  const menuItems = [
    { path: "/", icon: <LayoutDashboard size={20} />, label: "Dashboard" },
    { path: "/products", icon: <Package size={20} />, label: "Products" },
    { path: "/charges", icon: <DollarSign size={20} />, label: "Charges" },
    { path: "/currencies", icon: <Globe size={20} />, label: "Currencies" },
    { path: "/inventory", icon: <Box size={20} />, label: "Inventory" },
    { path: "/users", icon: <Users size={20} />, label: "Users" },
    {
      path: "/configurations",
      icon: <Settings2 size={20} />,
      label: "Configurations",
    },
    {
      path: "/audit-logs",
      icon: <ClipboardList size={20} />,
      label: "Audit Logs",
    },
  ];

  return (
    <div className="bg-gray-900 text-white w-64 min-h-screen px-4 py-6">
      <div className="flex items-center mb-8 px-2">
        <Package className="text-blue-400" size={24} />
        <span className="ml-2 text-xl font-bold">ProCart Admin</span>
      </div>
      <nav>
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center px-4 py-3 mb-2 rounded-lg transition-colors ${
                isActive
                  ? "bg-blue-600 text-white"
                  : "text-gray-300 hover:bg-gray-800"
              }`
            }
          >
            {item.icon}
            <span className="ml-3">{item.label}</span>
          </NavLink>
        ))}
        <button
          onClick={logout}
          className="flex items-center w-full px-4 py-3 mt-4 rounded-lg text-gray-300 hover:bg-gray-800 transition-colors"
        >
          <LogOut size={20} />
          <span className="ml-3">Logout</span>
        </button>
      </nav>
    </div>
  );
};

export default Sidebar;
