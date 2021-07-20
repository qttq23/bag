import React, { useEffect } from "react";
import qs from 'qs';
import { FirebaseAPI } from '../../../fb';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link,
    useRouteMatch,
    useParams,
    useHistory,
    useLocation,
    Redirect
} from "react-router-dom";


export enum EnumStatus {
    CHECKING = 1,
    NOTFOUND,
    FOUND
};
export type AuthState = {
    status: EnumStatus; // 1: checking, 2: not found, 3: found
};



export function useAuth() {
    const [state, setState] = React.useState<AuthState>({
        status: EnumStatus.CHECKING
    });


    let history = useHistory();
    let match = useRouteMatch();
    let location = useLocation();



    let waitUser = async () => {
        let fb = new FirebaseAPI();
        let user = await fb.waitUser();
        if (!user) {
            localStorage.setItem('isSignedIn', 'false');
            console.log('user not found');

            handleUserNotFound();

            return;
        }

        console.log('user found');
        handleUserFound();

    }

    let handleUserFound = async () => {
        let path = location.pathname;
        let query = location.search;
        console.log(path);
        console.log(query);

        // if path === login
        if (path == '/login') {
            let newPath = '/';
            if (query) {
                let obj = qs.parse(query.substring(1));
                if (typeof obj['redirect'] == 'string') {
                    newPath = obj['redirect'];
                }
            }

            console.log('redirecting to ', newPath);
            history.replace({ pathname: newPath });
        }
        else {
            // if path === / or /home
            console.log('go straight to ', path);
            setState({ status: EnumStatus.FOUND });

        }



    }

    let handleUserNotFound = async () => {

        let path = location.pathname;
        let query = location.search;
        console.log(path);
        console.log(query);

        // if path == 'login' -> setstate next
        if (path == '/login') {
            console.log('go straight to login');
            setState({ status: EnumStatus.NOTFOUND });
        }
        else {

            console.log('redirecting to login, will return to ', path);
            let queryString = qs.stringify({ redirect: path + query });
            history.replace({ pathname: '/login', search: '?' + queryString });
        }

    }

    let handleSignOut = async () => {
        let fb = new FirebaseAPI();
        await fb.signOut();

        localStorage.setItem('isSignedIn', 'false');

        setState({
            status: EnumStatus.CHECKING
        });
        history.push({ pathname: '/login' })
    };

    let handleSignInOk = async () => {

        localStorage.setItem('isSignedIn', 'true');

        let redirectPath = '/';
        if (location.search) {
            let obj = qs.parse(location.search.substring(1));
            if (typeof obj['redirect'] == 'string') {
                redirectPath = obj['redirect'];
            }
        }

        console.log('from authmdw, redirecting to ', redirectPath);

        setState({
            status: EnumStatus.CHECKING
        });
        history.replace({ pathname: redirectPath });
    }

    useEffect(() => {
        console.log('checking user from effect');

        let isSignedIn = localStorage.getItem('isSignedIn');
        if (isSignedIn === 'true') {
            console.log('signed in. watiting user...');
            waitUser();
        }
        else {

            console.log('not signed in');
            handleUserNotFound();
        }

        return () => { console.log('cleanup effect'); };
    }, [location.pathname]);


    return { state, handleSignInOk, handleSignOut };

}