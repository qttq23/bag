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

  // getTodos = async (): Promise<Array<any>> => {

  //   let db: TodoDb = TodoDbHelper.getTodoDb();
  //   let list = await db.getTodos();
  //   this.setState({
  //     count: list.length,
  //     text: list[0].text
  //   });
  //   return list;

  // };

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
      // <div className="App">
      //   <header className="App-header">
      //     <img src={logo} className="App-logo" alt="logo" />
      //     <p>
      //       {this.props.cb(this.props.car.age)}
      //       <code>{this.props.message}</code> <br></br>
      //       {this.state.count} - {this.state.text}
      //     </p>
      //     <a
      //       className="App-link"
      //       href="https://reactjs.org"
      //       target="_blank"
      //       rel="noopener noreferrer"
      //     >
      //       Learn React2
      //   </a>
      //   </header>
      // </div>

      <div className="App">
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
