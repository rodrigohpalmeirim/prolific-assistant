import { browser, Windows, Tabs, WebRequest } from 'webextension-scripts/polyfill';
import { appendLog } from '../pages/background';
export let authUrl = 'https://www.prolific.co/openid/authorize?client_id=447610&redirect_uri=https://app.prolific.co/oauth/callback&scope=openid%20profile&response_type=id_token%20token&state=state&nonce=nonce';
export async function authProlific() {
  appendLog(`Authentication type: FETCH`,'status',`Authorising by FETCH method.`)
  const response = await fetch(authUrl);
  console.log(response);
}

export async function auth(){
  await authProlific()
}
