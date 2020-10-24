import { appendLog } from '../pages/background';
import { settingUID } from '../store/settings/actions';
import { Store } from 'redux';

export async function fetchProlificStudies(authHeader: any) {
  const { name, value } = authHeader;
  const headers = { [name]: value };
  // omit credentials here, since auth is handled via the bearer token
  const response = await fetch('https://www.prolific.co/api/v1/studies/?current=1', { credentials: 'omit', headers });
  const json: ProlificApiStudies = await response.json();
  return json;
}

export async function fetchProlificAccount(authHeader: any, userID: string) {
  const { name, value } = authHeader;
  const headers = { [name]: value };
  // omit credentials here, since auth is handled via the bearer token
  const response = await fetch(`https://www.prolific.co/api/v1/users/${userID}/`, { credentials: 'omit', headers });
  let json = await response.json();
  if (json.error) {
    appendLog('ERROR while loading user info', 'error', `ERROR while loading user info\nUserID: ${userID}\n STATUS ${response.status}\n ERROR: ${JSON.stringify(json.error)}`);
  } else {
    appendLog('Successfully loaded user info', 'status', `Successfully loaded user info\nUserID: ${userID}\n STATUS ${response.status}`);

  }
  return json;
}

export async function fetchProlificSubmissions(authHeader: any, userID: string) {
  const { name, value } = authHeader;
  const headers = { [name]: value };
  // omit credentials here, since auth is handled via the bearer token
  const response = await fetch(`https://www.prolific.co/api/v1/submissions/?participant=${userID}&page=1`, {
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

export async function fetchStartStudy(authHeader: any, userID: string, studyID: string) {
  let url = 'https://www.prolific.co/api/v1/submissions/';

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
  } else {
    appendLog(`Successfully started study`, 'success', `Successfully started study\nSTUDYID: ${studyID}\nUSERID: ${userID}\nSTATUS: ${req.status}`);
  }

  console.log(json);
  return json;
}

export async function checkUserID(authHeader: any, userID: string, store: Store) {
  const { name, value } = authHeader;
  const headers = { [name]: value };
  // omit credentials here, since auth is handled via the bearer token
  if (!userID || !userID.length || userID.length < 1) {
    return false;
  }
  const response = await fetch(`https://www.prolific.co/api/v1/users/${userID}/`, { credentials: 'omit', headers });
  if (response.status == 404) {
    appendLog('ERROR PROLIFIC ID may be Invalid', 'error', `ERROR PROLIFIC ID may be Invalid\nID: ${userID}`);
    return false;
  }
  appendLog('PROLIFIC ID is valid', 'status', `PROLIFIC ID is valid ID: ${userID}`);
  store.dispatch(settingUID(userID));
  return true;
}

