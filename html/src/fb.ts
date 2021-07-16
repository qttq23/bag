import firebase from "firebase/app";
import "firebase/analytics";
import "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyDWlr-umcSyQ5VabAZaX3o5K7AhRVWJDdU",
    authDomain: "brave-smile-298908.firebaseapp.com",
    projectId: "brave-smile-298908",
    storageBucket: "brave-smile-298908.appspot.com",
    messagingSenderId: "621096916288",
    appId: "1:621096916288:web:a927c290e143138acc96a5"
};
let isInit = false;

export class FirebaseAPI {

    constructor() {
        if (!isInit) {
            firebase.initializeApp(firebaseConfig);
            isInit = true;
        }

    }

    async signInEmailPassword(email: string, password: string) {
        try {
            let result = await firebase.auth().signInWithEmailAndPassword(email, password);
            return result;
        } catch (error) {
            console.log(error);
            return null;
        }

    }

    async createEmailPassword(email: string, password: string) {
        try {
            let result = await firebase.auth().createUserWithEmailAndPassword(email, password);
            return result;
        } catch (error) {
            console.log(error);
            return null;
        }
    }


    async getIdTokenResult(isForceRefresh: boolean = false) {
        return await firebase.auth().currentUser?.getIdTokenResult(isForceRefresh);
    }

    async getIdToken(isForceRefresh: boolean = false) {
        let result = await this.getIdTokenResult(isForceRefresh);
        return result?.token || '';

    }

    async getUser() {
        return await firebase.auth().currentUser;
    }

    async signInGoogle() {

        var provider = new firebase.auth.GoogleAuthProvider();
        provider.addScope('https://www.googleapis.com/auth/userinfo.email');
        provider.setCustomParameters({'prompt': 'select_account consent'});

        try {
            let credential = await firebase.auth().signInWithPopup(provider);
            return credential;

        } catch (error) {
            console.log(error);
            return null;
        }


    }

    async signOut() {
        return await firebase.auth().signOut();
    }

    async waitUser(timeout: number = 10000) {

        return new Promise<firebase.User | null>((resolve, reject) => {

            setTimeout(() => {
                resolve(null);
            }, timeout);

            firebase.auth().onAuthStateChanged(function (user) {
                if (user) {
                    // User is signed in.
                    resolve(user);
                }
            });

        });
    }

}
