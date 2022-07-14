import { useSelector } from 'react-redux';
import { selectAcc_Info, selectProlificError } from '../store/prolific/selectors';
import React from 'react';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import { set_app_container } from '../components/App';
import { browser } from 'webextension-scripts/polyfill';
import { selectFirebase } from '../store/firebase/actions';

export function WarnMsg() {
  const user = useSelector(selectFirebase).currentUser;
  const canUsePA = useSelector(selectFirebase).canUsePA;
  const acc_info = useSelector(selectAcc_Info);
  const error = useSelector(selectProlificError);

  let msg: JSX.Element = <div />;
  let actions: JSX.Element = <div />;

  if(!user){
    actions = generateActions([(<button className="btn btn-primary" onClick={_ => {
      set_app_container('settings');
    }}>Settings</button>)]);
    msg = generateWarnBox(`Extension is not authenticated. Please login to use all functions of this extension`, actions, '#f00');
  }

  if(canUsePA!== true){
    actions = generateActions([(<button className="btn btn-primary" onClick={_ => {
      set_app_container('settings');
    }}>Settings</button>)]);
    msg = generateWarnBox(`Something wrong when authenticating: ${canUsePA}`, actions, '#f00');
  }

  if (acc_info.status != 'OK') {
    actions = generateActions([(<button className="btn btn-primary" onClick={_ => {
      window.open('https://app.prolific.co', '_blank');
    }}>Navigate to prolific</button>), (<button className="btn btn-primary" onClick={_ => {
      //location.href = '?v=accinfo';
      set_app_container('accinfo');
    }}>Account Info</button>)]);
    msg = generateWarnBox(`ACCOUNT STATUS is ${acc_info.status}.`, actions, '#f00');
  }

  if (!acc_info || !acc_info.id) {
    actions = generateActions([(<button className="btn btn-primary" onClick={_ => {
      window.open('https://app.prolific.co', '_blank');
    }}>Navigate to prolific</button>), (<button className="btn btn-primary" onClick={_ => {
      //location.href = '?v=settings';
      set_app_container('settings');
    }}>Settings</button>)]);
    msg = generateWarnBox('PROLIFIC ID is undefined. Enter it in settings or navigate to app.prolific.co page', actions, '#f00');
  }

  if (error == 401) {
    actions = generateActions([(<button className="btn btn-primary" onClick={_ => {
      window.open('https://app.prolific.co', '_blank');
    }}>Navigate to prolific</button>), (<button className="btn btn-primary" onClick={_ => {
      //location.href = '?v=settings';
      browser.runtime.sendMessage('check_for_studies');
    }}>Check for Studies</button>)]);
    msg = generateWarnBox('Auth Header missing', actions, '#f00');
  }

  return <div>{msg}</div>;
}

function generateWarnBox(txt: string, actions: {}, color: string) {
  return (<div>
    <style>{`.warn_icon{width: 64px;text-align: center;align-self: center;} .warn_icon_2{border-radius: 50%;border-style: solid;width: 32px;height: 32px;background-color: ${color};top: 16px;position: relative;} .warn_icon_3{color: white;font-size: 25px;top: -7px;position: relative;}`}</style>
    <div className="warn_icon">
      <div className="warn_icon_2">
        {generateOverlay(txt, actions)}
      </div>
    </div>
  </div>);
}

function generateActions(actions: JSX.Element[]) {
  let els: any = [];

  actions.forEach((el, i) => {
    els.push(<div className="warn_box_action" key={`warn_box_action_${i}`}>{el}</div>);
  });
  //console.log(els)
  return (<div>
    <style>{`.warn_box_actions{padding-bottom: 10px; text-align:center;} .warn_box_action{display:inline;padding:15px;}`}</style>
    <div className="warn_box_actions">{els}</div>
  </div>);
}

function generateOverlay(txt: string, actions: {}) {
  let overlay = (<Tooltip id="warn_box_tooltip">
    <div>{txt}<br /><br />{actions}</div>
  </Tooltip>);

  return (<OverlayTrigger placement="bottom" overlay={overlay} delay={{ show: 0, hide: 1500 }}>
    <div className="warn_icon_3">!</div>
  </OverlayTrigger>);
}