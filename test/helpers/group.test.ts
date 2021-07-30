import {Group} from "../../src/models/group";
import * as db from "../db/db.setup";
import {startSession} from "mongoose";
import {GroupDocument} from "../../src/models/group/interfaces";


describe("test group routes", () => {
    const testInstance1 = 'testInstance1';
    const testInstance2 = 'testInstance2';
    const group = {name: 'test'};

    beforeAll(async () => await db.dbConnect());

    afterEach(async () => await db.clearDatabase());

    afterAll(async () => {
        jest.setTimeout(30000);
        await db.dropDatabaseConnection();
    });

    it('Calls the createOrUpdate and saves a new group and a new instance', async () => {
        const session = await startSession();

        await Group.createOrUpdate(group.name, testInstance1, session);

        const createdGroup = await Group.findOne({name: group.name});

        expect(createdGroup?.name).toBe(group.name);
        expect(createdGroup?.instances.includes(testInstance1)).toBeTruthy();

    });

    it('Calls the createOrUpdate with an existing group and a new instance', async () => {
        const session = await startSession();

        await Group.createOrUpdate(group.name, testInstance1, session);

        const newGroup: GroupDocument = await Group.findOne({name: group.name}) as GroupDocument;

        await new Promise<void>(res => setTimeout(async () => {

            await Group.createOrUpdate(group.name, testInstance2, session);

            const updatedGroup: GroupDocument = await Group.findOne({name: group.name}) as GroupDocument;

            expect(updatedGroup?.name).toBe(group.name);
            expect(updatedGroup?.instances.includes(testInstance1) && updatedGroup?.instances.includes(testInstance2)).toBeTruthy();
            expect(updatedGroup.updatedAt).toBeGreaterThan(newGroup.updatedAt);
            res()
        }, 1000));

    });


});


