import React from 'react';
import ReactDom from 'react-dom';
import { Provider, useSelector } from 'react-redux';
import { Store } from 'webext-redux';

import { App } from '../components/App';

import 'bootstrap/dist/css/bootstrap.css';
import './popup.css';
import { reload, resetSettings } from '../store/settings/actions';

const store = new Store();
console.log(location.href)
store.ready().then(() => {
  try{
  ReactDom.render(
    <Provider store={store}>
      <App />
    </Provider>,
    document.getElementById('root'),
  );}catch(ex) {
    console.log(ex);
    ReactDom.render(
      <Provider store={store}>
        <h2 className="middle c-red">ERROR</h2>
        <div className="middle">YOU CAN CLICK BUTTON BELLOW TO RESET SETTINGS TO DEFAULT</div>
        <div className="middle">OR RELOAD EXTENSION</div>
        <code className="raw p-2">{ex.toString()}</code><br/>
        <code className="raw p-2">{ex.stack}</code>
        <button onClick={function(){
          store.dispatch(resetSettings());
          location.reload();
        }}>RESET</button>
        <button onClick={function(){
          store.dispatch(reload());
          location.reload();
        }}>RELOAD</button>
      </Provider>,
      document.getElementById('root'),
    );
  }
});
