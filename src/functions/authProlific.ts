import { authUrl } from './GlobalVars';
import { LogObject } from '../types';

export async function authProlific():Promise<LogObject> {
  await fetch(authUrl);
  return {type:"status",log:`Authentication type: FETCH`,description:`Authorising by FETCH method.`};
}
