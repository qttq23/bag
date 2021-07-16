import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import {App, myfunc} from './component/App/App';
import { Car } from './model/car';
import { FirebaseAPI } from './fb';

let handler = (x:number)=>{
  return 3*x;
}


// init firebase
new FirebaseAPI();

// show UI
ReactDOM.render(
  <React.StrictMode>
    <App/>
  </React.StrictMode>,
  document.getElementById('root')
);
