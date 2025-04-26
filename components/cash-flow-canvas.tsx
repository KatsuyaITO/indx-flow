"use client"

import { useCallback, useRef, useState } from "react"
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  addEdge,
  useEdgesState,
  useNodesState,
  MarkerType,
  Panel,
  type Connection,
  type NodeTypes,
} from "reactflow"
import "reactflow/dist/style.css"

import { Button } from "@/components/ui/button"
import {
  BanknoteIcon,
  BuildingIcon,
  CircleDollarSignIcon,
  CoinsIcon,
  CreditCardIcon,
  DollarSignIcon,
  HomeIcon,
  PiggyBankIcon,
  PlusIcon,
  ShoppingCartIcon,
  TrashIcon,
  WalletIcon,
} from "lucide-react"

import FundingNode from "@/components/nodes/funding-node"
import ExpenseNode from "@/components/nodes/expense-node"
import BudgetNode from "@/components/nodes/budget-node"
import IncomeNode from "@/components/nodes/income-node"
import AssetNode from "@/components/nodes/asset-node"
import EditNodeForm from "@/components/edit-node-form"
import EditEdgeForm from "@/components/edit-edge-form"
import { JsonExport, JsonImport } from "@/components/json-import-export"

// Define node types
const nodeTypes: NodeTypes = {
  fundingNode: FundingNode,
  expenseNode: ExpenseNode,
  budgetNode: BudgetNode,
  incomeNode: IncomeNode,
  assetNode: AssetNode,
}

// Initial nodes and edges
const initialNodes = [
  {
    id: "1",
    type: "incomeNode",
    position: { x: 100, y: 100 },
    data: {
      label: "Monthly Income",
      amount: 5000,
      icon: <DollarSignIcon className="h-5 w-5" />,
      color: "bg-green-100 border-green-500",
    },
  },
  {
    id: "2",
    type: "budgetNode",
    position: { x: 400, y: 100 },
    data: {
      label: "Monthly Budget",
      amount: 4000,
      icon: <WalletIcon className="h-5 w-5" />,
      color: "bg-blue-100 border-blue-500",
    },
  },
  {
    id: "3",
    type: "expenseNode",
    position: { x: 700, y: 50 },
    data: {
      label: "Rent",
      amount: 1500,
      icon: <HomeIcon className="h-5 w-5" />,
      color: "bg-red-100 border-red-500",
    },
  },
  {
    id: "4",
    type: "expenseNode",
    position: { x: 700, y: 150 },
    data: {
      label: "Groceries",
      amount: 500,
      icon: <ShoppingCartIcon className="h-5 w-5" />,
      color: "bg-red-100 border-red-500",
    },
  },
  {
    id: "5",
    type: "fundingNode",
    position: { x: 400, y: 300 },
    data: {
      label: "Savings",
      amount: 1000,
      icon: <PiggyBankIcon className="h-5 w-5" />,
      color: "bg-purple-100 border-purple-500",
    },
  },
]

const initialEdges = [
  {
    id: "e1-2",
    source: "1",
    target: "2",
    animated: true,
    label: "4000万円",
    style: { stroke: "#3b82f6", strokeWidth: 2 },
    markerEnd: {
      type: MarkerType.ArrowClosed,
      color: "#3b82f6",
    },
  },
  {
    id: "e1-5",
    source: "1",
    target: "5",
    animated: true,
    label: "1000万円",
    style: { stroke: "#8b5cf6", strokeWidth: 2 },
    markerEnd: {
      type: MarkerType.ArrowClosed,
      color: "#8b5cf6",
    },
  },
  {
    id: "e2-3",
    source: "2",
    target: "3",
    animated: true,
    label: "1500万円",
    style: { stroke: "#ef4444", strokeWidth: 2 },
    markerEnd: {
      type: MarkerType.ArrowClosed,
      color: "#ef4444",
    },
  },
  {
    id: "e2-4",
    source: "2",
    target: "4",
    animated: true,
    label: "500万円",
    style: { stroke: "#ef4444", strokeWidth: 2 },
    markerEnd: {
      type: MarkerType.ArrowClosed,
      color: "#ef4444",
    },
  },
]

// Node templates for adding new nodes
const nodeTemplates = {
  income: {
    type: "incomeNode",
    data: {
      label: "Income",
      amount: 1000,
      icon: <DollarSignIcon className="h-5 w-5" />,
      color: "bg-green-100 border-green-500",
    },
  },
  expense: {
    type: "expenseNode",
    data: {
      label: "Expense",
      amount: 500,
      icon: <CreditCardIcon className="h-5 w-5" />,
      color: "bg-red-100 border-red-500",
    },
  },
  budget: {
    type: "budgetNode",
    data: {
      label: "Budget",
      amount: 2000,
      icon: <WalletIcon className="h-5 w-5" />,
      color: "bg-blue-100 border-blue-500",
    },
  },
  funding: {
    type: "fundingNode",
    data: {
      label: "Funding",
      amount: 5000,
      icon: <BanknoteIcon className="h-5 w-5" />,
      color: "bg-purple-100 border-purple-500",
    },
  },
  asset: {
    type: "assetNode",
    data: {
      label: "Asset",
      amount: 10000,
      icon: <HomeIcon className="h-5 w-5" />,
      color: "bg-amber-100 border-amber-500",
    },
  },
}

// Icon options for nodes
const iconOptions = [
  { value: "dollar", label: "Dollar", icon: <DollarSignIcon className="h-4 w-4" /> },
  { value: "wallet", label: "Wallet", icon: <WalletIcon className="h-4 w-4" /> },
  { value: "bank", label: "Bank", icon: <BuildingIcon className="h-4 w-4" /> },
  { value: "piggy", label: "Piggy Bank", icon: <PiggyBankIcon className="h-4 w-4" /> },
  { value: "card", label: "Credit Card", icon: <CreditCardIcon className="h-4 w-4" /> },
  { value: "cart", label: "Shopping", icon: <ShoppingCartIcon className="h-4 w-4" /> },
  { value: "home", label: "Home", icon: <HomeIcon className="h-4 w-4" /> },
  { value: "coins", label: "Coins", icon: <CoinsIcon className="h-4 w-4" /> },
  { value: "circle", label: "Circle Dollar", icon: <CircleDollarSignIcon className="h-4 w-4" /> },
]

export default function CashFlowCanvas() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges)
  const [selectedNode, setSelectedNode] = useState(null)
  const [selectedEdge, setSelectedEdge] = useState(null)
  const reactFlowWrapper = useRef(null)
  const [reactFlowInstance, setReactFlowInstance] = useState(null)

  // Handle connecting nodes
  const onConnect = useCallback(
    (params: Connection) => {
      const newEdge = {
        ...params,
        animated: true,
        label: "0万円",
        style: { stroke: "#64748b", strokeWidth: 2 },
        markerEnd: {
          type: MarkerType.ArrowClosed,
          color: "#64748b",
        },
      }
      setEdges((eds) => addEdge(newEdge, eds))
    },
    [setEdges],
  )

  // Handle node selection
  const onNodeClick = useCallback((event, node) => {
    setSelectedNode(node)
    setSelectedEdge(null)
  }, [])

  // Handle edge selection
  const onEdgeClick = useCallback((event, edge) => {
    setSelectedEdge(edge)
    setSelectedNode(null)
  }, [])

  // Handle pane click (deselect)
  const onPaneClick = useCallback(() => {
    setSelectedNode(null)
    setSelectedEdge(null)
  }, [])

  // Add a new node
  const addNode = (type) => {
    const newNode = {
      id: `node_${Date.now()}`,
      position: { x: 100, y: 100 },
      ...nodeTemplates[type],
    }
    setNodes((nds) => nds.concat(newNode))
  }

  // Update node data
  const updateNodeData = (id, newData) => {
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === id) {
          return {
            ...node,
            data: {
              ...node.data,
              ...newData,
            },
          }
        }
        return node
      }),
    )
  }

  // Update edge data
  const updateEdgeData = (id, newData) => {
    setEdges((eds) =>
      eds.map((edge) => {
        if (edge.id === id) {
          return {
            ...edge,
            ...newData,
          }
        }
        return edge
      }),
    )
  }

  // Delete selected node or edge
  const deleteSelected = () => {
    if (selectedNode) {
      setNodes((nds) => nds.filter((node) => node.id !== selectedNode.id))
      setEdges((eds) => eds.filter((edge) => edge.source !== selectedNode.id && edge.target !== selectedNode.id))
      setSelectedNode(null)
    }
    if (selectedEdge) {
      setEdges((eds) => eds.filter((edge) => edge.id !== selectedEdge.id))
      setSelectedEdge(null)
    }
  }

  // Get icon component by name
  const getIconByName = (name) => {
    const iconOption = iconOptions.find((option) => option.value === name)
    return iconOption ? iconOption.icon : <DollarSignIcon className="h-5 w-5" />
  }

  return (
    <div className="h-[calc(100vh-57px)]" ref={reactFlowWrapper}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={onNodeClick}
        onEdgeClick={onEdgeClick}
        onPaneClick={onPaneClick}
        nodeTypes={nodeTypes}
        onInit={setReactFlowInstance}
        fitView
      >
        <Background />
        <Controls />
        <MiniMap />

        <Panel position="top-right" className="bg-background border rounded-md shadow-sm p-2">
          <div className="flex gap-2">
            <Button size="sm" onClick={() => addNode("income")} className="bg-green-500 hover:bg-green-600">
              <PlusIcon className="h-4 w-4 mr-1" /> Income
            </Button>
            <Button size="sm" onClick={() => addNode("expense")} className="bg-red-500 hover:bg-red-600">
              <PlusIcon className="h-4 w-4 mr-1" /> Expense
            </Button>
            <Button size="sm" onClick={() => addNode("budget")} className="bg-blue-500 hover:bg-blue-600">
              <PlusIcon className="h-4 w-4 mr-1" /> Budget
            </Button>
            <Button size="sm" onClick={() => addNode("funding")} className="bg-purple-500 hover:bg-purple-600">
              <PlusIcon className="h-4 w-4 mr-1" /> Funding
            </Button>
            <Button size="sm" onClick={() => addNode("asset")} className="bg-amber-500 hover:bg-amber-600">
              <PlusIcon className="h-4 w-4 mr-1" /> Asset
            </Button>
            {(selectedNode || selectedEdge) && (
              <Button size="sm" variant="destructive" onClick={deleteSelected}>
                <TrashIcon className="h-4 w-4 mr-1" /> Delete
              </Button>
            )}
          </div>
        </Panel>

        <Panel position="top-left" className="bg-background border rounded-md shadow-sm p-2">
          <div className="flex gap-2">
            <JsonExport
              onExport={() => {
                if (!reactFlowInstance) return {}
                return reactFlowInstance.toObject()
              }}
            />
            <JsonImport
              onImport={(flowData) => {
                if (flowData.nodes && flowData.edges) {
                  setNodes(flowData.nodes || [])
                  setEdges(flowData.edges || [])
                }
              }}
            />
          </div>
        </Panel>

        {selectedNode && (
          <Panel position="bottom-left" className="bg-background border rounded-md shadow-sm p-4 w-80">
            <EditNodeForm
              node={selectedNode}
              onUpdate={(id, data) => {
                updateNodeData(id, data)
              }}
              onCancel={() => setSelectedNode(null)}
            />
          </Panel>
        )}

        {selectedEdge && (
          <Panel position="bottom-left" className="bg-background border rounded-md shadow-sm p-4 w-80">
            <EditEdgeForm
              edge={selectedEdge}
              onUpdate={(id, data) => {
                updateEdgeData(id, data)
              }}
              onCancel={() => setSelectedEdge(null)}
            />
          </Panel>
        )}
      </ReactFlow>
    </div>
  )
}
