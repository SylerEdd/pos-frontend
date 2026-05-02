import { useAuth } from "../../context/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import { useOrder } from "../../context/OrderContext";

import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  ClipboardList,
  Settings,
  LogOut,
  Wrench,
  BarChart2,
} from "lucide-react";

export function Sidebar() {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const { activeTab, activeOrderId } = useOrder();
  const location = useLocation();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <aside className="flex flex-col justify-between w-36 min-h-screen bg-white border-r border-gray-100 py-6 px-3">
      <div>
        <div className="mb-8 px-2">
          <span
            className="block text-center text-sm font-bold text-white py-2 px-3 rounded-lg"
            style={{ background: "#0C2B4E" }}
          >
            FlowServe
          </span>
        </div>
        {/* Dashboard */}
        <nav className="flex flex-col gap-1">
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              `flex flex-col items-center gap-1 py-3 px-2 rounded-xl text-xs font-medium transition-colors ${isActive ? "bg-[#0C2B4E] text-white" : "text-gray-500 hover:bg-gray-100 hover:text-gray-800"}`
            }
          >
            <LayoutDashboard size={20} />
            Dashboard
          </NavLink>

          {/* Order/Menu*/}
          <button
            onClick={() => {
              if (activeTab) {
                navigate("/orders", {
                  state: { tab: activeTab, orderId: activeOrderId },
                });
              } else {
                navigate("/dashboard");
              }
            }}
            className={`flex flex-col items-center gap-1 py-3 px-2 rounded-xl text-xs font-medium transition-colors ${location.pathname === "/orders" ? "bg-[#0C2B4E] text-white" : "text-gray-500 hover:bg-gray-100 hover:text-gray-800"}`}
          >
            <ClipboardList size={20} />
            Order
          </button>
          {/* Manage Items, Tables (only accessible to Managers */}
          {user?.roles.includes("MANAGER") && (
            <NavLink
              to="/manage"
              className={({ isActive }) =>
                `flex flex-col items-center gap-1 py-3 px-2 rounded-xl text-xs font-medium transition-colors ${isActive ? "bg-[#0C2B4E] text-white" : "text-gray-500 hover:bg-gray-100 hover:text-gray-800"}`
              }
            >
              <Wrench size={20} />
              Manage
            </NavLink>
          )}
          {/* Reports (only accessible to Managers)*/}
          {user?.roles.includes("MANAGER") && (
            <NavLink
              to="/reports"
              className={({ isActive }) =>
                `flex flex-col items-center gap-1 py-3 px-2 rounded-xl text-xs font-medium transition-colors ${isActive ? "bg-[#0C2B4E] text-white" : "text-gray-500 hover:bg-gray-100 hover:text-gray-800"}`
              }
            >
              <BarChart2 size={20} />
              Reports
            </NavLink>
          )}
        </nav>
      </div>

      <div className="flex flex-col gap-1">
        <NavLink
          to="/settings"
          className="flex flex-col items-center gap-1 py-3 px-2 rounded-xl text-xs font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-800 transition-colors"
        >
          <Settings size={20} />
          User Settings
        </NavLink>

        <button
          onClick={handleLogout}
          className="flex flex-col items-center gap-1 py-3 px-2 rounded-xl text-xs font-medium text-gray-500 hover:bg-red-50 hover:text-red-600 transition-colors"
        >
          <LogOut size={20} />
          Log out
        </button>
      </div>
    </aside>
  );
}
