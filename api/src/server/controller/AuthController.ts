
import express from 'express';
import { Types } from 'mongoose';
import { decode } from 'punycode';
import { Db } from '../../db/Db';
import { Paper } from '../../db/model/Paper';
import { Section } from '../../db/model/Section';
import { PaperRepo } from '../../db/repo/PaperRepo';
import { PersonRepo } from '../../db/repo/PersonRepo';
import { SectionRepo } from '../../db/repo/SectionRepo';
import { FirebaseAdminAPI } from '../../fb';
import { BagClaim } from '../../model/BagClaim';

export class AuthController {

    protected _router: express.Router;
    protected _prefixPath: string;

    constructor(prefixPath: string) {
        this._prefixPath = prefixPath;
        this._setup();
    }

    getRouter = (): express.Router => {
        return this._router;
    }

    protected _setup = (): void => {
        this._router = express.Router();

        // config routes
        let router = this._router;
        router.get('/first_time_setup', this.first_time_setup.bind(this));


        router.use(this._handleError.bind(this));

    }

    protected async first_time_setup(req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> {

        console.log('auth first_time_setup');

        // check if already set up
        let idToken = res.locals.idToken;
        let fb = new FirebaseAdminAPI();
        try {
            let decoded = await fb.verifyIdToken(idToken);
            let bagClaim: BagClaim = decoded.bag;
            if (bagClaim && bagClaim.isSetup == true) {

                res.status(200).json({
                    result: 'already set up'
                });
                return;
            }


        } catch (error) {

            console.log(error);
            res.status(401).json({
                result: 'not authenticated'
            });

        }

        // user info
        let userId = res.locals.userId;
        let userEmail = res.locals.email;
        let userDisplayName: string = res.locals.name || 'defaultname';
        console.log(userId);
        if (!userId) {
            res.status(400).json({ result: 'not found user' })
            return;
        };

        // set up database
        // create user
        let personRepo = new Db().getRepo(PersonRepo);
        let newUser = await personRepo.save({
            _id: userId,
            name: userDisplayName,
            email: userEmail,
            description: ''
        });
        console.log(newUser);

        // add default paper
        let paper: Paper = {
            _id: new Types.ObjectId(),
            name: 'default paper name',
            description: '',
            author: newUser,
            sections: []
        };
        let paperRepo = new Db().getRepo(PaperRepo);
        let newPaper = await paperRepo.save(paper);
        console.log(newPaper);

        // add role 
        let claim: BagClaim = new BagClaim();
        claim.isSetup = true;
        claim.role = 'normal';
        try {
            let fb = new FirebaseAdminAPI();
            await fb.setClaim(userId, { bag: claim });

            res.json({
                result: 'ok acquire_permission'
            });
        } catch (error) {
            console.log(error);

            res.status(400).json({
                result: 'fail acquire_permission'
            });
        }



    }





    protected async _handleError(
        err: any,
        req: express.Request,
        res: express.Response,
        next: any
    ): Promise<void> {

        console.error(err.stack);
        res.status(500).send('Something broke! from auth router');
    }


}


