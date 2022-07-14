import { store } from '../pages/popup';
import React from 'react';
import Tab from 'react-bootstrap/Tab';
import { centsToGBP, formatTimestamp } from '../functions/centsToGBP';
import { StatField, Statistics } from '../types';
import { useSelector } from 'react-redux';
import { selectAcc_Info } from '../store/prolific/selectors';

export function StatisticsPane() {
  let fstats = store.getState().firebase.statistics;
  let userID = useSelector(selectAcc_Info)?.id;
  let stats: Statistics = {statistics:{}};
  let stats_this = fstats.this_user;

  if(!fstats?.this_user)return <></>;

  Object.keys(fstats.this_user).forEach(key => {
    let accStats = fstats.this_user[key].statistics;
    if(accStats && stats.statistics){
      Object.keys(accStats).forEach((key: StatField) => {
        if (!stats.statistics[key]) stats.statistics[key] = { value: 0, isMoney: accStats[key].isMoney };
        stats.statistics[key].value += accStats[key].value;
      });
    }
  });

  return <Tab.Pane className="p-1 settings" eventKey="statistics">
    <div className="acc_property_h_f acc_full">
      <div className="acc_property acc_f_f_i inline-block w-25">Statistic</div>
      <div className="acc_value acc_f_f_i inline-block w-25">All your accounts ({Object.keys(fstats.this_user).length})</div>
      <div className="acc_value acc_f_f_i inline-block w-25">This prolific account</div>
      <div className="acc_value acc_f_f_i inline-block w-25">Whole community ({fstats?.bulk?.default?.accounts_count})</div>
    </div>
    {Object.keys(stats.statistics||{}).map((key: StatField) => {
      let value = String(stats.statistics[key].value);
      let isMoney = stats.statistics[key].isMoney;
      if (isMoney) value = centsToGBP(stats.statistics[key].value);

      let value_this = "undefined"
      if(userID && stats_this[userID] && stats_this[userID].statistics && stats_this[userID].statistics[key] && stats_this[userID].statistics[key].value !== undefined){
        value_this = String(stats_this[userID].statistics[key].value);
        if (isMoney) value_this = centsToGBP(stats_this[userID].statistics[key].value);
      }

      let value_community = "cannot load community"
      if(fstats?.bulk?.default?.statistics[key] && fstats?.bulk?.default?.statistics[key].value){
        value_community = String(fstats.bulk.default.statistics[key].value);
        if (isMoney) value_community = centsToGBP(fstats.bulk.default.statistics[key].value);

      }

      return <div className="acc_property_h_f acc_full" key={key}>
        <div className="acc_property acc_f_f_i inline-block w-25">{key}</div>
        <div className="acc_value acc_f_f_i inline-block w-25">{value}</div>
        <div className="acc_value acc_f_f_i inline-block w-25">{value_this}</div>
        <div className="acc_value acc_f_f_i inline-block w-25">{"W.I.P"}</div>
      </div>;
    })}

    <br/><br/>
    <div>Refresh times:</div>
    <div>This prolific account: {stats_this[userID]?formatTimestamp(stats_this[userID]._lastUpdated):"undefined prolific id"}</div>
    {Object.keys(fstats.this_user).map(prolificID=>{
      let stats = fstats.this_user[prolificID];
      return <div key={`refresh-${prolificID}`}>{prolificID}: {stats?formatTimestamp(stats._lastUpdated):""}</div>
    })}
    <div>Community: {formatTimestamp(fstats?.bulk?.default?._lastUpdated)} (refreshed every 2 hours)</div>
  </Tab.Pane>;


}