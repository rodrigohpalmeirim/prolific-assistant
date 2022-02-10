import { appendLog } from '../pages/background';

export let authUrl = 'https://internal-api.prolific.co/openid/authorize?client_id=447610&redirect_uri=https%3A%2F%2Fapp.prolific.co%2Fsilent-renew.html&response_type=id_token%20token&scope=openid%20profile&state=state&nonce=nonce';



export async function authProlific() {
  appendLog(`Authentication type: FETCH`, 'status', `Authorising by FETCH method.`);
  const response = await fetch(authUrl);
  console.log(response);
}

export async function auth() {
  await authProlific();
}
