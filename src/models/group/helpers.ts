import mongoose from "mongoose";
import {Group, GroupSchema} from "./schema";
import {GroupDocument, IGroup} from "./interfaces";

export const setGroupHelpers = (): void => {

    GroupSchema.statics.build = (args: IGroup) => {
        return new Group(args);
    }

    GroupSchema.statics.createOrUpdate = async (name: string, clientId: string, session: mongoose.ClientSession): Promise<GroupDocument> => {
        let group = await Group.findOne({name}).session(session);

        if (!group) group = Group.build({name, instances: [clientId]});
        else if (group.instances.indexOf(clientId) < 0) group.instances.push(clientId);

        group.updatedAt = Date.now();

        await group.save();

        return group;
    }
}

