import mongoose from "mongoose";
import {Instance, InstanceSchema} from "./schema";
import {IInstance, InstanceDto, mapToInstanceDto} from "./interfaces";
import {Group} from "../group";
import {APP_INSTANCE_AGE} from "../../config";

export const setInstanceHelpers = (): void => {
    InstanceSchema.statics.build = (args: IInstance) => {
        return new Instance(args);
    }

    InstanceSchema.statics.createOrUpdate = async ({
                                                       _id,
                                                       group,
                                                       meta
                                                   }: IInstance, session: mongoose.ClientSession): Promise<InstanceDto> => {

        let appInstance = await Instance.findById(_id).session(session);

        if (!appInstance) appInstance = Instance.build({_id, meta, group});

        appInstance.updatedAt = Date.now();

        await appInstance.save();

        return mapToInstanceDto(appInstance);
    }

    InstanceSchema.statics.removeInstance = async (id: string, group: string, session: mongoose.ClientSession): Promise<void> => {
        await Instance.findByIdAndRemove(id).session(session);

        await Group.findOneAndUpdate({name: group}, {
                "$pull": {"instances": id}, updatedAt: Date.now()
            },
            {upsert: false, multi: true}).session(session);
    }

    InstanceSchema.statics.removeExpired = async (): Promise<void> => {
        for await (const doc of Instance.find()) {

            const age = (new Date().getTime() / 1000) - doc.updatedAt;

            console.log(`Age of instance with id ${doc._id} is ${age} seconds or ${age / 60} minutes`);

            if (age > APP_INSTANCE_AGE) {
                await Instance.removeInstance(doc._id, doc.group)
            }
        }
    }

}


