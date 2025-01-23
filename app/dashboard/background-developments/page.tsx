"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

export default function BackgroundDevelopments() {
  const [developments, setDevelopments] = useState([
    { id: 1, title: "New Zoning Laws", description: "Updates to city zoning laws affecting commercial districts." },
    {
      id: 2,
      title: "Population Growth Projections",
      description: "Latest demographic studies projecting 5% population growth over next 3 years.",
    },
  ])

  const [newTitle, setNewTitle] = useState("")
  const [newDescription, setNewDescription] = useState("")

  const handleAddDevelopment = (e: React.FormEvent) => {
    e.preventDefault()
    const newDevelopment = {
      id: developments.length + 1,
      title: newTitle,
      description: newDescription,
    }
    setDevelopments([...developments, newDevelopment])
    setNewTitle("")
    setNewDescription("")
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-4xl font-bold mb-8">Background Developments</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {developments.map((dev) => (
          <Card key={dev.id}>
            <CardHeader>
              <CardTitle>{dev.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p>{dev.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Add New Development</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAddDevelopment} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input id="title" value={newTitle} onChange={(e) => setNewTitle(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
                required
              />
            </div>
            <Button type="submit">Add Development</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

