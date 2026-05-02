import { Search, UserCircle } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

export function TopBar() {
  const { user } = useAuth();
  return (
    <header className="flex items-center justify-between bg-white border-b border-gray-100 px-6 py-3 h-16">
      {/* Search button */}
      <div className="flex items-center gap-2 bg-gray-100 rounded-full px-4 py-2 w-80">
        <Search size={16} className="text-gray-4400 shrink-0" />
        <input
          type="text"
          placeholder="Search menu item"
          className="bg-transparent text-sm outline-none w-full placeholder-gray-400"
        />
      </div>

      {/* User profile */}
      <div className="flex items-center gap-3">
        <div className="text-right">
          <p className="text-sm font-semibold text-gray-800">
            {user?.fullName}
          </p>
          <p className="text-xs text-gray-400">
            {user?.roles[0]?.toUpperCase()}
          </p>
        </div>
        <div className="w-9 h-9 rounded-full bg-gray-200 flex items-center justify-center">
          <UserCircle size={24} className="text-gray-500" />
        </div>
      </div>
    </header>
  );
}
