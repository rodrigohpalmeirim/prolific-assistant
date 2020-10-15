import { browser, WebRequest, Windows } from 'webextension-scripts/polyfill';

import {
  checkUserID,
  fetchProlificAccount,
  fetchProlificStudies,
  fetchProlificSubmissions,
  fetchStartStudy,
} from '../functions/fetchProlificStudies';
import { openProlificStudy } from '../functions/openProlificStudy';
import { configureStore } from '../store';
import {
  accInfoUpdate,
  prolificErrorUpdate,
  prolificStudiesUpdate,
  prolificSubmissionsUpdate,
} from '../store/prolific/actions';
import { sessionLastChecked, popup, logUpdate } from '../store/session/actions';
import { prolificStudiesUpdateMiddleware } from '../store/prolificStudiesUpdateMiddleware';
import { settingsAlertSoundMiddleware } from '../store/settingsAlertSoundMiddleware';
import { auth, authUrl } from '../functions/authProlific';
import { settingUID } from '../store/settings/actions';
import { useDispatch, useSelector } from 'react-redux';
import { selectLogs } from '../store/session/selectors';

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
    appendLog(`${results.length} STUDIES FOUND`, '0-studies',`no studies found.`);
  } else {
    appendLog(`${results.length} STUDIES FOUND`, 'studies',`${results.length} studies found.`);
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

export function appendLog(log: string, type: string,description:string) {
  logs = store.getState().session.logs;
  if (!logs) logs = [];
  while(logs.length>200){
    logs.shift();
  }
  logs.push({ data: log, type: type, timestamp: (+new Date()),desc:description });
  store.dispatch(logUpdate(logs));
}

async function main() {
  clearTimeout(timeout);
  const state = store.getState();
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
          appendLog('AUTHENTICATION ERROR', 'error',`ERROR 401 Occurred\n${response.error}`);
          auth();
        } else {
          store.dispatch(prolificStudiesUpdate([]));
          browser.browserAction.setBadgeText({ text: 'ERR' });
          browser.browserAction.setBadgeBackgroundColor({ color: 'black' });
          appendLog('OTHER ERROR', 'error',`Unknown ERROR Occurred\n${response.error}`);
        }
      } else {
        browser.browserAction.setBadgeText({ text: 'OK' });
        browser.browserAction.setBadgeBackgroundColor({ color: 'lime' });
        appendLog('OK!', 'status',`Everything seems to be fine`);
      }

      if (response.results) {
        updateResults(response.results);
      }
      if (userID) {
        appendLog('LOADING USER INFO', 'status',`Fetching UserInfo for UserID: ${userID}`);
        acc_info = await fetchProlificAccount(authHeader, userID);
        if (!acc_info.id || acc_info.id == !userID) {
          if (await checkUserID(authHeader, state.settings.uid, store)) {
            userID = state.settings.uid;
          }
        }
        store.dispatch(accInfoUpdate(acc_info));
      } else {
        if (await checkUserID(authHeader, state.settings.uid, store)) {
          userID = state.settings.uid;
          appendLog(`Successfully Gathered Prolific ID from settings`, 'success',`Successfully Gathered Prolific ID from settings\nID: ${state.settings.uid}`);
        } else {
          appendLog('Prolific ID from settings is invalid', 'error',`Prolific ID from settings is invalid. \nID: ${state.settings.uid}`);
        }
      }

      if (userID) {
        let response = await fetchProlificSubmissions(authHeader, userID);
        if (response.results) {
          store.dispatch(prolificSubmissionsUpdate(response.results));
        }
      }
    } catch (error) {
      store.dispatch(prolificStudiesUpdate([]));
      browser.browserAction.setBadgeText({ text: 'ERR' });
      browser.browserAction.setBadgeBackgroundColor({ color: 'black' });
      appendLog(`ERROR - fetchProlificStudies`, 'error',`Exception occurred:\n${error}`);
      window.console.error('fetchProlificStudies error', error);
    }
  } else {
    store.dispatch(prolificErrorUpdate(401));
    browser.browserAction.setBadgeText({ text: 'ERR' });
    browser.browserAction.setBadgeBackgroundColor({ color: 'black' });
    appendLog(`ERROR - Auth Header missing`, 'error',`Auth header is missing`);
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
    try {
      let filter = browser.webRequest.filterResponseData(details.requestId);
      let decoder = new TextDecoder('utf-8');
      let encoder = new TextEncoder();

      // @ts-ignore
      filter.ondata = event => {
        let str = decoder.decode(event.data, { stream: true });
        acc_info = JSON.parse(str);
        UIDfromBody(acc_info);

        filter.write(encoder.encode(str));
        filter.disconnect();
      };
    } catch {
      //https://www.prolific.co/api/v1/users/${userID}/
      UIDfromUrl(details.url);
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
  if (message === 'check_for_studies-cuid') {
    main();
    if(userID==store.getState().settings.uid){
      store.dispatch(popup(({type:"ok",text:`Prolific ID Changed to:\n${userID}`})))
    }else {
      store.dispatch(popup(({type:"ok",text:`Prolific ID is Invalid:\n${store.getState().settings.uid}`})))
    }
  }
});
browser.webRequest.onHeadersReceived.addListener(
  (details) => {

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

async function UIDfromUrl(url: string) {
  let str = url.split('users')[1].replace('/', '').replace('/', '');
  let userID_t = str;
  if (!acc_info) {
    acc_info = await fetchProlificAccount(authHeader, userID);
    store.dispatch(accInfoUpdate(acc_info));
  }
  if (userID_t && userID_t.length > 0) {
    store.dispatch(settingUID(userID_t));
    userID = userID_t;
    if (store.getState().settings.uid != userID) {
      appendLog(`Automatically Gathered UserID from HTTP request`, 'success',`Automatically Gathered UserID from HTTP request: ${userID}`);
    }
  }

}

function UIDfromBody(body: any) {
  store.dispatch(accInfoUpdate(acc_info));
  let userID_t = '';
  if (body) {
    userID_t = body.id;
  }
  if (userID_t && userID_t.length > 0) {
    store.dispatch(settingUID(userID_t));
    userID = userID_t;
    if (store.getState().settings.uid != userID) {
      appendLog(`Automatically Gathered UserID from HTTP request`, 'success',`Automatically Gathered UserID from HTTP request: ${userID}`);
    }
  }
}