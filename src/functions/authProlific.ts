import { browser, Windows, Tabs, WebRequest } from 'webextension-scripts/polyfill';
import { appendLog } from '../pages/background';
export let authUrl = 'https://www.prolific.co/openid/authorize?client_id=447610&redirect_uri=https://app.prolific.co/oauth/callback&scope=openid%20profile&response_type=id_token%20token&state=state&nonce=nonce';
export async function authProlific() {
  appendLog(`Authentication type: FETCH`,'status')
  const response = await fetch(authUrl);
  console.log(response);
  appendLog(`Authentication success: FETCH`,'success')
}

let tab: Tabs.Tab;
let des = false;

export async function delWindow() {
  try {
    browser.tabs.remove(tab.id);
  } catch {

  }
  des = false;
}

export async function authProlificTab() {
  appendLog(`Authentication type: TAB`,'status')
  let popupURL = 'https://app.prolific.co/';
  browser.browserAction.setBadgeText({ text: 'ATH' });
  browser.browserAction.setBadgeBackgroundColor({ color: 'orange' });
  var creating = browser.tabs.create({
    url: popupURL,
    active:false,
    pinned:true
  });
  creating.then(el => {
    tab = el;
    des = true;
    let interv = setTimeout(function(){
      if(des){
      browser.browserAction.setBadgeText({ text: 'ATO' });
      browser.browserAction.setBadgeBackgroundColor({ color: 'red' });
      delWindow()}
      appendLog(`ERROR - Authentication timed out: TAB`,'error')
    },15000)
  });
}

export async function auth(){
  await authProlific()
}
