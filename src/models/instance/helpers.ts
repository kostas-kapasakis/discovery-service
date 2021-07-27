import mongoose from "mongoose";
import {Instance, InstanceSchema} from "./schema";
import {IInstance, InstanceDto, mapToInstanceDto} from "./interfaces";

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

}


