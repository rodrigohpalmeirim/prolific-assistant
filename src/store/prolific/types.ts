import { FullProlificStudy, ProlificStudy, ProlificSubmission, SharedProlificStudy } from '../../types';

export interface ProlificState {
  submissions: ProlificSubmission[];
  error: number;
  studies: ProlificStudy[];
  acc_info: any,
  sharedStudies: { available:{[key: string]: {[key:string]:SharedProlificStudy}},own:SharedProlificStudy|{},claimed:any },
}

export const PROLIFIC_ERROR_UPDATE = 'PROLIFIC_ERROR_UPDATE';
export const PROLIFIC_STUDIES_UPDATE = 'PROLIFIC_STUDIES_UPDATE';
export const PROLIFIC_SUBMISSIONS_UPDATE = 'PROLIFIC_SUBMISSIONS_UPDATE';
export const ACC_INFO_UPDATE = 'ACC_INFO_UPDATE';
export const SHARE_STUDY = 'SHARE_STUDY';
export const CLAIM_SHARED_STUDY = 'CLAIM_SHARED_STUDY';
export const READ_SHARED_STUDIES = 'READ_SHARED_STUDIES';
export const CLEAR_CLAIMED_SHARED_STUDIES = 'CLEAR_CLAIMED_SHARED_STUDIES';
export const SET_SHARED_STUDIES = 'SET_SHARED_STUDIES';

export interface ProlificErrorUpdateAction {
  type: typeof PROLIFIC_ERROR_UPDATE;
  payload: number;
}

export interface ProlificStudiesUpdateAction {
  type: typeof PROLIFIC_STUDIES_UPDATE;
  payload: ProlificStudy[];
}

export interface ProlificSubmissionsUpdateAction {
  type: typeof PROLIFIC_SUBMISSIONS_UPDATE;
  payload: ProlificSubmission[];
}

export interface AccInfoUpdateAction {
  type: typeof ACC_INFO_UPDATE;
  payload: ProlificStudy[];
}

export interface ShareStudyAction {
  type: typeof SHARE_STUDY;
  payload: {studyID:string};
}

export interface ClaimSharedStudyAction {
  type: typeof CLAIM_SHARED_STUDY;
  payload: {studyID:string,accountID:string,remoteUserID:string};
}

export interface SetSharedStudiesAction {
  type: typeof SET_SHARED_STUDIES;
  payload: { available:{[key: string]: {[key: string]:SharedProlificStudy}},claimed:any };
}

export interface ReadSharedStudiesAction {
  type: typeof READ_SHARED_STUDIES;
  payload: "",
}

export interface ClearClaimedStudiesAction {
  type: typeof CLEAR_CLAIMED_SHARED_STUDIES;
  payload: "",
}

export type ProlificActionTypes =
  ProlificErrorUpdateAction
  | ProlificStudiesUpdateAction
  | AccInfoUpdateAction
  | ProlificSubmissionsUpdateAction
  | ShareStudyAction
  | ClaimSharedStudyAction
  | SetSharedStudiesAction
  | ReadSharedStudiesAction
  | ClearClaimedStudiesAction
