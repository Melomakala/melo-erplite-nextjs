export default function ProductsPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold tracking-tight text-foreground">Products</h1>
      <div className="grid gap-6 md:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-card rounded-xl border border-border shadow-sm overflow-hidden p-4">
            <div className="aspect-square bg-muted rounded-lg mb-4" />
            <div className="h-4 w-2/3 bg-muted/80 rounded mb-2" />
            <div className="h-4 w-1/3 bg-muted/60 rounded" />
          </div>
        ))}
      </div>
    </div>
  )
}
