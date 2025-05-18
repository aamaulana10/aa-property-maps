"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { PropertyData } from "@/module/map/entity/PropertyData"
import { Spinner } from "./ui/spinner"

type PropertyFormProps = {
  property?: PropertyData
  onSubmit: (data: PropertyData) => void
  onDelete?: () => void
  isLoading?: boolean
}

export function PropertyForm({ property, onSubmit, onDelete, isLoading }: PropertyFormProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [inputLat, setInputLat] = useState(String(property?.latitude || 0))
  const [inputLng, setInputLng] = useState(String(property?.longitude || 0))
  const [formData, setFormData] = useState<PropertyData>(
    property ?? {
        id: "",
        title: "",
        description: "",
        price: 0,
        image_url: "",
        latitude: 0.0,
        longitude: 0.0,
    }
  )

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const lat = parseFloat(inputLat)
    const lng = parseFloat(inputLng)

  if (isNaN(lat) || isNaN(lng)) {
    alert("Latitude dan Longitude should be valid")
    return
  }
    onSubmit(formData)
    setIsOpen(false)
  }

  const handleDelete = () => {
    if (onDelete) {
      onDelete()
      setIsOpen(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant={property ? "outline" : "default"}>
          {property ? "Edit" : "Add Property"}
        </Button>
      </DialogTrigger>
      <DialogContent className="z-[2000]">
        <DialogHeader>
          <DialogTitle>{property ? "Edit Property" : "Add New Property"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
             <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Beautiful House"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="A beautiful house with great view"
                required
              />
            </div>
          <div className="space-y-2">
            <Label htmlFor="price">Price</Label>
            <Input
              id="price"
              value={(formData.price || 0).toString()}
              onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
              placeholder="Rp 800 juta"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="image">Image URL</Label>
            <Input
              id="image"
              value={formData.image_url}
              onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
              placeholder="Your the best image url"
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="lat">Latitude</Label>
              <Input
                id="lat"
                type="text"
                value={inputLat}
                onChange={(e) => {
                  const value = e.target.value
                  setInputLat(value)
                  if (value && !isNaN(parseFloat(value))) {
                    setFormData({ ...formData, latitude: parseFloat(value) })
                  }
                }}
                placeholder="-6.2088"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lng">Longitude</Label>
              <Input
                id="lng"
                type="text"
                value={inputLng}
                onChange={(e) => {
                  const value = e.target.value
                  setInputLng(value)
                  if (value && !isNaN(parseFloat(value))) {
                    setFormData({ ...formData, longitude: parseFloat(value) })
                  }
                }}
                placeholder="106.8456"
                required
              />
            </div>
          </div>
          <div className="flex justify-between pt-4">
            {property && (
              <Button type="button" variant="destructive" onClick={handleDelete} disabled={isLoading}>
                {isLoading ? <Spinner className="mr-2" /> : null}
                Delete
              </Button>
            )}
            <div className="flex gap-2 ml-auto">
              <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? <Spinner className="mr-2" /> : null}
                {property ? "Save Changes" : "Add Property"}
              </Button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}