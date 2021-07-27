import express, {Express} from 'express';
import helmet from 'helmet';
import routes from './routes';
import * as config from './config';
import mongoose from 'mongoose';
import cron from 'node-cron';
import {Instance} from "./models/instance";

const app: Express = express();

app.use(helmet());
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(routes);

mongoose.connect(config.DB_CONNECTION_STRING, config.DB_OPTIONS, (args) => {
    !args ? console.log('Successfully connected to Database') : console.log(args);
})

cron.schedule(`*/${config.APP_INSTANCE_AGE} * * * * *`, async () => {
    console.log(' run task');
    await Instance.removeExpired();
});


app.listen(config.PORT, () => console.log(`Running on ${config.PORT} ⚡`));