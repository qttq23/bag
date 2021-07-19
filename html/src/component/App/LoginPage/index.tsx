import React from 'react';
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
        statusMessage: '...'
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
                                                <Form.Control type="email" placeholder="Enter email" ref={this.refEmail} />

                                            </Form.Group>

                                            <Form.Group className="mb-3" controlId="formBasicPassword">
                                                <Form.Label>Password</Form.Label>
                                                <Form.Control type="password" placeholder="Password" ref={this.refPassword} />
                                            </Form.Group>

                                            <p>{this.state.statusMessage}</p>

                                            <Button variant="primary" type="submit" onClick={this.handleSignIn}>sign in</Button>
                                        </Form>
                                        {/* 
                                    <form>
                                        <input type="text" ref={this.refEmail}></input>
                                        <input type="password" ref={this.refPassword}></input>
                                        <p>{this.state.statusMessage}</p>
                                        <br></br>
                                        <br></br>
                                        <Button variant="primary" type="submit" onClick={this.handleSignIn}>sign in</Button>
                                    </form> */}
                                        <br></br>
                                        <br></br>
                                        <Button variant="outline-primary" onClick={this.handleSignUp}>sign up</Button>
                                        <br></br>
                                        <br></br>
                                        <Button variant="light" onClick={this.handleSignInGoogle}><FaGoogle />&emsp;<span>sign in google</span></Button>

                                    </div>

                            }
                        </Col>
                    </Row>
                </Container>


            </div>

        );
    }

}

