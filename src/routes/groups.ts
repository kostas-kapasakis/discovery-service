import {Request, Response, Router} from 'express';
import {Group, mapToGroupInstancesDto} from '../models/group';
import {Instance, InstanceDto} from "../models/instance";
import mongoose from "mongoose";
import {GroupDocument} from "../models/group/interfaces";
import {logger} from "../utils";

const groupsRouter = Router();

groupsRouter.post('/:group/:id', async (req: Request, res: Response) => {
    const {meta} = req.body;
    const {id, group} = req.params;

    logger.info(`Request: /:group/:id for group ${group} and instance ${id}`);

    const session = await mongoose.startSession();
    session.startTransaction();

    let appInstance: InstanceDto | undefined;

    try {
        await Group.createOrUpdate(group, id, session);
        appInstance = await Instance.createOrUpdate({_id: id, group, meta}, session)
        await session.commitTransaction();
    } catch (e) {
        logger.error('Error for group ${group} and instance ${id}', e)
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
        await Instance.removeInstance(id, group, session);
        await session.commitTransaction();
    } catch (e) {
        logger.error(`Error for deleting instance ${id} from group ${group}`, e)
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
        logger.error(`Error for getting instances for group ${group} }`, e)
        res.status(500).json({message: 'internal server error'});
    }

});


export default groupsRouter;