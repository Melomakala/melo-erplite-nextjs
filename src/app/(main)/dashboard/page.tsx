export default function DashboardPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold tracking-tight text-foreground">Dashboard</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="p-6 bg-card rounded-xl border border-border shadow-sm">
            <div className="h-4 w-24 bg-muted rounded mb-4" />
            <div className="h-8 w-16 bg-muted/80 rounded" />
          </div>
        ))}
      </div>
      <div className="h-[400px] bg-card rounded-xl border border-border shadow-sm flex items-center justify-center text-muted-foreground">
        Dashboard Analytics Placeholder
      </div>
    </div>
  )
}
