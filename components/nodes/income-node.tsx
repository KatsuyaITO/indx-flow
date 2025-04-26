import { memo } from "react"
import { Handle, Position } from "reactflow"

function IncomeNode({ data }) {
  return (
    <div className={`px-4 py-2 shadow-md rounded-md border ${data.color || "bg-green-100 border-green-500"}`}>
      <Handle type="target" position={Position.Left} className="w-3 h-3" />
      <div className="flex items-center">
        <div className="mr-2">{data.icon}</div>
        <div>
          <div className="text-sm font-bold">{data.label}</div>
          <div className="text-xs text-green-700">{data.amount.toLocaleString()}万円</div>
        </div>
      </div>
      <Handle type="source" position={Position.Right} className="w-3 h-3" />
    </div>
  )
}

export default memo(IncomeNode)
