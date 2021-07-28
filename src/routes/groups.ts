import {Request, Response, Router} from 'express';
import {Group, mapToGroupInstancesDto} from '../models/group';
import {Instance, InstanceDto} from "../models/instance";
import mongoose from "mongoose";
import {logger} from "../utils";
import {ReasonPhrases, StatusCodes} from "http-status-codes";

const groupsRouter = Router();

groupsRouter.post('/:group/:id', async (req: Request, res: Response) => {
    const {meta} = req.body;
    const {id, group} = req.params;

    const session = await mongoose.startSession();

    let appInstance: InstanceDto | undefined;


    logger.info(`Request: /:group/:id for group ${group} and instance ${id}`);

    try {
        const transactionResults = await session.withTransaction(async () => {
            await Group.createOrUpdate(group, id, session);
            appInstance = await Instance.createOrUpdate({_id: id, group, meta}, session);
        });

        console.log(appInstance);

        transactionResults ?
            res.status(StatusCodes.CREATED).send(appInstance) :
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(ReasonPhrases.INTERNAL_SERVER_ERROR);

    } catch (e) {
        logger.error(`Error for group ${group} and instance ${id}`, e)
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
            type: ReasonPhrases.INTERNAL_SERVER_ERROR,
            message: e.message
        });
    } finally {
        session.endSession();
    }
});


groupsRouter.delete('/:group/:id', async (req: Request, res: Response) => {
    const {id, group} = req.params;
    const session = await mongoose.startSession();
    const response = {message: "Instance successfully deleted", id};

    try {
        const transactionResults = await session.withTransaction(async () => {
            await Instance.removeInstance(id, group, session);
        });

        transactionResults ?
            res.status(StatusCodes.OK).send(response) :
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(ReasonPhrases.INTERNAL_SERVER_ERROR);

    } catch (e) {
        logger.error(`Error for deleting instance ${id} from group ${group}`, e)
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
            type: ReasonPhrases.INTERNAL_SERVER_ERROR,
            message: e.message
        });
    } finally {
        session.endSession();
    }
});


groupsRouter.get('/:group', async (req: Request, res: Response) => {
    const {group} = req.params;

    try {
        const groupDoc = await Group
            .findOne({name: group})
            .populate('instances')
            .orFail();

        res.status(StatusCodes.OK).send(mapToGroupInstancesDto(groupDoc));

    } catch (e) {
        logger.error(`Error for getting instances for group ${group} }`, e)
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
            type: ReasonPhrases.INTERNAL_SERVER_ERROR,
            message: e.message
        });
    }

});


export default groupsRouter;