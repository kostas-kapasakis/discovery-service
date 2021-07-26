import mongoose, {Schema} from "mongoose";
import {GroupDocument, GroupModel} from './interfaces';
import {setGroupHelpers} from './helpers';

const opts = {
    timestamps: {currentTime: () => Date.now()},

};

export const GroupSchema = new Schema({
    name: {
        type: String,
        required: true
    },

    instances: {
        type: [{type: String, ref: 'Instance'}],
        required: true
    },

    createdAt: Number,
    updatedAt: Number
}, opts);

setGroupHelpers();

export const Group = mongoose.model<GroupDocument, GroupModel>('Group', GroupSchema);
