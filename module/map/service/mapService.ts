import supabase from "@/lib/supabase"
import { PropertyData } from "../entity/PropertyData"
import { MapRepository } from "../repository/mapRepository"

export class MapService implements MapRepository {

  private BASE_URL = process.env.NEXT_PUBLIC_ENDPOINT_URL || ""

  private async getHeaders(userId: string) {
    return {
      "x-user-id": userId,
      "Content-Type": "application/json"
    }
  }

  async getProperties(userId: string): Promise<PropertyData[]> {
    const response = await fetch(`${this.BASE_URL}/properties`, {
      headers: await this.getHeaders(userId)
    })
    if (!response.ok) throw new Error('Failed to fetch properties')
    const data = await response.json()
    return data || []
  }

  async getPropertyById(id: string, userId: string): Promise<PropertyData | null> {
    const response = await fetch(`${this.BASE_URL}/properties/${id}`, {
      headers: await this.getHeaders(userId)
    })
    if (!response.ok) throw new Error('Failed to fetch property')
    const data = await response.json()
    return data
  }

  async createProperty(property: PropertyData, userId: string): Promise<PropertyData> {
    const response = await fetch(`${this.BASE_URL}/properties`, {
      method: 'POST',
      headers: await this.getHeaders(userId),
      body: JSON.stringify(property)
    })
    if (!response.ok) throw new Error('Failed to create property')
    const data = await response.json()
    return data
  }

  async updateProperty(id: string, property: PropertyData, userId: string): Promise<PropertyData> {
    const response = await fetch(`${this.BASE_URL}/properties/${id}`, {
      method: 'PUT',
      headers: await this.getHeaders(userId),
      body: JSON.stringify(property)
    })
    if (!response.ok) throw new Error('Failed to update property')
    const data = await response.json()
    return data
  }

  async deleteProperty(id: string, userId: string): Promise<void> {
    const response = await fetch(`${this.BASE_URL}/properties/${id}`, {
      method: 'DELETE',
      headers: await this.getHeaders(userId)
    })
    if (!response.ok) throw new Error('Failed to delete property')
  }
}