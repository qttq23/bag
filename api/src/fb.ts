import * as admin from 'firebase-admin';


let isInit = false;
export class FirebaseAdminAPI {

    constructor() {
        if (!isInit) {

            let serviceAccount: Object = process.env.SERVICE_ACCOUNT;

            admin.initializeApp({
                // credential: admin.credential.applicationDefault(),
                credential: admin.credential.cert(serviceAccount),
            });

            isInit = true;
        }
    }

    async verifyIdToken(idToken: string) {
        return await admin.auth().verifyIdToken(idToken, false);
    }

    async setClaim(uid: string, claim: object) {
        return await admin.auth().setCustomUserClaims(uid, claim);
    }

    async getUser(uid: string) {
        return await admin.auth().getUser(uid);
    }



}