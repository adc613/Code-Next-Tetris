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
    this.board.addPiece();
    this.board.drawPiece();
    this.drawOutline();
  }

  update() {
    this.frame += 1;
    if(this.frame % 5 == 1) {
      this.board.movePieceDown();
    }

    this.redraw();
  }

  movePieces() {
  }

  redraw() {
    this.clearBoxes();

    this.board.forEach((x, y, val) => {
      if(val === 1) {
        this.drawBox(x * this.boxSize, y * this.boxSize);
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
    this.grid = [];

    this.forEach((x, y) => {
      if(y == 0) {
        this.grid[x] = [];
      }
      this.grid[x][y] = 0;
    });
  }

  addPiece() {
    this.piece = new Piece(3);
  }

  drawPiece() {
    this.piece.forEach((x, y, value) => {
      if(value == 1) {
        const gridX = x + this.piece.position.x;
        const gridY = y + this.piece.position.y;
        this.grid[gridX][gridY] = 1;
      }
    });
  }

  removePiece() {
    this.piece.forEach((x, y, value) => {
      if(value == 1) {
        const gridX = x + this.piece.position.x;
        const gridY = y + this.piece.position.y;
        this.grid[gridX][gridY] = 0;
      }
    });
  }

  testMove(xOffset, yOffset) {
    let passed = true;
    this.piece.forEach((x, y, value) => {
      if(value === 1) {
        const gridX = x + xOffset + this.piece.position.x;
        const gridY = y + yOffset + this.piece.position.y;
        if(gridX >= this.grid.length
          || gridY >= this.grid[gridX].length
          || this.grid[gridX][gridY] == 1) {
          passed = false;
        }
      }
    });
    return passed;
  }

  movePieceDown() {
    this.removePiece();

    if(this.testMove(0, 1)) {
      this.piece.position.y += 1;
      this.drawPiece();
    } else {
      this.drawPiece();
      this.addPiece();
      if(!this.testMove(0, 0)) {
        throw new Error("game over");
      };
      this.drawPiece();
    }
  }

  dropPiece() {
  }

  movePieceLeft() {
  }

  movePieceRight() {
  }

  createBoard() {
  }

  forEach(func) {
    for(let x = 0; x < this.xSize; x++) {
      for(let y = 0; y < this.ySize; y++) {
        if(this.grid[x] && this.grid[x][y]) func(x, y, this.grid[x][y]);
        else func(x,y);
      }
    }
  }
}

class Piece {
  constructor(x) {
    const pieces = [
      [ // L
        [0, 0, 0, 0],
        [1, 0, 0, 0],
        [1, 0, 0, 0],
        [1, 1, 0, 0],
      ], [ // L inverted
        [0, 0, 0, 0],
        [0, 1, 0, 0],
        [0, 1, 0, 0],
        [1, 1, 0, 0],
      ], [ // long
        [1, 0, 0, 0],
        [1, 0, 0, 0],
        [1, 0, 0, 0],
        [1, 0, 0, 0],
      ], [ // Z
        [0, 0, 0, 0],
        [1, 0, 0, 0],
        [1, 1, 0, 0],
        [0, 1, 0, 0],
      ], [ // Z inverted
        [0, 0, 0, 0],
        [0, 1, 0, 0],
        [1, 1, 0, 0],
        [1, 0, 0, 0],
      ], [ /// T
        [0, 0, 0, 0],
        [1, 0, 0, 0],
        [1, 1, 0, 0],
        [1, 0, 0, 0],
      ],
    ];

    this.gridLayout = this.getRandomPiece(pieces);
    this.position = {x,y: 0};
  }

  getRandomPiece(pieces) {
    return pieces[Math.floor(Math.random() * pieces.length)];
  }

  forEach(func) {
    for(let x = 0; x < this.gridLayout.length; x++) {
      for(let y = 0; y < this.gridLayout[x].length; y++) {
        func(x, y, this.gridLayout[x][y]);
      }
    }
  }
}

new Tetris();
