import { appendLog } from '../pages/background';

export async function fetchProlificStudies(authHeader: any) {
  const { name, value } = authHeader
  const headers = { [name]: value }
  // omit credentials here, since auth is handled via the bearer token
  const response = await fetch('https://www.prolific.co/api/v1/studies/?current=1', { credentials: 'omit', headers });
  const json: ProlificApiStudies = await response.json();
  return json;
}

export async function fetchProlificAccount(authHeader: any,userID:string) {
  const { name, value } = authHeader
  const headers = { [name]: value }
  // omit credentials here, since auth is handled via the bearer token
  const response = await fetch(`https://www.prolific.co/api/v1/users/${userID}/`, { credentials: 'omit', headers });
  return await response.json();
}

export async function fetchStartStudy(authHeader: any,userID:string,studyID:string) {
  const { name, value } = authHeader
  let url = 'https://www.prolific.co/api/v1/submissions/'
  const headers = { [name]: value }
  let req = new XMLHttpRequest();
  req.open('POST',url,false)
  req.setRequestHeader(authHeader.name,authHeader.value)
  req.setRequestHeader('Content-Type','application/json')
  req.send(JSON.stringify({
    study_id:studyID,
    participant_id:userID
  }))
  let json = JSON.parse(req.responseText);
  let state = json.error?'error':'success';
  let log = `Starting Study ${studyID} STATUS:${req.status}`
  if(state==='error')log = 'ERROR - '+log+` ERRCODE: ${json.error.error_code}`
  appendLog(log,state)
  console.log(json)
  return json
}

