import mongoose from "mongoose";
import {Instance, InstanceSchema} from "./schema";
import {IInstance, InstanceDocument, InstanceDto, mapToInstanceDto} from "./interfaces";

export const setInstanceHelpers = () => {
    InstanceSchema.statics.build = (args: IInstance) => {
        return new Instance(args);
    }

    InstanceSchema.statics.createOrUpdate = async ({
                                                       _id,
                                                       group,
                                                       meta
                                                   }: IInstance, session: mongoose.ClientSession): Promise<InstanceDto> => {
        let appInstance: InstanceDocument;

        if (!await Instance.exists({_id: _id}))
            appInstance = Instance.build({_id, meta, group});
        else
            appInstance = await Instance.findByIdAndUpdate(_id,
                {updatedAt: Date.now()},
                {upsert: true, new: true, setDefaultsOnInsert: true}).session(session);

        await appInstance.save();

        return mapToInstanceDto(appInstance);
    }

}


