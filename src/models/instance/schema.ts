import mongoose, {Schema} from "mongoose";
import {v4 as uuidv4} from "uuid";
import {InstanceDocument, InstanceModel} from "./interfaces";
import {setInstanceHelpers} from "./helpers";

const opts = {
    timestamps: {currentTime: () => Math.floor(Date.now() / 1000)},
};

export const InstanceSchema = new Schema({
    _id: {type: String, default: uuidv4()},
    group: {
        type: String,
        required: true
    },

    meta: {
        type: Schema.Types.Mixed,
        required: false
    },
    createdAt: Number,
    updatedAt: Number
}, opts);

setInstanceHelpers();

export const Instance = mongoose.model<InstanceDocument, InstanceModel>('Instance', InstanceSchema);
