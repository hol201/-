import { startGame } from './script/start';
document.addEventListener('DOMContentLoaded', () => {
  // Проверка на мобильное устройство
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

  if (isMobile) {
    document.body.addEventListener('touchstart', () => {
      const audio = document.getElementById('start');
      audio.play().then(() => {
        audio.pause();
        audio.currentTime = 0;
      });
    }, { once: true });
  }
(() => startGame())();
