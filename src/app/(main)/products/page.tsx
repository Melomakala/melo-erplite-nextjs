export default function ProductsPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold tracking-tight text-slate-900">Products</h1>
      <div className="grid gap-6 md:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden p-4">
            <div className="aspect-square bg-slate-100 rounded-lg mb-4" />
            <div className="h-4 w-2/3 bg-slate-200 rounded mb-2" />
            <div className="h-4 w-1/3 bg-slate-100 rounded" />
          </div>
        ))}
      </div>
    </div>
  )
}
