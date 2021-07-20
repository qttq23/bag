
import React, { useEffect } from 'react';
import { FirebaseAPI } from '../../../fb';
import { LoginPage } from '../LoginPage';
import qs from 'qs';

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
import { HomePage } from '../HomePage';
import { EnumStatus, useAuth } from './AuthHook';

type MyProps = {

};
type MyState = {
};


export const HomeMdw = (props: MyProps) => {


    let { state, handleSignInOk, handleSignOut } = useAuth();

    let ui = <h4>HOME, Checking user...10s</h4>;

    if (state.status === EnumStatus.CHECKING) {
        return <div>HOME, render due to auth hook</div>;
    }

    else if (state.status == EnumStatus.FOUND) {
        // go to page rather than login
        ui = (

            <HomePage onSignOut={handleSignOut} />
        );

    }
    // below may be never reached
    else if (state.status == EnumStatus.NOTFOUND) {

        console.log('never_reach, homemdw and not found');
        ui = (
            <LoginPage onDoneSignIn={handleSignInOk}></LoginPage>
        );
    }


    return ui;
};