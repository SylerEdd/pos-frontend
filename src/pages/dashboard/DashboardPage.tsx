import { useState } from "react";
import { Sidebar } from "../../components/layout/Sidebar";
import { TopBar } from "../../components/layout/TopBar";
import { TableGrid } from "../../components/dashboard/TableGrid";
import { OrderPanel } from "../../components/dashboard/OrderPanel";

interface Tab {
  id: number;
  tableNumber: string;
  tableStatus: string;
  createdAt: string;
}

export function DashboardPage() {
  const [selectedTab, setSelectedTab] = useState<Tab | null>(null);

  return (
    <div className="flex h-screen w-screen bg-gray-50">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <TopBar />
        <div className="flex flex-1 overflow-hidden">
          <div className="flex-1 overflow-y-auto bg-gray-50">
            <TableGrid
              selectedTableId={selectedTab?.id ?? null}
              onTableSelect={(tab) => setSelectedTab(tab)}
            />
          </div>

          <OrderPanel selectedTab={selectedTab} />
        </div>
      </div>
    </div>
  );
}
