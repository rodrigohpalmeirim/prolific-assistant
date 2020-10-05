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