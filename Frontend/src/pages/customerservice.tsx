import { useState } from "react";
import Icon from "../icon";

export default function CustomerScreen() {
  const [cart, setCart] = useState<Record<number, number>>({});
  const [added, setAdded] = useState<number | null>(null);

  const items = [
    { id: 1, name: "Chicken Biryani", price: 220, stock: 2, image: "https://images.unsplash.com/photo-1563379091339-03246963d96c?w=400&h=260&fit=crop&auto=format", desc: "Fragrant basmati rice with tender chicken, aromatic spices", veg: false },
    { id: 2, name: "Paneer Tikka", price: 180, stock: 5, image: "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=400&h=260&fit=crop&auto=format", desc: "Grilled cottage cheese with peppers and spices", veg: true },
    { id: 3, name: "Masala Dosa", price: 120, stock: 0, image: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=400&h=260&fit=crop&auto=format", desc: "Crispy rice crepe with spiced potato filling", veg: true },
  ];

  const addToCart = (id: number) => {
    setCart(c => ({ ...c, [id]: (c[id] || 0) + 1 }));
    setAdded(id);
    setTimeout(() => setAdded(null), 1500);
  };

  const totalItems = Object.values(cart).reduce((a, b) => a + b, 0);

  return (
    <div className="flex-1 bg-[#F7F8FA] overflow-y-auto">
      {/* Restaurant Header */}
      <div className="bg-white border-b border-[#E8EAED] px-8 py-5 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-xl overflow-hidden bg-[#FEE8EA] flex items-center justify-center">
            <span className="text-2xl">🌶️</span>
          </div>
          <div>
            <h1 className="text-xl font-bold text-[#1A1A2E]">Spice Garden</h1>
            <div className="flex items-center gap-2 mt-0.5">
              <div className="flex items-center gap-1">
                <Icon.star />
                <span className="text-sm font-semibold text-[#1A1A2E]">4.5</span>
              </div>
              <span className="text-xs text-[#9CA3AF]">· 200+ ratings</span>
              <span className="text-xs text-[#9CA3AF]">· North Indian, South Indian</span>
            </div>
          </div>
        </div>
        {totalItems > 0 && (
          <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-white text-sm font-semibold" style={{ backgroundColor: "#E23744" }}>
            <Icon.cart />
            {totalItems} item{totalItems > 1 ? "s" : ""} · View Cart
          </div>
        )}
      </div>

      <div className="p-8">
        {added && (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-xl flex items-center gap-2 text-green-700 text-sm font-medium">
            <Icon.check />
            Added to cart!
          </div>
        )}

        <h2 className="text-base font-semibold text-[#1A1A2E] mb-4">Menu</h2>
        <div className="grid grid-cols-3 gap-5">
          {items.map(item => {
            const soldOut = item.stock === 0;
            const low = item.stock <= 2 && item.stock > 0;
            const qty = cart[item.id] || 0;
            return (
              <div key={item.id} className={`bg-white rounded-xl border border-[#E8EAED] shadow-sm overflow-hidden transition-all ${soldOut ? "opacity-70" : "hover:shadow-md"}`}>
                <div className="relative">
                  <img src={item.image} alt={item.name} className="w-full h-44 object-cover bg-[#F7F8FA]" />
                  {soldOut && (
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                      <span className="px-3 py-1 bg-white rounded-full text-xs font-bold text-red-600">Sold Out</span>
                    </div>
                  )}
                  {low && !soldOut && (
                    <div className="absolute top-3 left-3">
                      <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-orange-500 text-white">Only {item.stock} left</span>
                    </div>
                  )}
                  <div className="absolute top-3 right-3">
                    <div className={`w-5 h-5 rounded-sm border-2 flex items-center justify-center ${item.veg ? "border-green-600 bg-white" : "border-red-600 bg-white"}`}>
                      <div className={`w-2 h-2 rounded-full ${item.veg ? "bg-green-600" : "bg-red-600"}`}></div>
                    </div>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-[#1A1A2E] text-sm mb-1">{item.name}</h3>
                  <p className="text-xs text-[#9CA3AF] mb-3 leading-relaxed">{item.desc}</p>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[#1A1A2E]">₹{item.price}</span>
                    {soldOut ? (
                      <button disabled className="px-3 py-1.5 rounded-lg text-xs font-medium bg-[#F7F8FA] text-[#9CA3AF] cursor-not-allowed border border-[#E8EAED]">
                        Unavailable
                      </button>
                    ) : qty > 0 ? (
                      <div className="flex items-center gap-2">
                        <button onClick={() => setCart(c => ({ ...c, [item.id]: Math.max(0, (c[item.id] || 0) - 1) }))} className="w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold cursor-pointer" style={{ backgroundColor: "#FEE8EA", color: "#E23744" }}>−</button>
                        <span className="text-sm font-bold text-[#1A1A2E] w-4 text-center">{qty}</span>
                        <button onClick={() => addToCart(item.id)} className="w-7 h-7 rounded-full flex items-center justify-center text-white text-sm font-bold cursor-pointer" style={{ backgroundColor: "#E23744" }}>+</button>
                      </div>
                    ) : (
                      <button
                        onClick={() => addToCart(item.id)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-white transition-all hover:opacity-90 cursor-pointer"
                        style={{ backgroundColor: "#E23744" }}
                      >
                        <Icon.cart />
                        Add
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
