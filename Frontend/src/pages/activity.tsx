import { useState } from "react";
import Icon from "../icon";
import type { ActivityEntry } from "../types";

export default function ActivityScreen() {
  const logs: ActivityEntry[] = [
    { id: 1, user: "Rahul", action: "Price Changed", item: "Chicken Biryani", field: "Price", prev: "₹200", next: "₹220", datetime: "01 Sep 2026, 2:30 PM", avatar: "R" },
    { id: 2, user: "Priya", action: "Item Added", item: "Paneer Tikka", field: "New Item", prev: "—", next: "₹180", datetime: "01 Sep 2026, 1:15 PM", avatar: "P" },
    { id: 3, user: "Rahul", action: "Stock Updated", item: "Masala Dosa", field: "Stock", prev: "8", next: "1", datetime: "01 Sep 2026, 11:00 AM", avatar: "R" },
    { id: 4, user: "Priya", action: "Availability Off", item: "Veg Burger", field: "Available", prev: "Yes", next: "No", datetime: "01 Sep 2026, 10:45 AM", avatar: "P" },
    { id: 5, user: "Rahul", action: "Price Changed", item: "Masala Dosa", field: "Price", prev: "₹100", next: "₹120", datetime: "31 Aug 2026, 6:00 PM", avatar: "R" },
  ];

  const [selected, setSelected] = useState<ActivityEntry>(logs[0]);
  const [search, setSearch] = useState("");

  const actionColors: Record<string, string> = {
    "Price Changed": "bg-blue-100 text-blue-700",
    "Item Added": "bg-green-100 text-green-700",
    "Stock Updated": "bg-amber-100 text-amber-700",
    "Availability Off": "bg-red-100 text-red-700",
  };

  const filtered = logs.filter(l =>
    l.user.toLowerCase().includes(search.toLowerCase()) ||
    l.item.toLowerCase().includes(search.toLowerCase()) ||
    l.action.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex-1 bg-[#F7F8FA] overflow-hidden flex flex-col">
      <div className="p-8 pb-4">
        <h1 className="text-2xl font-bold text-[#1A1A2E]">Activity Log</h1>
        <p className="text-sm text-[#6B7280] mt-1">Complete audit trail of all menu changes</p>
      </div>

      <div className="flex flex-1 gap-6 px-8 pb-8 overflow-hidden">
        {/* Log Table */}
        <div className="flex-1 bg-white rounded-xl border border-[#E8EAED] shadow-sm flex flex-col overflow-hidden">
          <div className="px-5 py-4 border-b border-[#E8EAED]">
            <div className="flex items-center gap-2 bg-[#F7F8FA] border border-[#E8EAED] rounded-lg px-3 py-2">
              <Icon.search />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search by user, item, or action..."
                className="text-sm text-[#1A1A2E] outline-none bg-transparent placeholder-[#9CA3AF] w-full"
              />
            </div>
          </div>
          <div className="overflow-y-auto flex-1">
            <table className="w-full">
              <thead className="sticky top-0 bg-white">
                <tr className="border-b border-[#E8EAED]">
                  {["User", "Action", "Item", "Date & Time"].map(h => (
                    <th key={h} className="px-5 py-3 text-left text-xs font-semibold text-[#9CA3AF] uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((log, i) => (
                  <tr
                    key={log.id}
                    onClick={() => setSelected(log)}
                    className={`cursor-pointer transition-colors ${i < filtered.length - 1 ? "border-b border-[#E8EAED]" : ""} ${selected.id === log.id ? "bg-[#FEE8EA]" : "hover:bg-[#F7F8FA]"}`}
                  >
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold" style={{ backgroundColor: log.avatar === "R" ? "#3B82F6" : "#8B5CF6" }}>
                          {log.avatar}
                        </div>
                        <span className="text-sm font-medium text-[#1A1A2E]">{log.user}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${actionColors[log.action] || "bg-gray-100 text-gray-700"}`}>{log.action}</span>
                    </td>
                    <td className="px-5 py-3.5 text-sm text-[#1A1A2E]">{log.item}</td>
                    <td className="px-5 py-3.5 text-xs text-[#9CA3AF]">{log.datetime}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Detail Panel */}
        <div className="w-72 shrink-0 bg-white rounded-xl border border-[#E8EAED] shadow-sm p-5 h-fit">
          <h3 className="text-sm font-bold text-[#1A1A2E] mb-4">Activity Details</h3>
          <div className="space-y-4">
            <div className="flex items-center gap-3 pb-4 border-b border-[#E8EAED]">
              <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold" style={{ backgroundColor: selected.avatar === "R" ? "#3B82F6" : "#8B5CF6" }}>
                {selected.avatar}
              </div>
              <div>
                <p className="text-sm font-semibold text-[#1A1A2E]">{selected.user}</p>
                <p className="text-xs text-[#9CA3AF]">{selected.action}</p>
              </div>
            </div>

            {[
              { label: "Item Changed", value: selected.item },
              { label: "Field", value: selected.field },
              { label: "Previous Value", value: selected.prev, color: "text-red-600" },
              { label: "New Value", value: selected.next, color: "text-green-600" },
              { label: "Timestamp", value: selected.datetime },
            ].map(({ label, value, color }) => (
              <div key={label}>
                <p className="text-xs font-semibold text-[#9CA3AF] uppercase tracking-wide mb-1">{label}</p>
                <p className={`text-sm font-medium ${color || "text-[#1A1A2E]"}`}>{value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
