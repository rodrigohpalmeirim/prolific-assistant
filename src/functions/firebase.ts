import { initializeApp } from "firebase/app";
import { getDatabase,ref, set, get  } from "firebase/database";
import { getFirestore } from "firebase/firestore";
import { auth } from './firebaseAuth';

const firebaseConfig = {
  apiKey: "AIzaSyCmNeZHXFDSm8Ci4wgbXQYhDeVqS3L98ao",
  authDomain: "mcatosdb.firebaseapp.com",
  projectId: "mcatosdb",
  storageBucket: "mcatosdb.appspot.com",
  messagingSenderId: "1068636696080",
  appId: "1:1068636696080:web:4fa1ac6948aa7f095fe495",
  databaseURL:"https://mcatosdb-default-rtdb.firebaseio.com",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

export async function writeData(path:string, data:any){
  if(!auth.currentUser)return;
  const db = getDatabase(app);
  await set(ref(db, `data/${auth.currentUser.uid}/${path}`), data);
}

export async function readData(path:string){
  if(!auth.currentUser)return;
  const db = getDatabase(app);
  get(ref(db,`data/${auth.currentUser.uid}/${path}`)).then((snapshot) => {
    if (snapshot.exists()) {
      return (snapshot.val());
    } else {
      return {};
    }
  })
  return {};
}

export async function writeState(state:any){
  await writeData("state",state)
}


export const firestore_db = getFirestore();