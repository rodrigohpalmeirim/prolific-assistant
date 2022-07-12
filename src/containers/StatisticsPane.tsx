import { store, useAsyncDispatch } from '../pages/popup';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import React from 'react';
import Tab from 'react-bootstrap/Tab';
import { Statistics } from '../pages/background';
import { centsToGBP } from '../functions/centsToGBP';

export function StatisticsPane(){
  const dispatch = useDispatch();
  let stats = store.getState().firebase.statistics;
  let new_stats:any|Statistics = {};

  Object.keys(stats).forEach(key=>{
    if(key.startsWith(":")){
      let id = key.split(":")[1];
      let nkey = key.split(":")[2];
      if(new_stats[nkey] === undefined)new_stats[nkey]={value:0,isMoney:stats[key].isMoney};
      new_stats[nkey].value += stats[key].value;
    }else{
      new_stats[key] =  stats[key];
    }
  })

  return <Tab.Pane className="p-1 settings" eventKey="statistics">
    {Object.keys(new_stats).map(key=>{
      let value = new_stats[key].value;
      let isMoney = new_stats[key].isMoney;
      if(isMoney) value = centsToGBP(value);

      return <div className="acc_property_h_f acc_full" key={key}>
        <div className="acc_property acc_f_f_i">{key}</div>
        <div className="acc_value acc_f_f_i">{value}</div>
      </div>
    })}
  </Tab.Pane>


}