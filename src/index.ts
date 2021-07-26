import express, {Express} from 'express';
import helmet from 'helmet';
import routes from './routes';
import * as config from './config';
import mongoose from 'mongoose';


const app: Express = express();

app.use(helmet());
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(routes);

mongoose.connect(config.DB_CONNECTION_STRING, config.dbConnectionConfig, (args) => {
    !args ? console.log('Successfully connected to Database') : console.log(args);
})


app.listen(config.PORT, () => console.log(`Running on ${config.PORT} ⚡`));