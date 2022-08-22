import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Form from 'react-bootstrap/Form';
import Tab from 'react-bootstrap/Tab';
import { selectSettings } from '../../store/settings/selectors';
import Button from 'react-bootstrap/Button';
import { selectProlific } from '../../store/prolific/selectors';
import { claimSharedStudy, clearClaimedSharedStudy, readSharedStudies, shareStudy } from '../../store/prolific/actions';
import { StudyCard } from '../StudiesPane';
import { useAsyncDispatch } from '../../pages/popup';
import { FullProlificStudy } from '../../types';

export function StudySharing() {
  const dispatch = useDispatch();
  const settings = useSelector(selectSettings);
  const prolific = useSelector(selectProlific);

  let activeStudy = prolific?.acc_info?.active_study_id;
  let ownStudy: FullProlificStudy = prolific?.sharedStudies?.own as FullProlificStudy;
  let claimedStudy: FullProlificStudy = ((prolific?.sharedStudies?.available ?? {})[prolific?.sharedStudies?.claimed?.accountID] ?? {})[prolific?.sharedStudies?.claimed?.remoteUserID];

  function _shareStudy(studyID: string) {
    dispatch(shareStudy({ studyID }));
  }

  return (
    <Tab.Pane className="p-1 StudySharing" eventKey="StudySharing">
      <Form.Group>
        <Form.Label>Active study: {activeStudy ?? 'Not active'}</Form.Label>
      </Form.Group>
      <Form.Group>
        {activeStudy ? (
          <Button className="mx-2" onClick={() => {
            // @ts-ignore
            _shareStudy(activeStudy);
          }}>
            Share Current Study
          </Button>) : <></>}
      </Form.Group>
      <Button className="mx-2" onClick={() => {
        dispatch(readSharedStudies());
      }}>Refresh</Button>
      <Form.Group>
        Active Sharing study:
        {ownStudy?.id ? (
          <OwnSharedStudyCard study={ownStudy} />) : <></>}
      </Form.Group>
      <Form.Group>
        Active Claimed study:
        {claimedStudy ? (<ClaimedStudyCard study={claimedStudy} accID={prolific?.sharedStudies?.claimed?.accountID}
                                           userID={prolific?.sharedStudies?.claimed?.remoteUserID} />) : <></>}
      </Form.Group>
      <Form.Group>
        Available Studies:
        {Object.keys(prolific?.sharedStudies?.available ?? {}).filter((acc) => {
          return !!(prolific?.sharedStudies?.available && prolific?.sharedStudies?.available[acc]);
        }).map(acc => {
          return Object.keys(prolific?.sharedStudies?.available[acc]).filter(userID => {
            return !!(prolific?.sharedStudies?.available[acc][userID] && prolific?.sharedStudies?.available[acc][userID].id&& !(prolific?.sharedStudies?.available[acc][userID].claimed) );
          }).map((userID) => {
            let study = prolific?.sharedStudies?.available[acc][userID];
            return <SharedStudyCard study={study} accID={acc} userID={userID} />;
          });
        })}
      </Form.Group>
    </Tab.Pane>
  );
}

export function OwnSharedStudyCard({ study }: { study: FullProlificStudy }) {
  const asyncDispatch = useAsyncDispatch();
  return <div style={{ display: 'flex' }}>
    <div style={{ width: 'calc( 100% - 100px )' }}>
      <StudyCard study={study} />
    </div>
    <div style={{ display: 'flex', flexDirection: 'column', width:"200px" }}>
      {study.claimed_by ? (<><span>Claimed by: </span>
        <br />
        <span style={{fontSize: '12px', fontFamily: 'Consolas'}}>{study.claimed_by}</span></>) : <>Not claimed</>}
      <Button style={{ width: '200px', height: '40px', alignSelf: 'center' }} onClick={() => {
        asyncDispatch(shareStudy({ studyID: undefined })).then(r => alert('success')).catch(e => alert('error: ' + e));
      }}>Cancel</Button>
    </div>
  </div>;
}

export function SharedStudyCard({ study, accID, userID }: { study: FullProlificStudy, accID: string, userID: string }) {
  const asyncDispatch = useAsyncDispatch();
  return <div style={{ display: 'flex' }}>
    <div style={{ width: 'calc( 100% - 100px )' }}>
      <StudyCard study={study} />
    </div>
    <div style={{ display: 'flex', flexDirection: 'column', width:"200px" }}>
      <span>From: </span>
      <br />
      <span style={{fontSize: '12px', fontFamily: 'Consolas'}}>{accID}</span>
      <Button style={{ width: '200px', height: '40px', alignSelf: 'center' }} onClick={() => {
        asyncDispatch(claimSharedStudy({
          accountID: accID,
          remoteUserID: userID,
          studyID: study.id,
        })).then(r => alert('success')).catch(e => alert('error: ' + e));
      }}>Claim Study</Button>
    </div>
  </div>;
}

export function ClaimedStudyCard({
                                   study,
                                   accID,
                                   userID,
                                 }: { study: FullProlificStudy, accID: string, userID: string }) {
  const asyncDispatch = useAsyncDispatch();
  return <div style={{ display: 'flex' }}>
    <div style={{ width: 'calc( 100% - 100px )' }}>
      <StudyCard study={study} />
    </div>
    <div style={{ display: 'flex', flexDirection: 'column', width:"200px" }}>
      <span>From: </span>
      <br />
      <span style={{fontSize: '12px', fontFamily: 'Consolas'}}>{accID}</span>
      <Button style={{ width: '200px', height: '40px', alignSelf: 'center' }} onClick={() => {
        window.open(study.external_study_url, '_blank');
      }}>Open</Button>
      <Button style={{ width: '200px', height: '40px', alignSelf: 'center' }} onClick={() => {
        asyncDispatch(clearClaimedSharedStudy()).then(r => alert('success')).catch(e => alert('error: ' + e));
      }}>Cancel</Button>
    </div>
  </div>;
}