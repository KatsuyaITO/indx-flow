"use client"

import { useState, useEffect } from "react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  DollarSignIcon,
  WalletIcon,
  BuildingIcon,
  PiggyBankIcon,
  CreditCardIcon,
  ShoppingCartIcon,
  HomeIcon,
  CoinsIcon,
  CircleDollarSignIcon,
} from "lucide-react"

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

export default function EditNodeForm({ node, onUpdate, onCancel }) {
  // Create local state for form values
  const [formValues, setFormValues] = useState({
    label: "",
    amount: 0,
    selectedIcon: "",
  })

  // Initialize form with node data when node changes
  useEffect(() => {
    if (node) {
      // Find the icon key by comparing the node's icon with our options
      const iconKey =
        iconOptions.find((option) => JSON.stringify(option.icon) === JSON.stringify(node.data.icon))?.value || "dollar"

      setFormValues({
        label: node.data.label || "",
        amount: node.data.amount || 0,
        selectedIcon: iconKey,
      })
    }
  }, [node])

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormValues((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  // Handle icon selection
  const handleIconChange = (value) => {
    setFormValues((prev) => ({
      ...prev,
      selectedIcon: value,
    }))
  }

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault()

    // Find the selected icon component
    const selectedIconOption = iconOptions.find((option) => option.value === formValues.selectedIcon)
    const iconComponent = selectedIconOption ? selectedIconOption.icon : <DollarSignIcon className="h-5 w-5" />

    // Update the node with validated values
    onUpdate(node.id, {
      label: formValues.label,
      amount: Number.parseFloat(formValues.amount) || 0,
      icon: iconComponent,
    })
  }

  if (!node) return null

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h3 className="font-medium mb-2">Edit Node</h3>

      <div className="space-y-2">
        <Label htmlFor="node-label">Label</Label>
        <Input id="node-label" name="label" value={formValues.label} onChange={handleInputChange} className="w-full" />
      </div>

      <div className="space-y-2">
        <Label htmlFor="node-amount">Amount (万円)</Label>
        <Input
          id="node-amount"
          name="amount"
          type="number"
          value={formValues.amount}
          onChange={handleInputChange}
          className="w-full"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="node-icon">Icon</Label>
        <Select value={formValues.selectedIcon} onValueChange={handleIconChange}>
          <SelectTrigger id="node-icon">
            <SelectValue placeholder="Select an icon" />
          </SelectTrigger>
          <SelectContent>
            {iconOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                <div className="flex items-center">
                  {option.icon}
                  <span className="ml-2">{option.label}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">Apply Changes</Button>
      </div>
    </form>
  )
}
