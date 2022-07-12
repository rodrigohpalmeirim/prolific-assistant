import { appendLog, authHeader, incStat, incStats, setStat, userID } from '../pages/background';
import {  settingUID } from '../store/settings/actions';
import { Store } from 'redux';
import { selectSettings } from '../store/settings/selectors';
import { incrementStatistic } from './firebase';
import {
  fetchAccountInfoUrl,
  fetchStartStudyUrl,
  fetchStudiesUrl,
  fetchStudyUrl,
  fetchSubmissionsUrl,
} from './GlobalVars';

export async function fetchProlificStudies(authHeader: any) {
  const { name, value } = authHeader;
  const headers = { [name]: value };
  // omit credentials here, since auth is handled via the bearer token
  const response = await fetch(fetchStudiesUrl(), { credentials: 'omit', headers });
  const json: ProlificApiStudies = await response.json();
  return json;
}

export async function fetchProlificStudy(authHeader: any, studyID:string) {
  const { name, value } = authHeader;
  const headers = { [name]: value };
  // omit credentials here, since auth is handled via the bearer token
  const response = await fetch(fetchStudyUrl(studyID), { credentials: 'omit', headers });
  const json: ProlificStudy = await response.json();
  return json;
}

export async function fetchProlificAccount(authHeader: any, userID: string) {
  const { name, value } = authHeader;
  const headers = { [name]: value };
  // omit credentials here, since auth is handled via the bearer token
  const response = await fetch(fetchAccountInfoUrl(userID), { credentials: 'omit', headers });
  let json = await response.json();
  if (json.error) {
    appendLog('ERROR while loading user info', 'error', `ERROR while loading user info\nUserID: ${userID}\n STATUS ${response.status}\n ERROR: ${JSON.stringify(json.error)}`);
  } else {
    appendLog('Successfully loaded user info', 'status', `Successfully loaded user info\nUserID: ${userID}\n STATUS ${response.status}`);

  }

  return json;
}

export type fetchProlificSubmissionsType = {results:ProlificStudy[],meta:{count:number,total_approved:number,total_earned:number}}
export async function fetchProlificSubmissions(authHeader: any, userID: string):Promise<fetchProlificSubmissionsType> {
  const { name, value } = authHeader;
  const headers = { [name]: value };
  // omit credentials here, since auth is handled via the bearer token
  const response = await fetch(fetchSubmissionsUrl(userID), {
    credentials: 'omit',
    headers,
  });
  let json = await response.json();
  if (json.error) {
    appendLog('ERROR while reading submissions', 'error', `ERROR while reading submissions\nUSERID: ${userID}\nERROR: ${JSON.stringify(json.error)}\nSTATUS: ${response.status}`);
  } else {
    appendLog('Successfully fetched submissions', 'status', `Successfully fetched submissions\nUSERID: ${userID}\nSTATUS: ${response.status}`);

  }
  return json;
}

export let startSuccess = false;
export let lastStartLog:any = "";

export async function fetchStartStudy(authHeader: any, userID: string, studyID: string,store:any) {
  let url = fetchStartStudyUrl();
  let proxy =selectSettings(store.getState()).proxy;
  if(proxy!=""){
    url = proxy;
  }

  startSuccess = false;
  let req = new XMLHttpRequest();
  req.open('POST', url, false);
  req.setRequestHeader(authHeader.name, authHeader.value);
  req.setRequestHeader('Content-Type', 'application/json');
  req.send(JSON.stringify({
    study_id: studyID,
    participant_id: userID,
  }));
  let json = JSON.parse(req.responseText);
  if (json.error) {
    appendLog(`ERROR while starting study`, 'error', `ERROR while starting study\nSTUDYID: ${studyID}\nUSERID: ${userID}\nERROR: ${JSON.stringify(json.error)}\nSTATUS: ${req.status}`);
    lastStartLog = json.error;
  } else {
    appendLog(`Successfully started study`, 'success', `Successfully started study\nSTUDYID: ${studyID}\nUSERID: ${userID}\nSTATUS: ${req.status}`);
    startSuccess = true;
    lastStartLog = "Success";
    try{
      let startedStudy = await fetchProlificStudy(authHeader,studyID);
      await incStats(["started","total_start_amount"], [1,startedStudy.reward],[false,true]);
    }catch (ex){
      appendLog(`ERROR while changing statistics - fetchStudyReward - total_start_amount`, 'error', `ERROR while changing statistics: ${ex}`);
    }

  }
  return json;
}

export async function checkUserID(authHeader: any, userID: string, store: Store) {
  const { name, value } = authHeader;
  const headers = { [name]: value };
  // omit credentials here, since auth is handled via the bearer token
  if (!userID || !userID.length || userID.length < 1) {
    return false;
  }
  const response = await fetch(fetchAccountInfoUrl(userID), { credentials: 'omit', headers });
  if (response.status == 404) {
    appendLog('ERROR PROLIFIC ID may be Invalid', 'error', `ERROR PROLIFIC ID may be Invalid\nID: ${userID}`);
    return false;
  }
  appendLog('PROLIFIC ID is valid', 'status', `PROLIFIC ID is valid ID: ${userID}`);
  store.dispatch(settingUID(userID));
  return true;
}