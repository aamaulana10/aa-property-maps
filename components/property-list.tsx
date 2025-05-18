import { PropertyData } from "@/module/map/entity/PropertyData"
import { Card } from "@/components/ui/card"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import Image from "next/image"
import { PropertyForm } from "./property-form"

type PropertyListProps = {
  properties: PropertyData[]
  onSelect?: (property: PropertyData) => void
  handleUpdateProperty: (id: string, data: PropertyData) => Promise<void>;
  handleDeleteProperty: (id: string) => Promise<void>;
  isDeleting: boolean;
}

export function PropertyList({ properties, onSelect, handleUpdateProperty, handleDeleteProperty }: PropertyListProps) {
  return (
    <div className="px-4 py-2">
      <h2 className="text-lg font-semibold mb-2">Available Properties</h2>
      <ScrollArea className="whitespace-nowrap overflow-x-auto">
        <div className="flex gap-4 pb-4">
          {properties.map((property) => (
            <Card
              key={property.id}
              className="group relative w-[400px] h-[250px] cursor-pointer overflow-hidden border-0 bg-transparent transition-all duration-300 hover:scale-105"
              onClick={() => onSelect?.(property)}
            >
              <div className="relative w-full h-full">
                <Image
                  src={
                    property.image_url ||
                    "https://images.pexels.com/photos/29929930/pexels-photo-29929930/free-photo-of-orang-fritzlar.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
                  }
                  alt="Property"
                  fill
                  className="object-cover rounded-lg"
                />

                {/* Hover Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                {/* Info Text */}
                <div className="absolute bottom-0 left-0 right-0 p-4 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                  <p className="text-white font-bold text-xl mb-1">
                    Rp {(property.price || 0).toLocaleString()}
                  </p>
                  <p className="text-white/90 text-sm truncate">
                    {property.title || "Beautiful Property"}
                  </p>
                </div>

                {/* Edit/Delete Form */}
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
                  <PropertyForm
                    property={property}
                    onSubmit={(data) => handleUpdateProperty(property.id, data)}
                    onDelete={() => handleDeleteProperty(property.id)}
                  />
                </div>
              </div>
            </Card>
          ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  )
}
