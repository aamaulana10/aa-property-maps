"use client"

import React from 'react'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import Image from "next/image"
import { PropertyData } from '@/module/map/entity/PropertyData'
import { PropertyForm } from '@/components/property-form'
import './map-styles.css'

// Fix Leaflet default marker icon issue
// This needs to be in a client component
// eslint-disable-next-line @typescript-eslint/no-explicit-any
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface MapProps {
  mapCenter: [number, number];
  properties: PropertyData[];
  handleUpdateProperty: (id: string, data: PropertyData) => Promise<void>;
  handleDeleteProperty: (id: string) => Promise<void>;
  isDeleting: boolean;
}

const Map = ({ mapCenter, properties, handleUpdateProperty, handleDeleteProperty, isDeleting }: MapProps) => {
  const mapRef = React.useRef<L.Map>(null);

  React.useEffect(() => {
    if (mapRef.current) {
      mapRef.current.setView(mapCenter, 12);
    }
  }, [mapCenter]);

  return (
    <MapContainer
      ref={mapRef}
      center={mapCenter}
      zoom={12}
      style={{ width: '100%', height: '100%' }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      {properties.map((property) => {
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
  );
};

export default Map;