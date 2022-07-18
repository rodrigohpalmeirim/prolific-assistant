import { getAuth, signInWithEmailAndPassword, signOut, sendPasswordResetEmail } from "firebase/auth";
import * as firebase from "./firebase";
import { app, readNeededVersion } from './firebase';
import { doc, getDoc, setDoc } from "firebase/firestore";

export const auth = getAuth(app);
const pjson = require('../../package.json');

export let valid_version:boolean|undefined = undefined;
export let hasPermissions:boolean|undefined = undefined;
export let lastCanUsePA:string|boolean = "";

export function _canUsePA(){
  if(!valid_version)return "wrong version";
  if(!auth.currentUser)return "not logged in";
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

export async function _canUseProlificAssistant(){
  hasPermissions = !!await checkPermissions("prolific");
  let version_needed = await readNeededVersion();
  valid_version = version_needed.includes(pjson.version);
}

export async function login(username: string, password: string) {
  await signInWithEmailAndPassword(auth, username, password)
  await canUseProlificAssistant();
}

export async function logout() {
  await signOut(auth);
  await canUseProlificAssistant();
}

export async function getAccountList() {
  let sn = await getDoc(doc(firebase.firestore_db, "indexes", "accounts"));
  return sn.data();
}

export async function getAccount(uid: string) {
  let sn = await getDoc(doc(firebase.firestore_db, "accounts", uid));
  return sn.data();
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