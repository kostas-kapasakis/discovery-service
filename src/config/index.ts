import dotenv from "dotenv";
import * as mongoose from "mongoose";

dotenv.config();


export const PORT = process.env.PORT || 3000;

export const DB_CONNECTION_STRING = process.env.databaseConenctionString || 'mongodb://localhost:27017/discovery-service';

export const dbConnectionConfig: mongoose.ConnectionOptions = {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
};