import { appendLog } from '../pages/background';
import { authUrl } from './GlobalVars';

export async function authProlific() {
  appendLog(`Authentication type: FETCH`, 'status', `Authorising by FETCH method.`);
  const response = await fetch(authUrl);
  console.log(response);
}

export async function auth() {
  await authProlific();
}
