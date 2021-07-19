import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import {App, myfunc} from './component/App/App';
import { Car } from './model/car';
import { FirebaseAPI } from './fb';

// Importing the Bootstrap CSS
import 'bootstrap/dist/css/bootstrap.min.css';



// init firebase
new FirebaseAPI();

// show UI
ReactDOM.render(
  <React.StrictMode>
    <App/>
  </React.StrictMode>,
  document.getElementById('root')
);
