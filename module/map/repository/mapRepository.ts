import { PropertyData } from "../entity/PropertyData"

export interface MapRepository {
  getProperties(userId: string): Promise<PropertyData[]>
  getPropertyById(id: string, userId: string): Promise<PropertyData | null>
  createProperty(property: PropertyData, userId: string): Promise<PropertyData>
  updateProperty(id: string, property: PropertyData, userId: string): Promise<PropertyData>
  deleteProperty(id: string, userId: string): Promise<void>
}