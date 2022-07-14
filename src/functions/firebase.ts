import { initializeApp } from 'firebase/app';
import { get, getDatabase, ref, set } from 'firebase/database';
import { getFirestore } from 'firebase/firestore';
import { auth } from './firebaseAuth';
import { userID } from '../pages/background';
import { FullStatistics, StatField, Statistic, Statistics } from '../types';

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

export async function writeData(path: string, data: any) {
  if (!auth.currentUser) return;
  const db = getDatabase(app);
  await set(ref(db, `data/${auth.currentUser.uid}/prolific/${path}`), data);
}

export async function readData(path: string) {
  if (!auth.currentUser) return;
  const db = getDatabase(app);
  let snapshot = await get(ref(db, `data/${auth.currentUser.uid}/prolific/${path}`));
  if (snapshot.exists()) {
    return (snapshot.val());
  } else {
    return {};
  }
}

export async function readBulkData(path: string) {
  if (!auth.currentUser) return;
  const db = getDatabase(app);
  let snapshot = await get(ref(db, `data/_bulk/prolific/${path}`));
  if (snapshot.exists()) {
    return (snapshot.val());
  } else {
    return {};
  }
}

export async function writeState(state: any) {
  await writeData('state', state);
}

export let last_full_stats:FullStatistics;
export async function readStatistics(): Promise<Statistics> {
  // @ts-ignore
  last_full_stats = {}
  last_full_stats.this_user = (await readData(`statistics`)) || {};
  last_full_stats.bulk = (await readBulkData(`statistics`)) || {default:{statistics:{}}};
  return last_full_stats.this_user[userID]||{statistics:{}};
}

export async function writeStatistics(stats: Statistics): Promise<Statistics> {
  if(!userID)return stats;
  Object.keys(stats.statistics).forEach((field:StatField)=>{
    if(!stats.statistics[field].lastUpdated){
      stats.statistics[field].lastUpdated = +new Date();
    }
  })
  stats._lastUpdated = +new Date();
  await writeData(`statistics/${userID}`, stats);
  return stats;
}

export async function transactStatistics(cb: { (arg0: Statistics): Statistics; }): Promise<Statistics> {
  return await writeStatistics(cb(await readStatistics()));
}

export async function incrementStatistic(field: StatField, count: number, isMoney:boolean): Promise<Statistics> {
  return await transactStatistics(((old: Statistics) => {
    if (!old.statistics[field]) old.statistics[field] = statisticObject(0,isMoney);
    old.statistics[field].value += count;
    return old;
  }));
}

export async function setStatistic(field: StatField, value: number, isMoney:boolean): Promise<Statistics> {
  return await transactStatistics(((old: Statistics) => {
    old.statistics[field] = statisticObject(value,isMoney);
    return old;
  }));
}

export async function incrementStatistics(fields: StatField[], counts: number[], isMoney:boolean[]): Promise<Statistics> {
  return await transactStatistics(((old: Statistics) => {
    fields.forEach((field,i)=>{
      let count = counts[i];
      if (!old.statistics[field]) old.statistics[field] = statisticObject(0,isMoney[i]);
      old.statistics[field].value += count;
    })

    return old;
  }));
}

export function statisticObject(value:number,isMoney:boolean):Statistic{
  return {value,isMoney,lastUpdated:+new Date()};
}

export const firestore_db = getFirestore();