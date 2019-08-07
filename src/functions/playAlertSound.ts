import { AppState } from '../store';

export function playAlertSound(state: AppState) {
  switch (state.settings.alert_sound) {
    case 'none':
      break;
    case 'sweet-alert-1':
    case 'sweet-alert-2':
    case 'sweet-alert-3':
    case 'sweet-alert-4':
    case 'sweet-alert-5':
      const audio = new Audio(`/audio/${state.settings.alert_sound}.wav`);
      audio.volume = state.settings.alert_volume / 100;
      audio.play();
      break;
    case 'voice':
      const speech = new SpeechSynthesisUtterance('New studies available on Prolific.');
      speech.volume = state.settings.alert_volume / 100;
      speechSynthesis.speak(speech);
      break;
  }
}