import {connect, connection} from 'mongoose';
import {MongoMemoryReplSet} from "mongodb-memory-server-core";

let mongoServer: MongoMemoryReplSet;


const dbConnect = async () => {

    mongoServer = await MongoMemoryReplSet.create({replSet: {count: 4}});

    const connectionUri = mongoServer.getUri() + "&retryWrites=false";

    await connect(connectionUri,
        {useNewUrlParser: true, useUnifiedTopology: true});

};

const dropDatabaseConnection = async () => {
    await connection.dropDatabase();
    await connection.close();
    await mongoServer.stop();
}

const clearDatabase = async () => {
    const collections = connection.collections;

    for (const key in collections) {
        const collection = collections[key];
        await collection.deleteMany({});
    }

}

export {mongoServer, dbConnect, dropDatabaseConnection, clearDatabase};



