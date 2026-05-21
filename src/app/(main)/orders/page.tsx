export default function OrdersPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold tracking-tight text-slate-900">Orders</h1>
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex justify-between items-center">
          <div className="h-9 w-64 bg-slate-100 rounded-md" />
          <div className="h-9 w-24 bg-blue-600 rounded-md" />
        </div>
        <div className="p-8 flex flex-col items-center justify-center text-slate-400 space-y-4">
          <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center">
            <span className="text-2xl">📦</span>
          </div>
          <p>No orders found yet.</p>
        </div>
      </div>
    </div>
  )
}
