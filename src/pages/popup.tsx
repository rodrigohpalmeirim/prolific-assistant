import React from 'react';
import ReactDom from 'react-dom';
import { Provider, useSelector } from 'react-redux';
import { Store } from 'webext-redux';

import { App } from '../components/App';

import 'bootstrap/dist/css/bootstrap.css';
import './popup.css';

const store = new Store();
console.log(location.href)
store.ready().then(() => {
  ReactDom.render(
    <Provider store={store}>
      <App />
    </Provider>,
    document.getElementById('root'),
  );
});
