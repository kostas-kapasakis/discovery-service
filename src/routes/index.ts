import {Request, Response, Router} from 'express';
import groupsRouter from "./groups";
import {Group, mapToAllGroupsDto} from "../models/group";
import {logger} from "../utils";

const routes = Router();

routes.get('/', async (req: Request, res: Response) => {
    const dtoToReturn = [];

    try {
        for await (const doc of Group.find()) {
            if (doc.instances.length > 0) dtoToReturn.push(mapToAllGroupsDto(doc));
        }

        res.send(dtoToReturn);
    } catch (e) {
        logger.error('Error on getting group info', e);
        res.status(500).json({message: 'internal server error'});
    }
});

routes.use('/', groupsRouter);


export default routes;
