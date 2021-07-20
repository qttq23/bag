import React, { useRef } from 'react';
import axios from 'axios';
import { FirebaseAPI } from '../../../fb';
import { AuthApi } from '../../../api/AuthApi';
import Button from 'react-bootstrap/esm/Button';
import { FaGoogle } from "react-icons/fa";
import Form from 'react-bootstrap/esm/Form';
import Container from 'react-bootstrap/esm/Container';
import Row from 'react-bootstrap/esm/Row';
import Col from 'react-bootstrap/esm/Col';
import Navbar from 'react-bootstrap/esm/Navbar';
import { useHistory, useLocation } from 'react-router-dom';
import qs from 'qs';


type MyProps = {
    // using `interface` is also ok
    // message: string;
    onDoneSignIn: () => void

};
type MyState = {
    count: number; // like this
    statusMessage: string
};


export const LoginPage = (props: MyProps) => {

    const [state, setState] = React.useState<MyState>({
        count: 7,
        statusMessage: '...'
    });

    let refEmail = useRef<HTMLInputElement>(null);
    let refPassword = useRef<HTMLInputElement>(null);

    let history = useHistory();
    let location = useLocation();

    let waitUser = async () => {
        let fb = new FirebaseAPI();
        let user = await fb.waitUser();
        if (!user) {
            localStorage.setItem('isSignedIn', 'false');

            state.statusMessage = 'fail to auto sign in';
            setState({ ...state });
            return;
        }

        handleDoneSignInSelf();

    }

    let handleSignIn = async (event: any) => {
        event.preventDefault();

        if (refEmail.current && refPassword.current) {
            state.statusMessage = 'sign in...';
            setState({ ...state });

            console.log('sign in...');

            let email = refEmail.current.value;
            let password = refPassword.current.value;

            // check with firebase auth
            let fb = new FirebaseAPI();
            let result = await fb.signInEmailPassword(email, password);
            console.log(result);
            if (!result) {
                console.log('sign in failed');
                state.statusMessage = 'fail to sign in';
                setState({ ...state });
                return;
            }

            // get token
            let idTokenResult = await fb.getIdTokenResult();
            console.log(idTokenResult);
            if (idTokenResult) {
                handleDoneSignInSelf();
            }

        }


    }

    let handleSignInGoogle = async (event: any) => {
        state.statusMessage = 'sign in with google...';
        setState({ ...state });

        // sign in with firebase auth
        let fb = new FirebaseAPI();
        let result = await fb.signInGoogle();
        console.log(result);
        if (!result) {
            console.log('sign in google failed');
            state.statusMessage = 'fail to google sign in';
            setState({ ...state });
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
                handleDoneSignInSelf();
            }
        }

    }

    let handleSignUp = async (event: any) => {
        if (refEmail.current && refPassword.current) {
            state.statusMessage = 'sign up...';
            setState({ ...state });
            console.log('sign up...');

            let email = refEmail.current.value;
            let password = refPassword.current.value;

            // create user using firebase auth
            let fb = new FirebaseAPI();
            let result = await fb.createEmailPassword(email, password);
            console.log(result);
            if (!result) {
                console.log('sign up failed');
                state.statusMessage = 'fail to sign up';
                setState({ ...state });
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
                    handleDoneSignInSelf();
                }
            }


        }

    }

    function handleDoneSignInSelf() {
        // localStorage.setItem('isSignedIn', 'true');
        // // props.onDoneSignIn();

    
        // let redirectPath = '/';
        // if (location.search) {
        //     let obj = qs.parse(location.search.substring(1));
        //     if (typeof obj['redirect'] == 'string') {
        //         redirectPath = obj['redirect'];
        //     }
        // }

        // console.log('from login page, redirecting to ', redirectPath);
        // history.replace({ pathname: redirectPath });

        props.onDoneSignIn();
    }

    React.useEffect(() => {
        console.log('login page effect..');

        // let isSignedIn = localStorage.getItem('isSignedIn');
        // if (isSignedIn === 'true') {
        //     console.log('signed in. watiting user...');
        //     waitUser();
        // }
        // else {

        //     console.log('not signed in');
        // }

    }, []);


    let isSignedIn = localStorage.getItem('isSignedIn') || 'false';

    return (
        <div>
            <Navbar bg="primary" variant="dark">
                <Container>
                    <Navbar.Brand href="#home"><h4>Bag Sign In</h4></Navbar.Brand>
                    <Navbar.Toggle />

                </Container>
            </Navbar>

            <Container>
                <Row>
                    <Col>
                        {
                            isSignedIn === 'true' ?
                                'waiting for auto sigin...'
                                :
                                <div  >
                                    <Form>
                                        <Form.Group className="mb-3" controlId="formBasicEmail">
                                            <Form.Label>Email address</Form.Label>
                                            <Form.Control type="email" placeholder="Enter email" ref={refEmail} />

                                        </Form.Group>

                                        <Form.Group className="mb-3" controlId="formBasicPassword">
                                            <Form.Label>Password</Form.Label>
                                            <Form.Control type="password" placeholder="Password" ref={refPassword} />
                                        </Form.Group>

                                        <p>{state.statusMessage}</p>

                                        <Button variant="primary" type="submit" onClick={handleSignIn}>sign in</Button>
                                    </Form>
                                   
                                    <br></br>
                                    <br></br>
                                    <Button variant="outline-primary" onClick={handleSignUp}>sign up</Button>
                                    <br></br>
                                    <br></br>
                                    <Button variant="light" onClick={handleSignInGoogle}><FaGoogle />&emsp;<span>sign in google</span></Button>

                                </div>

                        }
                    </Col>
                </Row>
            </Container>


        </div>

    );


}