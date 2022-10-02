import _ from "lodash";

type Square = "_" | "X" | "▣";

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

  currentGrid: string[][] = [];

  rowHints: RowHint[];
  columnHints: ColumnHint[];

  constructor(rowCount: number, columnCount: number, rowHints: RowHint[], columnHints: ColumnHint[]) {
    // if (_.some(rowHints, (rowHint) => rowHint.hints.length !== rowCount)) {
    //   throw "bad rowHints";
    // }

    // if (_.some(columnHints, (columnHint) => columnHint.hints.length !== columnCount)) {
    //   throw "bad columnHints";
    // }

    this.rowCount = rowCount;
    this.columnCount = columnCount;

    this.rowHints = rowHints;
    this.columnHints = columnHints;

    this.currentGrid = _.fill(Array(this.rowCount), _.fill(Array(this.columnCount), "_"));
  }

  isPotentiallySolved = () => {
    const expectedRowBoxCount = this.rowHints.reduce((total, rowHint) => total + _.sum(rowHint.hints), 0);
    const expectedColumnBoxCount = this.columnHints.reduce((total, columnHint) => total + _.sum(columnHint.hints), 0);

    // console.log("expectedRowBoxCount", expectedRowBoxCount);
    // console.log("expectedColumnBoxCount", expectedColumnBoxCount);

    const currentFilledBoxCount = this.currentGrid.reduce((filledCount, row) => {
      return filledCount + _.sumBy(row, (square) => (square === "▣" ? 1 : 0));
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
            if (square === "▣") {
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
            if (square === "▣") {
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
    // TODO implement
  }
  solveColumns() {
    // TODO implement
  }

  solve = () => {
    this.rowHints.forEach((rowHint, row) => {
      const isMaxedRow = _.sum(rowHint.hints) + (rowHint.hints.length - 1) === this.columnCount;

      if (isMaxedRow) {
        this.currentGrid[row] = rowHint.hints
          .map((hint) => {
            return _.fill(Array(hint), "▣");
          })
          .reduce((acc: string[], hintLine: string[]) => {
            acc.push(...hintLine);

            if (acc.length !== this.columnCount) {
              acc.push("X");
            }

            return acc;
          }, []);
      } else if (rowHint.hints.length === 1 && rowHint.hints[0] === 0) {
        this.currentGrid[row] = _.fill(Array(this.columnCount), "X");
      }
    });

    this.columnHints.forEach((columnHint, column) => {
      const isMaxedColumn = _.sum(columnHint.hints) + (columnHint.hints.length - 1) === this.rowCount;

      if (isMaxedColumn) {
        this.currentGrid = this.currentGrid.map((row) => {
          return row.map((square, columnIndex) => {
            if (square == "_" && column === columnIndex) {
              return "▣";
            }

            return square;
          });
        });
      } else if (columnHint.hints.length === 1 && columnHint.hints[0] === 0) {
        this.currentGrid = this.currentGrid.map((row) => {
          return row.map((square, columnIndex) => {
            if (square == "_" && column === columnIndex) {
              return "X";
            }

            return square;
          });
        });
      }
    });

    let count = 0;
    while (!this.isFullySolved()) {
      count++;

      if (count > 1000) {
        throw `not solved after ${count} iters`;
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

    // console.log("maxColumnHints", maxColumnHints);
    // console.log("maxRowHints", maxRowHints);

    let topLine = maxColumnHints;

    while (topLine > 0) {
      let columnString = `|${_.repeat(topLine === 1 ? "_" : " ", maxRowHints * 2 - 1)}|`;

      this.columnHints.forEach((columnHint: ColumnHint) => {
        if (columnHint.hints.length >= topLine) {
          columnString += `${columnHint.hints[columnHint.hints.length - topLine]} `;
        } else {
          columnString += "  ";
        }
      });

      lines.push(columnString);

      topLine--;
    }

    const rowStrings: string[] = this.rowHints.map((rowHint: RowHint, rowIndex) => {
      let rowString = rowHint.hints.join(" ");

      rowString += "|";

      rowString += this.currentGrid[rowIndex].join("|");
      rowString += "|";

      return `|${_.padStart(rowString, lines[0].length - 1, " ")}`;
    });

    lines.unshift(` ${_.repeat("_", lines[0].length - 2)}`);
    lines.push(...rowStrings);

    console.log(lines.join("\n"));
  };

  getResults = () => {
    console.log("*----------------------before------------------------*");
    this.print();

    this.solve();

    console.log("this.rowHints", this.rowHints);
    console.log("this.columnHints", this.columnHints);

    console.log("*----------------------after------------------------*");
    this.print();

    console.log("board.isPotentiallySolved()", this.isPotentiallySolved());
    console.log("board.isFullySolved()", this.isFullySolved());
  };
}
