import { useEffect, useState } from "react";
import { TableCard } from "./TableCard";
import { getAllTabs } from "../../api/tabApi";
import { getAllOrders } from "../../api/orderApi";

interface Tab {
  id: number;
  tableNumber: string;
  tableStatus: string;
  createdAt: string;
}

interface TableGridProps {
  selectedTableId: number | null;
  onTableSelect: (tab: Tab) => void;
}

export function TableGrid({ selectedTableId, onTableSelect }: TableGridProps) {
  const [tabs, setTabs] = useState<Tab[]>([]);
  const [orderOpenedAt, setOrderOpenedAt] = useState<Record<number, string>>(
    {},
  );
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    Promise.all([getAllTabs(), getAllOrders()])
      .then(([tabsRes, ordersRes]) => {
        setTabs(tabsRes.data);

        //creating a tabId map for OPEN orders openedAt
        const map: Record<number, string> = {};
        ordersRes.data.forEach((order: any) => {
          if (order.status === "OPEN") {
            map[order.tabId] = order.openedAt;
          }
        });
        setOrderOpenedAt(map);
      })
      .catch((err) => console.error("Failed to load tables", err))
      .finally(() => setIsLoading(false));
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full text-gray-400">
        Loading tables...
      </div>
    );
  }

  if (tabs.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-gray-400">
        No tables found.
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Top */}
      <div className="flex items-center gap-4 mb-6">
        <h2 className="text-xl font-bold text-gray-800">Manage tables</h2>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-[#A8D5A2] inline-block" />
          <span className="text-xs text-gray-500">Available</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-[#C9A8D5] inline-block" />
          <span className="text-xs text-gray-500">Occupied</span>
        </div>
      </div>

      {/* all the tables */}
      <div className="grid grid-cols-4 gap-3">
        {tabs.map((tab) => (
          <TableCard
            key={tab.id}
            id={tab.id}
            tableNumber={tab.tableNumber}
            tableStatus={tab.tableStatus}
            openedAt={orderOpenedAt[tab.id] ?? ""}
            isSelected={selectedTableId === tab.id}
            onClick={() => onTableSelect(tab)}
          />
        ))}
      </div>
    </div>
  );
}
