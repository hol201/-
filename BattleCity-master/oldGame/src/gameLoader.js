/**
 * gameLoader.js - Исправленная версия с отладкой
 */

let audioContext;
let isAudioUnlocked = false;
let oClass;
let cxt = {}; // Добавляем объект контекста, если он не был определен

// Проверка мобильного устройства
const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

// Функция разблокировки аудио
function unlockAudio() {
  if (isAudioUnlocked) return;
  console.log('Attempting audio unlock...');

  try {
    // Разблокировка Web Audio API
    if (typeof AudioContext !== 'undefined' && !audioContext) {
      audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }

    if (audioContext) {
      const buffer = audioContext.createBuffer(1, 1, 22050);
      const source = audioContext.createBufferSource();
      source.buffer = buffer;
      source.connect(audioContext.destination);
      source.start(0);
    }

    // Разблокировка HTML5 Audio
    document.querySelectorAll('audio').forEach(audio => {
      audio.play().then(() => {
        audio.pause();
        audio.currentTime = 0;
      }).catch(e => console.error('HTML5 audio unlock error:', e));
    });

    isAudioUnlocked = true;
    console.log('Audio successfully unlocked');
  } catch (error) {
    console.error('Audio unlock failed:', error);
  }
}

// Универсальная функция воспроизведения звука
function playSound(id) {
  if (!isAudioUnlocked) {
    console.warn(`Audio blocked - cannot play ${id}`);
    return;
  }

  const audio = document.getElementById(id);
  if (!audio) {
    console.error(`Audio element not found: ${id}`);
    return;
  }

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
  console.log('Initializing game...');
  
  try {
    // Инициализация контекстов канваса
    cxt.bg = document.getElementById('canvas-bg').getContext('2d');
    cxt.misc = document.getElementById('canvas-misc').getContext('2d');
    
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
    
    console.log('Game initialized successfully');
  } catch (error) {
    console.error('Initialization error:', error);
    throw error;
  }
}

/**
 * Игровой цикл
 */
async function gameLoop() {
  try {
    // Отрисовка UI
    if (draw.ui && oClass.ui) oClass.ui.draw();

    // Отрисовка редактора карт
    if (draw.setMap && oClass.mapEditor) oClass.mapEditor.draw();

    // Отрисовка игровой карты
    if (draw.map && oClass.drawMap) oClass.drawMap.draw(stage.num - 1);

    // Обработка игровых объектов
    if (draw.obj) {
      if (typeof drawTank === 'function') drawTank();
      if (typeof drawBullet === 'function') drawBullet();
      if (typeof bonus === 'function') bonus();
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
  try {
    init();
    gameLoop().catch(error => {
      console.error('Game loop initialization failed:', error);
    });
  } catch (error) {
    console.error('Window load error:', error);
  }
};

/**
 * Полифил для requestAnimationFrame
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
