import mongoose from "mongoose";

export interface IInstance {
    _id: string;
    group: string;
    meta?: any
}

export interface InstanceDocument extends mongoose.Document {
    group: string;
    meta?: any
    createdAt: Number;
    updatedAt: Number;
}

export interface InstanceModel extends mongoose.Model<InstanceDocument> {
    build(args: IInstance): InstanceDocument

    createOrUpdate(args: IInstance, session?: mongoose.ClientSession): Promise<InstanceDto>
}

export type InstanceDto = {
    id: string;
    meta?: any;
    group: string;
    createdAt: Number;
    updatedAt: Number;
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