import express, { Express} from 'express';
import helmet from 'helmet';
import dotenv from 'dotenv';
import routes from './routes';
dotenv.config();

const PORT = process.env.PORT || 3000;
const app: Express = express();

app.use(helmet());
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(routes);


app.listen(PORT, () => console.log(`Running on ${PORT} ⚡`));