"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { SaveIcon, UploadIcon } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"

export function JsonExport({ onExport }) {
  const [isOpen, setIsOpen] = useState(false)
  const [jsonData, setJsonData] = useState("")

  const handleExport = () => {
    try {
      const data = onExport()
      setJsonData(JSON.stringify(data, null, 2))
      setIsOpen(true)
    } catch (error) {
      console.error("Export error:", error)
    }
  }

  const handleCopyToClipboard = () => {
    navigator.clipboard
      .writeText(jsonData)
      .then(() => {
        alert("JSON copied to clipboard!")
      })
      .catch((err) => {
        console.error("Failed to copy: ", err)
      })
  }

  const handleDownload = () => {
    const blob = new Blob([jsonData], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "cash-flow-diagram.json"
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <>
      <Button size="sm" onClick={handleExport} variant="outline">
        <SaveIcon className="h-4 w-4 mr-1" /> Export
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Export Flow Data</DialogTitle>
            <DialogDescription>Copy the JSON data below to save your flow diagram.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <Textarea
              value={jsonData}
              readOnly
              className="font-mono text-xs h-[300px]"
              onClick={(e) => e.target.select()}
            />
          </div>
          <DialogFooter>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={handleCopyToClipboard}>
                Copy to Clipboard
              </Button>
              <Button onClick={handleDownload}>Download JSON</Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

export function JsonImport({ onImport }) {
  const [isOpen, setIsOpen] = useState(false)
  const [jsonData, setJsonData] = useState("")
  const [error, setError] = useState("")

  const handleImport = () => {
    try {
      setError("")
      const data = JSON.parse(jsonData)

      // Validate the data structure
      if (!data.nodes || !Array.isArray(data.nodes) || !data.edges || !Array.isArray(data.edges)) {
        throw new Error("Invalid JSON format: missing nodes or edges arrays")
      }

      // Validate each node has required properties
      for (const node of data.nodes) {
        if (!node.id || !node.type || !node.position || !node.data) {
          throw new Error("Invalid node format: missing required properties")
        }
      }

      // Validate each edge has required properties
      for (const edge of data.edges) {
        if (!edge.id || !edge.source || !edge.target) {
          throw new Error("Invalid edge format: missing required properties")
        }
      }

      onImport(data)
      setIsOpen(false)
      setJsonData("")
    } catch (error) {
      console.error("Import error:", error)
      setError(error.message || "Invalid JSON data. Please check the format and try again.")
    }
  }

  const handleFileUpload = (e) => {
    const file = e.target.files[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      try {
        setJsonData(event.target.result)
      } catch (error) {
        console.error("File read error:", error)
        setError("Could not read the file. Please try again.")
      }
    }
    reader.readAsText(file)
  }

  return (
    <>
      <Button size="sm" onClick={() => setIsOpen(true)} variant="outline">
        <UploadIcon className="h-4 w-4 mr-1" /> Import
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Import Flow Data</DialogTitle>
            <DialogDescription>Paste your JSON data below or upload a file to load a flow diagram.</DialogDescription>
          </DialogHeader>

          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="grid gap-4 py-4">
            <div>
              <label htmlFor="file-upload" className="block text-sm font-medium mb-2">
                Upload JSON File
              </label>
              <input
                id="file-upload"
                type="file"
                accept=".json"
                onChange={handleFileUpload}
                className="block w-full text-sm text-gray-500
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-md file:border-0
                  file:text-sm file:font-semibold
                  file:bg-primary file:text-primary-foreground
                  hover:file:bg-primary/90"
              />
            </div>

            <div className="mt-4">
              <label htmlFor="json-input" className="block text-sm font-medium mb-2">
                Or paste JSON data
              </label>
              <Textarea
                id="json-input"
                value={jsonData}
                onChange={(e) => setJsonData(e.target.value)}
                className="font-mono text-xs h-[300px]"
                placeholder="Paste your JSON data here..."
              />
            </div>
          </div>

          <DialogFooter>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleImport}>Import</Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
