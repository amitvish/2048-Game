let grid = [];
const gridSize = 4;

window.onload = function() {
    initGrid();
    drawGrid();
    addRandomTile();
    addRandomTile();
    document.addEventListener('keydown', handleKeyPress);
};

function initGrid() {
    for (let i = 0; i < gridSize; i++) {
        grid[i] = [];
        for (let j = 0; j < gridSize; j++) {
            grid[i][j] = 0;
        }
    }
}

function drawGrid() {
    const gridContainer = document.getElementById('grid');
    gridContainer.innerHTML = '';
    for (let i = 0; i < gridSize; i++) {
        for (let j = 0; j < gridSize; j++) {
            const tile = document.createElement('div');
            tile.classList.add('grid-cell');
            if (grid[i][j] !== 0) {
                const tileValue = document.createElement('div');
                tileValue.classList.add('tile');
                tileValue.textContent = grid[i][j];
                tile.appendChild(tileValue);
            }
            gridContainer.appendChild(tile);
        }
    }
}

function addRandomTile() {
    let emptyTiles = [];
    for (let i = 0; i < gridSize; i++) {
        for (let j = 0; j < gridSize; j++) {
            if (grid[i][j] === 0) {
                emptyTiles.push({ x: i, y: j });
            }
        }
    }
    if (emptyTiles.length > 0) {
        let randomTile = emptyTiles[Math.floor(Math.random() * emptyTiles.length)];
        grid[randomTile.x][randomTile.y] = Math.random() > 0.5 ? 2 : 4;
        drawGrid();
    }
}

function slideRowLeft(row) {
    let arr = row.filter(val => val);
    let missing = gridSize - arr.length;
    let zeros = Array(missing).fill(0);
    arr = arr.concat(zeros);
    return arr;
}

function combineRow(row) {
    for (let i = 0; i < gridSize - 1; i++) {
        if (row[i] === row[i + 1]) {
            row[i] *= 2;
            row[i + 1] = 0;
        }
    }
    return row;
}

function moveLeft() {
    let moved = false;
    for (let i = 0; i < gridSize; i++) {
        let row = grid[i];
        let originalRow = [...row];
        row = slideRowLeft(row);
        row = combineRow(row);
        row = slideRowLeft(row);
        grid[i] = row;
        if (originalRow.join('') !== row.join('')) {
            moved = true;
        }
    }
    return moved;
}

function moveRight() {
    let moved = false;
    for (let i = 0; i < gridSize; i++) {
        let row = grid[i];
        let originalRow = [...row];
        row.reverse();
        row = slideRowLeft(row);
        row = combineRow(row);
        row = slideRowLeft(row);
        row.reverse();
        grid[i] = row;
        if (originalRow.join('') !== row.join('')) {
            moved = true;
        }
    }
    return moved;
}

function transposeGrid(grid) {
    return grid[0].map((_, colIndex) => grid.map(row => row[colIndex]));
}

function moveUp() {
    grid = transposeGrid(grid);
    let moved = moveLeft();
    grid = transposeGrid(grid);
    return moved;
}

function moveDown() {
    grid = transposeGrid(grid);
    let moved = moveRight();
    grid = transposeGrid(grid);
    return moved;
}

function checkGameOver() {
    for (let i = 0; i < gridSize; i++) {
        for (let j = 0; j < gridSize; j++) {
            if (grid[i][j] === 0) {
                return false;
            }
            if (j !== gridSize - 1 && grid[i][j] === grid[i][j + 1]) {
                return false;
            }
            if (i !== gridSize - 1 && grid[i][j] === grid[i + 1][j]) {
                return false;
            }
        }
    }
    return true;
}

function updateGame() {
    drawGrid();
    if (checkGameOver()) {
        document.getElementById('gameOverMessage').style.display = 'block';
    }
}

function handleKeyPress(e) {
    let moved = false;
    if (e.key === 'ArrowUp') {
        moved = moveUp();
    } else if (e.key === 'ArrowDown') {
        moved = moveDown();
    } else if (e.key === 'ArrowLeft') {
        moved = moveLeft();
    } else if (e.key === 'ArrowRight') {
        moved = moveRight();
    }

    if (moved) {
        addRandomTile();
        updateGame();
    }

    // Check if the game is over after making a move
    if (checkGameOver()) {
        document.getElementById('gameOverMessage').style.display = 'block';
    }
}


function checkForWin() {
    for (let i = 0; i < gridSize; i++) {
        for (let j = 0; j < gridSize; j++) {
            if (grid[i][j] === 2048) {
                return true;
            }
        }
    }
    return false;
}

function updateGame() {
    drawGrid();
    if (checkForWin()) {
        alert('Congratulations! You won!');
        // Optionally, you can stop the game here or let it continue
    } else if (checkGameOver()) {
        document.getElementById('gameOverMessage').style.display = 'block';
    }
}

document.getElementById('restartButton').addEventListener('click', function() {
    grid = [];
    initGrid();
    addRandomTile();
    addRandomTile();
    updateGame();
    document.getElementById('gameOverMessage').style.display = 'none';
});