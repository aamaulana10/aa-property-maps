import { PropertyData } from "../entity/PropertyData";
import { MapService } from "../service/mapService";

export class MapUsecase {
    constructor(private service: MapService) {}

    async getListProperty(userId: string): Promise<Array<PropertyData>> {
        return this.service.getProperties(userId)
    }

    async createProperty(data: PropertyData, userId: string): Promise<PropertyData> {
        return this.service.createProperty(data, userId)
    }

    async deleteProperty(id: string, userId: string) {
        return this.service.deleteProperty(id, userId)
    }
}