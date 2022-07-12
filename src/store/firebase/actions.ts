import { AppState } from '../index';
import { FullStatistics, Statistics } from '../../pages/background';

export function selectFirebase(state: AppState) {
  return state.firebase;
}

export function selectUser(state: AppState) {
  return state.firebase.currentUser;
}


export const FIREBASE_LOGIN = 'FIREBASE_LOGIN';

export interface firebaseLoginAction {
  type: typeof FIREBASE_LOGIN;
  payload: { email: string, password: string };
}

export function firebaseLogin(payload: { email: string, password: string }) {
  return {
    type: FIREBASE_LOGIN,
    payload,
  };
}

export const FIREBASE_LOGOUT = 'FIREBASE_LOGOUT';

export interface firebaseLogoutAction {
  type: typeof FIREBASE_LOGOUT;
  payload: '';
}

export function firebaseLogout() {
  return {
    type: FIREBASE_LOGOUT,
    payload: '',
  };
}

export const READ_PREFERENCES = 'READ_PREFERENCES';

export interface readPreferencesAction {
  type: typeof READ_PREFERENCES;
  payload: '';
}

export function readPreferences() {
  return {
    type: READ_PREFERENCES,
    payload: '',
  };
}

export const SET_PREFERENCES = 'SET_PREFERENCES';

export interface setPreferencesAction {
  type: typeof SET_PREFERENCES;
  payload: any;
}

export function setPreferences(payload: any) {
  return {
    type: SET_PREFERENCES,
    payload,
  };
}

export const UPLOAD_PREFERENCES = 'UPLOAD_PREFERENCES';

export interface uploadPreferencesAction {
  type: typeof UPLOAD_PREFERENCES;
  payload: any;
}

export function uploadPreferences() {
  return {
    type: UPLOAD_PREFERENCES,
    payload: '',
  };
}


export const GET_USER = 'GET_USER';

export interface getUserAction {
  type: typeof GET_USER;
  payload: any;
}

export function getUser() {
  return {
    type: GET_USER,
    payload: '',
  };
}

export const SET_USER = 'SET_USER';

export interface setUserAction {
  type: typeof SET_USER;
  payload: "";
}

export function setUser() {
  return {
    type: SET_USER,
    payload: "",
  };
}

export const SET_STATISTICS = 'SET_STATISTICS';

export interface setStatisticsAction {
  type: typeof SET_STATISTICS;
  payload: FullStatistics;
}

export function setStatistics(payload:FullStatistics) {
  return {
    type: SET_STATISTICS,
    payload,
  };
}


export type FirebaseActionTypes =
  readPreferencesAction
  | firebaseLoginAction
  | setPreferencesAction
  | getUserAction
  | uploadPreferencesAction
  | setUserAction
| setStatisticsAction