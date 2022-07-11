import React, { useCallback, useEffect } from 'react';
import ReactDom from 'react-dom';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { Store } from 'webext-redux';

import { App, useForceUpdate } from '../components/App';

import 'bootstrap/dist/css/bootstrap.css';
import './popup.css';
import {
  reload,
  resetSettings,
  settingAlertSound,
  testingAlertSound,
} from '../store/settings/actions';
import { canUsePA, canUseProlificAssistant } from '../functions/firebaseAuth';
import { selectSettings } from '../store/settings/selectors';
import { getUser } from '../store/firebase/actions';
import { AppState } from '../store';
import { _awaitDispatch } from '../store/confirmCompletionMiddleware';
import { AnyAction } from 'redux';

export const store = new Store<AppState>();
console.log(location.href);

export function useAsyncDispatch(){
  let dispatch = useDispatch();
  return async (action:AnyAction)=>{
    await _awaitDispatch(dispatch,store,action)
  }
}

store.ready().then(() => {
  try {
    ReactDom.render(
      <Provider store={store}>
        <PreApp />
      </Provider>,
      document.getElementById('root'),
    );
  } catch (ex) {
    console.log(ex);
    ReactDom.render(
      <Provider store={store}>
        <h2 className="middle c-red">ERROR</h2>
        <div className="middle">YOU CAN CLICK BUTTON BELLOW TO RESET SETTINGS TO DEFAULT</div>
        <div className="middle">OR RELOAD EXTENSION</div>
        <code className="raw p-2">{ex.toString()}</code><br />
        <code className="raw p-2">{ex.stack}</code>
        <button onClick={function() {
          store.dispatch(resetSettings());
          location.reload();
        }}>RESET
        </button>
        <button onClick={function() {
          store.dispatch(reload());
          location.reload();
        }}>RELOAD
        </button>
      </Provider>,
      document.getElementById('root'),
    );
  }
});

function PreApp(){
  const dispatch = useDispatch();
  dispatch(getUser());
  return <AppByAction/>
}

function AppByAction() {
  let action = location.href.includes('a=')? location.href.split('a=')[1].split('?')[0]:'';
  if (!action || action.length < 1) action = 'display';
  const settings = useSelector(selectSettings);

  const reload = useForceUpdate();
  useEffect(()=>{
    reload();
  },[settings]);

  if(!settings)return <></>;
  if (action == 'display') {
    return <App/>
  }
}
