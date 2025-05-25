

// 1. Добавим глобальные переменные
let oClass = null;
let cxt = {
    bg: null,
    misc: null
};
let draw = {
    ui: false,
    setMap: false,
    map: false,
    obj: false
};

// 2. Исправленная проверка на мобильные устройства
const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

// 3. Инициализация аудио с обработкой ошибок
function initAudio() {
    try {
        const audio = document.getElementById('start');
        if (audio) {
            audio.play().then(() => {
                audio.pause();
                audio.currentTime = 0;
            }).catch(e => {
                console.warn('Audio init error:', e);
            });
        }
    } catch (e) {
        console.error('Audio system error:', e);
    }
}

// 4. Исправленная функция инициализации
function init() {
    // 4.1. Инициализация канвасов
    const bgCanvas = document.getElementById('canvas-bg');
    const miscCanvas = document.getElementById('canvas-misc');
    
    if (!bgCanvas || !miscCanvas) {
        console.error('Canvas elements not found!');
        return;
    }

    cxt.bg = bgCanvas.getContext('2d');
    cxt.misc = miscCanvas.getContext('2d');

    // 4.2. Проверка основных классов
    if (typeof UI !== 'function' || 
        typeof MapEditor !== 'function' || 
        typeof DrawMap !== 'function') {
        console.error('Core classes not defined!');
        return;
    }

    oClass = {
        ui: new UI(),
        mapEditor: new MapEditor(),
        drawMap: new DrawMap()
    };

    // 4.3. Настройка шрифтов
    const prstartFont = new FontFace('prstart', 'url(font/prstart.ttf)');
    prstartFont.load().then(() => {
        document.fonts.add(prstartFont);
        cxt.bg.font = "15px prstart";
        cxt.misc.font = "15px prstart";
    }).catch(e => {
        console.error('Font loading error:', e);
        cxt.bg.font = "15px Arial";
        cxt.misc.font = "15px Arial";
    });

    cxt.bg.fillStyle = '#000';
    cxt.misc.fillStyle = '#000';

    // 5. Инициализация управления
    try {
        keyEvent(); // Убедитесь, что эта функция существует
        oClass.ui.init();
    } catch (e) {
        console.error('Initialization error:', e);
    }
}

// 6. Исправленный игровой цикл
function gameLoop() {
    try {
        // 6.1. Отрисовка элементов
        if (draw.ui) oClass.ui.draw();
        if (draw.setMap) oClass.mapEditor.draw();
        if (draw.map) oClass.drawMap.draw(stage?.num ? stage.num - 1 : 0);
        
        // 6.2. Игровая логика
        if (draw.obj) {
            drawTank();
            drawBullet();
            bonus();
        }

        // 6.3. Запрос следующего кадра
        requestAnimationFrame(gameLoop);
    } catch (e) {
        console.error('Game loop error:', e);
    }
}

// 7. Исправленный запуск игры
window.addEventListener('load', () => {
    // 7.1. Мобильная разблокировка аудио
    if (isMobile) {
        document.body.addEventListener('touchstart', initAudio, { once: true });
    } else {
        initAudio();
    }

    // 7.2. Отложенная инициализация
    setTimeout(() => {
        try {
            init();
            gameLoop();
        } catch (e) {
            console.error('Game boot failed:', e);
            alert('Ошибка загрузки игры! Проверьте консоль для деталей.');
        }
    }, 100);
});
