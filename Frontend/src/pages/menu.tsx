import { useState } from "react";
import Icon from "../icon";
import StatusBadge from "../components/statusbadge";
import type { Dish } from "../types";

export default function MenuScreen({ onPricing }: { onPricing: () => void }) {
  const [dishes, setDishes] = useState<Dish[]>([
    { id: 1, name: "Chicken Biryani", price: 220, stock: 12, category: "Main Course", image: "https://images.unsplash.com/photo-1563379091339-03246963d96c?w=200&h=150&fit=crop&auto=format" },
    { id: 2, name: "Paneer Tikka", price: 180, stock: 5, category: "Starters", image: "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=200&h=150&fit=crop&auto=format" },
    { id: 3, name: "Masala Dosa", price: 120, stock: 1, category: "Breakfast", image: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=200&h=150&fit=crop&auto=format" },
    { id: 4, name: "Veg Burger", price: 150, stock: 0, category: "Fast Food", image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=200&h=150&fit=crop&auto=format" },
  ]);
  const [editDish, setEditDish] = useState<Dish | null>(null);
  const [editForm, setEditForm] = useState({ name: "", price: 0, stock: 0, available: true });
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  const openEdit = (d: Dish) => {
    setEditDish(d);
    setEditForm({ name: d.name, price: d.price, stock: d.stock, available: d.stock > 0 });
  };
  const saveEdit = () => {
    if (!editDish) return;
    setDishes(dishes.map(d => d.id === editDish.id
      ? { ...d, name: editForm.name, price: editForm.price, stock: editForm.available ? editForm.stock : 0 }
      : d
    ));
    setEditDish(null);
  };

  const filtered = dishes.filter(d =>
    (category === "All" || d.category === category) &&
    d.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex-1 bg-[#F7F8FA] overflow-y-auto">
      <div className="p-8">
        <div className="mb-7 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-[#1A1A2E]">Menu Management</h1>
            <p className="text-sm text-[#6B7280] mt-1">Manage your dishes, prices, and availability</p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-white text-sm font-medium transition-all hover:opacity-90" style={{ backgroundColor: "#E23744" }}>
            <Icon.plus />
            Add Dish
          </button>
        </div>

        {/* Filters */}
        <div className="flex gap-3 mb-6">
          <div className="flex items-center gap-2 bg-white border border-[#E8EAED] rounded-lg px-3 py-2 flex-1 max-w-xs">
            <Icon.search />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search dishes..."
              className="text-sm text-[#1A1A2E] outline-none bg-transparent placeholder-[#9CA3AF] w-full"
            />
          </div>
          <select
            value={category}
            onChange={e => setCategory(e.target.value)}
            className="bg-white border border-[#E8EAED] rounded-lg px-3 py-2 text-sm text-[#1A1A2E] outline-none cursor-pointer"
          >
            {["All", "Main Course", "Starters", "Breakfast", "Fast Food"].map(c => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </div>

        {/* Dish Cards */}
        <div className="grid grid-cols-2 gap-5">
          {filtered.map(dish => (
            <div key={dish.id} className="bg-white rounded-xl border border-[#E8EAED] shadow-sm overflow-hidden">
              <div className="relative">
                <img src={dish.image} alt={dish.name} className="w-full h-36 object-cover bg-[#F7F8FA]" />
                <div className="absolute top-3 right-3">
                  <StatusBadge stock={dish.stock} />
                </div>
              </div>
              <div className="p-4">
                <div className="flex items-start justify-between mb-1">
                  <h3 className="font-semibold text-[#1A1A2E] text-sm">{dish.name}</h3>
                  <span className="text-base font-bold text-[#1A1A2E]">₹{dish.price}</span>
                </div>
                <p className="text-xs text-[#9CA3AF] mb-3">{dish.category} · Stock: {dish.stock} units</p>
                <div className="flex gap-2">
                  <button
                    onClick={() => openEdit(dish)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border border-[#E8EAED] text-[#6B7280] hover:bg-[#F7F8FA] transition-all cursor-pointer"
                  >
                    <Icon.edit />
                    Edit
                  </button>
                  <button
                    onClick={onPricing}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border border-[#E23744] text-[#E23744] hover:bg-[#FEE8EA] transition-all cursor-pointer"
                  >
                    <Icon.clock />
                    Pricing
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Edit Modal */}
      {editDish && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50" onClick={() => setEditDish(null)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 p-6" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-bold text-[#1A1A2E]">Edit Dish</h3>
              <button onClick={() => setEditDish(null)} className="text-[#9CA3AF] hover:text-[#1A1A2E] cursor-pointer">
                <Icon.x />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#6B7280] mb-1.5">Dish Name</label>
                <input
                  value={editForm.name}
                  onChange={e => setEditForm({ ...editForm, name: e.target.value })}
                  className="w-full border border-[#E8EAED] rounded-lg px-3 py-2 text-sm text-[#1A1A2E] outline-none focus:border-[#E23744] transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#6B7280] mb-1.5">Price (₹)</label>
                <input
                  type="number"
                  value={editForm.price}
                  onChange={e => setEditForm({ ...editForm, price: Number(e.target.value) })}
                  className="w-full border border-[#E8EAED] rounded-lg px-3 py-2 text-sm text-[#1A1A2E] outline-none focus:border-[#E23744] transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#6B7280] mb-1.5">Available Quantity</label>
                <input
                  type="number"
                  value={editForm.stock}
                  onChange={e => setEditForm({ ...editForm, stock: Number(e.target.value) })}
                  className="w-full border border-[#E8EAED] rounded-lg px-3 py-2 text-sm text-[#1A1A2E] outline-none focus:border-[#E23744] transition-colors"
                />
              </div>
              <div className="flex items-center justify-between p-3 bg-[#F7F8FA] rounded-lg">
                <span className="text-sm font-medium text-[#1A1A2E]">Available for Order</span>
                <button
                  onClick={() => setEditForm({ ...editForm, available: !editForm.available })}
                  className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${editForm.available ? "" : "bg-gray-300"}`}
                  style={editForm.available ? { backgroundColor: "#E23744" } : {}}
                >
                  <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${editForm.available ? "translate-x-5" : "translate-x-0.5"}`}></span>
                </button>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setEditDish(null)}
                className="flex-1 py-2.5 rounded-lg border border-[#E8EAED] text-sm font-medium text-[#6B7280] hover:bg-[#F7F8FA] transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={saveEdit}
                className="flex-1 py-2.5 rounded-lg text-white text-sm font-medium transition-all hover:opacity-90 cursor-pointer"
                style={{ backgroundColor: "#E23744" }}
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
