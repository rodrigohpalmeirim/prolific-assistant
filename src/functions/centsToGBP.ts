import { appendLog } from '../pages/background';

export function centsToGBP(cents: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'GBP',
  }).format(cents * 0.01);
}

export function centsToGBP_Submission(cents: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'GBP',
  }).format(cents * 0.0001);
}

export function efficiency(submissions: any) {
  let total = 0;
  let totalTime = 0;
  try {
    if (submissions) {
      submissions.forEach((el: any) => {
        if (getAllReward(el) > 0) {
          total += getAllReward(el);
          totalTime += Math.round(el.time_taken / 60 / 15);
        }
      });
    }
  } catch {
  }
  if (totalTime <= 0) return -1;
  return Math.round(total / (totalTime / 4));
}

export function isBonus(submission: any) {
  try {
    return submission.bonus_payments && submission.bonus_payments.length && submission.bonus_payments.length > 0;
  } catch {
    return false;
  }

}

export function getBonusReward(submission: any) {
  try {
    let reward: number = 0;
    if (isBonus(submission)) {
      submission.bonus_payments.forEach((el: any) => {
        reward += ((el) as number);
      });

      return reward * 100;
    }
  } catch {
  }
  return 0;

}

export function getAllReward(submission: any) {
  try {
    if (isBonus(submission)) {
      return submission.reward + getBonusReward(submission);
    }
    return submission.reward;
  } catch {
  }
  return 0;
}

export function priceRange(prices: any): any {
  let min = 0;
  let max = 1 / 0;
  if (!prices) return [0, 1 / 0];
  min = prices[0];
  max = prices[1];
  if (max < 0) return [min, 1 / 0];
  if (min == max) return [min, max];
  if (min > max) return [-1, -1];
  return [min, max];
}

export function timeRange(times: any): any {
  if (!times) return ['00:00', '23:59'];
  let min = (times[0]);
  let max = (times[1]);
  if(!min||min.length<5)return ['00:00', '23:59'];
  if(!max||max.length<5)return ['00:00', '23:59'];
  if (!times[2]) return ['00:00', '23:59'];
  return [min, max];
}

export function testTimeRange(times: any):any {
  try{
  let min = timeRange(times)[0];
  let max = timeRange(times)[1];

  let timeString = getTimeString();

  let Hours = Number(timeString.split(':')[0]);
  let MinHours = Number(min.split(':')[0]);
  let MinMinutes = Number(min.split(':')[1]);
  let MaxHours = Number(max.split(':')[0]);
  let MaxMinutes = Number(max.split(':')[1]);
  let Minutes = Number(timeString.split(':')[1]);

  if (Minutes >= MinMinutes && Minutes <= MaxMinutes) {
    if (Hours >= MinHours && Hours <= MaxHours) {
      return true;
    }
  }
  return false;}catch {
    return testTimeRange(["00:00","23:59"])
  }
}

export function getTimeString() {
  let now = new Date();
  return `${now.getHours()}:${now.getMinutes()}`;
}

export function testAutoStart(autostart: any, price: number) {
  if (!autostart[0]) return false;
  if (!testTimeRange(autostart[2])) {
    appendLog(`AutoStart: not in time range`, 'status', `RANGE: ${JSON.stringify(timeRange(autostart[2]))}\nNOW: ${getTimeString()}`);
    return false;
  }
  let pRange = priceRange(autostart[1]);
  //appendLog(`AutoStart: study price not in range`, 'status', `RANGE: ${JSON.stringify(pRange)}\nSTUDY: ${price / 100}`);
  if (price / 100 >= pRange[0] && price / 100 <= pRange[1]) {
    return true;
  } else {
    appendLog(`AutoStart: study price not in range`, 'status', `RANGE: ${JSON.stringify(pRange)}\nSTUDY: ${price / 100}`);
  }
}