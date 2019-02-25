class Tetris {
  constructor() {
    let width = 800;
    let height = 800;
    this.game = new Phaser.Game(
      width,
      height,
      Phaser.AUTO,
      'phaser-example',
      { preload: () => this.preload(),
        create: () => this.create(),
        update: () => this.update() },
    );
    this.boxSize = 30;
    this.framesPerMove = 60;

    const x = (width - this.boxSize * 10) / 2;
    const y = (height - this.boxSize * 20) / 2;
    this.boardLocation = {x: x, y: y};
    this.boxes = [];
    this.frame = 1;
  }

  preload() {
  }

  create() {
    this.board = new Board(10, 20);
    this.tetromino = new Tetromino(3);
    this.drawOutline();

    let left = this.game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
    left.onDown.add(() => this.moveLeft());

    let right = this.game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);
    right.onDown.add(() => this.moveRight());

    let down = this.game.input.keyboard.addKey(Phaser.Keyboard.DOWN);
    down.onDown.add(() => this.moveDown());

    let space = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    space.onDown.add(() => this.drop());

    let a = this.game.input.keyboard.addKey(Phaser.Keyboard.A);
    a.onDown.add(() => this.rotateLeft());

    let d = this.game.input.keyboard.addKey(Phaser.Keyboard.D);
    d.onDown.add(() => this.rotateRight());
  }

  update() {
    this.frame += 1;
    if(this.frame % this.framesPerMove == 1) {
      this.moveTetrominoDown();
    }

    this.draw();
  }

  moveTetrominoDown() {
    if(this.board.testBoundaries(this.tetromino, 0, 1)) {
      this.tetromino.position.y += 1;
    } else {

      this.insertNewTetromino();

      if(!this.board.testBoundaries(this.tetromino, 0, 0)) {
        throw new Error("game over");
      };
    }
  }

  insertNewTetromino() {
    this.board.addTetromino(this.tetromino);
    this.board.clearRows();
    this.tetromino = new Tetromino(3);
  }

  rotateRight() {
    this.tetromino.rotateRight();
    if(!this.board.testBoundaries(this.tetromino, 0, 0)) {
      this.tetromino.rotateLeft();
    }
  }

  rotateLeft() {
    this.tetromino.rotateLeft();
    if(!this.board.testBoundaries(this.tetromino, 0, 0)) {
      this.tetromino.rotateRight();
    }
  }

  moveRight() {
    if(this.board.testBoundaries(this.tetromino, 1, 0)) {
      this.tetromino.position.x += 1;
    }
  }

  moveLeft() {
    if(this.board.testBoundaries(this.tetromino, -1, 0)) {
      this.tetromino.position.x -= 1;
    }
  }

  moveDown() {
    if(this.board.testBoundaries(this.tetromino, 0, 1)) {
      this.tetromino.position.y += 1;
    }
  }

  drop() {
    let dropValue = 0;
    for(let i = 0; i < this.board.size.y; i++) {
      if(this.board.testBoundaries(this.tetromino, 0, i)) {
        dropValue = i;
      } else {
        break;
      }
    }
    this.tetromino.position.y += dropValue;
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
    box.lineTo(this.boxSize * this.board.size.x, 0);
    box.lineTo(this.boxSize * this.board.size.x, this.boxSize * this.board.size.y);
    box.lineTo(0, this.boxSize * this.board.size.y);
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
    this.size = {x: xSize, y: ySize};
    this.initializeGrid();
  }

  testBoundaries(tetromino, xOffset, yOffset) {
    let passed = true;
    tetromino.forEach((x, y, value) => {
      if(value === 1) {
        const gridX = x + xOffset + tetromino.position.x;
        const gridY = y + yOffset + tetromino.position.y;
        if(gridX >= this.size.x 
          || gridY >= this.size.y
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

  clearRows() {
    let count = 0;
    let y = this.size.y - 1;
    while(y >= 0) {
      let passed = true;
      for(let x = 0; x < this.size.x; x++) {
        if(this.grid[x][y] == 0) {
          passed = false;
        }
      }
      if(passed) {
        count += 1;
        this.removeRow(y);
      } else {
        y -= 1;
      }
    }

    return count;
  }

  removeRow(y) {
    for(; y >= 0; y--) {
      for(let x = 0; x < this.size.x; x++) {
        if(y - 1 >= 0) {
          this.grid[x][y] = this.grid[x][y - 1];
        } else {
          this.grid[x][y] = 0;
        }
      }
    }
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

  forEachReverse(func) {
    for(let x = 0; x < this.size.x; x++) {
      for(let y = this.size.y; y >= 0; y--) {
        if(this.grid[x] && this.grid[x][y]) {
          func(x, y, this.grid[x][y]);
        } else {
          func(x,y);
        }
      }
    }
  }

  forEach(func) {
    for(let x = 0; x < this.size.x; x++) {
      for(let y = 0; y < this.size.y; y++) {
        if(this.grid[x] && this.grid[x][y]) {
          func(x, y, this.grid[x][y]);
        } else {
          func(x,y);
        }
      }
    }
  }

  forEachRow(func) {
    const rows = [];
    this.forEach((x, y, value) => {
      if(x === 0) {
        rows[y] = [];
      }
      rows[y][x] = value;
    });
    for(let x = 0; x < rows.length; x++) {
      func(x, rows[x]);
    }
  }
}

class Tetromino {
  constructor(x) {
    this.gridLayout = getRandomValue(TETROMINOS);
    this.position = {x,y: 0};
    this.rotation = 0;
  }

  rotateRight() {
    if(this.rotation == 3) {
      this.rotation = 0;
    } else {
      this.rotation += 1;
    }
  }

  rotateLeft() {
    if(this.rotation == 0) {
      this.rotation = 3;
    } else {
      this.rotation -= 1;
    }
  }

  forEach(func) {
    const gridLayout = this.gridLayout[this.rotation];
    for(let x = 0; x < gridLayout.length; x++) {
      for(let y = 0; y < gridLayout[x].length; y++) {
        func(x, y, gridLayout[x][y]);
      }
    }
  }
}

const T1 =[
  [1, 0],
  [1, 1],
  [1, 0],
];

const T2 =[
  [1, 1, 1],
  [0, 1, 0],
];

const T3 =[
  [0, 1],
  [1, 1],
  [0, 1],
];

const T4 = [
  [0, 1, 0],
  [1, 1, 1],
];

const L1 =[
  [1, 0],
  [1, 0],
  [1, 1],
];

const L2 =[
  [1, 1, 1],
  [1, 0, 0],
];

const L3 =[
  [1, 1],
  [0, 1],
  [0, 1],
];

const L4 =[
  [0, 0, 1],
  [1, 1, 1],
];

const J1 = [
  [0, 1],
  [0, 1],
  [1, 1],
];

const J2 = [
  [1, 0, 0],
  [1, 1, 1],
];

const J3 = [
  [1, 1],
  [1, 0],
  [1, 0],
];

const J4 = [
  [1, 1, 1],
  [0, 0, 1],
];

const I1 = [
  [1],
  [1],
  [1],
  [1],
];

const I2 = [
  [1, 1, 1, 1],
];

const S1 = [
  [1, 0],
  [1, 1],
  [0, 1],
];

const S2 = [
  [0, 1, 1],
  [1, 1, 0],
];

const Z1 = [
  [0, 1],
  [1, 1],
  [1, 0],
];

const Z2 = [
  [1, 1, 0],
  [0, 1, 1],
];

const O1 = [
  [1, 1],
  [1, 1],
];

const TETROMINOS = [
  [L1, L2, L3, L4],
  [J1, J2, J3, J4],
  [I1, I2, I1, I2],
  [S1, S2, S1, S2],
  [Z1, Z2, Z1, Z2],
  [O1, O1, O1, O1],
  [T1, T2, T3, T4],
];

function getRandomValue(values) {
  return values[Math.floor(Math.random() * values.length)];
}

new Tetris();
