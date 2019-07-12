//#region FIELDS//
const MAX_LINE = 4;
const keyCodeDic = {
    left: 37,
    up: 38,
    right: 39,
    down: 40
};

let gameData = [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0]
];
let score = 0;
let scoreBuffer = [];
let playing = false;
//#endregion

//#region DOM ELEMENTS//
const resetBtn = document.querySelector('#reset');
const tableCells = document.querySelectorAll('table tr td');
const scoreBoard = document.querySelector('#score');
//#endregion

//#region METHODS//
function checkTableFull() {
    let full = true;

    for (let i = 0; i < MAX_LINE; i++) {
        if (gameData[i].includes(0)) { full = false; }
    }

    return full;
}

function randomGenerator() {
    let available = !checkTableFull();

    while (available) {
        let row = Math.floor(Math.random() * 4);
        let col = Math.floor(Math.random() * 4);

        if (gameData[row][col] === 0) {
            gameData[row][col] = 2;
            break;
        }
    }
}

function merge(data) {
    let arr = [];
    let alpha = data.shift();

    if (!alpha) { return; }
    for (let i = 0; i < MAX_LINE; i++) {
        let beta = data.shift();

        if (!beta) {
            if (alpha) { arr.push(alpha); }
            break;
        } else if (alpha === beta) {
            arr.push(alpha + beta);
            scoreBuffer.push(alpha + beta);
            alpha = null;
        } else if (alpha !== beta) {
            if (alpha) {
                arr.push(alpha);
            }
            alpha = beta;
        }
    }

    return arr.slice();
}

function makeMove(direction) {
    let gameDataNext = [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
    ];

    switch (direction) {
        case keyCodeDic.left:
            for (let i = 0; i < MAX_LINE; i++) {
                let shifted = merge(gameData[i].filter((v) => v > 0));

                if (shifted) {
                    for (let j = 0; j < shifted.length; j++) {
                        gameDataNext[i][j] = shifted[j];
                    }
                }
            }
            break;
        case keyCodeDic.right:
            for (let i = 0; i < MAX_LINE; i++) {
                let shifted = merge(gameData[i].filter((v) => v > 0).reverse());

                if (shifted) {
                    for (let j = 0; j < shifted.length; j++) {
                        gameDataNext[i][MAX_LINE - 1 - j] = shifted[j];
                    }
                }
            }
            break;
        case keyCodeDic.up:
            for (let j = 0; j < MAX_LINE; j++) {
                let arr = [];
                for (let i = 0; i < MAX_LINE; i++) {
                    arr.push(gameData[i][j]);
                }

                let shifted = merge(arr.filter((v) => v > 0));
                if (shifted) {
                    for (let i = 0; i < shifted.length; i++) {
                        gameDataNext[i][j] = shifted[i];
                    }
                }
            }
            break;
        case keyCodeDic.down:
            for (let j = 0; j < MAX_LINE; j++) {
                let arr = [];
                for (let i = 0; i < MAX_LINE; i++) {
                    arr.push(gameData[MAX_LINE - 1 - i][j]);
                }

                let shifted = merge(arr.filter((v) => v > 0));
                if (shifted) {
                    for (let i = 0; i < shifted.length; i++) {
                        gameDataNext[MAX_LINE - 1 - i][j] = shifted[i];
                    }
                }
            }
            break;
        default:
            break;
    }

    return gameDataNext;
}

function winCheck() {
    return scoreBuffer.includes(2048) ? true : false;
}

function gameoverCheck() {
    if (JSON.stringify(gameData) !== JSON.stringify(makeMove(keyCodeDic.left))) return false;
    if (JSON.stringify(gameData) !== JSON.stringify(makeMove(keyCodeDic.right))) return false;
    if (JSON.stringify(gameData) !== JSON.stringify(makeMove(keyCodeDic.up))) return false;
    if (JSON.stringify(gameData) !== JSON.stringify(makeMove(keyCodeDic.down))) return false;

    return true;
}

function addScore() {
    if (scoreBuffer.length > 0) score += scoreBuffer.reduce((acc, cur) => acc + cur);
    scoreBoard.textContent = score ? score : 0;
}

function action(direction) {
    scoreBuffer = [];

    let gameDataNext = makeMove(direction);
    if (JSON.stringify(gameData) === JSON.stringify(gameDataNext)) {
        return false;
    }

    gameData = JSON.parse(JSON.stringify(gameDataNext));
    return true;
}

function endGame(result) {
    // result: true if win, false if lose
    playing = false;

    if (result) {
        alert('You Won!\nYou got the score: ' + score);
    } else {
        alert('You Lost!\nYou got the score: ' + score);
    }
}

function init() {
    console.log('initializing...');
    gameData = [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
    ];
    score = 0;
    scoreBuffer = [];
    playing = true;

    randomGenerator();
    randomGenerator();
    draw();
}

function draw() {
    let gameDataUnpacked = [];
    gameData.forEach((rows) => {
        rows.forEach((cells) => {
            gameDataUnpacked.push(cells);
        });
    });

    tableCells.forEach((cells) => {
        let text = gameDataUnpacked.shift();
        cells.textContent = text ? text : null;
    });
}
//#endregion

//#region EVENT LISTENERS//
document.addEventListener('keydown', (e) => {
    if (e.keyCode < 36 || e.keyCode > 41 || !playing) return;
    if (action(e.keyCode)) {
        if (winCheck()) {
            endGame(true);
        }
    
        addScore();
        randomGenerator();
    
        if (checkTableFull()) {
            if (gameoverCheck()) {
                endGame(false);
            }
        }
    
        scoreBuffer = [];
        draw();
    }
    console.log(JSON.stringify(gameData));
});

resetBtn.addEventListener('click', (e) => {
    init();
});
//#endregion

init();