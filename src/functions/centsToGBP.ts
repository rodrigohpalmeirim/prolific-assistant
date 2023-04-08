import moment from 'moment';
import { LogObject, ProlificStudy, ProlificSubmission } from '../types';
import { SettingsState } from '../store/settings/types';

export function centsToGBP(cents: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'GBP',
  }).format(cents * 0.01);
}

export function efficiency(submissions: ProlificSubmission[]) {
  let total = 0;
  let totalTime = 0;
  try {
    if (submissions) {
      submissions.forEach((el: any) => {
        let reward = getFullReward(el).all;
        if (reward > 0) {
          total += reward;
          totalTime += Math.round(el.time_taken / 60 / 15);
        }
      });
    }
  } catch {
  }
  if (totalTime <= 0) return -1;
  return Math.round(total / (totalTime / 4));
}

export function getFullReward(submission: ProlificSubmission): { all: number, bonus: number, adjustment: number, base: number } {
  let reward = { base: submission.submission_reward.amount, bonus: 0, adjustment: 0, all: 0 };
  if (submission.bonus_payments) {
    reward.bonus = submission.bonus_payments.reduce((prev, cur) => {
      return prev + cur;
    }, 0);
  }
  if (submission.adjustment_payments) {
    reward.adjustment = submission.adjustment_payments.reduce((prev, cur) => {
      return prev + cur;
    }, 0);
  }
  reward.all = reward.base + reward.bonus + reward.adjustment;
  return reward;
}

export function priceRange(prices: { min: number, max: number, enabled: boolean }) {
  let min = prices?.min;
  let max = prices?.max;
  if (max < 0) max = 1/0;
  if (min > max) {min = -1;max=-1}
  if (!prices?.enabled) {min=0;max = 1/0}
  return { min, max};
}

export function timeRange(times: { min: string, max: string, enabled: boolean }) {
  let min = (times?.min);
  let max = (times?.max);
  if (min === "-" || max === "-" ) {
    min = '00:00';
    max = '23:59';
  }
  if (!times?.enabled) {
    min = '00:00';
    max = '23:59';
  }
  return { min, max };
}

export function timeValue(str:string){
  if(!str?.includes(":"))return 0;
  let hours = Number(str.split(':')[0]);
  let mins = Number(str.split(':')[1]);
  return hours*60+mins;
}

export function testTimeRange(times: { min: string, max: string, enabled: boolean }): any {
  try {
    let {min, max} = timeRange(times);
    let current = getTimeString();

    let minV = timeValue(min);
    let maxV = timeValue(max);
    let cV = timeValue(current);

    return cV >= minV && cV <= maxV;
  } catch {
    return testTimeRange({min:'00:00', max:'23:59',enabled:false});
  }
}

export function getTimeString() {
  let now = new Date();
  return `${now.getHours()}:${now.getMinutes()}`;
}

export function testAutoStart(autostart: SettingsState['autostart'], study: ProlificStudy): boolean | LogObject {
  if (!autostart.enabled) return false;
  if (!testTimeRange(autostart.timeRange)) {
    return {
      type: 'status',
      log: `AutoStart: not in time range`,
      description: `RANGE: ${JSON.stringify(timeRange(autostart.timeRange))}\nNOW: ${getTimeString()}`,
    };
  }

  let price = study.reward;
  let pRange = priceRange(autostart.priceRange);
  //appendLog(`AutoStart: study price not in range`, 'status', `RANGE: ${JSON.stringify(pRange)}\nSTUDY: ${price / 100}`);
  if (price / 100 < pRange.min || price / 100 > pRange.max) {
    return {
      type: 'status',
      log: `AutoStart: study price not in range`,
      description: `RANGE: ${JSON.stringify(pRange)}\nSTUDY: ${price / 100}`,
    };
  }

  if (study.estimated_reward_per_hour / 100 < autostart.priceRange.min_per_hour) {
    return {
      type: 'status',
      log: `AutoStart: study price not in range`,
      description: `RANGE: ${JSON.stringify(pRange)}\nSTUDY: ${price / 100}`,
    };
  }

  return true;
}

export function formatTimestamp(ts: number) {
  return ts ? moment(ts).format('LTS') : 'Never';
}