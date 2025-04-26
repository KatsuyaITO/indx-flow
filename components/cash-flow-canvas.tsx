"use client"

import { useCallback, useRef, useState, useEffect } from "react"
import ReactFlow, {
  Background,
  Controls,
  addEdge,
  useEdgesState,
  useNodesState,
  MarkerType,
  Panel,
  type Connection,
  type NodeTypes,
  SelectionMode,
} from "reactflow"
import "reactflow/dist/style.css"

import { Button } from "@/components/ui/button"
import {
  BanknoteIcon,
  BuildingIcon,
  CircleDollarSignIcon,
  CoinsIcon,
  CopyIcon,
  CreditCardIcon,
  DollarSignIcon,
  HomeIcon,
  PiggyBankIcon,
  ShoppingCartIcon,
  PlusIcon,
  ScissorsIcon,
  TrashIcon,
  WalletIcon,
  MessageSquareIcon,
} from "lucide-react"

import FundingNode from "@/components/nodes/funding-node"
import ExpenseNode from "@/components/nodes/expense-node"
import BudgetNode from "@/components/nodes/budget-node"
import IncomeNode from "@/components/nodes/income-node"
import AssetNode from "@/components/nodes/asset-node"
import CommentNode from "@/components/nodes/comment-node"
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
  commentNode: CommentNode,
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
  { value: "message", label: "Comment", icon: <MessageSquareIcon className="h-4 w-4" /> },
]

// Initial nodes and edges with iconName instead of icon component
const initialNodes = [
  {
    id: "1",
    type: "incomeNode",
    position: { x: 100, y: 100 },
    data: {
      label: "Monthly Income",
      amount: 5000,
      iconName: "dollar",
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
      iconName: "wallet",
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
      iconName: "home",
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
      iconName: "cart",
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
      iconName: "piggy",
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
      iconName: "dollar",
      color: "bg-green-100 border-green-500",
    },
  },
  expense: {
    type: "expenseNode",
    data: {
      label: "Expense",
      amount: 500,
      iconName: "card",
      color: "bg-red-100 border-red-500",
    },
  },
  budget: {
    type: "budgetNode",
    data: {
      label: "Budget",
      amount: 2000,
      iconName: "wallet",
      color: "bg-blue-100 border-blue-500",
    },
  },
  funding: {
    type: "fundingNode",
    data: {
      label: "Funding",
      amount: 5000,
      iconName: "bank",
      color: "bg-purple-100 border-purple-500",
    },
  },
  asset: {
    type: "assetNode",
    data: {
      label: "Asset",
      amount: 10000,
      iconName: "home",
      color: "bg-amber-100 border-amber-500",
    },
  },
  comment: {
    type: "commentNode",
    data: {
      label: "Comment",
      comment: "Add your notes here",
      iconName: "message",
      color: "bg-yellow-100 border-yellow-500",
    },
  },
}

export default function CashFlowCanvas() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges)
  const [selectedNode, setSelectedNode] = useState(null)
  const [selectedEdge, setSelectedEdge] = useState(null)
  const [selectedElements, setSelectedElements] = useState({ nodes: [], edges: [] })
  const [clipboard, setClipboard] = useState({ nodes: [], edges: [] })
  const reactFlowWrapper = useRef(null)
  const [reactFlowInstance, setReactFlowInstance] = useState(null)
  const [isEditingNode, setIsEditingNode] = useState(false)
  const [isEditingEdge, setIsEditingEdge] = useState(false)

  // Get icon component by name
  const getIconByName = (name) => {
    const iconOption = iconOptions.find((option) => option.value === name)
    return iconOption ? iconOption.icon : <DollarSignIcon className="h-5 w-5" />
  }

  // Process nodes to add icon components based on iconName
  const processNodes = (nodes) => {
    return nodes.map(node => ({
      ...node,
      data: {
        ...node.data,
        icon: getIconByName(node.data.iconName)
      }
    }))
  }

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
    if (!event.ctrlKey && !event.metaKey) {
      setSelectedNode(node)
      setSelectedEdge(null)
      setIsEditingNode(true)
    }
  }, [])

  // Handle edge selection
  const onEdgeClick = useCallback((event, edge) => {
    if (!event.ctrlKey && !event.metaKey) {
      setSelectedEdge(edge)
      setSelectedNode(null)
      setIsEditingEdge(true)
    }
  }, [])

  // Handle selection change by monitoring nodes and edges directly
  useEffect(() => {
    const selectedNodes = nodes.filter(node => node.selected);
    const selectedEdges = edges.filter(edge => edge.selected);
    
    setSelectedElements({ nodes: selectedNodes, edges: selectedEdges });
    
    // Handle single node/edge selection for edit panel
    if (selectedNodes.length === 1 && selectedEdges.length === 0) {
      setSelectedNode(selectedNodes[0]);
      setSelectedEdge(null);
    } else if (selectedNodes.length === 0 && selectedEdges.length === 1) {
      setSelectedNode(null);
      setSelectedEdge(selectedEdges[0]);
    } else if (selectedNodes.length > 1 || selectedEdges.length > 1) {
      setSelectedNode(null);
      setSelectedEdge(null);
      setIsEditingNode(false);
      setIsEditingEdge(false);
    }
  }, [nodes, edges]);

  // Handle pane click (deselect)
  const onPaneClick = useCallback(() => {
    setSelectedNode(null)
    setSelectedEdge(null)
    setIsEditingNode(false)
    setIsEditingEdge(false)
  }, [])

  // Add a new node
  const addNode = (type) => {
    const newNode = {
      id: `node_${Date.now()}`,
      position: { x: 100, y: 100 },
      ...nodeTemplates[type],
    }
    // Add icon component based on iconName
    newNode.data.icon = getIconByName(newNode.data.iconName)
    setNodes((nds) => nds.concat(newNode))
  }

  // Update node data
  const updateNodeData = (id, newData) => {
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === id) {
          const updatedData = {
            ...node.data,
            ...newData,
          }
          // If iconName is updated, update the icon component too
          if (newData.iconName) {
            updatedData.icon = getIconByName(newData.iconName)
          }
          return {
            ...node,
            data: updatedData,
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
    if (selectedElements.nodes.length > 0 || selectedElements.edges.length > 0) {
      const selectedNodeIds = selectedElements.nodes.map(node => node.id)
      
      setNodes((nds) => nds.filter((node) => !selectedNodeIds.includes(node.id)))
      setEdges((eds) => eds.filter((edge) => {
        // Remove edges connected to deleted nodes
        if (selectedNodeIds.includes(edge.source) || selectedNodeIds.includes(edge.target)) {
          return false
        }
        
        // Remove selected edges
        return !selectedElements.edges.some(selectedEdge => selectedEdge.id === edge.id)
      }))
      
      setSelectedNode(null)
      setSelectedEdge(null)
      setIsEditingNode(false)
      setIsEditingEdge(false)
    } else if (selectedNode) {
      setNodes((nds) => nds.filter((node) => node.id !== selectedNode.id))
      setEdges((eds) => eds.filter((edge) => edge.source !== selectedNode.id && edge.target !== selectedNode.id))
      setSelectedNode(null)
      setIsEditingNode(false)
    } else if (selectedEdge) {
      setEdges((eds) => eds.filter((edge) => edge.id !== selectedEdge.id))
      setSelectedEdge(null)
      setIsEditingEdge(false)
    }
  }

  // Cut selected nodes and edges
  const cutSelected = () => {
    if (selectedElements.nodes.length > 0 || selectedElements.edges.length > 0) {
      // Copy selected elements to clipboard
      setClipboard({
        nodes: selectedElements.nodes.map(node => ({...node})),
        edges: selectedElements.edges.filter(edge => {
          // Only include edges where both source and target nodes are selected
          const sourceSelected = selectedElements.nodes.some(node => node.id === edge.source)
          const targetSelected = selectedElements.nodes.some(node => node.id === edge.target)
          return sourceSelected && targetSelected
        })
      })
      
      // Delete selected elements
      deleteSelected()
    }
  }

  // Paste nodes and edges from clipboard
  const pasteFromClipboard = () => {
    if (clipboard.nodes.length === 0) return
    
    if (!reactFlowInstance) return
    
    // Get current viewport position
    const { x, y, zoom } = reactFlowInstance.getViewport()
    
    // Generate new IDs for nodes and create mapping
    const idMapping = {}
    const currentTimestamp = Date.now()
    
    // Create new nodes with offset positions
    const newNodes = clipboard.nodes.map((node, index) => {
      const newId = `${node.id}_copy_${currentTimestamp}_${index}`
      idMapping[node.id] = newId
      
      // Calculate paste position: we'll offset by 100px from original position
      return {
        ...node,
        id: newId,
        position: {
          x: node.position.x + 100,
          y: node.position.y + 100
        },
        selected: true,
        data: {
          ...node.data,
          icon: getIconByName(node.data.iconName) // Ensure icon is set
        }
      }
    })
    
    // Create new edges with updated source/target IDs
    const newEdges = clipboard.edges.map((edge, index) => {
      return {
        ...edge,
        id: `${edge.id}_copy_${currentTimestamp}_${index}`,
        source: idMapping[edge.source],
        target: idMapping[edge.target],
        selected: true
      }
    })
    
    // Add new nodes and edges to the canvas
    setNodes(existingNodes => [...existingNodes, ...newNodes])
    setEdges(existingEdges => [...existingEdges, ...newEdges])
  }

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (event) => {
      // Skip keyboard shortcuts if we're editing a node or edge
      if (isEditingNode || isEditingEdge) {
        return;
      }
      
      // Ctrl+X or Cmd+X: Cut
      if ((event.ctrlKey || event.metaKey) && event.key === 'x') {
        cutSelected()
      }
      
      // Ctrl+V or Cmd+V: Paste
      if ((event.ctrlKey || event.metaKey) && event.key === 'v') {
        event.preventDefault()
        pasteFromClipboard()
      }
      
      // Ctrl+C or Cmd+C: Copy
      if ((event.ctrlKey || event.metaKey) && event.key === 'c') {
        if (selectedElements.nodes.length > 0 || selectedElements.edges.length > 0) {
          setClipboard({
            nodes: selectedElements.nodes.map(node => ({...node})),
            edges: selectedElements.edges.filter(edge => {
              // Only include edges where both source and target nodes are selected
              const sourceSelected = selectedElements.nodes.some(node => node.id === edge.source)
              const targetSelected = selectedElements.nodes.some(node => node.id === edge.target)
              return sourceSelected && targetSelected
            })
          })
        }
      }
      
      // Delete or Backspace: Delete selected
      if (event.key === 'Delete' || event.key === 'Backspace') {
        deleteSelected()
      }
    }
    
    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [selectedElements, selectedNode, selectedEdge, isEditingNode, isEditingEdge])

  // Initialize nodes with icons on component mount
  useState(() => {
    setNodes(processNodes(initialNodes))
  }, [])

  // Function to handle selection change directly from ReactFlow
  const onSelectionChange = useCallback(({ nodes, edges }) => {
    setSelectedElements({ nodes, edges });
  }, []);

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
        onSelectionChange={onSelectionChange}
        nodeTypes={nodeTypes}
        onInit={setReactFlowInstance}
        fitView
        selectionMode={SelectionMode.Partial}
        selectionOnDrag
        multiSelectionKeyCode={['Control', 'Meta']}
        deleteKeyCode={['Backspace', 'Delete']}
      >
        <Background />
        <Controls />

        <Panel position="top-right" className="bg-background border rounded-md shadow-sm p-2">
          <div className="flex gap-2 flex-wrap">
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
            <Button size="sm" onClick={() => addNode("comment")} className="bg-yellow-500 hover:bg-yellow-600">
              <PlusIcon className="h-4 w-4 mr-1" /> Comment
            </Button>
            
            {selectedElements.nodes.length > 0 || selectedElements.edges.length > 0 || selectedNode || selectedEdge ? (
              <>
                <Button size="sm" variant="destructive" onClick={deleteSelected}>
                  <TrashIcon className="h-4 w-4 mr-1" /> Delete
                </Button>
                <Button size="sm" variant="secondary" onClick={cutSelected}>
                  <ScissorsIcon className="h-4 w-4 mr-1" /> Cut
                </Button>
              </>
            ) : null}
            
            {clipboard.nodes.length > 0 && (
              <Button size="sm" variant="secondary" onClick={pasteFromClipboard}>
                <CopyIcon className="h-4 w-4 mr-1" /> Paste
              </Button>
            )}
          </div>
        </Panel>

        <Panel position="top-left" className="bg-background border rounded-md shadow-sm p-2">
          <div className="flex gap-2">
            <JsonExport
              onExport={() => {
                if (!reactFlowInstance) return {}
                
                // Remove icon components before serialization
                const flowObject = reactFlowInstance.toObject()
                const serializedNodes = flowObject.nodes.map(node => ({
                  ...node,
                  data: {
                    ...node.data,
                    icon: undefined // Remove non-serializable icon component
                  }
                }))
                
                return {
                  ...flowObject,
                  nodes: serializedNodes
                }
              }}
            />
            <JsonImport
              onImport={(flowData) => {
                if (flowData.nodes && flowData.edges) {
                  // Add icon components based on iconName when importing
                  const nodesWithIcons = flowData.nodes.map(node => ({
                    ...node,
                    data: {
                      ...node.data,
                      icon: getIconByName(node.data.iconName)
                    }
                  }))
                  
                  setNodes(nodesWithIcons)
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
              onCancel={() => {
                setSelectedNode(null)
                setIsEditingNode(false)
              }}
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
              onCancel={() => {
                setSelectedEdge(null)
                setIsEditingEdge(false)
              }}
            />
          </Panel>
        )}
      </ReactFlow>
    </div>
  )
}