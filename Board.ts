import _ from 'lodash';

type Square = '_' | 'X' | '▣';

export class RowHint {
  isSolved = false;
  hints: number[];
  constructor(hints: number[]) {
    this.hints = hints;
  }
}

export class ColumnHint {
  isSolved = false;
  hints: number[];

  constructor(hints: number[]) {
    this.hints = hints;
  }
}

export class Board {
  rowCount: number;
  columnCount: number;

  currentGrid: Square[][] = [];

  rowHints: RowHint[];
  columnHints: ColumnHint[];

  constructor(rowCount: number, columnCount: number, rowHints: RowHint[], columnHints: ColumnHint[]) {
    this.rowCount = rowCount;
    this.columnCount = columnCount;

    this.rowHints = rowHints;
    this.columnHints = columnHints;

    this.currentGrid = _.fill(Array(this.rowCount), _.fill(Array(this.columnCount), '_'));
  }

  isPotentiallySolved = () => {
    const expectedRowBoxCount = this.rowHints.reduce((total, rowHint) => total + _.sum(rowHint.hints), 0);
    const expectedColumnBoxCount = this.columnHints.reduce((total, columnHint) => total + _.sum(columnHint.hints), 0);

    // console.log("expectedRowBoxCount", expectedRowBoxCount);
    // console.log("expectedColumnBoxCount", expectedColumnBoxCount);

    const currentFilledBoxCount = this.currentGrid.reduce((filledCount, row) => {
      return filledCount + _.sumBy(row, (square) => (square === '▣' ? 1 : 0));
    }, 0);

    // console.log("currentFilledBoxCount", currentFilledBoxCount);

    return expectedColumnBoxCount === currentFilledBoxCount && expectedRowBoxCount === currentFilledBoxCount;
  };

  isFullySolved = () => {
    return (
      this.rowHints.every((rowHint) => rowHint.isSolved) && this.columnHints.every((columnHint) => columnHint.isSolved)
    );
  };

  checkHints = () => {
    this.rowHints
      .filter((rowHint) => !rowHint.isSolved)
      .forEach((rowHint: RowHint, rowIndex) => {
        const rowToCheck = this.currentGrid[rowIndex];

        let contiguousSquares = rowToCheck.reduce(
          (acc: number[], square) => {
            if (square === '▣') {
              acc[acc.length - 1] = ++acc[acc.length - 1];
            } else {
              acc.push(0);
            }

            return acc;
          },
          [0]
        );

        contiguousSquares = _.compact(contiguousSquares);

        //   console.log("contiguousSquares", contiguousSquares);
        //   console.log("rowHint.hints", rowHint.hints);

        if (rowHint.hints[0] === 0 && contiguousSquares.length === 0) {
          rowHint.isSolved = true;
        } else if (_.isEqual(rowHint.hints, contiguousSquares)) {
          rowHint.isSolved = true;
        }
      });

    // console.log("*----------------------columsn------------------------*");
    this.columnHints
      .filter((columnHint) => !columnHint.isSolved)
      .forEach((columnHint, columnIndex) => {
        const columnToCheck = this.currentGrid.map((row) => row[columnIndex]);

        let contiguousSquares = columnToCheck.reduce(
          (acc: number[], square) => {
            if (square === '▣') {
              acc[acc.length - 1] = ++acc[acc.length - 1];
            } else {
              acc.push(0);
            }

            return acc;
          },
          [0]
        );

        contiguousSquares = _.compact(contiguousSquares);

        //   console.log("contiguousSquares", contiguousSquares);
        //   console.log("columnHint.hints", columnHint.hints);

        if (columnHint.hints[0] === 0 && contiguousSquares.length === 0) {
          columnHint.isSolved = true;
        } else if (_.isEqual(columnHint.hints, contiguousSquares)) {
          columnHint.isSolved = true;
        }
      });
  };

  solveRows() {
    this.currentGrid = this.currentGrid.map((row: Square[], rowIndex) => {
      const updatedRow = [...row];

      const rowHint = this.rowHints[rowIndex];

      if (rowHint.isSolved) {
        return updatedRow;
      }

      const leftAnchoredSquareIndexes = updatedRow
        .map((square: Square, squareIndex: number) => {
          const left = updatedRow[squareIndex - 1];

          if (square === '▣' && !left) {
            return squareIndex;
          } else {
            return -1;
          }
        })
        .filter((squareIndex) => squareIndex !== -1)
        .forEach((leftAnchorIndex) => {
          const squaresInARow = this.rowHints[rowIndex].hints[0];

          updatedRow.splice(0, squaresInARow, ..._.fill<Square>(Array(squaresInARow), '▣'));
        });

      return updatedRow;
    });
  }
  solveColumns() {
    // TODO implement
  }

  solve = () => {
    this.rowHints.forEach((rowHint: RowHint, rowIndex) => {
      const isMaxedRow = _.sum(rowHint.hints) + (rowHint.hints.length - 1) === this.columnCount;

      if (isMaxedRow) {
        this.currentGrid[rowIndex] = rowHint.hints
          .map((hint, _i) => {
            return _.fill<Square>(Array(hint), '▣');
          })
          .reduce((acc: Square[], hintLine: Square[], _, currRow) => {
            acc.push(...hintLine);

            if (acc.length !== this.columnCount) {
              acc.push('X');
            }

            return acc;
          }, []);
      } else if (rowHint.hints.length === 1 && rowHint.hints[0] === 0) {
        this.currentGrid[rowIndex] = _.fill(Array(this.columnCount), 'X');
      }
    });

    this.columnHints.forEach((columnHint, column) => {
      const isMaxedColumn = _.sum(columnHint.hints) + (columnHint.hints.length - 1) === this.rowCount;

      if (isMaxedColumn) {
        const maxedColumn = columnHint.hints
          .map((hint, _i) => {
            return _.fill<Square>(Array(hint), '▣');
          })
          .reduce((acc: Square[], hintLine: Square[]) => {
            acc.push(...hintLine);

            if (acc.length !== this.rowCount) {
              acc.push('X');
            }

            return acc;
          }, []);
        this.currentGrid = this.currentGrid.map((row: Square[], rowIndex) => {
          return row.map((square: Square, columnIndex) => {
            if (square == '_' && column === columnIndex) {
              return maxedColumn[rowIndex];
            }

            return square;
          });
        });
      } else if (columnHint.hints.length === 1 && columnHint.hints[0] === 0) {
        this.currentGrid = this.currentGrid.map((row) => {
          return row.map((square, columnIndex) => {
            if (square == '_' && column === columnIndex) {
              return 'X';
            }

            return square;
          });
        });
      }
    });

    let count = 0;
    while (!this.isFullySolved()) {
      count++;

      if (count > 1) {
        console.log(`not solved after ${count} iters`);
        return;
      }

      this.solveRows();
      this.solveColumns();

      this.checkHints();
    }
  };

  print = (): void => {
    const lines: string[] = [];

    const maxColumnHints = this.columnHints.reduce((currentMax: number, columnHint: ColumnHint) => {
      if (columnHint.hints.length > currentMax) {
        return columnHint.hints.length;
      }

      return currentMax;
    }, 0);

    const maxRowHints = this.rowHints.reduce((currentMax: number, rowHint: RowHint) => {
      if (rowHint.hints.length > currentMax) {
        return rowHint.hints.length;
      }

      return currentMax;
    }, 0);

    let topLine = maxColumnHints;

    while (topLine > 0) {
      let columnString = `|${_.repeat(topLine === 1 ? '_' : ' ', maxRowHints * 2 - 1)}|`;

      this.columnHints.forEach((columnHint: ColumnHint) => {
        if (columnHint.hints.length >= topLine) {
          columnString += `${columnHint.hints[columnHint.hints.length - topLine]} `;
        } else {
          columnString += '  ';
        }
      });

      lines.push(columnString);

      topLine--;
    }

    const rowStrings: string[] = this.rowHints.map((rowHint: RowHint, rowIndex) => {
      let rowString = rowHint.hints.join(' ');

      rowString += '|';

      rowString += this.currentGrid[rowIndex].join('|');
      rowString += '|';

      return `|${_.padStart(rowString, lines[0].length - 1, ' ')}`;
    });

    lines.unshift(` ${_.repeat('_', lines[0].length - 2)}`);
    lines.push(...rowStrings);

    console.log(lines.join('\n'));
  };

  getResults = (isDebugOnly = false) => {
    !isDebugOnly && console.log('*----------------------before------------------------*');
    !isDebugOnly && this.print();

    this.solve();

    (!this.isFullySolved() || !isDebugOnly) && console.log('*----------------------after------------------------*');
    (!this.isFullySolved() || !isDebugOnly) && this.print();

    !isDebugOnly && console.log('board.isPotentiallySolved()', this.isPotentiallySolved());
    !isDebugOnly && console.log('board.isFullySolved()', this.isFullySolved());

    if (isDebugOnly && !this.isFullySolved()) {
      console.log('*----------------------board not solved------------------------*');
    }

    return this.isFullySolved();
  };
}
