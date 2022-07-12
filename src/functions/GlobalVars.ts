//export const studyImg = "https://app.prolific.co/assets/default_study_icon.2850c668.svg";
export const studyImg = "https://media.discordapp.net/attachments/744190749209395301/787437102131707914/Icon.png"
export let authUrl = 'https://internal-api.prolific.co/openid/authorize?client_id=447610&redirect_uri=https%3A%2F%2Fapp.prolific.co%2Fsilent-renew.html&response_type=id_token%20token&scope=openid%20profile&state=state&nonce=nonce';

export function fetchStudyUrl(studyID:string) {
  return `https://internal-api.prolific.co/api/v1/studies/${studyID}/`
}

export function fetchStudiesUrl(){
  return 'https://internal-api.prolific.co/api/v1/studies/?current=1';
}

export function fetchAccountInfoUrl(userID:string){
  return `https://internal-api.prolific.co/api/v1/users/${userID}/`
}

export function fetchSubmissionsUrl(userID:string,page:number=1){
  return `https://internal-api.prolific.co/api/v1/submissions/?participant=${userID}&page=${page}`
}

export function fetchStartStudyUrl(){
  return 'https://internal-api.prolific.co/api/v1/submissions/'
}