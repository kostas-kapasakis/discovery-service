import {Request, Response, Router} from 'express';
import {Group, mapToGroupInstancesDto} from '../models/group';
import {Instance, InstanceDto} from "../models/instance";
import mongoose from "mongoose";
import {GroupDocument} from "../models/group/interfaces";

const groupsRouter = Router();

groupsRouter.post('/:group/:id', async (req: Request, res: Response) => {
    const {meta} = req.body;
    const {id, group} = req.params;

    const session = await mongoose.startSession();
    session.startTransaction();

    let appInstance: InstanceDto | undefined;

    try {
        await Group.createOrUpdate(group, id, session);
        appInstance = await Instance.createOrUpdate({_id: id, group, meta}, session)
        await session.commitTransaction();
    } catch (e) {
        console.log(e);
        await session.abortTransaction();
        res.status(500).json({message: 'internal server error'});
    } finally {
        session.endSession();
        res.send(appInstance);
    }
});


groupsRouter.delete('/:group/:id', async (req: Request, res: Response) => {
    const {id, group} = req.params;

    const session = await mongoose.startSession();
    session.startTransaction();

    const response = {
        message: "Instance successfully deleted",
        id
    };
    try {
        await Instance.findByIdAndRemove(id).session(session);

        await Group.findOneAndUpdate({name: group}, {
                "$pull": {"instances": id}, updatedAt: Date.now()
            },
            {upsert: true, new: true, multi: true}).session(session);

        await session.commitTransaction();
    } catch (e) {
        console.log(e);
        await session.abortTransaction();
        res.status(500).json({message: 'internal server error'});
    } finally {
        session.endSession();
        res.status(200).send(response);
    }
});


groupsRouter.get('/:group', async (req: Request, res: Response) => {
    const {group} = req.params;

    try {
        Group
            .findOne({name: group})
            .populate('instances')
            .orFail()
            .then((doc: GroupDocument) => res.send(mapToGroupInstancesDto(doc)));

    } catch (e) {
        console.log(e);
        res.status(500).json({message: 'internal server error'});
    }

});


export default groupsRouter;