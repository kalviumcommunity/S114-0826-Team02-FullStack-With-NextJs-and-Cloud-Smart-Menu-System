import { useState } from "react";
import Icon from "../icon";
import type { TimeSlot } from "../types";

export default function PricingScreen() {
  const [slots, setSlots] = useState<TimeSlot[]>([
    { id: 1, start: "07:00 AM", end: "11:00 AM", price: 180 },
    { id: 2, start: "11:00 AM", end: "05:00 PM", price: 220 },
    { id: 3, start: "05:00 PM", end: "10:00 PM", price: 250 },
  ]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ start: "", end: "", price: "" });

  const addSlot = () => {
    if (!form.start || !form.end || !form.price) return;
    setSlots([...slots, { id: Date.now(), start: form.start, end: form.end, price: Number(form.price) }]);
    setForm({ start: "", end: "", price: "" });
    setShowModal(false);
  };

  const periodLabels = ["Morning Rush", "Afternoon Peak", "Dinner Prime"];
  const periodColors = ["#EFF6FF", "#F0FDF4", "#FFF7ED"];
  const periodTextColors = ["#3B82F6", "#16A34A", "#EA580C"];

  return (
    <div className="flex-1 bg-[#F7F8FA] overflow-y-auto">
      <div className="p-8">
        <div className="mb-7">
          <h1 className="text-2xl font-bold text-[#1A1A2E]">Time-Based Pricing</h1>
          <p className="text-sm text-[#6B7280] mt-1">Set dynamic prices for different time periods</p>
        </div>

        {/* Dish selector */}
        <div className="bg-white rounded-xl border border-[#E8EAED] shadow-sm p-5 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <img
                src="https://images.unsplash.com/photo-1563379091339-03246963d96c?w=80&h=60&fit=crop&auto=format"
                alt="Chicken Biryani"
                className="w-16 h-12 rounded-lg object-cover bg-[#F7F8FA]"
              />
              <div>
                <h3 className="font-semibold text-[#1A1A2E]">Chicken Biryani</h3>
                <p className="text-xs text-[#9CA3AF] mt-0.5">Main Course · Base price: <span className="font-semibold text-[#1A1A2E]">₹220</span></p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-xs text-[#6B7280] bg-[#F7F8FA] px-3 py-2 rounded-lg">
              <Icon.clock />
              3 active time slots
            </div>
          </div>
        </div>

        {/* Pricing Table */}
        <div className="bg-white rounded-xl border border-[#E8EAED] shadow-sm mb-5">
          <div className="px-6 py-4 border-b border-[#E8EAED] flex items-center justify-between">
            <h2 className="text-base font-semibold text-[#1A1A2E]">Pricing Schedule</h2>
            <button
              onClick={() => setShowModal(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-white text-sm font-medium transition-all hover:opacity-90 cursor-pointer"
              style={{ backgroundColor: "#E23744" }}
            >
              <Icon.plus />
              Add Time Slot
            </button>
          </div>
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#E8EAED]">
                {["Period", "Start Time", "End Time", "Price", "vs Base"].map(h => (
                  <th key={h} className="px-6 py-3 text-left text-xs font-semibold text-[#9CA3AF] uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {slots.map((slot, i) => {
                const diff = slot.price - 220;
                return (
                  <tr key={slot.id} className={`${i < slots.length - 1 ? "border-b border-[#E8EAED]" : ""} hover:bg-[#F7F8FA] transition-colors`}>
                    <td className="px-6 py-4">
                      <span className="px-2 py-0.5 rounded-full text-xs font-medium" style={{ backgroundColor: periodColors[i] || "#F7F8FA", color: periodTextColors[i] || "#6B7280" }}>
                        {periodLabels[i] || `Slot ${i + 1}`}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-[#1A1A2E]">{slot.start}</td>
                    <td className="px-6 py-4 text-sm text-[#1A1A2E]">{slot.end}</td>
                    <td className="px-6 py-4 text-sm font-bold text-[#1A1A2E]">₹{slot.price}</td>
                    <td className="px-6 py-4">
                      <span className={`text-xs font-medium ${diff > 0 ? "text-green-600" : diff < 0 ? "text-red-600" : "text-[#9CA3AF]"}`}>
                        {diff > 0 ? `+₹${diff}` : diff < 0 ? `-₹${Math.abs(diff)}` : "Base"}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="bg-[#FEE8EA] rounded-xl p-4 flex items-start gap-3">
          <Icon.clock />
          <div>
            <p className="text-sm font-semibold text-[#E23744]">How time-based pricing works</p>
            <p className="text-xs text-[#C72F3A] mt-1">Prices automatically switch based on the current time. Customers see the price for the active time slot when they view the menu. This helps maximize revenue during peak hours.</p>
          </div>
        </div>
      </div>

      {/* Add Time Slot Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50" onClick={() => setShowModal(false)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm mx-4 p-6" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-bold text-[#1A1A2E]">Add Time Slot</h3>
              <button onClick={() => setShowModal(false)} className="text-[#9CA3AF] hover:text-[#1A1A2E] cursor-pointer"><Icon.x /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#6B7280] mb-1.5">Start Time</label>
                <input type="time" value={form.start} onChange={e => setForm({ ...form, start: e.target.value })}
                  className="w-full border border-[#E8EAED] rounded-lg px-3 py-2 text-sm text-[#1A1A2E] outline-none focus:border-[#E23744] transition-colors" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#6B7280] mb-1.5">End Time</label>
                <input type="time" value={form.end} onChange={e => setForm({ ...form, end: e.target.value })}
                  className="w-full border border-[#E8EAED] rounded-lg px-3 py-2 text-sm text-[#1A1A2E] outline-none focus:border-[#E23744] transition-colors" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#6B7280] mb-1.5">Price (₹)</label>
                <input type="number" placeholder="e.g. 200" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })}
                  className="w-full border border-[#E8EAED] rounded-lg px-3 py-2 text-sm text-[#1A1A2E] outline-none focus:border-[#E23744] transition-colors" />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowModal(false)} className="flex-1 py-2.5 rounded-lg border border-[#E8EAED] text-sm font-medium text-[#6B7280] hover:bg-[#F7F8FA] transition-all cursor-pointer">Cancel</button>
              <button onClick={addSlot} className="flex-1 py-2.5 rounded-lg text-white text-sm font-medium hover:opacity-90 transition-all cursor-pointer" style={{ backgroundColor: "#E23744" }}>Save Rule</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
