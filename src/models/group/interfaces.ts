import mongoose, {Document, Model, PopulatedDoc} from "mongoose";
import {InstanceDocument, InstanceDto, mapToInstanceDto} from "../instance/interfaces";

export interface IGroup {
    name: string;
    instances: string[];

}

export interface GroupDocument extends Document {
    name: string;
    instances: PopulatedDoc<InstanceDocument & Document>;
    createdAt: number;
    updatedAt: number;
}

export interface GroupModel extends Model<GroupDocument> {
    build(args: IGroup): GroupDocument;
    createOrUpdate(name: string, clientId: string, session?: mongoose.ClientSession): Promise<GroupDocument>
}


export type GroupsDto = {
    group: string;
    instances: number
    createdAt: number;
    lastUpdatedAt: number;
}

export const mapToGroupInstancesDto = (doc: GroupDocument): InstanceDto[] => {
    return doc.instances.map((instance: InstanceDocument) => mapToInstanceDto(instance))
};


export const mapToAllGroupsDto = (doc: GroupDocument): GroupsDto => {
    return {
        group: doc.name,
        instances: doc.instances.length,
        createdAt: doc.createdAt,
        lastUpdatedAt: doc.updatedAt
    }
}