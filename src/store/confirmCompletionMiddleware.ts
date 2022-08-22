import { AnyAction, Dispatch, Middleware } from 'redux';
import { setDoneAction, setErrorAction } from './session/actions';
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

  await new Promise<void>((r,j)=>{
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

  await new Promise<void>((r,j)=>{
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

