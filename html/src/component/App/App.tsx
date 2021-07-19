import logo from './logo.svg';
import './App.css';
import React from 'react';
import { Car } from '../../model/car';
import axios from 'axios';
import { TodoDb, TodoDbHelper } from '../../db/TodoDb';
import { HomePage } from './HomePage';
import { LoginPage } from './LoginPage';

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


      <div className="App" style={{backgroundColor: ''}}>
        {
          this.state.isSignedIn ?
            <HomePage onSignOut={this.handleSignOut} />
            : <LoginPage onDoneSignIn={this.handleToken} />
        }
      </div>
    );
  }

}

// export default App;
