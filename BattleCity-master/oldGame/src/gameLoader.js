// Файл: src/gameLoader.js

/** 
 * Инициализация аудио системы 
 */
let audioContext;
const sounds = new Map();

function initAudio() {
  try {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
  } catch (error) {
    console.warn('Web Audio API не поддерживается:', error);
  }
}

/**
 * Воспроизведение звука
 */
function playSound(id) {
  const audio = document.getElementById(id);
  if (!audio) return;

  try {
    // Для мобильных устройств
    if (audioContext?.state === 'suspended') {
      audioContext.resume();
    }
    
    audio.currentTime = 0;
    audio.play().catch(e => {
      console.error('Ошибка воспроизведения:', id, e);
    });
  } catch (error) {
    console.error('Критическая ошибка звука:', error);
  }
}

/** 
 * Инициализация игры 
 */
let gameInitialized = false;

function init() {
  if (gameInitialized) return;
  gameInitialized = true;

  // Инициализация аудио
  initAudio();

  // Основные классы
  window.oClass = {
    ui: new UI(),
    mapEditor: new MapEditor(),
    drawMap: new DrawMap()
  };

  // Настройка контекста
  const setupContext = ctx => {
    ctx.font = "15px prstart";
    ctx.fillStyle = '#000';
    ctx.imageSmoothingEnabled = false;
  };

  setupContext(cxt.bg);
  setupContext(cxt.misc);

  // Управление
  initControls();
  oClass.ui.init();
}

/**
 * Инициализация управления
 */
function initControls() {
  // Клавиатура
  const pressedKeys = new Set();
  
  window.addEventListener('keydown', e => {
    pressedKeys.add(e.key.toLowerCase());
    handleKeyPress(e.key);
  });

  window.addEventListener('keyup', e => {
    pressedKeys.delete(e.key.toLowerCase());
  });

  // Мобильное управление
  if (isMobile) {
    document.querySelectorAll('[data-action]').forEach(btn => {
      btn.addEventListener('touchstart', e => {
        const action = e.target.dataset.action;
        pressedKeys.add(action);
        handleKeyPress(action);
      });

      btn.addEventListener('touchend', e => {
        pressedKeys.delete(e.target.dataset.action);
      });
    });
  }
}

/** 
 * Основной игровой цикл 
 */
let lastSoundTime = 0;

function gameLoop(timestamp) {
  // Отрисовка интерфейса
  draw.ui && oClass.ui.draw();
  
  // Отрисовка карты
  draw.setMap && oClass.mapEditor.draw();
  draw.map && oClass.drawMap.draw(stage.num - 1);

  // Игровая логика
  if (draw.obj) {
    drawTank();
    drawBullet();
    bonus();

    // Пример воспроизведения звука выстрела
    if (shootingCondition) {
      const now = Date.now();
      if (now - lastSoundTime > 200) {
        playSound('shoot-sound');
        lastSoundTime = now;
      }
    }
  }

  requestAnimationFrame(gameLoop);
}

/** 
 * Запуск игры 
 */
function startGame() {
  playSound('start-sound');
  init();
  gameLoop();
}

// Инициализация
const isMobile = /* ... */;

window.addEventListener('load', () => {
  // Разблокировка аудио
  const unlock = () => {
    if (audioContext && audioContext.state !== 'running') {
      audioContext.resume();
    }
    document.removeEventListener('click', unlock);
    document.removeEventListener('touchstart', unlock);
  };

  document.addEventListener('click', unlock);
  document.addEventListener('touchstart', unlock);

  // Старт игры
  startGame();
});
