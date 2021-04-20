"use strict";
const settings = {
    rowsCount: 21,
    colsCount: 21,
    speed: 2,
    winFoodCount: 50,
};

const config = {
    settings,
    init(userSettings = {}) {
        Object.assign(this.settings, userSettings);
    },

    getRowsCount() {
        return this.settings.rowsCount;
    },

    getColsCount() {
        return this.settings.colsCount;
    },

    getSpeed() {
        return this.settings.speed;
    },

    getWinFoodCount() {
        return this.settings.winFoodCount;
    },

    validate() {
        const result = {
            isValid: true,
            errors: [],
        };

        if (this.getRowsCount() < 10 || this.getRowsCount() > 30) {
            result.isValid = false;
            result.errors.push('Неверные настройки, значение rowsCount должно быть в диапазоне [10, 30].');
        }

        if (this.getRowsCount() < 10 || this.getRowsCount() > 30) {
            result.isValid = false;
            result.errors.push('Неверные настройки, значение colsCount должно быть в диапазоне [10, 30].');
        }

        if (this.getSpeed() < 1 || this.getSpeed() > 10) {
            result.isValid = false;
            result.errors.push('Неверные настройки, значение speed должно быть в диапазоне [1, 10].');
        }

        if (this.getWinFoodCount() < 5 || this.getWinFoodCount() > 50) {
            result.isValid = false;
            result.errors.push('Неверные настройки, значение winFoodCount должно быть в диапазоне [5, 50].');
        }

        return result;
    },
};

const map = {
    cells: null, // {x1_y1: td, x1_y2: td}
    usedCells: null,

    init(rowsCount, colsCount) {
        const table = document.getElementById('game');
        table.innerHTML = '';

        this.cells = {}; // {x1_y1: td, x1_y2: td}
        this.usedCells = [];

        for (let row = 0; row < rowsCount; row++) {
            const tr = document.createElement('tr');
            tr.classList.add('row');
            table.appendChild(tr);

            for (let col = 0; col < colsCount; col++) {
                const td = document.createElement('td');
                td.classList.add('cell');

                this.cells[`x${col}_y${row}`] = td;
                tr.appendChild(td);
            }
        }
    },

    render(snakePointsArray, foodPoint, barrierPointsArray) {
        for (const cell of this.usedCells) {
            cell.className = 'cell';
        }

        this.usedCells = [];

        snakePointsArray.forEach((point, index) => {
            const snakeCell = this.cells[`x${point.x}_y${point.y}`];
            snakeCell.classList.add(index === 0 ? 'snakeHead' : 'snakeBody');
            this.usedCells.push(snakeCell);
        });

        const foodCell = this.cells[`x${foodPoint.x}_y${foodPoint.y}`];
        foodCell.classList.add('food');
        this.usedCells.push(foodCell);

        barrierPointsArray.forEach(point => {                                       // добавила рендер барьеров
            const barrierCell = this.cells[`x${point.x}_y${point.y}`];
            barrierCell.classList.add('barrier');
            this.usedCells.push(barrierCell);
        })
    },
};

const snake = {
    body: null,
    direction: null,
    lastStepDirection: null,

    init(startBody, direction) {
        this.body = startBody;
        this.direction = direction;
        this.lastStepDirection = direction;
    },

    getBody() {
        return this.body;
    },

    getLastStepDirection() {
        return this.lastStepDirection;
    },

    setDirection(direction) {
        this.direction = direction;
    },

    isOnPoint(point) {
        return this.body.some(snakePoint => snakePoint.x === point.x && snakePoint.y === point.y);
    },

    makeStep() {
        this.lastStepDirection = this.direction;
        this.body.unshift(this.getNextStepHeadPoint()); // [p3, p2, p1] // [p4, p3, p2]
        this.body.pop();
    },

    growUp() {
        const lastBodyIdx = this.getBody().length - 1;
        const lastBodyPoint = this.body[lastBodyIdx];
        const lastBodyPointClone = Object.assign({}, lastBodyPoint);
        this.body.push(lastBodyPointClone);
    },

    getNextStepHeadPoint() {
        const firstPoint = this.getBody()[0];

        switch (this.direction) {
            case 'up':
                return { x: firstPoint.x, y: firstPoint.y - 1 };
            case 'right':
                return { x: firstPoint.x + 1, y: firstPoint.y };
            case 'down':
                return { x: firstPoint.x, y: firstPoint.y + 1 };
            case 'left':
                return { x: firstPoint.x - 1, y: firstPoint.y };
        }
    },
};

const food = {
    x: null,
    y: null,

    getCoordinates() {
        return {
            x: this.x,
            y: this.y,
        };
    },

    setCoordinates(point) {
        this.x = point.x;
        this.y = point.y;
    },

    isOnPoint(point) {
        return this.x === point.x && this.y === point.y;
    },
};

const barrier = {                           // объект барьеров
    coordinates: [],

    getCoordinates() {
        return this.coordinates
    },

    resetCoordinates() {
        this.coordinates = []
    },

    setBarrierCoordinates(points) {
        this.coordinates = [ ...this.coordinates, ...points ]
    },

    isOnPointBarrier(point) {
        return this.coordinates.some(fPoint => point.x === fPoint.x && point.y === fPoint.y)
    },
};

const status = {
    condition: null,

    setPlaying() {
        this.condition = 'playing';
    },

    setStopped() {
        this.condition = 'stopped';
    },

    setFinished() {
        this.condition = 'finished';
    },

    isPlaying() {
        return this.condition === 'playing';
    },

    isStopped() {
        return this.condition === 'stopped';
    },
};

const game = {
    config,
    map,
    snake,
    food,
    barrier,
    status,
    tickInterval: null,
    score: 0,


    init(userSettings) {
        this.config.init(userSettings);
        const validation = this.config.validate();

        if (!validation.isValid) {
            for (const err of validation.errors) {
                console.error(err);
            }
            return;
        }

        this.map.init(this.config.getRowsCount(), this.config.getColsCount());

        this.setEventHandlers();
        this.reset();
    },

    reset() {                                               // добавила сброс барьеров при нажатии на новую игру
        this.stop();
        this.snake.init(this.getStartSnakeBody(), ['up', 'right', 'down', 'left'][Math.floor(Math.random() * 4)]);
        this.food.setCoordinates(this.getPointSequence()[0]);
        this.barrier.resetCoordinates()
        this.barrier.setBarrierCoordinates(this.getPointSequence(2))
        this.barrier.setBarrierCoordinates(this.getPointSequence(2))
        this.barrier.setBarrierCoordinates(this.getPointSequence(2))
        this.barrier.setBarrierCoordinates(this.getPointSequence(3))
        this.barrier.setBarrierCoordinates(this.getPointSequence(3))
        this.barrier.setBarrierCoordinates(this.getPointSequence(4))
        this.score = 0
        this.whatScore(this.score)
        this.render();
    },

    play() {
        this.status.setPlaying();
        this.tickInterval = setInterval(() => this.tickHandler(), 1000 / this.config.getSpeed());
        this.setPlayButton('Стоп');
    },

    stop() {
        this.status.setStopped();
        clearInterval(this.tickInterval);
        this.setPlayButton('Старт');
    },

    finish() {
        this.status.setFinished();
        clearInterval(this.tickInterval);
        this.setPlayButton('Игра завершена', true);
    },

    tickHandler() {                             // завершение игры при натыкании на барьеры
        if (!this.canMakeStep() || this.barrier.isOnPointBarrier(this.snake.getNextStepHeadPoint())) {
            return this.finish();
        }
        if (this.food.isOnPoint(this.snake.getNextStepHeadPoint())) {
            this.snake.growUp();

            this.food.setCoordinates(this.getPointSequence()[0]);

            this.score++                                                // счет
            this.whatScore(this.score)

            if (this.isGameWon()) {
                this.finish();
            }
        }

        this.snake.makeStep();
        this.render();
    },

    whatScore(newScore) {                                   // метод счета
        const howMuchAte = document.getElementById('score')
        switch (newScore) {
            case 0:
                howMuchAte.innerText = 'Накормите змейку'
                break
            case this.config.getWinFoodCount():
                howMuchAte.innerText = 'Поздравляю! Вы накормили змейку, змейка сыта'
                break
            default:
                howMuchAte.innerText = 'Змейка поела  ' + newScore + ' раз(а)'
        }
    },

    canMakeStep() {
        const nextHeadPoint = this.snake.getNextStepHeadPoint();
        return !this.snake.isOnPoint(nextHeadPoint) &&
            nextHeadPoint.x < this.config.getColsCount() &&
            nextHeadPoint.y < this.config.getRowsCount() &&
            nextHeadPoint.x >= 0 &&
            nextHeadPoint.y >= 0;
    },

    isGameWon() {
        return this.snake.getBody().length > this.config.getWinFoodCount();
    },

    setPlayButton(text, isDisabled = false) {
        const playButton = document.getElementById('playButton');

        playButton.textContent = text;
        isDisabled ? playButton.classList.add('disabled') : playButton.classList.remove('disabled');
    },

    getStartSnakeBody() {
        return [
            {
                x: Math.floor(this.config.getColsCount() / 2),
                y: Math.floor(this.config.getRowsCount() / 2),
            }
        ];
    },

    getPointSequence(count = 1) {               // получение последовательности точек для барьеров
        const coordinates = []
        const axis = Math.random() < 0.5 ? 'x' : 'y'

        const point = this.generateRandomPoint()
        coordinates.push({ ...point })

        for (let i = 1; i < count; i++) {
            point[axis]++
            if (this.isPointTaken(point)) {
                return coordinates
            }
            if (point.x >= this.config.getColsCount()) {
                return coordinates
            }
            if (point.y >= this.config.getRowsCount()) {
                return coordinates
            }
            coordinates.push({ ...point })
        }

        return coordinates
    },

    isPointTaken(point) {
        const exclude = [ this.food.getCoordinates(), ...this.barrier.getCoordinates(), ...this.snake.getBody() ];
        return exclude.some(exPoint => point.x === exPoint.x && point.y === exPoint.y)
    },

    generateRandomPoint() {
        while (true) {
            const point = {
                x: Math.floor(Math.random() * this.config.getColsCount()),
                y: Math.floor(Math.random() * this.config.getRowsCount()),
            };

            if (!this.isPointTaken(point)) {
                return point
            }
        }
    },

    setEventHandlers() {
        document.getElementById('playButton').addEventListener('click', () => {
            this.playClickHandler();
        });
        document.getElementById('newGameButton').addEventListener('click', () => {
            this.newGameClickHandler();
        });
        document.addEventListener('keydown', event => this.keyDownHandler(event));
    },

    render() {
        this.map.render(this.snake.getBody(), this.food.getCoordinates(), this.barrier.getCoordinates());
    },

    playClickHandler() {
        if (this.status.isPlaying()) {
            this.stop();
        } else if (this.status.isStopped()) {
            this.play();
        }
    },

    newGameClickHandler() {
        this.reset();
    },

    keyDownHandler(event) {
        if (!this.status.isPlaying()) return;

        const direction = this.getDirectionByCode(event.code);

        if (this.canSetDirection(direction)) {
            this.snake.setDirection(direction);
        }
    },

    getDirectionByCode(code) {
        switch (code) {
            case 'KeyW':
            case 'ArrowUp':
                return 'up';
            case 'KeyD':
            case 'ArrowRight':
                return 'right';
            case 'KeyS':
            case 'ArrowDown':
                return 'down';
            case 'KeyA':
            case 'ArrowLeft':
                return 'left';
        }
    },

    canSetDirection(direction) {
        const lastStepDirection = this.snake.getLastStepDirection();

        return direction === 'up' && lastStepDirection !== 'down' ||
            direction === 'right' && lastStepDirection !== 'left' ||
            direction === 'down' && lastStepDirection !== 'up' ||
            direction === 'left' && lastStepDirection !== 'right';
    },


};

game.init({ speed: 4 });
