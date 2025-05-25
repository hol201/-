/**
 * 初始化
 */


const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

// 1. Глобальная переменная для управления звуком
let soundEnabled = false;

// 2. Функция для разблокировки аудио
function unlockAudio() {
  const audio = document.getElementById('start');
  if (!audio) return;

  audio.play()
    .then(() => {
      audio.pause();
      audio.currentTime = 0;
      soundEnabled = true;
      console.log('Аудио разблокировано');
    })
    .catch(e => {
      console.error('Ошибка разблокировки аудио:', e);
      enableFallbackSound();
    });
}

// 3. Функция воспроизведения звука
function playSound(id) {
  if (!soundEnabled) return;

  const audio = document.getElementById(id);
  if (!audio) return;

  try {
    audio.currentTime = 0;
    audio.play().catch(e => console.warn('Не удалось воспроизвести:', id, e));
  } catch (e) {
    console.error('Ошибка звука:', e);
  }
}

// 4. Инициализация аудио системы
if (isMobile) {
  document.body.addEventListener('touchstart', unlockAudio, { once: true });
} else {
  document.addEventListener('click', unlockAudio, { once: true });
}

// 5. Модифицированная функция инициализации
function init() {
  oClass = {
    ui: new UI(),
    mapEditor: new MapEditor(),
    drawMap: new DrawMap()
  };

  cxt.bg.font = "15px prstart";
  cxt.bg.fillStyle = '#000';
  cxt.misc.font = "15px prstart";

  keyEvent();
  oClass.ui.init();

  // 6. Запуск фоновой музыки
  if (soundEnabled) {
    const bgMusic = document.getElementById('bg-music');
    bgMusic.loop = true;
    bgMusic.volume = 0.5;
    bgMusic.play().catch(e => console.warn('Фоновая музыка:', e));
  }
}

// 7. Модифицированный игровой цикл
function gameLoop() {
  // Отрисовка UI
  draw.ui && oClass.ui.draw();
  
  // Отрисовка карты
  draw.setMap && oClass.mapEditor.draw();
  draw.map && oClass.drawMap.draw(stage.num - 1);

  // Игровая логика
  if (draw.obj) {
    drawTank();
    drawBullet();
    bonus();

    // 8. Пример воспроизведения звука выстрела
    if (shootingCondition) {
      playSound('shoot-sound');
    }
  }

  requestAnimFrame(gameLoop);
}

window.onload = function() {
  startGame();
};
