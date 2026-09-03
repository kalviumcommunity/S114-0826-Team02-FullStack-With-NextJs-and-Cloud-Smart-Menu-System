import Icon from "../icon";
import type { Screen } from "../types";

const navItems = [
  { id: "dashboard" as Screen, label: "Dashboard", icon: Icon.dashboard },
  { id: "menu" as Screen, label: "Menu", icon: Icon.menu },
  { id: "inventory" as Screen, label: "Inventory", icon: Icon.inventory },
  { id: "pricing" as Screen, label: "Pricing", icon: Icon.pricing },
  { id: "activity" as Screen, label: "Activity Log", icon: Icon.activity },
  { id: "customer" as Screen, label: "Customer View", icon: Icon.orders },
];

export default function Sidebar({ active, onNav }: { active: Screen; onNav: (s: Screen) => void }) {
  return (
    <aside className="w-56 bg-white border-r border-[#E8EAED] flex flex-col shrink-0 h-full">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-[#E8EAED]">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: "#E23744" }}>
            <span className="text-white font-bold text-sm">Z</span>
          </div>
          <div>
            <span className="font-bold text-[#1A1A2E] text-sm leading-none block">Zomato</span>
            <span className="text-[10px] text-[#9CA3AF] leading-none">Smart Menu</span>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5">
        {navItems.map(({ id, label, icon: Ic }) => {
          const isActive = active === id;
          return (
            <button
              key={id}
              onClick={() => onNav(id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all cursor-pointer ${
                isActive
                  ? "text-white"
                  : "text-[#6B7280] hover:bg-[#F7F8FA] hover:text-[#1A1A2E]"
              }`}
              style={isActive ? { backgroundColor: "#E23744" } : {}}
            >
              <Ic />
              {label}
            </button>
          );
        })}
      </nav>

      {/* Settings */}
      <div className="px-3 py-4 border-t border-[#E8EAED]">
        <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-[#6B7280] hover:bg-[#F7F8FA] hover:text-[#1A1A2E] transition-all cursor-pointer">
          <Icon.settings />
          Settings
        </button>
        <div className="mt-3 px-3 flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-full bg-[#E23744] flex items-center justify-center text-white text-xs font-semibold">R</div>
          <div>
            <p className="text-xs font-semibold text-[#1A1A2E] leading-none">Rahul Sharma</p>
            <p className="text-[10px] text-[#9CA3AF] mt-0.5">Manager</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
