import CashFlowCanvas from "@/components/cash-flow-canvas"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b bg-background px-4 py-3">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-semibold">Cash Flow Visualizer</h1>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Your financial flows, visualized</span>
          </div>
        </div>
      </header>
      <main className="flex-1">
        <CashFlowCanvas />
      </main>
    </div>
  )
}
