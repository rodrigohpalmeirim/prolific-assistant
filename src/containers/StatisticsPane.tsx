import { store } from '../pages/popup';
import React from 'react';
import Tab from 'react-bootstrap/Tab';
import { StatField, Statistics, userID } from '../pages/background';
import { centsToGBP } from '../functions/centsToGBP';

export function StatisticsPane() {
  let fstats = store.getState().firebase.statistics;
  let stats: Statistics = {};
  let stats_this = fstats[userID];
  Object.keys(fstats).forEach(key => {
    let accStats = fstats[key];
    Object.keys(accStats).forEach((key: StatField) => {
      if (!stats[key]) stats[key] = { value: 0, isMoney: accStats[key].isMoney };
      stats[key].value += accStats[key].value;
    });
  });

  if(!userID)return <></>
  return <Tab.Pane className="p-1 settings" eventKey="statistics">
    <div className="acc_property_h_f acc_full">
      <div className="acc_property acc_f_f_i inline-block w-33">Statistic</div>
      <div className="acc_value acc_f_f_i inline-block w-33">All prolific accounts</div>
      <div className="acc_value acc_f_f_i inline-block w-33">This prolific account</div>
    </div>
    {Object.keys(stats).map((key: StatField) => {
      let value = String(stats[key].value);
      let isMoney = stats[key].isMoney;
      if (isMoney) value = centsToGBP(stats[key].value);

      let value_this = String(stats_this[key].value);
      if (isMoney) value_this = centsToGBP(stats_this[key].value);

      return <div className="acc_property_h_f acc_full" key={key}>
        <div className="acc_property acc_f_f_i inline-block w-33">{key}</div>
        <div className="acc_value acc_f_f_i inline-block w-33">{value}</div>
        <div className="acc_value acc_f_f_i inline-block w-33">{value_this}</div>
      </div>;
    })}
  </Tab.Pane>;


}