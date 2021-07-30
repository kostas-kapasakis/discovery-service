import * as db from "../db/db.setup";
import {startSession} from "mongoose";
import {Instance} from "../../src/models/instance";
import {InstanceDocument} from "../../src/models/instance/interfaces";


describe("test instances helper fns", () => {

    beforeAll(async () => await db.dbConnect());

    afterEach(async () => await db.clearDatabase());

    afterAll(async () => await db.dropDatabaseConnection());

    it('Calls the createOrUpdate and saves a new instance', async () => {
        const session = await startSession();

        await Instance.createOrUpdate(instance, session);

        const createdInstance = await Instance.findById(instance._id);

        expect(createdInstance?._id).toBe(instance._id);
        expect(createdInstance?.group).toBe(instance.group);
        expect(JSON.stringify(createdInstance?.meta)).toMatch(JSON.stringify(instance.meta));
    });

    it('Calls the createOrUpdate with an existing instance and updates the updatedAt field', async () => {

        const session = await startSession();

        await Instance.createOrUpdate(instance, session);

        const existingInstance = await Instance.findById(instance._id) as InstanceDocument;

        await new Promise<void>(res => setTimeout(async () => {

            await Instance.createOrUpdate(instance, session);

            const updatedInstance = await Instance.findById(instance._id) as InstanceDocument;

            expect(updatedInstance?.updatedAt).toBeGreaterThan(existingInstance?.updatedAt);

            res()
        }, 1000));

    });


});

const instance = {
    _id: 'test',
    group: 'testGroup',
    meta: {description: 'test'}
}
