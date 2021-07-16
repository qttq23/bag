import { Util } from './util/Util';
new Util().loadEnv();


import { Db } from "./db/Db";
import { FirebaseAdminAPI } from './fb';
import { Server } from "./server/server";


async function main() {

    // variables
    let db: Db;
    let server: Server;

    // error handling
    let cleanResource = async () => {
        if (db) {
            await db.close();
        }
        if (server) {
            await server.stop();
        }
    };
    process.on('uncaughtException', async (err: any, origin: any) => {
        console.log(err);
        console.log(origin);

        await cleanResource();
        process.exit(1);
    });

    process.on('unhandledRejection', async (reason, promise) => {
        console.log('Unhandled Rejection at:', promise, 'reason:', reason);

        await cleanResource();
        process.exit(1);
    });


    // init firebase
    new FirebaseAdminAPI();

    // init Database
    db = new Db();
    await db.open(`mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@${process.env.MONGO_HOST}/${process.env.MONGO_DB}?retryWrites=true&w=majority`);


    // start server
    server = new Server({
        port: parseInt(process.env.SERVER_PORT) || 8080,
        db: db
    });
    await server.start();

}

main();