import { browser, WebRequest, Windows } from 'webextension-scripts/polyfill';

import { fetchProlificAccount, fetchProlificStudies, fetchStartStudy } from '../functions/fetchProlificStudies';
import { openProlificStudy } from '../functions/openProlificStudy';
import { configureStore } from '../store';
import { accInfoUpdate, logUpdate, prolificErrorUpdate, prolificStudiesUpdate } from '../store/prolific/actions';
import { sessionLastChecked } from '../store/session/action';
import { prolificStudiesUpdateMiddleware } from '../store/prolificStudiesUpdateMiddleware';
import { settingsAlertSoundMiddleware } from '../store/settingsAlertSoundMiddleware';
import { auth, authUrl, delWindow } from '../functions/authProlific';
import { settingUID } from '../store/settings/actions';

const store = configureStore(prolificStudiesUpdateMiddleware, settingsAlertSoundMiddleware);
let auth_window: Windows.Window;
export let authHeader: WebRequest.HttpHeadersItemType;
export let id_token: string;
export let userID = '';
export let acc_info: any = {};

export function updateResults(results: any[]) {
  store.dispatch(prolificStudiesUpdate(results));
  store.dispatch(sessionLastChecked());
  browser.browserAction.setBadgeBackgroundColor({ color: 'red' });
  browser.browserAction.setBadgeText({ text: results.length ? results.length.toString() : '' });

  if (results.length < 1) {
    browser.browserAction.setBadgeText({ text: 'OK' });
    browser.browserAction.setBadgeBackgroundColor({ color: 'lime' });
    appendLog(`${results.length} STUDIES FOUND`, '0-studies');
  } else {
    appendLog(`${results.length} STUDIES FOUND`, 'studies');
    let bestStudy: ProlificStudy;
    results.forEach(el => {
      if (!bestStudy) bestStudy = el;
      if (el.reward > bestStudy.reward) bestStudy = el;
    });
    const settings = store.getState().settings;
    if (settings.autostart && results.length > 0) {
      fetchStartStudy(authHeader, userID, bestStudy.id);
    }
  }
}

let timeout = window.setTimeout(main);

let logs: {}[];

export function appendLog(log: string, type: string) {
  if (!logs) logs = [];
  logs.push({ data: log, type: type, timestamp: (+new Date()) });
  store.dispatch(logUpdate(logs));
}

async function main() {
  clearTimeout(timeout);
  const state = store.getState();
  if (state.settings.uid && authHeader) {
    async function tmp() {
      try {
        let json = await fetchProlificAccount(authHeader, state.settings.uid);
        if (json.id && json.id == state.settings.uid) {

        } else {
          store.dispatch(settingUID(''));
        }
      } catch {
        store.dispatch(settingUID(''));
      }
    }
    tmp();
  }
  browser.browserAction.setBadgeText({ text: '...' });
  browser.browserAction.setBadgeBackgroundColor({ color: 'orange' });

  if (authHeader) {
    try {
      const response = await fetchProlificStudies(authHeader);
      browser.browserAction.setBadgeText({ text: 'ERR' });
      browser.browserAction.setBadgeBackgroundColor({ color: 'black' });


      if (response.error) {
        if (response.error.status === 401) {
          store.dispatch(prolificErrorUpdate(401));
          browser.browserAction.setBadgeText({ text: '!' });
          browser.browserAction.setBadgeBackgroundColor({ color: 'red' });
          appendLog('AUTHENTICATION ERROR', 'error');
          auth();
        } else {
          store.dispatch(prolificStudiesUpdate([]));
          browser.browserAction.setBadgeText({ text: 'ERR' });
          browser.browserAction.setBadgeBackgroundColor({ color: 'black' });
          appendLog('OTHER ERROR', 'error');
        }
      } else {
        browser.browserAction.setBadgeText({ text: 'OK' });
        browser.browserAction.setBadgeBackgroundColor({ color: 'lime' });
        appendLog('OK!', 'status');
      }

      if (response.results) {
        updateResults(response.results);
      }
      if (userID) {
        acc_info = await fetchProlificAccount(authHeader, userID);
        appendLog('CHECKING FOR STUDIES', 'status');
      }
    } catch (error) {
      store.dispatch(prolificStudiesUpdate([]));
      browser.browserAction.setBadgeText({ text: 'ERR' });
      browser.browserAction.setBadgeBackgroundColor({ color: 'black' });
      appendLog(`ERROR - fetchProlificStudies`, 'error');
      window.console.error('fetchProlificStudies error', error);
    }
  } else {
    store.dispatch(prolificErrorUpdate(401));
    browser.browserAction.setBadgeText({ text: 'ERR' });
    browser.browserAction.setBadgeBackgroundColor({ color: 'black' });
    appendLog(`ERROR - Auth Header missing`, 'error');
    auth();
  }

  timeout = window.setTimeout(main, state.settings.check_interval * 1000);
}

browser.notifications.onClicked.addListener((notificationId) => {
  browser.notifications.clear(notificationId);
  openProlificStudy(notificationId);
});

function handleSignedOut() {
  authHeader = null;
  updateResults([]);
  store.dispatch(prolificErrorUpdate(401));
}

// Watch for url changes and handle sign out
browser.webNavigation.onCompleted.addListener(
  (details) => {
    handleSignedOut();
  },
  {
    url: [{ urlEquals: 'https://www.prolific.co/auth/accounts/login/' }],
  },
);

// Prolific is a single page app, so we need to watch
// the history state for changes too
browser.webNavigation.onHistoryStateUpdated.addListener(
  (details) => {
    handleSignedOut();
  },
  {
    url: [{ urlEquals: 'https://app.prolific.co/login' }],
  },
);

// Parse and save the Authorization header from any Prolific request.
browser.webRequest.onBeforeSendHeaders.addListener(
  (details) => {
    const foundAuthHeader = details.requestHeaders.find((header) => header.name === 'Authorization');


    if (foundAuthHeader) {
      if (foundAuthHeader.value === 'Bearer null') {
        return;
      }

      let restart = false;

      if (!authHeader) {
        restart = true;
      }

      authHeader = foundAuthHeader;
      delWindow();
      if (restart) {
        main();
      }
    }

    return {};
  },
  {
    urls: ['https://www.prolific.co/api/*'],
  },
  ['blocking', 'requestHeaders'],
);

browser.webRequest.onBeforeRequest.addListener(
  (details) => {
    if (details.url.includes('/firebase/')) return;
    try{
    let filter = browser.webRequest.filterResponseData(details.requestId);
    let decoder = new TextDecoder('utf-8');
    let encoder = new TextEncoder();

    // @ts-ignore
    filter.ondata = event => {
      let str = decoder.decode(event.data, { stream: true });
      acc_info = JSON.parse(str);
      userID = acc_info.id;
      store.dispatch(accInfoUpdate(acc_info));
      store.dispatch(settingUID(userID));
      try {
        browser.windows.remove(auth_window.id);
      } catch {
      }
      filter.write(encoder.encode(str));
      filter.disconnect();
    };}catch {
      //https://www.prolific.co/api/v1/users/${userID}/
      async function tmp(){
        let str = details.url.split('users')[1].replace('/','').replace('/','')
        userID = str;
        if(!acc_info)
        acc_info = await fetchProlificAccount(authHeader,userID)
        store.dispatch(accInfoUpdate(acc_info));
        store.dispatch(settingUID(userID));
      }
      tmp()
    }

  },
  {
    urls: ['https://www.prolific.co/api/v1/users/*'],
  }, ['blocking'],
);

browser.runtime.onMessage.addListener((message) => {
  if (message === 'check_for_studies') {
    main();
  }
});
browser.webRequest.onHeadersReceived.addListener(
  (details) => {
    console.log(details);

    if (details.url === authUrl) {
      details.responseHeaders.forEach(el => {
        if (el.name === 'location') {
          let url = el.value;
          let u_args = url.split('#')[1].split('&');
          let u_args2: any = {};
          u_args.forEach(el => {
            let arg = el.split('=');
            u_args2[arg[0]] = arg[1];
          });
          let token = u_args2.access_token;
          authHeader = { name: 'Authorization', value: `Bearer ${token}` };
          id_token = u_args2.id_token;
          main();
        }
      });
    }
  },
  {
    urls: ['https://www.prolific.co/*'],
  }, ['responseHeaders'],
);