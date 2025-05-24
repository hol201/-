/**
 * Инициализация игры и управление звуком
 */

let audioContext;
let isAudioUnlocked = false;
let oClass;

// Проверка мобильного устройства
const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

// Функция разблокировки аудио
function unlockAudio() {
  if (isAudioUnlocked) return;

  try {
    // Разблокировка Web Audio API
    if (audioContext) {
      const buffer = audioContext.createBuffer(1, 1, 22050);
      const source = audioContext.createBufferSource();
      source.buffer = buffer;
      source.connect(audioContext.destination);
      source.start(0);
    }

    // Разблокировка HTML5 Audio
    document.querySelectorAll('audio').forEach(audio => {
      audio.play().then(() => audio.pause()).catch(() => {});
    });

    isAudioUnlocked = true;
    console.log('Audio unlocked');
  } catch (error) {
    console.error('Audio unlock error:', error);
  }
}

// Универсальная функция воспроизведения звука
function playSound(id) {
  if (!isAudioUnlocked) return;

  const audio = document.getElementById(id);
  if (!audio) return;

  try {
    audio.currentTime = 0;
    audio.play().catch(error => console.error(`Play error for ${id}:`, error));
  } catch (error) {
    console.error(`Audio play failed for ${id}:`, error);
  }
}

/**
 * Основная инициализация игры
 */
function init() {
  // Инициализация Audio Context
  if (typeof AudioContext !== 'undefined') {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
  }

  // Обработчики для мобильных устройств
  if (isMobile) {
    document.body.addEventListener('touchstart', unlockAudio, { once: true });
    document.body.addEventListener('touchend', unlockAudio, { once: true });
  }

  // Инициализация игровых классов
  oClass = {
    ui: new UI(),
    mapEditor: new MapEditor(),
    drawMap: new DrawMap()
  };

  // Настройка шрифтов
  cxt.bg.font = "15px prstart";
  cxt.bg.fillStyle = '#000';
  cxt.misc.font = "15px prstart";

  // Инициализация управления
  keyEvent();

  // Запуск UI
  oClass.ui.init();
}

/**
 * Игровой цикл
 */
async function gameLoop() {
  try {
    // Отрисовка UI
    draw.ui && oClass.ui.draw();

    // Отрисовка редактора карт
    draw.setMap && oClass.mapEditor.draw();

    // Отрисовка игровой карты
    draw.map && oClass.drawMap.draw(stage.num - 1);

    // Обработка игровых объектов
    if (draw.obj) {
      drawTank();
      drawBullet();
      bonus();
    }

    // Восстановление аудиоконтекста для iOS
    if (isMobile && audioContext && audioContext.state === 'suspended') {
      await audioContext.resume();
    }
  } catch (error) {
    console.error('Game loop error:', error);
  }

  requestAnimFrame(gameLoop);
}

/**
 * Точка входа в игру
 */
window.onload = function() {
  init();
  gameLoop().catch(error => {
    console.error('Game initialization failed:', error);
  });
};

/**
 * Вспомогательные функции
 */
const requestAnimFrame = (() => {
  return window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.oRequestAnimationFrame ||
    window.msRequestAnimationFrame ||
    function(callback) {
      window.setTimeout(callback, 1000 / 60);
    };
})();
