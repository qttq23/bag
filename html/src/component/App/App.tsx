import logo from './logo.svg';
import './App.css';
import React from 'react';
import { Car } from '../../model/car';
import axios from 'axios';
import { TodoDb, TodoDbHelper } from '../../db/TodoDb';
import { HomePage } from './HomePage';
import { LoginPage } from './LoginPage';

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useRouteMatch,
  useParams
} from "react-router-dom";
import { LoginMdw } from './Middleware/LoginMdw';
import { HomeMdw } from './Middleware/HomeMdw';


export type myfunc = (age: number) => number;

type MyProps = {

};
type MyState = {
  count: number; // like this
  isSignedIn: boolean
};

export class App extends React.Component<MyProps, MyState> {

  state: MyState = {
    count: 7,
    isSignedIn: false
  };

  handleToken = () => {
    this.setState({
      isSignedIn: true
    });

  }

  handleSignOut = () => {
    this.setState({
      isSignedIn: false
    });
  }

  componentDidMount() {

  }

  render() {
    return (

      <div className="App" style={{ backgroundColor: '' }}>
        <Router>
          <div>

            <Switch>

              <Route path="/login">
                <LoginMdw></LoginMdw>
              </Route>


              <Route path="/home">
                <HomeMdw></HomeMdw>
              </Route>

              <Route path="/" exact={true}>
                <HomeMdw></HomeMdw>
              </Route>

              <Route path="/">
                <div>404 page: resources not found2</div>
              </Route>

            </Switch>

          </div>
        </Router>


        {/* {
          this.state.isSignedIn ?
            <HomePage onSignOut={this.handleSignOut} />
            : <LoginPage onDoneSignIn={this.handleToken} />
        } */}
      </div>
    );
  }

}

// export default App;
