import { browser, WebRequest, Windows } from 'webextension-scripts/polyfill';

import { fetchProlificAccount, fetchProlificStudies } from '../functions/fetchProlificStudies';
import { openProlificStudy } from '../functions/openProlificStudy';
import { configureStore } from '../store';
import { prolificStudiesUpdate, prolificErrorUpdate, accInfoUpdate } from '../store/prolific/actions';
import { sessionLastChecked } from '../store/session/action';
import { prolificStudiesUpdateMiddleware } from '../store/prolificStudiesUpdateMiddleware';
import { settingsAlertSoundMiddleware } from '../store/settingsAlertSoundMiddleware';
import { authProlific, authProlificTab, delWindow } from '../functions/authProlific';

const store = configureStore(prolificStudiesUpdateMiddleware, settingsAlertSoundMiddleware);
let authHeader: WebRequest.HttpHeadersItemType;
export let userID = '';
export let acc_info: any = {};
let auth_window: Windows.Window;

function updateResults(results: any[]) {
  store.dispatch(prolificStudiesUpdate(results));
  store.dispatch(sessionLastChecked());
  browser.browserAction.setBadgeBackgroundColor({ color: 'red' });
  browser.browserAction.setBadgeText({ text: results.length ? results.length.toString() : '' });

  if(results.length<1){
    browser.browserAction.setBadgeText({ text: 'OK' });
    browser.browserAction.setBadgeBackgroundColor({ color: 'lime' });
  }
}
let timeout = window.setTimeout(main);
async function main() {
  clearTimeout(timeout);
  const state = store.getState();
  browser.browserAction.setBadgeText({ text: '...' });
  browser.browserAction.setBadgeBackgroundColor({ color: 'orange' });
  if (authHeader) {
    try {
      const response = await fetchProlificStudies(authHeader);
      acc_info = await fetchProlificAccount(authHeader,userID);
      store.dispatch(accInfoUpdate(acc_info))
      browser.browserAction.setBadgeText({ text: 'ERR' });
      browser.browserAction.setBadgeBackgroundColor({ color: 'black' });


      if (response.error) {
        if (response.error.status === 401) {
          store.dispatch(prolificErrorUpdate(401));
          browser.browserAction.setBadgeText({ text: '!' });
          browser.browserAction.setBadgeBackgroundColor({ color: 'red' });
        } else {
          store.dispatch(prolificStudiesUpdate([]));
          browser.browserAction.setBadgeText({ text: 'ERR' });
          browser.browserAction.setBadgeBackgroundColor({ color: 'black' });
        }
      }else {
        browser.browserAction.setBadgeText({ text: 'OK' });
        browser.browserAction.setBadgeBackgroundColor({ color: 'lime' });
      }

      if (response.results) {
        updateResults(response.results)
      }
    } catch (error) {
      store.dispatch(prolificStudiesUpdate([]));
      browser.browserAction.setBadgeText({ text: 'ERR' });
      browser.browserAction.setBadgeBackgroundColor({ color: 'black' });
      window.console.error('fetchProlificStudies error', error);
    }
  } else {
    store.dispatch(prolificErrorUpdate(401));
    browser.browserAction.setBadgeText({ text: 'ERR' });
    browser.browserAction.setBadgeBackgroundColor({ color: 'black' });
    console.log('error - noh')
    authProlificTab()
  }

  timeout = window.setTimeout(main, state.settings.check_interval * 1000);
}

browser.notifications.onClicked.addListener((notificationId) => {
  browser.notifications.clear(notificationId);
  openProlificStudy(notificationId);
});

function handleSignedOut() {
  authHeader = null
  updateResults([])
  store.dispatch(prolificErrorUpdate(401))
}

// Watch for url changes and handle sign out
browser.webNavigation.onCompleted.addListener(
  (details) => {
    handleSignedOut();
  },
  {
    url: [{ urlEquals: 'https://www.prolific.co/auth/accounts/login/'}],
  },
);

// Prolific is a single page app, so we need to watch
// the history state for changes too
browser.webNavigation.onHistoryStateUpdated.addListener(
  (details) => {
    handleSignedOut();
  },
  {
    url: [{ urlEquals: 'https://app.prolific.co/login'}],
  },
);

// Parse and save the Authorization header from any Prolific request.
browser.webRequest.onBeforeSendHeaders.addListener(
  (details) => {
    const foundAuthHeader = details.requestHeaders.find((header) => header.name === 'Authorization');


    if (foundAuthHeader) {
      if (foundAuthHeader.value === 'Bearer null') {
        return
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
    if(details.url.includes('/firebase/'))return;
    userID = details.url.replace('https://www.prolific.co/api/v1/users/','').replace('/','')
    let filter = browser.webRequest.filterResponseData(details.requestId);
    let decoder = new TextDecoder("utf-8");
    let encoder = new TextEncoder();

    // @ts-ignore
    filter.ondata = event => {
      let str = decoder.decode(event.data, {stream: true});
      acc_info = JSON.parse(str);
      store.dispatch(accInfoUpdate(acc_info))
      try{browser.windows.remove(auth_window.id)}catch  {}
      filter.write(encoder.encode(str));
      filter.disconnect();
    }

  },
  {
    urls: ['https://www.prolific.co/api/v1/users/*'],
  },["blocking"]
);

browser.runtime.onMessage.addListener((message) => {
  if (message === 'check_for_studies') {
    main();
  }
});

browser.webRequest.onCompleted.addListener(
  (details) => {
    console.log(details)

  },
  {
    urls: ['https://www.prolific.co/*'],
  },
);