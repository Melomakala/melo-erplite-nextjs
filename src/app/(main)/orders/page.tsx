export default function OrdersPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold tracking-tight text-foreground">Orders</h1>
      <div className="bg-card rounded-lg border border-border shadow-sm overflow-hidden">
        <div className="p-4 border-b border-border flex justify-between items-center">
          <div className="h-9 w-64 bg-muted rounded-md" />
          <div className="h-9 w-24 bg-primary rounded-md" />
        </div>
        <div className="p-8 flex flex-col items-center justify-center text-muted-foreground space-y-4">
          <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
            <span className="text-2xl">📦</span>
          </div>
          <p>No orders found yet.</p>
        </div>
      </div>
    </div>
  )
}
