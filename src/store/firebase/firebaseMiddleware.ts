import { Middleware } from 'redux';
import {
  FIREBASE_LOGIN,
  FIREBASE_LOGOUT,
  GET_USER,
  READ_PREFERENCES,
  setPreferences,
  setUser,
  UPLOAD_PREFERENCES,
} from './actions';
import {
  canUseProlificAssistant,
  getUserPreferences,
  login,
  logout,
  setUserPreferences,
} from '../../functions/firebaseAuth';
import { reportErrorAction } from '../session/actions';

export const firebaseMiddleware: Middleware = (store) => (next) => (action) => {
  (async () => {
    switch (action.type) {
      case FIREBASE_LOGIN:
        await login(action.payload.email, action.payload.password);
        await store.dispatch(setUser());
        break;
      case FIREBASE_LOGOUT:
        await logout();
        await store.dispatch(setUser());
        break;
      case READ_PREFERENCES:
        let prefs = await getUserPreferences();
        await store.dispatch(setPreferences(prefs));
        break;
      case GET_USER:
        await canUseProlificAssistant();
        await store.dispatch(setUser());
        break;
      case UPLOAD_PREFERENCES:
        await setUserPreferences(store.getState().firebase.preferences);
        break;
    }
  })().then(() => {
    next(action);
  }).catch((e)=>{
    store.dispatch(reportErrorAction({type:action.type,error:e}));
    next(action);
  });

  return;
};
