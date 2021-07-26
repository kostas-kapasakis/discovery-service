import {Request, Response, Router} from 'express';
import groupsRouter from "./groups";
import {Group, mapToAllGroupsDto} from "../models/group";

const routes = Router();

routes.get('/', async (req: Request, res: Response) => {
    let dtoToReturn = [];

    try {
        for await (const doc of Group.find()) {
            if (doc.instances.length > 0) dtoToReturn.push(mapToAllGroupsDto(doc));
        }

        res.send(dtoToReturn);
    } catch (e) {
        console.log(e);
        res.status(500).json({message: 'internal server error'});
    }
});

routes.use('/', groupsRouter);


export default routes;
