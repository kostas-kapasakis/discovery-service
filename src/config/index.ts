import dotenv from "dotenv";
import * as mongoose from "mongoose";

dotenv.config();


export const PORT = process.env.PORT || 3000;

export const DB_CONNECTION_STRING = process.env.DB_CONNECTION_STRING || 'mongodb://localhost:27017/discovery-service';

export const DB_OPTIONS: mongoose.ConnectionOptions = {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
};

export const APP_INSTANCE_AGE = process.env.APP_INSTANCE_AGE || 30  //sec