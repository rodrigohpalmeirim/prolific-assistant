import React from 'react';

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
  try{
  if (submissions) {
    submissions.forEach((el: any) => {
      if(getAllReward(el)>0){
        total+=getAllReward(el);
        totalTime+=Math.round(el.time_taken/60/15)
      }
    })
  }}catch {}
  if(totalTime<=0)return -1;
  return Math.round(total/(totalTime/4));
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