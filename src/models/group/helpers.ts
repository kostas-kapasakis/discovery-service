import mongoose from "mongoose";
import {Group, GroupSchema} from "./schema";
import {GroupDocument, IGroup} from "./interfaces";

export const setGroupHelpers = () => {


    GroupSchema.statics.build = (args: IGroup) => {
        return new Group(args);
    }

    GroupSchema.statics.createOrUpdate = async (name: string, clientId: string, session: mongoose.ClientSession): Promise<GroupDocument> => {
        let group = await Group.findOne({name});

        if (!group) group = Group.build({name, instances: [clientId]});
        else
            group = group.instances.indexOf(clientId) > 0 ?
                await updateGroup(name, false, clientId, session) :
                await updateGroup(name, true, clientId, session);

        await group?.save();

        return group as GroupDocument;

    }
}

const updateGroup = (name: string, isNewClientId: boolean, clientId: string, session: mongoose.ClientSession): mongoose.Query<any, GroupDocument> => {
    return Group.findOneAndUpdate({name},
        isNewClientId ?
            {"$push": {"instances": clientId}, updatedAt: Date.now()} :
            {updatedAt: Date.now()},
        {upsert: true, new: true, setDefaultsOnInsert: true})
        .session(session);
}


