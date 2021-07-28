import mongoose from "mongoose";
import {Instance, InstanceSchema} from "./schema";
import {IInstance, InstanceDto, mapToInstanceDto} from "./interfaces";
import {Group} from "../group";
import {APP_INSTANCE_AGE} from "../../config";
import {logger} from "../../utils";

export const setInstanceHelpers = (): void => {

    InstanceSchema.statics.createOrUpdate = async ({
                                                       _id,
                                                       group,
                                                       meta
                                                   }: IInstance, session: mongoose.ClientSession): Promise<InstanceDto> => {

        let appInstance = await Instance.findById(_id).session(session);

        if (!appInstance) [appInstance] = await Instance.create([{_id, meta, group}], {session: session});

        appInstance.updatedAt = Date.now();

        await appInstance.save();

        return mapToInstanceDto(appInstance);
    }

    InstanceSchema.statics.removeInstance = async (id: string, group: string, session: mongoose.ClientSession): Promise<void> => {
        const groupDoc = await Group.findOneAndUpdate({name: group}, {
                "$pull": {"instances": id}, updatedAt: Date.now()
            },
            {upsert: false, multi: true}).session(session);

        if (!groupDoc)
            throw new Error(`Group does not exist , group: ${group}`);

        if (!groupDoc?.instances.includes(id))
            throw new Error(`Instance does not belong to group ${group} - id: ${id}`);

        await Instance.findByIdAndRemove(id).session(session);
    }

    InstanceSchema.statics.removeExpired = async (): Promise<void> => {
        let cleanedInstances: string[] = [];

        for await (const doc of Instance.find()) {

            const age = (new Date().getTime() / 1000) - doc.updatedAt;

            if (age > APP_INSTANCE_AGE) {
                cleanedInstances.push(doc._id);
                await Instance.removeInstance(doc._id, doc.group)
            }
        }

        logger.info(`Healthcheck : Removed Expired instances , Total: ${cleanedInstances.length} , [${cleanedInstances.join(',')}]`);

    }

}


