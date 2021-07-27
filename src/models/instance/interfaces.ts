import mongoose from "mongoose";

export interface IInstance {
    _id: string;
    group: string;
    meta?: Record<string, unknown>
}

export interface InstanceDocument extends mongoose.Document {
    group: string;
    meta?: Record<string, unknown>
    createdAt: number;
    updatedAt: number;
}

export interface InstanceModel extends mongoose.Model<InstanceDocument> {
    build(args: IInstance): InstanceDocument

    createOrUpdate(args: IInstance, session?: mongoose.ClientSession): Promise<InstanceDto>
}

export type InstanceDto = {
    id: string;
    meta?: Record<string, unknown>;
    group: string;
    createdAt: number;
    updatedAt: number;
}

export const mapToInstanceDto = ({_id, meta, group, createdAt, updatedAt}: InstanceDocument): InstanceDto => {
    return {
        id: _id,
        meta,
        group,
        createdAt: createdAt,
        updatedAt
    }
}