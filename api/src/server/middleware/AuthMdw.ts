import express from 'express';
import { FirebaseAdminAPI } from '../../fb';
import { BagClaim } from '../../model/BagClaim';

export class AuthMdw {


    async checkAuth(req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> {

        let idToken = req.get('Authorization');

        // parse
        let fb = new FirebaseAdminAPI();
        try {
            let decoded = await fb.verifyIdToken(idToken);
            let userInfo = await fb.getUser(decoded.uid);
            
            res.locals.userId = decoded.uid;
            res.locals.idToken = idToken;
            res.locals.email = userInfo.email;
            res.locals.name = userInfo.displayName;
            
            
            next();

        } catch (error) {

            console.log(error);

            res.status(401).json({
                result: 'not authenticated'
            });

        }


    }

    async checkFirstTimeSetup(req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> {

        let idToken = req.get('Authorization');

        // parse
        let fb = new FirebaseAdminAPI();
        try {
            let decoded = await fb.verifyIdToken(idToken);
            if (!decoded.bag) {
                throw new Error('ERR_NOT_SETUP');
            }

            res.locals.bag = decoded.bag;
            next();

        } catch (error) {

            console.log(error);

            if (error.message === 'ERR_NOT_SETUP') {
                res.status(460).json({
                    result: 'role not found'
                });
            }
            else {
                res.status(401).json({
                    result: 'not authenticated'
                });
            }

        }


    }


}