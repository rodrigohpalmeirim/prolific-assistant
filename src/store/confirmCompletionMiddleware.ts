import { AnyAction, Dispatch, Middleware } from 'redux';
import {
  FIREBASE_LOGIN,
  FIREBASE_LOGOUT,
  GET_USER,
  READ_PREFERENCES,
  setPreferences,
  setUser, UPLOAD_PREFERENCES,
} from './firebase/actions';
import { setDoneAction, setErrorAction } from './session/actions';
import {
  canUseProlificAssistant,
  getUserPreferences,
  login,
  logout,
  setUserPreferences,
} from '../functions/firebaseAuth';
import { AppState } from './index';
import { SET_DONE, SET_ERROR } from './session/types';

export const confirmCompletionMiddleware: Middleware = (store) => (next) => (action) => {
  if(action.type === SET_ERROR || action.type === SET_DONE)return next(action);
  store.dispatch(setDoneAction({type:action.type,done:true}));

  return next(action);
};

const retry_interval = 10;
export async function _awaitDispatch(dispatch:Dispatch<any>,store:any,action:AnyAction){
  dispatch(setErrorAction({type:action.type,error:undefined,done:false}));

  await new Promise((r,j)=>{
    function a(){
      let state:AppState = store.getState();
      if(!state.session.errors[action.type]?.done){
        r();
      }else{
        setTimeout(a,retry_interval);
      }
    }
    a();
  })

  dispatch(action);

  await new Promise((r,j)=>{
    function a(){
      let state:AppState = store.getState();
      if(state.session.errors[action.type]?.done){
        r();
      }else{
        setTimeout(a,retry_interval);
      }
    }
    a();
  })
  let state:AppState = store.getState();
  if(state.session.errors[action.type].error){
    throw state.session.errors[action.type].error;
  }
}

