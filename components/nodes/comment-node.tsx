import { memo } from "react"
import { Handle, Position } from "reactflow"

function CommentNode({ data }) {
  return (
    <div className={`px-4 py-2 shadow-md rounded-md border ${data.color || "bg-yellow-100 border-yellow-500"}`}>
      <Handle type="target" position={Position.Left} className="w-3 h-3" />
      <div className="flex">
        <div className="mr-2">{data.icon}</div>
        <div className="flex-1">
          <div className="text-sm font-bold">{data.label}</div>
        </div>
      </div>
      <Handle type="source" position={Position.Right} className="w-3 h-3" />
    </div>
  )
}

export default memo(CommentNode)
