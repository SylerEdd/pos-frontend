import { useEffect, useState } from "react";
import { Sidebar } from "../../components/layout/Sidebar";
import { TopBar } from "../../components/layout/TopBar";
import { getAllOrders } from "../../api/orderApi";

interface OrderItem {
  id: number;
  menuItemName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

interface Payment {
  id: number;
  amount: number;
  paymentMethod: string;
  createdAt: string;
}

interface Order {
  id: number;
  tabId: number;
  totalAmount: number;
  status: string;
  orderItems: OrderItem[];
  payments: Payment[];
  totalPaid: number;
  openedAt: string;
  closedAt: string | null;
}

export function ReportsPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showReceipt, setShowReceipt] = useState(false);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  useEffect(() => {
    getAllOrders().then((res) => {
      const closed = res.data.filter((o: Order) => o.status === "CLOSED");
      setOrders(closed);
    });
  }, []);

  const filteredOrders = orders.filter((o) => {
    if (!o.closedAt) return false;
    const closed = new Date(o.closedAt);
    if (fromDate && closed < new Date(fromDate)) return false;
    if (toDate && closed > new Date(toDate + "T23:59:59")) return false;
    return true;
  });

  const totalRevenue = filteredOrders.reduce(
    (sum, o) => sum + o.totalAmount,
    0,
  );
  const totalOrders = filteredOrders.length;
  const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString("en-IE", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

  const formatTime = (iso: string) =>
    new Date(iso).toLocaleTimeString("en-IE", {
      hour: "2-digit",
      minute: "2-digit",
    });

  return (
    <div className="flex h-screen w-screen bg-gray-50">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <TopBar />
        <div className="flex flex-1 overflow-hidden">
          <div className="flex-1 flex flex-col overflow-hidden p-6">
            {/* choose the dates to see the orders */}
            <div className="flex items-center gap-4 mb-6">
              <h2 className="text-xl font-bold text-gray-800">Reports</h2>
              <div className="flex items-center gap-2 ml-auto">
                <label className="text-sm text-gray-500">From</label>
                <input
                  type="date"
                  value={fromDate}
                  onChange={(e) => setFromDate(e.target.value)}
                  className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0C2B4E]"
                />
                <label className="text-sm text-gray-500">To</label>
                <input
                  type="date"
                  value={toDate}
                  onChange={(e) => setToDate(e.target.value)}
                  className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0C2B4E]"
                />
                {(fromDate || toDate) && (
                  <button
                    onClick={() => {
                      setFromDate("");
                      setToDate("");
                    }}
                    className="text-xs text-gray-400 hover:text-gray-600 underline"
                  >
                    Reset
                  </button>
                )}
              </div>
            </div>

            {/* report bar */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="bg-white rounded-xl p-4 border border-gray-100">
                <p className="text-xs text-gray-400 mb-1">Total Revenue</p>
                <p className="text-2xl font-bold text-gray-800">
                  €{totalRevenue.toFixed(2)}
                </p>
              </div>
              <div className="bg-white rounded-xl p-4 border border-gray-100">
                <p className="text-xs text-gray-400 mb-1">Total Orders</p>
                <p className="text-2xl font-bold text-gray-800">
                  {totalOrders}
                </p>
              </div>
              <div className="bg-white rounded-xl p-4 border border-gray-100">
                <p className="text-xs text-gray-400 mb-1">Avg Order Value</p>
                <p className="text-2xl font-bold text-gray-800">
                  €{avgOrderValue.toFixed(2)}
                </p>
              </div>
            </div>

            {/* Orders */}
            <div className="bg-white rounded-xl border border-gray-100 overflow-hidden flex-1 overflow-y-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100 text-left">
                    <th className="px-4 py-3 text-xs font-semibold text-gray-400">
                      Order numbers
                    </th>
                    <th className="px-4 py-3 text-xs font-semibold text-gray-400">
                      Table
                    </th>
                    <th className="px-4 py-3 text-xs font-semibold text-gray-400">
                      Date
                    </th>
                    <th className="px-4 py-3 text-xs font-semibold text-gray-400">
                      Time
                    </th>
                    <th className="px-4 py-3 text-xs font-semibold text-gray-400">
                      Items
                    </th>
                    <th className="px-4 py-3 text-xs font-semibold text-gray-400">
                      Total
                    </th>
                    <th className="px-4 py-3 text-xs font-semibold text-gray-400">
                      Payment
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.length === 0 ? (
                    <tr>
                      <td
                        colSpan={7}
                        className="px-4 py-8 text-center text-gray-400 text-sm"
                      >
                        No orders found.
                      </td>
                    </tr>
                  ) : (
                    filteredOrders.map((order) => (
                      <tr
                        key={order.id}
                        onClick={() => setSelectedOrder(order)}
                        className={`border-b border-gray-50 cursor-pointer transition-colors hover:bg-gray-50 ${selectedOrder?.id === order.id ? "bg-[#0C2B4E]/5 border-l-2 border-l-[#0C2B4E]" : ""}`}
                      >
                        <td className="px-4 py-3 font-medium text-gray-800">
                          #{order.id}
                        </td>
                        <td className="px-4 py-3 text-gray-600">
                          Table {order.tabId}
                        </td>
                        <td className="px-4 py-3 text-gray-600">
                          {order.closedAt ? formatDate(order.closedAt) : "-"}
                        </td>
                        <td className="px-4 py-3 text-gray-600">
                          {order.closedAt ? formatTime(order.closedAt) : "-"}
                        </td>
                        <td className="px-4 py-3 text-gray-600">
                          {order.orderItems.length}
                        </td>
                        <td className="px-4 py-3 font-semibold text-gray-800">
                          €{order.totalAmount.toFixed(2)}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex gap-1 flex-wrap">
                            {order.payments.map((p) => (
                              <span
                                key={p.id}
                                className={`px-2 py-0.5 rounded-full text-xs font-medium ${p.paymentMethod === "CASH" ? "bg-green-100 text-green-700" : "bg-blue-100 text-blue-700"}`}
                              >
                                {p.paymentMethod}
                              </span>
                            ))}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Right — order detail panel */}
          {selectedOrder ? (
            <div className="w-80 bg-white border-l border-gray-100 flex flex-col h-full">
              <div className="px-6 py-4 border-b border-gray-100">
                <h3 className="font-bold text-gray-800 text-base">
                  Order #{selectedOrder.id}
                </h3>
                <p className="text-xs text-gray-400 mt-1">
                  Table {selectedOrder.tabId}
                </p>
                <p className="text-xs text-gray-400">
                  {selectedOrder.closedAt
                    ? formatDate(selectedOrder.closedAt) +
                      " · " +
                      formatTime(selectedOrder.closedAt)
                    : ""}
                </p>
              </div>

              <div className="flex-1 overflow-y-auto px-6 py-4 flex flex-col gap-3">
                {selectedOrder.orderItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between"
                  >
                    <div>
                      <p className="text-sm font-medium text-gray-800">
                        {item.menuItemName}
                      </p>
                      <p className="text-xs text-gray-400">
                        x{item.quantity} · €{item.unitPrice.toFixed(2)} each
                      </p>
                    </div>
                    <p className="text-sm font-semibold text-gray-800">
                      €{item.totalPrice.toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>

              <div className="px-6 py-3 border-t border-gray-100">
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-bold text-gray-800">Total</span>
                  <span className="text-sm font-bold text-gray-800">
                    €{selectedOrder.totalAmount.toFixed(2)}
                  </span>
                </div>
                <div className="flex flex-col gap-1">
                  {selectedOrder.payments.map((p) => (
                    <div
                      key={p.id}
                      className="flex justify-between text-xs text-gray-500"
                    >
                      <span>{p.paymentMethod}</span>
                      <span>€{p.amount.toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="px-6 py-4">
                <button
                  onClick={() => setShowReceipt(true)}
                  className="w-full py-4 rounded-xl text-white font-semibold text-base hover:opacity-90 transition-colors"
                  style={{ background: "#0C2B4E" }}
                >
                  Print Receipt
                </button>
              </div>
            </div>
          ) : (
            <div className="w-80 bg-white border-l border-gray-100 flex items-center justify-center">
              <p className="text-gray-400 text-sm text-center px-6">
                Select an order to see details
              </p>
            </div>
          )}
        </div>
      </div>

      {/* print reciept */}
      {showReceipt && selectedOrder && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 w-96 shadow-2xl">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">FlowServe</h2>
              <p className="text-xs text-gray-400 mt-1">POS Receipt</p>
            </div>

            <div className="border-t border-dashed border-gray-200 pt-4 mb-4">
              <div className="flex justify-between text-sm text-gray-600 mb-1">
                <span>Order</span>
                <span>#{selectedOrder.id}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-600 mb-1">
                <span>Table</span>
                <span>{selectedOrder.tabId}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-600">
                <span>Date</span>
                <span>
                  {selectedOrder.closedAt
                    ? formatDate(selectedOrder.closedAt) +
                      " " +
                      formatTime(selectedOrder.closedAt)
                    : ""}
                </span>
              </div>
            </div>

            <div className="border-t border-dashed border-gray-200 py-4 flex flex-col gap-2 mb-4">
              {selectedOrder.orderItems.map((item) => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span className="text-gray-700">
                    {item.menuItemName} x{item.quantity}
                  </span>
                  <span className="font-medium text-gray-800">
                    €{item.totalPrice.toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            <div className="border-t border-dashed border-gray-200 pt-4 mb-6">
              <div className="flex justify-between font-bold text-gray-800 mb-2">
                <span>Total</span>
                <span>€{selectedOrder.totalAmount.toFixed(2)}</span>
              </div>
              {selectedOrder.payments.map((p) => (
                <div
                  key={p.id}
                  className="flex justify-between text-sm text-gray-500"
                >
                  <span>{p.paymentMethod}</span>
                  <span>€{p.amount.toFixed(2)}</span>
                </div>
              ))}
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowReceipt(false)}
                className="flex-1 py-3 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50"
              >
                Close
              </button>
              <button
                onClick={() => window.print()}
                className="flex-1 py-3 rounded-xl text-white font-semibold text-sm hover:opacity-90"
                style={{ background: "#0C2B4E" }}
              >
                Print
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
