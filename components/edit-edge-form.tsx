"use client"

import { useState, useEffect } from "react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"

export default function EditEdgeForm({ edge, onUpdate, onCancel }) {
  // Create local state for form values
  const [formValues, setFormValues] = useState({
    amount: "0",
    animated: true,
  })

  // Initialize form with edge data when edge changes
  useEffect(() => {
    if (edge) {
      setFormValues({
        amount: edge.label?.replace("$", "") || "0",
        animated: edge.animated || false,
      })
    }
  }, [edge])

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormValues((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  // Handle switch changes
  const handleSwitchChange = (checked) => {
    setFormValues((prev) => ({
      ...prev,
      animated: checked,
    }))
  }

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault()

    // Update the edge with validated values
    onUpdate(edge.id, {
      label: `${formValues.amount}`,
      animated: formValues.animated,
    })
  }

  if (!edge) return null

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h3 className="font-medium mb-2">Edit Connection</h3>

      <div className="space-y-2">
        <Label htmlFor="edge-amount">Amount (万円)</Label>
        <Input
          id="edge-amount"
          name="amount"
          value={formValues.amount}
          onChange={handleInputChange}
          className="w-full"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="edge-animated">Animate Flow</Label>
        <div className="flex items-center space-x-2 mt-1">
          <Switch id="edge-animated" checked={formValues.animated} onCheckedChange={handleSwitchChange} />
          <Label htmlFor="edge-animated">Enabled</Label>
        </div>
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
