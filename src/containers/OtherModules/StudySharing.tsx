import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Form from 'react-bootstrap/Form';
import Tab from 'react-bootstrap/Tab';
import { selectSettings } from '../../store/settings/selectors';
import Button from 'react-bootstrap/Button';
import { selectProlific } from '../../store/prolific/selectors';
import { claimSharedStudy, clearClaimedSharedStudy, readSharedStudies, shareStudy } from '../../store/prolific/actions';
import { StudyCard } from '../StudiesPane';
import { useAsyncDispatch } from '../../pages/popup';
import { FullProlificStudy, SharedProlificStudy } from '../../types';

export function StudySharing() {
  const dispatch = useDispatch();
  const settings = useSelector(selectSettings);
  const prolific = useSelector(selectProlific);

  const updateState = useState(0);

  setTimeout(()=>{
    updateState[1](+new Date());
  },1000)

  let activeStudy = prolific?.acc_info?.active_study_id;
  let ownStudy: SharedProlificStudy = prolific?.sharedStudies?.own as SharedProlificStudy;
  let claimedStudy: SharedProlificStudy = ((prolific?.sharedStudies?.available ?? {})[prolific?.sharedStudies?.claimed?.accountID] ?? {})[prolific?.sharedStudies?.claimed?.remoteUserID];

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
            return !!(prolific?.sharedStudies?.available[acc][userID] && prolific?.sharedStudies?.available[acc][userID].id && !(prolific?.sharedStudies?.available[acc][userID].claimed));
          }).filter(userID=>{
            return prolific?.sharedStudies?.available[acc][userID]?.submission?.end_time > +new Date();
          }).map((userID) => {
            let study = prolific?.sharedStudies?.available[acc][userID];
            return <SharedStudyCard study={study} accID={acc} userID={userID} />;
          });
        })}
      </Form.Group>
    </Tab.Pane>
  );
}

export function OwnSharedStudyCard(props: { study: SharedProlificStudy }) {
  let { study } = props;

  const asyncDispatch = useAsyncDispatch();
  return <div style={{ display: 'flex' }}>
    <div style={{ width: 'calc( 100% - 100px )' }}>
      <StudyCard study={study} />
    </div>
    <div style={{ display: 'flex', flexDirection: 'column', width: '200px' }}>
      {study.claimed_by ? (<><span>Claimed by: </span>
        <br />
        <span style={{ fontSize: '12px', fontFamily: 'Consolas' }}>{study.claimed_by}</span></>) : <>Not claimed</>}
      <br />
      <span>Time left: </span>
      <br />
      <span style={{ fontSize: '12px', fontFamily: 'Consolas' }}>{getTimeLeftFormated(study)}</span>
      <Button style={{ width: '200px', height: '40px', alignSelf: 'center' }} onClick={() => {
        asyncDispatch(shareStudy({ studyID: undefined })).then(r => alert('success')).catch(e => alert('error: ' + e));
      }}>Cancel</Button>
    </div>
  </div>;
}

export function SharedStudyCard(props: { study: SharedProlificStudy, accID: string, userID: string }) {
  let { study, accID, userID } = props;

  const asyncDispatch = useAsyncDispatch();
  return <div style={{ display: 'flex' }}>
    <div style={{ width: 'calc( 100% - 100px )' }}>
      <StudyCard study={study} />
    </div>
    <div style={{ display: 'flex', flexDirection: 'column', width: '200px' }}>
      <span>From: </span>
      <br />
      <span style={{ fontSize: '12px', fontFamily: 'Consolas' }}>{accID}</span>
      <br />
      <span>Time left: </span>
      <br />
      <span style={{ fontSize: '12px', fontFamily: 'Consolas' }}>{getTimeLeftFormated(study)}</span>
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

export function ClaimedStudyCard(props: { study: SharedProlificStudy, accID: string, userID: string }) {
  let { study, accID, userID } = props;

  const asyncDispatch = useAsyncDispatch();
  return <div style={{ display: 'flex' }}>
    <div style={{ width: 'calc( 100% - 100px )' }}>
      <StudyCard study={study} />
    </div>
    <div style={{ display: 'flex', flexDirection: 'column', width: '200px' }}>
      <span>From: </span>
      <br />
      <span style={{ fontSize: '12px', fontFamily: 'Consolas' }}>{accID}</span>
      <br />
      <span>Time left: </span>
      <br />
      <span style={{ fontSize: '12px', fontFamily: 'Consolas' }}>{getTimeLeftFormated(study)}</span>
      <Button style={{ width: '200px', height: '40px', alignSelf: 'center' }} onClick={() => {
        window.open(study.external_study_url, '_blank');
      }}>Open</Button>
      <Button style={{ width: '200px', height: '40px', alignSelf: 'center' }} onClick={() => {
        asyncDispatch(clearClaimedSharedStudy()).then(r => alert('success')).catch(e => alert('error: ' + e));
      }}>Cancel</Button>
    </div>
  </div>;
}

export function getTimeLeft(study: SharedProlificStudy) {
  return study.submission.end_time - +new Date();
}

export function getTimeLeftFormated(study: SharedProlificStudy) {
  let timeLeft = getTimeLeft(study);
  let secoundsLeft = String(Math.floor(timeLeft / 1000) % 60);
  let minutesLeft = String(Math.floor(timeLeft / (60 * 1000)) % 60);
  let hoursLeft = String(Math.floor(timeLeft / (60 * 60 * 1000)));
  if (secoundsLeft.length < 2) secoundsLeft = '0' + secoundsLeft;
  if (minutesLeft.length < 2) minutesLeft = '0' + minutesLeft;
  return `${hoursLeft}:${minutesLeft}:${secoundsLeft}`;
}