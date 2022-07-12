import { initializeApp } from 'firebase/app';
import { get, getDatabase, ref, set } from 'firebase/database';
import { getFirestore } from 'firebase/firestore';
import { auth } from './firebaseAuth';
import { FullStatistics, Statistics, userID } from '../pages/background';

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

export async function writeState(state: any) {
  await writeData('state', state);
}

export let last_full_stats:FullStatistics;
export async function readStatistics(): Promise<Statistics> {
  // @ts-ignore
  last_full_stats = await readData(`statistics`);
  return last_full_stats[userID]||{};
}

export async function writeStatistics(stats: Statistics): Promise<Statistics> {
  if(!userID)return stats;
  await writeData(`statistics/${userID}`, stats);
  return stats;
}

export async function transactStatistics(cb: { (arg0: Statistics): Statistics; }): Promise<Statistics> {
  return await writeStatistics(cb(await readStatistics()));
}

export async function incrementStatistic(field: string, count: number, isMoney:boolean): Promise<Statistics> {
  return await transactStatistics(((old: any) => {
    if (!old[field]) old[field] = {value:0,isMoney};
    old[field].value += count;
    return old;
  }));
}

export async function setStatistic(field: string, count: number, isMoney:boolean): Promise<Statistics> {
  return await transactStatistics(((old: any) => {
    old[field] = {value:count,isMoney};
    return old;
  }));
}

export async function incrementStatistics(fields: string[], counts: number[], isMoney:boolean[]): Promise<Statistics> {
  return await transactStatistics(((old: any) => {
    fields.forEach((field,i)=>{
      let count = counts[i];
      if (!old[field]) old[field] = {value:0,isMoney:isMoney[i]};
      old[field].value += count;
    })

    return old;
  }));
}

export const firestore_db = getFirestore();