
import React from 'react';
import { FirebaseAPI } from '../../../fb';
import { useHistory, useRouteMatch, withRouter } from "react-router-dom";


type MyProps = {

};
type MyState = {
};


class AuthMdwRaw extends React.Component<MyProps, MyState>{

    history: any;
    match: any;

    componentDidMount() {
        let isSignedIn = localStorage.getItem('isSignedIn');
        if (isSignedIn === 'true') {
            console.log('signed in. watiting user...');
            this.waitUser();
        }
        else {

            console.log('not signed in');
        }
    }


    waitUser = async () => {
        let fb = new FirebaseAPI();
        let user = await fb.waitUser();
        if (!user) {
            localStorage.setItem('isSignedIn', 'false');
            console.log('user not found');
            this.handleUserNotFound();

            return;
        }

        console.log('user found');
        this.handleUserFound();

    }

    handleUserFound = async () => {
        let path = this.match.path;
        console.log(path);
        // if(path == 'login' || path == '/login'){

        // }
        // else if(path ==)
        // this.history.push()
    }

    handleUserNotFound = async () => {

    }

    render() {

        // check user 10s

        // if not user => login with redirectURL

        // if user
        // if path == login => home page
        // if path != login => path

        return (
            <h4>Checking user...10s</h4>
        );
    }
};

// const AuthMdw = withRouter(AuthMdwRaw);