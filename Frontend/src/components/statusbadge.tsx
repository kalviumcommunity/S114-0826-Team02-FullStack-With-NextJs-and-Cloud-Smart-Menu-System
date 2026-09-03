export default function StatusBadge({ stock }: { stock: number }) {
  if (stock === 0) return <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-700">Sold Out</span>;
  if (stock === 1) return <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-700">Almost Sold Out</span>;
  if (stock <= 5) return <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-700">Low Stock</span>;
  return <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700">Available</span>;
}