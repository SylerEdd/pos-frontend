import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getOrdersByTab } from "../../api/orderApi";
import { useOrder } from "../../context/OrderContext";

interface OrderItem {
  id: number;
  menuItemName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

interface Order {
  id: number;
  status: string;
  totalAmount: number;
  orderItems: OrderItem[];
  openedAt: string;
}

interface Tab {
  id: number;
  tableNumber: string;
  tableStatus: string;
  createdAt: string;
}

interface OrderPanelProps {
  selectedTab: Tab | null;
}

export function OrderPanel({ selectedTab }: OrderPanelProps) {
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { setActiveOrder } = useOrder();

  useEffect(() => {
    if (!selectedTab) {
      setOrder(null);
      return;
    }

    setIsLoading(true);
    getOrdersByTab(selectedTab.id)
      .then((res) => {
        // get the most recent open order
        const orders: Order[] = res.data;
        const openOrder = orders.find((o) => o.status === "OPEN");
        setOrder(openOrder ?? null);
      })
      .catch(() => setOrder(null))
      .finally(() => setIsLoading(false));
  }, [selectedTab]);

  //Empty state
  if (!selectedTab) {
    return (
      <div className="w-80 bg-white border-l border-gray-100 flex items-center justify-center">
        <p className="text-gray-400 text-sm text-center px-6">
          Choose a table to see the order
        </p>
      </div>
    );
  }

  //Loading state
  if (isLoading) {
    return (
      <div className="w-80 bg-white border-l border-gray-100 flex items-center justify-center">
        <p className="text-gray-400 text-sm">Loading order...</p>
      </div>
    );
  }

  //No open order on the table stayte
  if (!order) {
    return (
      <div className="w-80 bg-white border-l border-gray-100 flex flex-col items-center justify-center gap-4 p-6">
        <p className="text-gray-400 text-sm text-center">
          No open order for Table #{selectedTab.tableNumber}
        </p>
        <button
          onClick={() => {
            setActiveOrder(selectedTab!, null);
            navigate("/orders", { state: { tab: selectedTab, orderId: null } });
          }}
          className="w-full py-3 rounded-xl text-white font-semibold text-sm"
          style={{ background: "#0C2B4E" }}
        >
          New Order
        </button>
      </div>
    );
  }

  // Order shows up
  return (
    <div className="w-80 bg-white border-l border-gray-100 flex flex-col h-full">
      <div className="px-6 py-4 border-b border-gray-100">
        <h3 className="font-bold text-gray-800 text-base">
          Table #{selectedTab.tableNumber}
        </h3>
        <p className="text-xs text-gray-400 mt-1">Order #{order.id}</p>
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-4 flex flex-col gap-3">
        {order.orderItems.length === 0 ? (
          <p className="text-gray-400 text-sm">No items yet</p>
        ) : (
          order.orderItems.map((item) => (
            <div key={item.id} className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-800">
                  {item.menuItemName}
                </p>
                <p className="text-xs text-gray-400">x{item.quantity}</p>
              </div>
              <p className="text-sm font-semibold text-gray-800">
                €{item.totalPrice.toFixed(2)}
              </p>
            </div>
          ))
        )}
      </div>

      {/* showing the total amount */}
      <div className="px-6 py-3 border-t border-gray-100 flex items-center justify-between">
        <span className="text-sm font-bold text-gray-800">Total</span>
        <span className="text-sm font-bold text-gray-800">
          €{order.totalAmount.toFixed(2)}
        </span>
      </div>

      <div className="px-6 py-4">
        <button
          onClick={() => {
            setActiveOrder(selectedTab!, order.id);
            navigate("/orders", {
              state: { tab: selectedTab, orderId: order.id },
            });
          }}
          className="w-full py-4 rounded-xl text-white font-semibold text-base transition-colors hover:opacity-90"
          style={{ background: "#0C2B4E" }}
        >
          Edit Order
        </button>
      </div>
    </div>
  );
}
