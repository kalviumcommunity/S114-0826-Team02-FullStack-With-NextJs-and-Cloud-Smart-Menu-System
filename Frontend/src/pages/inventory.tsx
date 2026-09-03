import { useState } from "react";
import Icon from "../icon";
import StatusBadge from "../components/statusbadge";

type InventoryState = "order_pending" | "order_accepted" | "last_item";

export default function InventoryScreen() {
  const [state, setState] = useState<InventoryState>("order_pending");

  return (
    <div className="flex-1 bg-[#F7F8FA] overflow-y-auto">
      <div className="p-8">
        <div className="mb-7">
          <h1 className="text-2xl font-bold text-[#1A1A2E]">Smart Inventory</h1>
          <p className="text-sm text-[#6B7280] mt-1">Live inventory with automatic deduction and last-item protection</p>
        </div>

        {/* State Tabs */}
        <div className="flex gap-2 mb-6">
          {([
            ["order_pending", "📦 Incoming Order"],
            ["order_accepted", "✅ Order Accepted"],
            ["last_item", "🛡️ Last-Item Protection"],
          ] as [InventoryState, string][]).map(([s, label]) => (
            <button
              key={s}
              onClick={() => setState(s)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer ${state === s ? "text-white" : "bg-white border border-[#E8EAED] text-[#6B7280] hover:bg-[#F7F8FA]"}`}
              style={state === s ? { backgroundColor: "#E23744" } : {}}
            >
              {label}
            </button>
          ))}
        </div>

        {state === "order_pending" && (
          <div className="grid grid-cols-2 gap-6">
            {/* Live Inventory */}
            <div className="bg-white rounded-xl border border-[#E8EAED] shadow-sm">
              <div className="px-5 py-4 border-b border-[#E8EAED]">
                <h2 className="font-semibold text-[#1A1A2E]">Live Inventory</h2>
              </div>
              <div className="p-5">
                <div className="flex items-center gap-4 p-4 rounded-xl bg-[#F7F8FA]">
                  <img src="https://images.unsplash.com/photo-1563379091339-03246963d96c?w=80&h=60&fit=crop&auto=format" alt="Chicken Biryani" className="w-14 h-10 rounded-lg object-cover bg-[#E8EAED]" />
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-[#1A1A2E]">Chicken Biryani</p>
                    <p className="text-xs text-[#9CA3AF]">Main Course</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-[#1A1A2E]">3</p>
                    <p className="text-xs text-[#9CA3AF]">units in stock</p>
                  </div>
                </div>
                <div className="mt-4 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse inline-block"></span>
                  <span className="text-xs text-[#6B7280]">Stock synced in real-time</span>
                </div>
              </div>
            </div>

            {/* Incoming Order */}
            <div className="bg-white rounded-xl border-2 border-[#E23744] shadow-sm">
              <div className="px-5 py-4 border-b border-[#E8EAED] flex items-center justify-between">
                <h2 className="font-semibold text-[#1A1A2E]">New Order</h2>
                <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-[#FEE8EA] text-[#E23744]">#1048</span>
              </div>
              <div className="p-5">
                <div className="flex items-center justify-between py-3 border-b border-[#E8EAED]">
                  <div>
                    <p className="text-sm font-medium text-[#1A1A2E]">Chicken Biryani × 2</p>
                    <p className="text-xs text-[#9CA3AF]">Qty will be deducted from stock</p>
                  </div>
                  <span className="font-bold text-[#1A1A2E]">₹440</span>
                </div>
                <div className="mt-4 flex items-center justify-between text-sm">
                  <span className="text-[#6B7280]">Total</span>
                  <span className="font-bold text-[#1A1A2E]">₹440</span>
                </div>
                <button
                  onClick={() => setState("order_accepted")}
                  className="w-full mt-4 py-2.5 rounded-lg text-white text-sm font-semibold transition-all hover:opacity-90 cursor-pointer"
                  style={{ backgroundColor: "#E23744" }}
                >
                  Accept Order
                </button>
              </div>
            </div>
          </div>
        )}

        {state === "order_accepted" && (
          <div className="grid grid-cols-2 gap-6">
            {/* Updated Stock */}
            <div className="bg-white rounded-xl border border-green-200 shadow-sm">
              <div className="px-5 py-4 border-b border-green-100 bg-green-50 rounded-t-xl flex items-center gap-2">
                <span className="text-green-600"><Icon.check /></span>
                <h2 className="font-semibold text-green-800">Inventory Auto-Updated</h2>
              </div>
              <div className="p-5">
                <div className="flex items-center gap-4 p-4 rounded-xl bg-[#F7F8FA]">
                  <img src="https://images.unsplash.com/photo-1563379091339-03246963d96c?w=80&h=60&fit=crop&auto=format" alt="Chicken Biryani" className="w-14 h-10 rounded-lg object-cover bg-[#E8EAED]" />
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-[#1A1A2E]">Chicken Biryani</p>
                    <p className="text-xs text-[#9CA3AF]">Main Course</p>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-bold text-[#9CA3AF] line-through">3</span>
                      <span className="text-2xl font-bold text-green-600">1</span>
                    </div>
                    <p className="text-xs text-[#9CA3AF]">−2 deducted</p>
                  </div>
                </div>
                <div className="mt-4 p-3 rounded-lg bg-green-50 border border-green-100">
                  <p className="text-xs font-semibold text-green-700">✅ Inventory automatically updated</p>
                  <p className="text-xs text-green-600 mt-0.5">Stock reduced from 3 → 1 after Order #1048 was accepted</p>
                </div>
              </div>
            </div>

            {/* Order Confirmed */}
            <div className="bg-white rounded-xl border border-[#E8EAED] shadow-sm">
              <div className="px-5 py-4 border-b border-[#E8EAED]">
                <h2 className="font-semibold text-[#1A1A2E]">Order #1048 · Accepted</h2>
              </div>
              <div className="p-5">
                <div className="flex items-center gap-3 p-4 bg-green-50 rounded-xl border border-green-100 mb-4">
                  <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-white"><Icon.check /></div>
                  <div>
                    <p className="text-sm font-semibold text-green-800">Order Accepted</p>
                    <p className="text-xs text-green-600">Kitchen has been notified</p>
                  </div>
                </div>
                <div className="space-y-2 text-xs text-[#6B7280]">
                  <div className="flex justify-between"><span>Order placed</span><span className="font-medium text-[#1A1A2E]">2:34 PM</span></div>
                  <div className="flex justify-between"><span>Accepted at</span><span className="font-medium text-[#1A1A2E]">2:34 PM</span></div>
                  <div className="flex justify-between"><span>Stock deducted</span><span className="font-medium text-green-600">Automatic</span></div>
                </div>
                <button onClick={() => setState("order_pending")} className="w-full mt-4 py-2 rounded-lg border border-[#E8EAED] text-xs font-medium text-[#6B7280] hover:bg-[#F7F8FA] transition-all cursor-pointer">
                  ← Back to Incoming Orders
                </button>
              </div>
            </div>
          </div>
        )}

        {state === "last_item" && (
          <div>
            <div className="mb-5 p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-center gap-3">
              <span className="text-amber-600"><Icon.shield /></span>
              <div>
                <p className="text-sm font-semibold text-amber-800">Last-Item Protection Active</p>
                <p className="text-xs text-amber-700 mt-0.5">When only 1 item remains, simultaneous orders are handled safely. Only the first customer gets it — the second is automatically rejected.</p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-5">
              {/* Stock state */}
              <div className="bg-white rounded-xl border border-[#E8EAED] shadow-sm p-5">
                <h3 className="text-sm font-semibold text-[#1A1A2E] mb-3">Masala Dosa</h3>
                <div className="text-center py-4">
                  <p className="text-5xl font-bold text-orange-500">1</p>
                  <p className="text-xs text-[#9CA3AF] mt-1">Last unit remaining</p>
                  <StatusBadge stock={1} />
                </div>
                <div className="mt-3 p-2 bg-orange-50 rounded-lg">
                  <p className="text-xs text-orange-700 text-center font-medium">⚠️ Only 1 left · Protection active</p>
                </div>
              </div>

              {/* Customer A — success */}
              <div className="bg-white rounded-xl border border-green-200 shadow-sm p-5">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-7 h-7 rounded-full bg-green-500 flex items-center justify-center text-white text-xs font-bold">A</div>
                  <h3 className="text-sm font-semibold text-[#1A1A2E]">Customer A</h3>
                  <span className="ml-auto px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700">First</span>
                </div>
                <p className="text-xs text-[#6B7280] mb-4">Orders Masala Dosa × 1</p>
                <div className="p-3 bg-green-50 border border-green-100 rounded-lg">
                  <p className="text-xs font-bold text-green-700">✅ Order Confirmed</p>
                  <p className="text-xs text-green-600 mt-1">Customer A got the last Masala Dosa. Stock updated to 0.</p>
                </div>
              </div>

              {/* Customer B — rejected */}
              <div className="bg-white rounded-xl border border-red-200 shadow-sm p-5">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-7 h-7 rounded-full bg-red-400 flex items-center justify-center text-white text-xs font-bold">B</div>
                  <h3 className="text-sm font-semibold text-[#1A1A2E]">Customer B</h3>
                  <span className="ml-auto px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-700">Simultaneous</span>
                </div>
                <p className="text-xs text-[#6B7280] mb-4">Also orders Masala Dosa × 1</p>
                <div className="p-3 bg-red-50 border border-red-100 rounded-lg">
                  <p className="text-xs font-bold text-red-700">❌ Order Rejected</p>
                  <p className="text-xs text-red-600 mt-1">Sorry, Masala Dosa just sold out. Customer B's order was automatically cancelled.</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
