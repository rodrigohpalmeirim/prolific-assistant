import { browser } from 'webextension-scripts/polyfill';

export function openProlificStudy(id: string) {
  if(id=="PAPIEŻ"){
    browser.tabs.create({ url: `https://stacja7.pl/jan-pawel-ii/wielki-test-wiedzy-o-janie-pawle-ii/` });
  }else {
    browser.tabs.create({ url: `https://app.prolific.co/studies/${id}` });
  }

}
