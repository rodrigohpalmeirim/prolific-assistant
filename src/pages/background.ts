import { browser, WebRequest } from 'webextension-scripts/polyfill';

import {
  checkUserID,
  fetchProlificAccount,
  fetchProlificStudies,
  fetchProlificSubmissions,
  fetchStartStudy,
  lastStartLog,
  startSuccess,
} from '../functions/fetchProlificStudies';
import { openProlificStudy } from '../functions/openProlificStudy';
import { configureStore } from '../store';
import {
  accInfoUpdate,
  prolificErrorUpdate,
  prolificStudiesUpdate,
  prolificSubmissionsUpdate,
} from '../store/prolific/actions';
import { appendLogAction, sessionLastChecked, spammerAction } from '../store/session/actions';
import { prolificStudiesUpdateMiddleware } from '../store/prolificStudiesUpdateMiddleware';
import { settingsAlertSoundMiddleware } from '../store/settingsAlertSoundMiddleware';
import { authProlific } from '../functions/authProlific';
import { settingUID, testingAlertSound } from '../store/settings/actions';
import { testAutoStart } from '../functions/centsToGBP';
import { showOKPopup } from '../containers/Popup_Info';
import { firebaseMiddleware } from '../store/firebase/firebaseMiddleware';
import { confirmCompletionMiddleware } from '../store/confirmCompletionMiddleware';
import { getUser, setStatistics } from '../store/firebase/actions';
import {
  incrementStatistic,
  incrementStatistics,
  last_full_stats,
  setStatistic,
  statisticObject,
  transactStatistics,
} from '../functions/firebase';
import { authUrl } from '../functions/GlobalVars';
import * as firebaseAuth from '../functions/firebaseAuth';
import { hasPermissions, valid_version } from '../functions/firebaseAuth';
import { LogObject, LogType, ProlificStudy, StatField, Statistics } from '../types';

const store = configureStore(prolificStudiesUpdateMiddleware, settingsAlertSoundMiddleware, firebaseMiddleware, confirmCompletionMiddleware);
export let authHeader: WebRequest.HttpHeadersItemType;
export let id_token: string;
export let userID = '';
export let acc_info: any = {};

export async function incStat(field: StatField, count: number, isMoney: boolean = false) {
  try {
    await incrementStatistic(field, count, isMoney);
    await store.dispatch(setStatistics(last_full_stats));
  } catch (ex) {
    appendLog(`ERROR while changing statistics - ${field}`, 'error', `ERROR while changing statistics: ${ex}`);
  }
}

export async function setStat(field: StatField, value: number, isMoney: boolean = false) {
  try {
    await setStatistic(field, value, isMoney);
    await store.dispatch(setStatistics(last_full_stats));
  } catch (ex) {
    appendLog(`ERROR while changing statistics - ${field}`, 'error', `ERROR while changing statistics: ${ex}`);
  }
}

export async function incStats(fields: StatField[], counts: number[], isMoney: boolean[]) {
  try {
    await incrementStatistics(fields, counts, isMoney);
    await store.dispatch(setStatistics(last_full_stats));
  } catch (ex) {
    appendLog(`ERROR while changing statistics - ${JSON.stringify(fields)}`, 'error', `ERROR while changing statistics: ${ex}`);
  }
}

function doEasterEggStudy(results: any[]) {
  let settings = store.getState().settings;
  if (!((settings.easter_egg && settings.easter_egg['2137']))) return results;
  let date = new Date();
  if (date.getMinutes() >= 37 && date.getMinutes() < 42 && date.getHours() == 21) {
    results.push({
      average_completion_time: 10,
      average_reward_per_hour: 0,
      date_created: '',
      description: 'TEST O PAPIEŻU',
      estimated_completion_time: 5,
      estimated_reward_per_hour: 0,
      id: 'TEST_PAPIEŻ',
      is_desktop_compatible: true,
      is_mobile_compatible: true,
      is_tablet_compatible: true,
      maximum_allowed_time: 60,
      name: 'TEST O PAPIEŻU',
      places_taken: 0,
      published_at: '',
      researcher: {
        id: 'ATOS',
        name: 'ATOS',
        institution: {
          name: null,
          logo: 'https://media-exp1.licdn.com/dms/image/C4D0BAQEBlVbxMm6y1w/company-logo_200_200/0?e=2159024400&v=beta&t=ODEH5hgKobSiRO-zUK8svECatNpFMDxxwMW_l_RtSpU',
          link: '',
        },
      },
      reward: 0,
      study_type: 'SINGLE',
      total_available_places: 1,
    });
  }
  return results;
}

export async function updateResults(results: any[]) {
  results = doEasterEggStudy(results);
  store.dispatch(prolificStudiesUpdate(results));
  store.dispatch(sessionLastChecked());
  await browser.browserAction.setBadgeBackgroundColor({ color: 'red' });
  await browser.browserAction.setBadgeText({ text: results.length ? results.length.toString() : '' });

  if (results.length < 1) {
    await browser.browserAction.setBadgeText({ text: 'OK' });
    await browser.browserAction.setBadgeBackgroundColor({ color: 'lime' });
    appendLog(`${results.length} STUDIES FOUND`, '0-studies', `no studies found.`);
  } else {
    const state = store.getState();
    appendLog(`${results.length} STUDIES FOUND`, 'studies', `${results.length} studies found.`);
    let bestStudy: ProlificStudy;
    results.forEach(el => {
      if (!bestStudy) bestStudy = el;
      if (el.reward > bestStudy.reward) bestStudy = el;
    });
    const settings = store.getState().settings;
    if (bestStudy && bestStudy.id && settings.autostart && results.length > 0 && state.firebase.canUsePA === true) {
      if (!bestStudy.id.includes('TEST')){
        let testRes = testAutoStart(settings.autostart, bestStudy.reward);
        if (testRes === true)
          await fetchStartStudy(authHeader, userID, bestStudy.id, store);
        else if (testRes !== false){
          appendLogObj(testRes);
        }
      }

    }
  }
}

let timeout = window.setTimeout(main);

export function appendLog(log: string, type: LogType, description: string) {
  store.dispatch(appendLogAction({ log, type, description }));
}

export function appendLogObj(log: LogObject) {
  store.dispatch(appendLogAction(log));
}

let freshlyLaunched = false;
async function main() {
  freshlyLaunched = true;
  setInterval(FastUpdate, 1000);
  Update();
}

async function Update() {
  const state = store.getState();
  clearTimeout(timeout);
  try {
    await _Update();
    await incStat('refreshes', 1);
  } catch (ex) {
    console.error(ex);
  }
  timeout = window.setTimeout(Update, state.settings.check_interval * 1000);
}

let fastUpdateIndex = 0;
let spammerIndex = 0;
let statisticSpammerCountQueue = 0;

async function FastUpdate() {
  fastUpdateIndex += 1;
  if (fastUpdateIndex > 512) fastUpdateIndex = 0;
  const state = store.getState();

  if (state.firebase.canUsePA !== true) {
    await browser.browserAction.setBadgeBackgroundColor({ color: 'orange' });
    await browser.browserAction.setBadgeText({ text: 'noa' });
  } else {
    if (await browser.browserAction.getBadgeText({}) === 'noa') {
      await browser.browserAction.setBadgeBackgroundColor({ color: 'green' });
      await browser.browserAction.setBadgeText({ text: 'IDL' });
    }
    if(freshlyLaunched){
      await incStat("launches",1);
      freshlyLaunched = false;
    }
  }

  if (firebaseAuth.auth.currentUser && (valid_version === undefined || hasPermissions === undefined)) {
    store.dispatch(getUser());
  }

  let spammerRes = await SpammerUpdate();
  if (statisticSpammerCountQueue > 15 || (!spammerRes && statisticSpammerCountQueue > 0)) {
    await incStat('spammer_count', statisticSpammerCountQueue);
    statisticSpammerCountQueue = 0;
  }
}

async function SpammerUpdate():Promise<boolean>{
  const state = store.getState();
  const spammer = state.session.spammer_conf;
  //console.log("update")
  if (state.firebase.canUsePA !== true || !authHeader || !userID || !spammer.studies || Object.keys(spammer.studies).length <= 0) {
    spammerIndex = 0;
    return false;
  }

  let active_studies = Object.keys(spammer.studies).reduce((prev, curr) => {
    if (spammer.studies[curr].enabled) prev.push(curr);
    return prev;
  }, []);
  if (active_studies.length <= 0) return false;

  let studyID = active_studies[spammerIndex % active_studies.length];
  await fetchStartStudy(authHeader, userID, studyID, store);
  spammerIndex += 1;
  statisticSpammerCountQueue += 1;
  if (startSuccess) {
    store.dispatch(spammerAction({
      type: 'output',
      studyID,
      data: {
        error: lastStartLog,
        success: startSuccess,
        iterations: state.session.spammer_output.studies[studyID].iterations + 1,
      },
    }));
    store.dispatch(spammerAction({ type: 'config', studyID, data: { enabled: false } }));
    store.dispatch(testingAlertSound());
  } else {
    store.dispatch(spammerAction({
      type: 'output',
      studyID,
      data: {
        error: lastStartLog,
        success: startSuccess,
        iterations: state.session.spammer_output.studies[studyID].iterations + 1,
      },
    }));
  }
  return true;
}

async function _Update() {
  const state = store.getState();
  try {
    await browser.browserAction.setBadgeText({ text: '...' });
    await browser.browserAction.setBadgeBackgroundColor({ color: 'orange' });

    if (authHeader) {
      try {
        const response = await fetchProlificStudies(authHeader);
        await browser.browserAction.setBadgeText({ text: 'ERR' });
        await browser.browserAction.setBadgeBackgroundColor({ color: 'black' });


        if (response.error) {
          if (response.error.status === 401) {
            store.dispatch(prolificErrorUpdate(401));
            await browser.browserAction.setBadgeText({ text: '!' });
            await browser.browserAction.setBadgeBackgroundColor({ color: 'red' });
            appendLog('AUTHENTICATION ERROR', 'error', `ERROR 401 Occurred\n${JSON.stringify(response.error)}`);
            appendLogObj(await authProlific());
          } else {
            store.dispatch(prolificStudiesUpdate([]));
            await browser.browserAction.setBadgeText({ text: 'ERR' });
            await browser.browserAction.setBadgeBackgroundColor({ color: 'black' });
            appendLog('OTHER ERROR', 'error', `Unknown ERROR Occurred\n${JSON.stringify(response.error)}`);
            appendLogObj(await authProlific());
          }
        } else {
          await browser.browserAction.setBadgeText({ text: 'OK' });
          await browser.browserAction.setBadgeBackgroundColor({ color: 'lime' });
          appendLog('OK!', 'status', `Everything seems to be fine`);
        }

        if (response.results) {
          await updateResults(response.results);
        }
        if (userID) {
          acc_info = await fetchProlificAccount(authHeader, userID);
          if (state.settings.easter_egg && state.settings.easter_egg.atos) {
            acc_info.status = 'SHADOWBANNED';
          }

          if (!acc_info.id || acc_info.id == !userID) {
            if (await checkUserID(authHeader, state.settings.uid, store)) {
              userID = state.settings.uid;
            }
          }
          store.dispatch(accInfoUpdate(acc_info));
        } else {
          if (await checkUserID(authHeader, state.settings.uid, store)) {
            userID = state.settings.uid;
            appendLog(`Successfully Gathered Prolific ID from settings`, 'success', `Successfully Gathered Prolific ID from settings\nID: ${state.settings.uid}`);
          } else {
            appendLog('Prolific ID from settings is invalid', 'error', `Prolific ID from settings is invalid. \nID: ${state.settings.uid}`);
          }
        }

        if (userID) {
          let response = await fetchProlificSubmissions(authHeader, userID);
          console.log(response);
          if (response.results) {
            store.dispatch(prolificSubmissionsUpdate(response.results));
          }
          if (response.meta) {
            try {
              let count = response.meta.count;
              let earned = response.meta.total_earned;
              let approved = response.meta.total_approved;
              await transactStatistics((old: Statistics) => {
                old.statistics[`submissions`] = statisticObject(count, false);
                old.statistics[`earned`] = statisticObject(earned, true);
                old.statistics[`approved`] = statisticObject(approved, false);
                return old;
              });
              await store.dispatch(setStatistics(last_full_stats));
            } catch (ex) {
              appendLog(`ERROR while changing statistics - meta`, 'error', `ERROR while changing statistics: ${ex}`);
            }
          }
        }
      } catch (error) {
        store.dispatch(prolificStudiesUpdate([]));
        await browser.browserAction.setBadgeText({ text: 'ERR' });
        await browser.browserAction.setBadgeBackgroundColor({ color: 'black' });
        appendLog(`ERROR - fetchProlificStudies`, 'error', `Exception occurred:\n${error}`);
        window.console.error('fetchProlificStudies error', error);
      }
    } else {
      store.dispatch(prolificErrorUpdate(401));
      await browser.browserAction.setBadgeText({ text: 'ERR' });
      await browser.browserAction.setBadgeBackgroundColor({ color: 'black' });
      appendLog(`ERROR - Auth Header missing`, 'error', `Auth header is missing`);
      appendLogObj(await authProlific());
    }
  } catch (e) {
    console.error(e);
  }
}

browser.notifications.onClicked.addListener(async (notificationId) => {
  await browser.notifications.clear(notificationId);
  openProlificStudy(notificationId);
});

function handleSignedOut() {
  authHeader = null;
  updateResults([]);
  store.dispatch(prolificErrorUpdate(401));
}

// Watch for url changes and handle sign out
browser.webNavigation.onCompleted.addListener(
  () => {
    handleSignedOut();
  },
  {
    url: [{ urlEquals: 'https://internal-api.prolific.co/auth/accounts/login/' }],
  },
);

// Prolific is a single page app, so we need to watch
// the history state for changes too
browser.webNavigation.onHistoryStateUpdated.addListener(
  () => {
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
        Update();
      }
    }

    return {};
  },
  {
    urls: ['https://internal-api.prolific.co/*'],
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
    urls: ['https://internal-api.prolific.co/api/v1/users/*'],
  }, ['blocking'],
);

browser.runtime.onMessage.addListener((message) => {
  if (message === 'check_for_studies') {
    Update();
  }
  if (message === 'check_for_studies-cuid') {
    Update();
    if (userID == store.getState().settings.uid) {
      showOKPopup(`Prolific ID Changed to:\n${userID}`);
    } else {
      showOKPopup(`Prolific ID is Invalid:\n${store.getState().settings.uid}`);
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
          Update();
        }
      });
    }
  },
  {
    urls: ['https://internal-api.prolific.co/*'],
  }, ['responseHeaders'],
);

async function UIDfromUrl(url: string) {
  let userID_t = url.split('users')[1].replace('/', '').replace('/', '');
  if (!acc_info) {
    acc_info = await fetchProlificAccount(authHeader, userID);
    store.dispatch(accInfoUpdate(acc_info));
  }
  if (userID_t && userID_t.length > 0) {
    store.dispatch(settingUID(userID_t));
    userID = userID_t;
    if (store.getState().settings.uid != userID) {
      appendLog(`Automatically Gathered UserID from HTTP request`, 'success', `Automatically Gathered UserID from HTTP request: ${userID}`);
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
      appendLog(`Automatically Gathered UserID from HTTP request`, 'success', `Automatically Gathered UserID from HTTP request: ${userID}`);
    }
  }
}