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
    this.boxes = [];
    this.frame = 1;
  }

  preload() {
  }

  create() {
    this.board = new Board();
    this.board.addPiece();
    this.board.drawPiece();
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
      if(val === 0) {
        this.drawBox(x * this.boxSize, y * this.boxSize);
      }
    });
  }

  drawBox(x, y) {
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
  constructor() {
    this.grid = [];
    for(let x = 0; x < 10; x++) {
      this.grid[x] = [];
      for(let y = 0; y < 20; y++) {
        this.grid[x][y] = 0;
      }
    }
  }

  getGrid() {
    return this.grid;
  }

  forEach(func) {
    for(let x = 0; x < 10; x++) {
      for(let y = 0; y < 20; y++) {
        func(x, y, this.grid[x][y]);
      }
    }
  }

  addPiece() {
    this.piece = new Piece();
  }

  drawPiece() {
    for(let i = 0; i < this.piece.piece.length; i++) {
      for(let j = 0; j < this.piece.piece[i].length; j++) {
        if(this.piece.piece[i][j] == 1) {
          const x = i + this.piece.x;
          const y = j + this.piece.y;
          this.grid[x][y] = 1;
        }
      }
    }
  }

  removePiece() {
    for(let i = 0; i < this.piece.piece.length; i++) {
      for(let j = 0; j < this.piece.piece[i].length; j++) {
        if(this.piece.piece[i][j] == 1) {
          const x = i + this.piece.x;
          const y = j + this.piece.y;
          this.grid[x][y] = 0;
        }
      }
    }
  }

  testMove(xOffset, yOffset) {
    for(let i = 0; i < this.piece.piece.length; i++) {
      for(let j = 0; j < this.piece.piece[i].length; j++) {
        if(this.piece.piece[i][j] == 1) {
          const x = i + this.piece.x + xOffset;
          const y = j + this.piece.y + yOffset;
          if(x >= this.grid.length
             || y >= this.grid[x].length
             || this.grid[x][y] == 1) {
            return false;
          };
        }
      }
    }
    return true;
  }

  movePieceDown() {
    this.removePiece();

    if(this.testMove(0, 1)) {
      this.piece.y += 1;
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
}

class Piece {
  constructor() {
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

    this.piece = this.getRandomPiece(pieces);

    this.y = 0
    this.x = 5
  }

  getRandomPiece(pieces) {
    return pieces[Math.floor(Math.random() * pieces.length)];
  }
}

new Tetris();
