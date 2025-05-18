"use client"

import React from 'react'
import { useEffect, useState } from "react"
import Image from "next/image"
import { MapUsecase } from '@/module/map/usecase/mapUsecase'
import { PropertyForm } from '@/components/property-form'
import { MapService } from '@/module/map/service/mapService'
import { PropertyData } from '@/module/map/entity/PropertyData'
import { Spinner } from '@/components/ui/spinner'
import supabase from '@/lib/supabase'
import { User } from '@supabase/supabase-js'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import './styles.css'

// Fix Leaflet default marker icon issue
// eslint-disable-next-line @typescript-eslint/no-explicit-any
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

export default function MapPage() {
  const [properties, setProperties] = useState<PropertyData[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isAdding, setIsAdding] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [priceRange, setPriceRange] = useState({ min: 0, max: Infinity })
  const [sortBy, setSortBy] = useState<'price-asc' | 'price-desc' | 'title'>('price-asc')
  const mapCenter: [number, number] = [-6.2088, 106.8456] // Jakarta center

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
      console.log('isDeleting :>>', isDeleting);
      
    }
  }

  const filteredAndSortedProperties = properties
    .filter(prop => 
      (prop.title?.toLowerCase() || '').includes(searchTerm.toLowerCase()) &&
      (prop.price || 0) >= priceRange.min &&
      (prop.price || 0) <= priceRange.max
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
        <div className="h-[600px] w-full rounded-lg overflow-hidden">
          <MapContainer
            center={mapCenter}
            zoom={12}
            style={{ width: '100%', height: '100%' }}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            {filteredAndSortedProperties.map((property) => {
              const customIcon = new L.DivIcon({
                className: 'custom-marker',
                html: `<div class="bg-black bg-opacity-75 text-white px-2 py-1 rounded-lg font-semibold">Rp ${property.price.toLocaleString()}</div>`,
                iconSize: [60, 30],
                iconAnchor: [30, 30]
              });
              return (
                <Marker
                  key={property.id}
                  position={[property.latitude, property.longitude]}
                  icon={customIcon}
                  eventHandlers={{
                    mouseover: (e) => e.target.openPopup()
                  }}
                >
                  <Popup className="property-popup">
                    <div className="p-4 max-w-sm transition-all duration-300 ease-in-out">
                      {property.image_url && (
                        <div className="relative w-[260px] h-[160px] rounded-xl overflow-hidden shadow-md">
                        <Image
                          src={property.image_url}
                          fill
                          alt="Property preview"
                          sizes="(max-width: 768px) 100vw, 260px"
                          className="object-cover"
                        />
                      </div>
                      )}
                      <h2 className="text-lg font-semibold m-2">{property.title}</h2>
                      <p className="text-gray-600 mb-2">{property.description}</p>
                      <p className="font-semibold text-lg">Rp {property.price.toLocaleString()}</p>
                      <div className="mt-4 flex justify-end space-x-2">
                        <PropertyForm
                          property={property}
                          onSubmit={(data) => handleUpdateProperty(property.id, data)}
                        />
                        <button
                          onClick={() => handleDeleteProperty(property.id)}
                          className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                          disabled={isDeleting}
                        >
                          {isDeleting ? 'Deleting...' : 'Delete'}
                        </button>
                      </div>
                    </div>
                  </Popup>
                </Marker>
              );
            })}
          </MapContainer>
        </div>
      )}
    </div>
  )
}