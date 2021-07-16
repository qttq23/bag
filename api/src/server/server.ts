
import express from 'express';
import { Db } from '../db/Db';
import { AuthController } from './controller/AuthController';
var cors = require('cors');
import { PaperController } from './controller/PaperController';
import { AuthMdw } from './middleware/AuthMdw';

export interface ServerConfig {
    port: number;
    db: Db;
}

export class Server {
    config: ServerConfig;
    private _app: express.Application;
    private _server: any;
    private _sockets: Array<any>;

    constructor(serverConfig: ServerConfig) {

        this.config = serverConfig;
        this._app = express();
        this._server = null;
        this._sockets = [];
        this._setup(this._app, this.config.db);

    }

    private _setup(app: express.Application, db: any): void {

        app.use(cors());
        app.use(express.json());
        // app.use('/build', express.static('build'));
        app.get('/', (req, res) => res.send('2Express + TypeScript: ' + new Date().toLocaleString()));


        // auth
        const authPath = '/api/auth';
        let authController = new AuthController(authPath);
        app.use(authPath, new AuthMdw().checkAuth, authController.getRouter());

        // paper
        const paperPath = '/api/paper';
        let paperController = new PaperController(paperPath, this.config.db);
        let authMdw = new AuthMdw();
        app.use(paperPath, [authMdw.checkAuth, authMdw.checkFirstTimeSetup], paperController.getRouter());

        // const paperPath2 = '/api/v2/paper';
        // let paperController2 = new PaperController2(paperPath2);
        // app.use(paperPath2, paperController2.getRouter());



        app.use(function (err: any, req: any, res: any, next: any) {
            console.error(err.stack)
            res.status(500).send('Something broke! from app server')
        });


    }

    public async start() {

        return new Promise((resolve, reject) => {

            let app = this._app;
            let port = this.config.port;

            this._server = app.listen(port, () => {
                console.log(`⚡️[server]: Server is running at https://localhost:${port}`);
                resolve(0);
            });

            // track sockets for later close server
            this._server.on('connection', (socket: any) => {
                this._sockets.push(socket);
            });
        });


    }

    public async stop() {

        return new Promise((resolve, reject) => {
            if (!this._server) resolve(0);

            this._sockets.forEach((socket: any) => {
                socket.destroy();
                console.log('1 connection killed');
            });

            this._server.close(() => {
                console.log('server closed');
                resolve(0);
            });
        });

    }

}

