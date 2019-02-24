class Tetris {
  constructor() {
    this.game = new Phaser.Game(
      1024,
      800,
      Phaser.AUTO,
      'phaser-example',
      { preload: () => this.preload(),
        create: () => this.create(),
        update: () => this.update() },
    );
    this.boxSize = 30;
    this.boardLocation = {x: 200, y:100};
    this.boxes = [];
    this.frame = 1;
  }

  preload() {
  }

  create() {
    this.board = new Board(10, 20);
    this.tetromino = new Tetromino(3);
    this.drawOutline();
  }

  update() {
    this.frame += 1;
    if(this.frame % 5 == 1) {
      this.moveTetrominoDown();
    }

    this.draw();
  }

  moveTetrominoDown() {
    if(this.board.testBoundaries(this.tetromino, 0, 1)) {
      this.tetromino.position.y += 1;
    } else {
      this.board.addTetromino(this.tetromino);

      this.tetromino = new Tetromino(3);
      if(!this.board.testBoundaries(this.tetromino, 0, 0)) {
        throw new Error("game over");
      };
    }
  }

  draw() {
    this.clearBoxes();

    this.board.forEach((x, y, val) => {
      if(val == 1) {
        this.drawBox(x * this.boxSize, y * this.boxSize);
      }
    });

    this.tetromino.forEach((x, y, val) => {
      if(val == 1 ) {
        const gridX = x + this.tetromino.position.x; 
        const gridY = y + this.tetromino.position.y;
        this.drawBox(gridX * this.boxSize, gridY * this.boxSize);
      }
    });
  }

  drawOutline() {
    let box = this.game.add.graphics(this.boardLocation.x, this.boardLocation.y);
    box.lineStyle(2, 0xfffff0, 1);
    box.lineTo(this.boxSize * 10, 0);
    box.lineTo(this.boxSize * 10, this.boxSize * 20);
    box.lineTo(0, this.boxSize * 20);
    box.lineTo(0, 0);
    box.endFill();
  }

  drawBox(x, y) {
    x += this.boardLocation.x;
    y += this.boardLocation.y;
    let box = this.game.add.graphics(x, y);

    box.beginFill(0xFF3300);
    box.lineStyle(1, 0xffffff, 1);
    box.lineTo(this.boxSize, 0);
    box.lineTo(this.boxSize, this.boxSize);
    box.lineTo(0, this.boxSize);
    box.lineTo(0, 0);
    box.endFill();

    this.boxes.push(box);
  }

  clearBoxes() {
    this.boxes.forEach(box => box.destroy());
    this.boxes = [];
  }
}

class Board {
  constructor(xSize, ySize) {
    this.xSize = xSize;
    this.ySize = ySize;

    this.initializeGrid();
  }

  testBoundaries(tetromino, xOffset, yOffset) {
    let passed = true;
    tetromino.forEach((x, y, value) => {
      if(value === 1) {
        const gridX = x + xOffset + tetromino.position.x;
        const gridY = y + yOffset + tetromino.position.y;
        if(gridX >= this.xSize 
          || gridY >= this.ySize
          || gridX < 0
          || gridY < 0
          || this.grid[gridX][gridY] == 1) {
          passed = false;
        }
      }
    });
    return passed;
  }

  addTetromino(tetromino) {
    tetromino.forEach((x, y, value) => {
      if(value == 1) {
        const gridX = x + tetromino.position.x;
        const gridY = y + tetromino.position.y;
        this.setValue(gridX, gridY, 1);
      }
    });
  }

  setValue(gridX, gridY, value) {
    this.grid[gridX][gridY] = value;
  }

  initializeGrid() {
    this.grid = [];
    this.forEach((x, y) => {
      if(y == 0) {
        this.grid[x] = [];
      }
      this.grid[x][y] = 0;
    });
  }

  forEach(func) {
    for(let x = 0; x < this.xSize; x++) {
      for(let y = 0; y < this.ySize; y++) {
        if(this.grid[x] && this.grid[x][y]) {
          func(x, y, this.grid[x][y]);
        } else {
          func(x,y);
        }
      }
    }
  }
}

class Tetromino {
  constructor(x) {
    const pieces = [
      [ // L
        [0, 0, 0, 0],
        [1, 0, 0, 0],
        [1, 0, 0, 0],
        [1, 1, 0, 0],
      ], [ // J
        [0, 0, 0, 0],
        [0, 1, 0, 0],
        [0, 1, 0, 0],
        [1, 1, 0, 0],
      ], [ // I
        [1, 0, 0, 0],
        [1, 0, 0, 0],
        [1, 0, 0, 0],
        [1, 0, 0, 0],
      ], [ // S
        [0, 0, 0, 0],
        [1, 0, 0, 0],
        [1, 1, 0, 0],
        [0, 1, 0, 0],
      ], [ // Z
        [0, 0, 0, 0],
        [0, 1, 0, 0],
        [1, 1, 0, 0],
        [1, 0, 0, 0],
      ], [ /// T
        [0, 0, 0, 0],
        [1, 0, 0, 0],
        [1, 1, 0, 0],
        [1, 0, 0, 0],
      ], [ /// O
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [1, 1, 0, 0],
        [1, 1, 0, 0],
      ],
    ];

    this.gridLayout = getRandomValue(pieces);
    this.position = {x,y: 0};
  }

  forEach(func) {
    for(let x = 0; x < this.gridLayout.length; x++) {
      for(let y = 0; y < this.gridLayout[x].length; y++) {
        func(x, y, this.gridLayout[x][y]);
      }
    }
  }
}

function getRandomValue(values) {
  return values[Math.floor(Math.random() * values.length)];
}

new Tetris();
