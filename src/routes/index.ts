import {Request, Response, Router} from 'express';
import groupsRouter from "./groups";

const routes = Router();

routes.get('/', (req: Request, res: Response) => {
    res.send('<h1>Discovery Service</h1>');

    /*
    Will have to return the below data structure

    {
        "group": "particle-detector",
        "instances": "4",               // the number of registered instances in this group
        "createdAt": 1571418124127,     // first heartbeat registered in this group
        "lastUpdatedAt": 1571418124127, // last heartbeat registered in this group
    },
    // ...
]

     */

});

routes.use('/', groupsRouter);


export default routes;
