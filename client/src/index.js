import 'babel-core/register';
import 'babel-polyfill';
import 'materialize-css/dist/css/materialize.min.css';
import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Switch, Route } from 'react-router-dom';
import axios from 'axios';
import App from './components/App';
import history from './history';

window.axios = axios;

ReactDOM.render(
  <Router history={history}>
    <Switch>
      <Route exact path="/">
        <App />
      </Route>{' '}
    </Switch>{' '}
  </Router>,
  document.querySelector('#root')
);
