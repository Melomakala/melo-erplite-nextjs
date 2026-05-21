export default function DashboardPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold tracking-tight text-slate-900">Dashboard</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="p-6 bg-white rounded-xl border border-slate-200 shadow-sm">
            <div className="h-4 w-24 bg-slate-100 rounded mb-4" />
            <div className="h-8 w-16 bg-slate-200 rounded" />
          </div>
        ))}
      </div>
      <div className="h-[400px] bg-white rounded-xl border border-slate-200 shadow-sm flex items-center justify-center text-slate-400">
        Dashboard Analytics Placeholder
      </div>
    </div>
  )
}
