"use client"

import React from 'react'
import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import Image from "next/image"
import Link from "next/link"
import { MapUsecase } from '@/module/map/usecase/mapUsecase'
import { PropertyForm } from '@/components/property-form'
import { MapService } from '@/module/map/service/mapService'
import { PropertyData } from '@/module/map/entity/PropertyData'
import { Spinner } from '@/components/ui/spinner'

export default function MapPage() {
  const [properties, setProperties] = useState<PropertyData[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isAdding, setIsAdding] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  // Add new states for search, filter, and sort
  const [searchTerm, setSearchTerm] = useState("")
  const [priceRange, setPriceRange] = useState({ min: 0, max: Infinity })
  const [sortBy, setSortBy] = useState<'price-asc' | 'price-desc' | 'title'>('price-asc')

  const service = new MapService()
  const usecase = new MapUsecase(service)

  const userId = "6cfb6a9e-bcef-42dc-8b9b-3702c7ec788a"

  useEffect(() => {
    const fetchProperties = async () => {
      setIsLoading(true)
      try {
        const mapResult = await usecase.getListProperty(userId)
        if (mapResult) setProperties(mapResult)
      } catch (error) {
        console.error('Error fetching properties:', error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchProperties()
  }, [])

  const handleAddProperty = async (data: PropertyData) => {
    setIsAdding(true)
    try {
      const newProperty = await usecase.createProperty(data, userId)
      setProperties([...properties, newProperty])
    } catch (error) {
      console.error('Error adding property:', error)
    } finally {
      setIsAdding(false)
    }
  }

  const handleUpdateProperty = async (id: string, data: PropertyData) => {
    // try {
    //   const updatedProperty = await usecase.update(id, data)
    //   setProperties(properties.map(prop => 
    //     prop.id === id ? updatedProperty : prop
    //   ))
    // } catch (error) {
    //   console.error('Error updating property:', error)
    // }
  }

  const handleDeleteProperty = async (id: string) => {
    setIsDeleting(true)
    try {
      await usecase.deleteProperty(id, userId)
      setProperties(properties.filter(prop => prop.id !== id))
    } catch (error) {
      console.error('Error deleting property:', error)
    } finally {
      setIsDeleting(false)
    }
  }

  // Add new function to filter and sort properties
  const filteredAndSortedProperties = properties
    .filter(prop => 
      prop.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
      prop.price >= priceRange.min &&
      prop.price <= priceRange.max
    )
    .sort((a, b) => {
      switch (sortBy) {
        case 'price-asc':
          return a.price - b.price
        case 'price-desc':
          return b.price - a.price
        case 'title':
          return a.title.localeCompare(b.title)
        default:
          return 0
      }
    })

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Your Properties</h1>
        <PropertyForm onSubmit={handleAddProperty} isLoading={isAdding} />
      </div>

      {/* Add search, filter, and sort controls */}
      <div className="mb-6 space-y-4">
        <div className="flex gap-4">
          <input
            type="text"
            placeholder="Search properties..."
            className="px-4 py-2 border rounded-lg flex-1"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <select
            className="px-4 py-2 border rounded-lg"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
          >
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="title">Title</option>
          </select>
        </div>
        
        <div className="flex gap-4 items-center">
          <input
            type="number"
            placeholder="Min price"
            className="px-4 py-2 border rounded-lg w-40"
            onChange={(e) => setPriceRange(prev => ({ ...prev, min: Number(e.target.value) || 0 }))}
          />
          <span>to</span>
          <input
            type="number"
            placeholder="Max price"
            className="px-4 py-2 border rounded-lg w-40"
            onChange={(e) => setPriceRange(prev => ({ ...prev, max: Number(e.target.value) || Infinity }))}
          />
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center min-h-[200px]">
          <Spinner className="w-8 h-8" />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {filteredAndSortedProperties.map((prop) => (
            <div key={prop.id} className="relative group overflow-hidden rounded-lg">
              <Link
                href={`https://maps.google.com/?q=${prop.latitude},${prop.longitude}`}
                target="_blank"
                rel="noopener noreferrer"
                className="block"
              >
                <Card className="transform transition-all duration-300 hover:scale-105 cursor-pointer border-0 bg-transparent">
                  <div className="relative">
                    <Image
                      src={prop.image_url}
                      alt="Property"
                      width={400}
                      height={250}
                      className="rounded-lg object-cover w-full h-[250px]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="absolute bottom-0 left-0 right-0 p-4 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                      <p className="text-white font-bold text-xl mb-2">Rp {prop.price.toLocaleString()}</p>
                      <p className="text-white/90 text-sm truncate">{prop.title || "Beautiful Property"}</p>
                    </div>
                  </div>
                </Card>
              </Link>
              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                <PropertyForm
                  property={prop}
                  onSubmit={(data) => handleUpdateProperty(prop.id, data)}
                  onDelete={() => handleDeleteProperty(prop.id)}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}