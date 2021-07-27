import express, {Express} from 'express';
import helmet from 'helmet';
import routes from './routes';
import * as config from './config';
import mongoose from 'mongoose';
import cron from 'node-cron';
import {Instance} from "./models/instance";
import {initializeLogger, logger} from "./utils";

const app: Express = express();


const startServer = () => {
    initializeLogger();

    registerMiddlewares();
    registerDbConnection();
    registerCronTask();

    app.listen(config.PORT, () => logger.info(`Running Discovery service on ${config.PORT}`));
}

const registerMiddlewares = (): void => {
    app.use(helmet());
    app.use(express.urlencoded({extended: true}));
    app.use(express.json());
    app.use(routes);
}

const registerDbConnection = (): void => {
    mongoose.connect(config.DB_CONNECTION_STRING, config.DB_OPTIONS, (args) => {
        !args ? logger.info('Successfully connected to Database') : logger.error(args);
    })
}

const registerCronTask = (): void => {
    cron.schedule(`*/${config.APP_INSTANCE_AGE} * * * * *`, async () => {
        await Instance.removeExpired();
    });
}


startServer();










