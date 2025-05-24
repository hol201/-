// Файл: src/gameLoader.js

/** 
 * Инициализация игры
 */
class GameLoader {
  constructor() {
    this.isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    this.audioContext = null;
    this.gameStarted = false;
    this.oClass = null;
    this.animationFrame = null;
  }

  /**
   * Инициализация аудио системы
   */
  initAudio() {
    try {
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
    } catch (error) {
      console.warn('Web Audio API не поддерживается:', error);
    }
  }

  /**
   * Запуск звука
   * @param {string} id - ID аудио элемента
   */
  playSound(id) {
    if (!this.gameStarted) return;
    
    const audio = document.getElementById(id);
    if (!audio) return;

    try {
      if (this.audioContext?.state === 'suspended') {
        this.audioContext.resume();
      }
      audio.currentTime = 0;
      audio.play();
    } catch (error) {
      console.error('Ошибка воспроизведения звука:', error);
    }
  }

  /**
   * Основная инициализация игры
   */
  init() {
    // Инициализация основных классов
    this.oClass = {
      ui: new UI(),
      mapEditor: new MapEditor(),
      drawMap: new DrawMap()
    };

    // Настройка графического контекста
    const setupCanvasContext = (ctx) => {
      ctx.font = '15px prstart';
      ctx.fillStyle = '#000';
      ctx.textBaseline = 'top';
    };

    setupCanvasContext(cxt.bg);
    setupCanvasContext(cxt.misc);

    // Инициализация управления
    this.initControls();
    this.oClass.ui.init();
  }

  /**
   * Инициализация управления
   */
  initControls() {
    // Обработчик клавиатуры
    const keyState = {};
    
    window.addEventListener('keydown', (e) => {
      keyState[e.key] = true;
    });

    window.addEventListener('keyup', (e) => {
      keyState[e.key] = false;
    });

    // Мобильное управление
    if (this.isMobile) {
      document.querySelectorAll('.control-btn').forEach(btn => {
        btn.addEventListener('touchstart', (e) => {
          keyState[e.target.dataset.action] = true;
          e.preventDefault();
        });

        btn.addEventListener('touchend', (e) => {
          keyState[e.target.dataset.action] = false;
        });
      });
    }
  }

  /**
   * Основной игровой цикл
   */
  gameLoop() {
    // Обновление UI
    if (draw.ui) {
      this.oClass.ui.draw();
    }

    // Редактор карты
    if (draw.setMap) {
      this.oClass.mapEditor.draw();
    }

    // Отрисовка основной карты
    if (draw.map) {
      this.oClass.drawMap.draw(stage.num - 1);
    }

    // Отрисовка игровых объектов
    if (draw.obj) {
      drawTank();
      drawBullet();
      bonus();
    }

    // Запрос следующего кадра
    this.animationFrame = requestAnimationFrame(() => this.gameLoop());
  }

  /**
   * Запуск игры
   */
  startGame() {
    if (this.gameStarted) return;
    
    this.initAudio();
    this.init();
    this.gameStarted = true;
    this.gameLoop();
    this.playSound('background-music');
  }

  /**
   * Остановка игры
   */
  stopGame() {
    cancelAnimationFrame(this.animationFrame);
    this.gameStarted = false;
  }
}

// Инициализация при загрузке
window.addEventListener('load', () => {
  const game = new GameLoader();
  
  // Экспорт для доступа из HTML
  window.startGame = () => game.startGame();
  window.stopGame = () => game.stopGame();

  // Мобильная разблокировка аудио
  if (game.isMobile) {
    document.body.addEventListener('touchstart', () => {
      game.playSound('unlock-audio');
    }, { once: true });
  }
});


