import * as firebaseAuth from "firebase/auth";
import { getAuth, signInWithEmailAndPassword, signOut, sendPasswordResetEmail } from "firebase/auth";
import * as firebase from "./firebase";
import { app } from "./firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";

export const auth = getAuth(app);
const pjson = require('../../package.json');

export let valid_version = false;
export let hasPermissions = false;
export let lastCanUsePA:string|boolean = "";

export function preSetPA(){
  valid_version = true;
  hasPermissions = true;
  lastCanUsePA = true;
}

export function _canUsePA(){
  if(!auth.currentUser)return "not logged in";
  if(!valid_version)return "wrong version";
  if(!hasPermissions)return "no permissions";
  return true;
}

export function canUsePA(){
  lastCanUsePA = _canUsePA();
  return lastCanUsePA;
}

export async function canUseProlificAssistant(){
  await _canUseProlificAssistant();
  return canUsePA();
}

export function canUseProlificAssistantCB(cb:any){
  canUseProlificAssistant().then(cb).catch(cb);
}

export async function _canUseProlificAssistant(){
  hasPermissions = !!await checkPermissions("prolific");
  let package_json:any = await fetch("https://raw.githubusercontent.com/dommilosz/prolific-assistant/master/package.json", {
    "method": "GET",
  });
  package_json = await package_json.json();
  valid_version = package_json.version === pjson.version;
}

export async function login(username: string, password: string) {
  await signInWithEmailAndPassword(auth, username, password)
  await canUseProlificAssistant();
}

export async function logout() {
  return await signOut(auth);
}

export async function getAccountList() {
  let sn = await getDoc(doc(firebase.firestore_db, "indexes", "accounts"));
  return sn.data();
}

export async function getAccount(uid: string) {
  let sn = await getDoc(doc(firebase.firestore_db, "accounts", uid));
  return sn.data();
}

export async function unlinkAccount(uid: any) {
  try {
    let resp = await fetch('https://mc.atos.mooo.com:21370/firebase/functions/accountDelete', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ token: await getAuthToken(), uid: uid })
    });
    const content = await resp.json();
    if (content.success !== true) {
      throw content.response;
    }
  } catch (ex) {
    throw ("Error during account unlinking. " + ex);
  }
}

export async function getAuthToken() {
  let originalUser = auth.currentUser
  return (await originalUser?.getIdToken());
}

export async function resetPassword(email: string) {
  try {
    await sendPasswordResetEmail(auth, email);
  } catch (ex) {
    throw `Error while sending reset link: ${ex}`;
  }
}

export async function getAccountData() {
  let uid = auth.currentUser?.uid;
  if (uid === undefined) return undefined;
  return (await getDoc(doc(firebase.firestore_db, "accounts", uid))).data();
}

export async function getUserPreferences() {
  let uid = auth.currentUser?.uid;
  if (uid === undefined) return undefined;
  return (await getDoc(doc(firebase.firestore_db, "accounts_preferences", uid))).data();
}

export async function setUserPreferences(prefs: any) {
  let uid = auth.currentUser?.uid;
  if (uid === undefined) return undefined;
  return (await setDoc(doc(firebase.firestore_db, "accounts_preferences", uid), prefs));
}

export async function checkPermissions(perms: string) {
  let accdata = await getAccountData();

  if (accdata === undefined) return 0;
  if (!accdata.permissions)
    return 0;
  if (accdata.permissions === true) return 1;

  let obj = accdata.permissions;
  let perma = perms.split('.');
  for (const perm of perma) {
    if (obj === undefined) break;
    if (obj[perm] === true) return 1;
    obj = obj[perm];
  }
  return 0;
}