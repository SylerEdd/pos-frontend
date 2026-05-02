import { Sidebar } from "../../components/layout/Sidebar";
import { TopBar } from "../../components/layout/TopBar";
import { UserSettings } from "../../components/settings/UserSettings";

export function UserSettingsPage() {
  return (
    <div className="flex h-screen w-screen bg-gray-50">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <TopBar />
        <div className="flex flex-1 overflow-hidden">
          <div className="flex-1 overflow-y-auto bg-gray-50">
            <UserSettings />
          </div>
        </div>
      </div>
    </div>
  );
}
