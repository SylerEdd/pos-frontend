import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";

interface Tab {
  id: number;
  tableNumber: string;
  tableStatus: string;
  createdAt: string;
}

interface OrderContextType {
  activeTab: Tab | null;
  activeOrderId: number | null;
  setActiveOrder: (tab: Tab, orderId: number | null) => void;
  clearActiveOrder: () => void;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export function OrderProvider({ children }: { children: ReactNode }) {
  const [activeTab, setActiveTab] = useState<Tab | null>(null);
  const [activeOrderId, setActiveOrderId] = useState<number | null>(null);

  const setActiveOrder = (tab: Tab, orderId: number | null) => {
    setActiveTab(tab);
    setActiveOrderId(orderId);
  };

  const clearActiveOrder = () => {
    setActiveTab(null);
    setActiveOrderId(null);
  };

  return (
    <OrderContext.Provider
      value={{ activeTab, activeOrderId, setActiveOrder, clearActiveOrder }}
    >
      {children}
    </OrderContext.Provider>
  );
}

export function useOrder() {
  const ctx = useContext(OrderContext);
  if (!ctx) throw new Error("useOrder must be used within an OrderProvider");
  return ctx;
}
