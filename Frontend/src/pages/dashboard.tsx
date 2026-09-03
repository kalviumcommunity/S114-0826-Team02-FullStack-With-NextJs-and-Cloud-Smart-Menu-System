export default function DashboardScreen() {
  const summaryCards = [
    { label: "Today's Orders", value: "128", icon: "📦", color: "#EFF6FF", accent: "#3B82F6" },
    { label: "Revenue", value: "₹24,580", icon: "💰", color: "#F0FDF4", accent: "#16A34A" },
    { label: "Items Sold", value: "246", icon: "🍽️", color: "#FFF7ED", accent: "#EA580C" },
    { label: "Low Stock", value: "5", icon: "⚠️", color: "#FEF2F2", accent: "#DC2626" },
  ];

  const tableRows = [
    { name: "Chicken Biryani", stock: 12, status: "Available" },
    { name: "Paneer Tikka", stock: 5, status: "Low Stock" },
    { name: "Masala Dosa", stock: 1, status: "Almost Sold Out" },
    { name: "Veg Burger", stock: 0, status: "Sold Out" },
  ];

  const statusStyle: Record<string, string> = {
    "Available": "bg-green-100 text-green-700",
    "Low Stock": "bg-amber-100 text-amber-700",
    "Almost Sold Out": "bg-orange-100 text-orange-700",
    "Sold Out": "bg-red-100 text-red-700",
  };

  return (
    <div className="flex-1 bg-[#F7F8FA] overflow-y-auto">
      <div className="p-8">
        {/* Header */}
        <div className="mb-7">
          <h1 className="text-2xl font-bold text-[#1A1A2E]">Restaurant Dashboard</h1>
          <p className="text-sm text-[#6B7280] mt-1">Spice Garden · Monday, 1 Sep 2026</p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          {summaryCards.map((c) => (
            <div key={c.label} className="bg-white rounded-xl p-5 border border-[#E8EAED] shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <span className="text-2xl">{c.icon}</span>
                <span className="text-xs font-medium px-2 py-0.5 rounded-full" style={{ color: c.accent, backgroundColor: c.color }}>Today</span>
              </div>
              <p className="text-2xl font-bold text-[#1A1A2E]">{c.value}</p>
              <p className="text-xs text-[#9CA3AF] mt-1">{c.label}</p>
            </div>
          ))}
        </div>

        {/* Inventory Table */}
        <div className="bg-white rounded-xl border border-[#E8EAED] shadow-sm">
          <div className="px-6 py-4 border-b border-[#E8EAED] flex items-center justify-between">
            <div>
              <h2 className="text-base font-semibold text-[#1A1A2E]">Smart Inventory Overview</h2>
              <p className="text-xs text-[#9CA3AF] mt-0.5">Live stock levels · auto-updated on orders</p>
            </div>
            <span className="flex items-center gap-1.5 text-xs text-green-600 font-medium">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse inline-block"></span>
              Live
            </span>
          </div>
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#E8EAED]">
                {["Dish Name", "Current Stock", "Status", "Last Updated"].map((h) => (
                  <th key={h} className="px-6 py-3 text-left text-xs font-semibold text-[#9CA3AF] uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {tableRows.map((r, i) => (
                <tr key={r.name} className={`${i < tableRows.length - 1 ? "border-b border-[#E8EAED]" : ""} hover:bg-[#F7F8FA] transition-colors`}>
                  <td className="px-6 py-4 text-sm font-medium text-[#1A1A2E]">{r.name}</td>
                  <td className="px-6 py-4 text-sm text-[#1A1A2E]">{r.stock} units</td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${statusStyle[r.status]}`}>{r.status}</span>
                  </td>
                  <td className="px-6 py-4 text-xs text-[#9CA3AF]">2 mins ago</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
