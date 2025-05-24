/**
 * 初始化
 */
// Файл: src/gameLoader.js

let audioContext; // Добавляем общий аудио контекст

// Проверка на мобильное устройство и разблокировка звука
const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

// Функция для разблокировки аудио
function unlockAudio() {
  const audio = document.getElementById('start');
  if (audio) {
    audio.play().then(() => {
      audio.pause();
      audio.currentTime = 0;
    }).catch(error => {
      console.error('Audio unlock failed:', error);
    });
  }
}

if (isMobile) {
  document.body.addEventListener('touchstart', unlockAudio, { once: true });
}

function init() {
    oClass = {
        ui: new UI(),
        mapEditor: new MapEditor(),
        drawMap: new DrawMap()
    };

    // Инициализация Audio Context для мобильных устройств
    if (isMobile && typeof AudioContext !== 'undefined') {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }

    // 规定所用的字体及颜色
    cxt.bg.font      = "15px prstart";
    cxt.bg.fillStyle = '#000';
    cxt.misc.font    = "15px prstart";

    // 键盘按下事件函数
    keyEvent();

    // UI初始化
    oClass.ui.init();
}

// 修改后的游戏主循环
async function gameLoop() {
    try {
        // 绘制游戏的UI界面
        draw.ui && oClass.ui.draw();

        // 绘制自定义地图界面
        draw.setMap && oClass.mapEditor.draw();

        // 绘制地图
        draw.map && oClass.drawMap.draw(stage.num - 1);

        // 处理游戏对象
        if (draw.obj) {
            drawTank();                        
            drawBullet();                     
            bonus();                          
        }

        // 恢复音频上下文 при необходимости (для iOS)
        if (isMobile && audioContext && audioContext.state === 'suspended') {
            await audioContext.resume();
        }
    } catch (error) {
        console.error('Game loop error:', error);
    }
    
    requestAnimFrame(gameLoop);
}

// 游戏入口
window.onload = function () {
    init();
    gameLoop().catch(error => {
        console.error('Game initialization failed:', error);
    });
}
