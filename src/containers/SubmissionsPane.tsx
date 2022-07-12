import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Row from 'react-bootstrap/Row';
import Tab from 'react-bootstrap/Tab';
import Tooltip from 'react-bootstrap/Tooltip';

import { centsToGBP, getFullReward } from '../functions/centsToGBP';
import { openProlificStudy } from '../functions/openProlificStudy';
import { selectProlificError, selectProlificSubmissions } from '../store/prolific/selectors';
import Form from 'react-bootstrap/Form';
import { studyImg } from '../functions/GlobalVars';

export function SubmissionsPage() {
  let [submissionType, setSubmissionType] = useState('awaiting review');
  const error = useSelector(selectProlificError);
  const submissions = useSelector(selectProlificSubmissions);

  let submissionTypes = getTypes(submissionType);

  return (
    <Tab.Pane eventKey="submissions">
      <style>{`
      .sub_s_{
        display:inline;
      }
      .sub_s_approved{
        color:lime;
      }
      .sub_s_rejected{
        color:red;
      }
      .sub_s_returned{
        color:gray;
      }
      .sub_s_awaiting_review{
        color: var(--blue);
      }
      .sub_s_timed-out{
        color: gray;
      }
      `}</style>
      <Form.Control as="select" value={submissionType} onChange={event => {
        setSubmissionType(event.target.value);
      }}>
        <option value="awaiting review">{`AWAITING REVIEW (${count(submissions, 'awaiting review')})`}</option>
        <option value="all">{`ALL (${count(submissions, 'all')})`}</option>
        <option value="rejected">{`REJECTED (${count(submissions, 'rejected')})`}</option>
        <option value="returned">{`RETURNED & TIMED-OUT (${count(submissions, 'returned')})`}</option>
        <option value="approved">{`APPROVED (${count(submissions, 'approved')})`}</option>
      </Form.Control>
      {(submissions && submissions.length && count(submissions, submissionType) > 0) ? (
        submissions.map((submission: ProlificSubmission) => (
          (submissionTypes.includes(submission.status.toLowerCase()) || submissionTypes.includes('all')) ?
            <Card className="study-card" key={submission.study.id}
                  onClick={() => openProlificStudy(submission.study.id)}>
              <Card.Body>
                <Container className="study-content">
                  <Row>
                    <Col xs="auto">
                      <img
                        alt="logo"
                        src={
                          submission.study.researcher.institution && submission.study.researcher.institution.logo
                            ? submission.study.researcher.institution.logo
                            : studyImg
                        }
                        style={{ width: 64, height: 64 }}
                      />
                    </Col>
                    <Col xs>
                      <div>
                        <b>{submission.study.name}</b>
                      </div>
                      <div>
                        Hosted by <b>{submission.study.researcher.name}</b>
                      </div>
                      <div className="split-with-bullets">
                        <OverlayTrigger
                          overlay={
                            <Tooltip id="reward-tooltip">
                              {createRewardTooltip(submission)}
                            </Tooltip>
                          }
                        >
                          <span>{createReward(submission)}</span>
                        </OverlayTrigger>
                        <OverlayTrigger
                          overlay={
                            <Tooltip id="status-tooltip">
                              STATUS:<br /><strong>{<div
                              className={'sub_s_ sub_s_' + submission.status.toLowerCase().replace(' ', '_')}>{submission.status}</div>}</strong>
                            </Tooltip>
                          }
                        >
                          <span>{<div
                            className={'sub_s_ sub_s_' + submission.status.toLowerCase().replace(' ', '_')}>{submission.status.replace('AWAITING REVIEW', 'TO REVIEW')}</div>}</span>
                        </OverlayTrigger>
                        <OverlayTrigger
                          overlay={
                            <Tooltip id="date-tooltip">
                              DATE:<br /><strong>{formatDate(submission)}</strong>
                              {createTimeTaken(submission)}
                            </Tooltip>
                          }
                        >
                          <span>{formatDate(submission)}</span>
                        </OverlayTrigger>
                        <OverlayTrigger
                          overlay={
                            <Tooltip id="code-tooltip">
                              CODE:<br /><strong>{submission.study_code}</strong>
                            </Tooltip>
                          }
                        >
                          <span>{submission.study_code}</span>
                        </OverlayTrigger>
                      </div>
                    </Col>
                  </Row>
                </Container>
              </Card.Body>
            </Card> : <div key={submission.study.id} />
        ))
      ) : (
        <div className="p-3 text-center">
          {error === 401 ? (
            <Button variant="primary" href="https://app.prolific.co/">
              Login to Prolific.co
            </Button>
          ) : (
            'No submissions available.'
          )}
        </div>
      )}
    </Tab.Pane>
  );
}

function formatDate(submission: ProlificSubmission) {
  let datestr = submission.completed_at ? submission.completed_at : submission.started_at;
  let date = new Date(datestr);

  let day = '' + date.getDate();
  let month = '' + ((date.getMonth()) + 1);
  let year = '' + date.getFullYear();
  let hour = '' + (date.getHours());
  let min = '' + date.getMinutes();


  if (hour.length < 2)
    hour = '0' + hour;
  if (day.length < 2)
    day = '0' + day;
  if (month.length < 2)
    month = '0' + month;
  if (year.length < 2)
    year = '0' + year;
  if (min.length < 2)
    min = '0' + min;

  return `${day}-${month}-${year}, ${hour}:${min}`;
}

function count(submissions: any, type: string) {
  if (!submissions) return 0;
  let submissionTypes = getTypes(type);
  let count = 0;
  submissions.forEach((el: any) => {
    if (submissionTypes.includes(el.status.toLowerCase()) || submissionTypes.includes('all')) {
      count++;
    }
  });
  return count;
}

function getTypes(type: string) {
  let submissionTypes;
  if (type == 'all') {
    submissionTypes = ['all'];
  } else if (type == 'approved') {
    submissionTypes = ['approved'];
  } else if (type == 'returned') {
    submissionTypes = ['returned', 'timed-out'];
  } else if (type == 'rejected') {
    submissionTypes = ['rejected'];
  } else {
    submissionTypes = [type];
  }
  return submissionTypes;
}

function createReward(submission: ProlificSubmission) {
  let reward = getFullReward(submission);
  if(reward.bonus > 0) return <div className="inline c-blue">{centsToGBP(reward.all)}</div>;
  if(reward.adjustment > 0) return <div className="inline c-green">{centsToGBP(reward.all)}</div>;
  return <div className="inline">{centsToGBP(reward.all)}</div>;
}

function effTooltip(submission: ProlificSubmission) {
  if(!submission.time_taken||submission.time_taken<=0)return (<></>)
  let efficiency = getEfficiency(submission);
  if(!isFinite(efficiency))return (<></>)
  return(<div>
    <div className="inline balance_type">Efficiency:</div>
    <div className="inline"><strong>{centsToGBP(efficiency)}/h</strong></div>
  </div>)
}

function createRewardTooltip(submission: ProlificSubmission) {
  let reward = getFullReward(submission);

  return (<div>
    <div>
      <div className="inline balance_type">Reward:</div>
      <div className="inline"><strong>{centsToGBP(reward.base)}</strong></div>
    </div>
    {reward.bonus>0?<div>
      <div className="inline balance_type">Bonus:</div>
      <div className="inline c-blue"><strong>{centsToGBP(reward.bonus)}</strong></div>
    </div>:<></>}
    {reward.adjustment>0?<div>
      <div className="inline balance_type">Adjustment:</div>
      <div className="inline c-green"><strong>{centsToGBP(reward.adjustment)}</strong></div>
    </div>:<></>}
    <div>
      <div className="inline balance_type">Total:</div>
      <div className="inline"><strong>{centsToGBP(reward.all)}</strong></div>
    </div>
    {effTooltip(submission)}
  </div>);
}

function getEfficiency(submission: ProlificSubmission){
  let mins = Math.round(submission.time_taken/60)
  let reward = getFullReward(submission);
  let rph = reward.all/mins*60;
  let rphround = Math.round(rph*100)/100
  return rphround;
}

function createTimeTaken(submission: ProlificSubmission){
  if(submission.time_taken){
    return <div><div className="balance_type">Time Taken:</div><strong>{Math.round(submission.time_taken/60)} minutes</strong></div>
  }else {
    return <div/>
  }
}