import React from 'react';
import axios from 'axios';
import { FirebaseAPI } from '../../../fb';
import { AuthApi } from '../../../api/AuthApi';


type MyProps = {
    // using `interface` is also ok
    // message: string;
    onDoneSignIn: () => void

};
type MyState = {
    count: number; // like this
    statusMessage: string
};

export class LoginPage extends React.Component<MyProps, MyState> {

    state: MyState = {
        count: 7,
        statusMessage: 'empty'
    };
    refEmail = React.createRef<HTMLInputElement>();
    refPassword = React.createRef<HTMLInputElement>();


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
            this.setState({
                statusMessage: 'fail to auto sign in'
            });
            return;
        }

        this.handleDoneSignInSelf();

    }

    handleSignIn = async (event: any) => {
        event.preventDefault();

        if (this.refEmail.current && this.refPassword.current) {
            this.setState({
                statusMessage: 'sign in...'
            });

            console.log('sign in...');

            let email = this.refEmail.current.value;
            let password = this.refPassword.current.value;

            // check with firebase auth
            let fb = new FirebaseAPI();
            let result = await fb.signInEmailPassword(email, password);
            console.log(result);
            if (!result) {
                console.log('sign in failed');
                this.setState({
                    statusMessage: 'fail to sign in'
                });
                return;
            }

            // get token
            let idTokenResult = await fb.getIdTokenResult();
            console.log(idTokenResult);
            if (idTokenResult) {
                this.handleDoneSignInSelf();
            }

        }


    }

    handleSignInGoogle = async (event: any) => {
        this.setState({
            statusMessage: 'sign in with google...'
        });

        // sign in with firebase auth
        let fb = new FirebaseAPI();
        let result = await fb.signInGoogle();
        console.log(result);
        if (!result) {
            console.log('sign in google failed');
            this.setState({
                statusMessage: 'fail to google sign in'
            });
            return;
        }

        // get token
        let idTokenResult = await fb.getIdTokenResult();
        console.log(idTokenResult);

        // first time set up
        if (idTokenResult) {

            let authApi = new AuthApi();
            await authApi.acquireFirstTimeSetUp(idTokenResult.token);
            let newIdTokenResult = await fb.getIdTokenResult(true);
            console.log(newIdTokenResult);

            if (newIdTokenResult) {
                this.handleDoneSignInSelf();
            }
        }

    }

    handleSignUp = async (event: any) => {
        if (this.refEmail.current && this.refPassword.current) {
            this.setState({
                statusMessage: 'sign up...'
            });
            console.log('sign up...');

            let email = this.refEmail.current.value;
            let password = this.refPassword.current.value;

            // create user using firebase auth
            let fb = new FirebaseAPI();
            let result = await fb.createEmailPassword(email, password);
            console.log(result);
            if (!result) {
                console.log('sign up failed');
                this.setState({
                    statusMessage: 'fail to sign up'
                });
                return;
            }

            // get token
            let idTokenResult = await fb.getIdTokenResult();
            console.log(idTokenResult);

            // first time set up
            if (idTokenResult) {

                let authApi = new AuthApi();
                await authApi.acquireFirstTimeSetUp(idTokenResult.token);
                let newIdTokenResult = await fb.getIdTokenResult(true);
                console.log(newIdTokenResult);

                if (newIdTokenResult) {
                    this.handleDoneSignInSelf();
                }
            }


        }

    }

    handleDoneSignInSelf() {
        localStorage.setItem('isSignedIn', 'true');
        this.props.onDoneSignIn();
    }

    render() {
        let isSignedIn = localStorage.getItem('isSignedIn') || 'false';

        return (
            <div>
                {
                    isSignedIn === 'true' ?
                        'waiting for auto sigin...'
                        :
                        <div style={{
                            display: 'flex',
                            flexDirection: 'column',
                            width: '300px',
                            margin: 'auto'
                        }} >
                            this is sign in
                            <form>
                                <input type="text" ref={this.refEmail}></input>
                                <input type="password" ref={this.refPassword}></input>
                                <p>{this.state.statusMessage}</p>
                                <br></br>
                                <br></br>
                                <button type="submit" onClick={this.handleSignIn}>sign in</button>

                            </form>
                            <br></br>
                            <br></br>
                            <button onClick={this.handleSignInGoogle}>sign in google</button>
                            <br></br>
                            <br></br>
                            <button onClick={this.handleSignUp}>sign up</button>

                        </div>

                }
            </div>


        );
    }

}

