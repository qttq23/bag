import { Util } from '../src/util/Util';
new Util().loadEnv();



var assert = require('assert');
import axios from 'axios';
import { Server, ServerConfig } from '../src/server/server';
import { Db } from '../src/db/Db';

describe('server', function (this) {
    this.timeout(60000);

    it('start', async () => {

        let db = new Db();
        await db.open(`mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@${process.env.MONGO_HOST}/${process.env.MONGO_DB}?retryWrites=true&w=majority`);


        // start server
        let server = new Server({
            port: parseInt(process.env.SERVER_PORT) || 8080,
            db: db
        });
        await server.start();


        // test paper
        try {
            const response3 = await axios({
                method: 'get', 
                url: 'http://localhost:10000/api/paper',
                headers: {
                    'Authorization': 'tui2'
                }
            });
            console.log(response3.data);

        } catch (error) {
            console.log(error.response.data);
            console.log(error.response.status);
            console.log(error.response.headers);
        }

        try {
            const response3 = await axios({
                method: 'get',
                url: 'http://localhost:10000/api/paper/60e9cb3c3af6502bbc7bb369',
                headers: {
                    'Authorization': 'tui2'
                }
            });
            console.log(response3.data);

        } catch (error) {
            console.log(error.response.data);
            console.log(error.response.status);
            console.log(error.response.headers);
        }


        try {
            const response3 = await axios({
                method: 'put',
                url: 'http://localhost:10000/api/paper/60e9cb3c3af6502bbc7bb369',
                headers: {
                    'Authorization': 'tui2'
                }
            });
            console.log(response3.data);

            let newSection = response3.data.result;
            const response4 = await axios({
                method: 'put',
                url: 'http://localhost:10000/api/paper/60e9cb3c3af6502bbc7bb369/' + newSection._id,
                headers: {
                    'Authorization': 'tui2'
                },
                data: {
                    content: 'from axios response45'
                }
            });
            console.log(response4.data);

        } catch (error) {
            console.log(error.response.data);
            console.log(error.response.status);
            console.log(error.response.headers);
        }

       


        // close
        await server.stop();
        await db.close();
    });


});