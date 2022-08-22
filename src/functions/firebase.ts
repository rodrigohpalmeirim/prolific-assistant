import { initializeApp } from 'firebase/app';
import { get, getDatabase, ref, set } from 'firebase/database';
import { getFirestore } from 'firebase/firestore';
import { auth } from './firebaseAuth';
import { store, userID } from '../pages/background';
import { FullProlificStudy, FullStatistics, SharedProlificStudy, StatField, Statistic, Statistics } from '../types';
import { onValue, Unsubscribe } from '@firebase/database';

const firebaseConfig = {
  apiKey: 'AIzaSyCmNeZHXFDSm8Ci4wgbXQYhDeVqS3L98ao',
  authDomain: 'mcatosdb.firebaseapp.com',
  projectId: 'mcatosdb',
  storageBucket: 'mcatosdb.appspot.com',
  messagingSenderId: '1068636696080',
  appId: '1:1068636696080:web:4fa1ac6948aa7f095fe495',
  databaseURL: 'https://mcatosdb-default-rtdb.firebaseio.com',
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

export const FIREBASE_DATA_VERSION = 2;

export function firebaseRootPath() {
  return `data/v${FIREBASE_DATA_VERSION}/prolific`;
}

export function firebasePath(accountID: string, path: string) {
  return `${firebaseRootPath()}/${accountID}/${path}`;
}

export async function writeData(path: string, data: any) {
  if (store.getState()?.firebase?.canUsePA !== true) throw new Error('extension not authenticated');
  const db = getDatabase(app);
  await set(ref(db, firebasePath(auth.currentUser.uid, path)), data);
}

export function readSnapshot(snapshot:any){
  if (snapshot.exists()) {
    return (snapshot.val());
  } else {
    return {};
  }
}

export async function readData(path: string) {
  if (store.getState()?.firebase?.canUsePA !== true) throw new Error('extension not authenticated');

  const db = getDatabase(app);
  let snapshot = await get(ref(db, firebasePath(auth.currentUser.uid, path)));
  if (snapshot.exists()) {
    return (snapshot.val());
  } else {
    return {};
  }
}

export function attachDataReader(path: string, cb: (data: any) => unknown, errorCb: (error: Error) => unknown): Unsubscribe {
  if (store.getState()?.firebase?.canUsePA !== true) throw new Error('extension not authenticated');

  const db = getDatabase(app);
  return onValue(ref(db, firebasePath(auth.currentUser.uid, path)), (snapshot) => {
    if (snapshot.exists()) {
      cb(snapshot.val());
    } else {
      return {};
    }
  }, errorCb);
}

export async function readBulkData(path: string) {
  if (!auth.currentUser) return;
  const db = getDatabase(app);
  let snapshot = await get(ref(db, firebasePath('_bulk', path)));
  if (snapshot.exists()) {
    return (snapshot.val());
  } else {
    return {};
  }
}

export async function writeState(state: any) {
  if (!userID) return;
  state._lastUpdated = +new Date();
  await writeData(`state/${userID}/current/`, JSON.parse(JSON.stringify(state)));
}

export async function writeShare(study: FullProlificStudy | {}) {
  if (store.getState()?.firebase?.canUsePA !== true) throw new Error('extension not authenticated');
  if (!userID) return;
  const db = getDatabase(app);
  await set(ref(db, firebaseRootPath()+`/_share/${auth.currentUser.uid}/${userID}/shared`), JSON.parse(JSON.stringify(study)));
}

export async function readShare():Promise<{ [key: string]: {[key: string]:SharedProlificStudy} }> {
  if (store.getState()?.firebase?.canUsePA !== true) throw new Error('extension not authenticated');
  if (!userID) return;
  const db = getDatabase(app);
  let res:any = readSnapshot(await get(ref(db, firebaseRootPath()+"/_share/")));
  let pres:any = {};
  Object.keys(res).filter(accID=>{
    return !!(res[accID])
  }).forEach(accID=>{
    Object.keys(res[accID]).filter(userID=>{
      return !!(res[accID][userID] && res[accID][userID].shared)
    }).forEach(userID=>{
      if(!pres[accID])pres[accID] = {};
      pres[accID][userID] = res[accID][userID].shared;
    })
  })
  Object.keys(res).forEach(accID=>{
    Object.keys(res[accID]).forEach(userID=>{
      if(res[accID][userID]?.claimed){
        try{
          pres[res[accID][userID]?.claimed?.accountID][res[accID][userID]?.claimed.remoteUserID].claimed = true;
          pres[res[accID][userID]?.claimed?.accountID][res[accID][userID]?.claimed.remoteUserID].claimed_by = accID;
        }catch{

        }
      }
    })
  })
  return pres;
}

export async function readOwnClaimed():Promise<{userID:string,accountID:string,studyID:string,remoteUserID:string}>{
  if (store.getState()?.firebase?.canUsePA !== true) throw new Error('extension not authenticated');
  if (!userID) return;
  const db = getDatabase(app);
  // @ts-ignore
  return readSnapshot(await get(ref(db, firebaseRootPath()+`/_share/${auth.currentUser.uid}/${userID}/claimed`)));
}

export async function claimStudy(accountID:string,remoteUserID:string,studyID:string){
  if (store.getState()?.firebase?.canUsePA !== true) throw new Error('extension not authenticated');
  if (!userID) return;
  const db = getDatabase(app);
  await set(ref(db, firebaseRootPath()+`/_share/${auth.currentUser.uid}/${userID}/claimed`), {userID,accountID,studyID,remoteUserID});
}

export async function clearDispatch() {
  if (!userID) return;
  await writeData(`state/${userID}/dispatch/`, { type: '', payload: '' });
}

export async function readDispatch(): Promise<{ type: string, payload: any }> {
  if (!userID) return;
  return await readData(`state/${userID}/dispatch/`);
}

export let dispatchListener: Unsubscribe;

export function attachDispatchListener() {
  if (dispatchListener) return;
  if (!userID) return;

  dispatchListener = attachDataReader(`state/${userID}/dispatch/`, processDispatch, () => {
    dispatchListener();
    dispatchListener = undefined;
  });
}

export async function processDispatch(dispatch: any) {
  if (store.getState()?.firebase?.canUsePA !== true) throw new Error('extension not authenticated');

  if (dispatch.type && dispatch.payload) {
    store.dispatch({ type: dispatch.type, payload: dispatch.payload });
    await writeState(store.getState());
    await clearDispatch();
  }
}

export let last_full_stats: FullStatistics;

export async function readStatistics(): Promise<Statistics> {
  last_full_stats = { this_user: {}, bulk: { default: { statistics: {} } } };
  last_full_stats.this_user = (await readData(`statistics`)) || {};
  last_full_stats.bulk = (await readBulkData(`statistics`)) || { default: { statistics: {} } };

  if (!last_full_stats?.this_user || !last_full_stats.this_user[userID]) return undefined;
  return last_full_stats.this_user[userID];
}

export async function writeStatistics(stats: Statistics): Promise<Statistics> {
  if (!userID) return stats;
  Object.keys(stats.statistics).forEach((field: StatField) => {
    if (!stats.statistics[field].lastUpdated) {
      stats.statistics[field].lastUpdated = +new Date();
    }
  });
  stats._lastUpdated = +new Date();
  await writeData(`statistics/${userID}`, stats);
  return stats;
}

export async function transactStatistics(cb: { (arg0: Statistics): Statistics; }): Promise<Statistics> {
  if (store.getState()?.firebase?.canUsePA !== true) throw new Error('extension not authenticated');
  return await writeStatistics(cb(await readStatistics()));
}

export async function incrementStatistic(field: StatField, count: number, isMoney: boolean): Promise<Statistics> {
  return await transactStatistics(((old: Statistics) => {
    if (!old.statistics[field]) old.statistics[field] = statisticObject(0, isMoney);
    old.statistics[field] = statisticObject(old.statistics[field].value + count, isMoney);
    return old;
  }));
}

export async function setStatistic(field: StatField, value: number, isMoney: boolean): Promise<Statistics> {
  return await transactStatistics(((old: Statistics) => {
    old.statistics[field] = statisticObject(value, isMoney);
    return old;
  }));
}

export async function incrementBulkStatistics(fields: StatField[], counts: number[], isMoney: boolean[]): Promise<Statistics> {
  return await transactStatistics(((old: Statistics) => {
    fields.forEach((field, i) => {
      let count = counts[i];
      if (!old.statistics[field]) old.statistics[field] = statisticObject(0, isMoney[i]);
      old.statistics[field] = statisticObject(old.statistics[field].value + count, isMoney[i]);
    });

    return old;
  }));
}

export async function setBulkStatistics(fields: StatField[], values: number[], isMoney: boolean[]): Promise<Statistics> {
  return await transactStatistics(((old: Statistics) => {
    fields.forEach((field, i) => {
      let value = values[i];
      old.statistics[field] = statisticObject(value, isMoney[i]);
    });

    return old;
  }));
}

export function statisticObject(value: number, isMoney: boolean): Statistic {
  return { value, isMoney, lastUpdated: +new Date() };
}

export async function readNeededVersion() {
  if (!auth.currentUser) return;
  const db = getDatabase(app);
  let snapshot = await get(ref(db, firebasePath('_version', '')));
  if (snapshot.exists()) {
    return (snapshot.val());
  } else {
    return '';
  }
}

export const firestore_db = getFirestore();