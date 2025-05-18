"use client"

import React from 'react'
import { useEffect, useState } from "react"
import { MapUsecase } from '@/module/map/usecase/mapUsecase'
import { PropertyForm } from '@/components/property-form'
import { MapService } from '@/module/map/service/mapService'
import { PropertyData } from '@/module/map/entity/PropertyData'
import { Spinner } from '@/components/ui/spinner'
import supabase from '@/lib/supabase'
import { User } from '@supabase/supabase-js'
import dynamic from 'next/dynamic'
import { PropertyList } from '@/components/property-list'

const MapWithNoSSR = dynamic(() => import('@/components/map'), {
  ssr: false,
  loading: () => (
    <div className="flex relative z-0 justify-center items-center h-[600px] w-full bg-gray-100 rounded-lg">
      <Spinner className="w-8 h-8" />
    </div>
  )
})

export default function MapPage() {
  const [properties, setProperties] = useState<PropertyData[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isAdding, setIsAdding] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [priceRange, setPriceRange] = useState<{ min: number; max: number | undefined }>({
    min: 0,
    max: undefined
  })
  const [sortBy, setSortBy] = useState<'price-asc' | 'price-desc' | 'title'>('price-asc')
  const [selectedLocation, setSelectedLocation] = useState<[number, number]>([-6.2088, 106.8456]) // Jakarta center

  const service = new MapService()
  const usecase = new MapUsecase(service)

  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    const init = async () => {
      const { data, error } = await supabase.auth.getUser();
  
      if (error || !data.user) {
        console.error("Gagal dapetin user:", error);
        return;
      }
  
      setUser(data.user);
    };
  
    init();
  }, []);

  useEffect(() => {
    if (user?.id) {
      handleGetProperties();
    }
  }, [user]);

  const handleGetProperties = async () => {
    setIsLoading(true)
    try {
      const mapResult = await usecase.getListProperty(user?.id || '')
      if (mapResult) setProperties(mapResult)
    } catch (error) {
      console.error('Error fetching properties:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddProperty = async (data: PropertyData) => {
    setIsAdding(true)
    try {
      const newProperty = await usecase.createProperty(data, user?.id || '')
      setProperties([...properties, newProperty])
    } catch (error) {
      console.error('Error adding property:', error)
    } finally {
      setIsAdding(false)
    }
  }

  const handleUpdateProperty = async (id: string, data: PropertyData) => {
    try {
      const updatedProperty = await usecase.updateProperty(id, data, user?.id || '')
      handleGetProperties();
      setProperties(properties.map(prop => 
        prop.id === id ? updatedProperty : prop
      ))
    } catch (error) {
      console.error('Error updating property:', error)
    }
  }

  const handleDeleteProperty = async (id: string) => {
    setIsDeleting(true)
    try {
      await usecase.deleteProperty(id, user?.id || '')
      setProperties(properties.filter(prop => prop.id !== id))
    } catch (error) {
      console.error('Error deleting property:', error)
    } finally {
      setIsDeleting(false)
    }
  }

  const filteredAndSortedProperties = properties
    .filter(prop => 
      (prop.title?.toLowerCase() || '').includes(searchTerm.toLowerCase()) &&
      (prop.price || 0) >= priceRange.min &&
      (priceRange.max === undefined || (prop.price || 0) <= priceRange.max)
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
        <div className='z-[9999]'>
            <PropertyForm onSubmit={handleAddProperty} isLoading={isAdding} />
        </div>
      </div>

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
            onChange={(e) => {
              const value = e.target.value
              setPriceRange(prev => ({
                ...prev,
                max: value === "" ? undefined : Number(value)
              }))
            }}
          />
        </div>
      </div>

      <PropertyList
        properties={filteredAndSortedProperties}
        onSelect={(property) => {
          setSelectedLocation([property.latitude, property.longitude])
        }}
        handleUpdateProperty={handleUpdateProperty}
        handleDeleteProperty={handleDeleteProperty}
        isDeleting={isDeleting}
      />

      {isLoading ? (
        <div className="flex justify-center items-center min-h-[200px]">
          <Spinner className="w-8 h-8" />
        </div>
      ) : (
        <div className="h-[600px] w-full rounded-lg overflow-hidden">
          <MapWithNoSSR 
            mapCenter={selectedLocation} 
            properties={filteredAndSortedProperties} 
            handleUpdateProperty={handleUpdateProperty}
            handleDeleteProperty={handleDeleteProperty}
            isDeleting={isDeleting}
          />
        </div>
      )}
    </div>
  )
}