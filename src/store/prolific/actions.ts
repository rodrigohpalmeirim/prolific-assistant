import {
  ACC_INFO_UPDATE,
  AccInfoUpdateAction,
  CLAIM_SHARED_STUDY,
  ClaimSharedStudyAction, CLEAR_CLAIMED_SHARED_STUDIES, ClearClaimedStudiesAction,
  PROLIFIC_ERROR_UPDATE,
  PROLIFIC_STUDIES_UPDATE,
  PROLIFIC_SUBMISSIONS_UPDATE,
  ProlificErrorUpdateAction,
  ProlificStudiesUpdateAction,
  ProlificSubmissionsUpdateAction,
  READ_SHARED_STUDIES, ReadSharedStudiesAction,
  SET_SHARED_STUDIES,
  SetSharedStudiesAction,
  SHARE_STUDY,
  ShareStudyAction,
} from './types';

export function prolificErrorUpdate(payload: ProlificErrorUpdateAction['payload']): ProlificErrorUpdateAction {
  return {
    type: PROLIFIC_ERROR_UPDATE,
    payload,
  };
}

export function prolificStudiesUpdate(payload: ProlificStudiesUpdateAction['payload']): ProlificStudiesUpdateAction {
  return {
    type: PROLIFIC_STUDIES_UPDATE,
    payload,
  };
}

export function prolificSubmissionsUpdate(payload: ProlificSubmissionsUpdateAction['payload']): ProlificSubmissionsUpdateAction {
  return {
    type: PROLIFIC_SUBMISSIONS_UPDATE,
    payload,
  };
}

export function accInfoUpdate(payload: AccInfoUpdateAction['payload']): AccInfoUpdateAction {
  return {
    type: ACC_INFO_UPDATE,
    payload,
  };
}

export function shareStudy(payload: ShareStudyAction['payload']): ShareStudyAction {
  return {
    type: SHARE_STUDY,
    payload,
  };
}

export function claimSharedStudy(payload: ClaimSharedStudyAction['payload']): ClaimSharedStudyAction {
  return {
    type: CLAIM_SHARED_STUDY,
    payload,
  };
}

export function setSharedStudies(payload: SetSharedStudiesAction['payload']): SetSharedStudiesAction {
  return {
    type: SET_SHARED_STUDIES,
    payload,
  };
}

export function readSharedStudies(): ReadSharedStudiesAction {
  return {
    type: READ_SHARED_STUDIES,
    payload:"",
  };
}

export function clearClaimedSharedStudy(): ClearClaimedStudiesAction {
  return {
    type: CLEAR_CLAIMED_SHARED_STUDIES,
    payload:"",
  };
}