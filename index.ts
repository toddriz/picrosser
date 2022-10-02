import _ from "lodash";
import { Board, ColumnHint, RowHint } from "./board";

const main = () => {
  const boards: Board[] = [];

  const easy5x5RowHints: RowHint[] = [
    new RowHint([2, 2]),
    new RowHint([1, 1]),
    new RowHint([1, 1, 1]),
    new RowHint([5]),
    new RowHint([5]),
  ];
  const easy5x5ColumnHints: ColumnHint[] = [
    // top to bottom
    new ColumnHint([5]),
    new ColumnHint([1, 2]),
    new ColumnHint([3]),
    new ColumnHint([1, 2]),
    new ColumnHint([5]),
  ];

  const easy5x5 = new Board(5, 5, easy5x5RowHints, easy5x5ColumnHints);

  const rowHints: RowHint[] = [
    new RowHint([0]),
    new RowHint([0]),
    new RowHint([0]),
    new RowHint([0]),
    new RowHint([0]),
  ];
  const columnHints: ColumnHint[] = [
    // top to bottom
    new ColumnHint([0]),
    new ColumnHint([0]),
    new ColumnHint([0]),
    new ColumnHint([0]),
    new ColumnHint([0]),
  ];

  const allZero5x5 = new Board(5, 5, rowHints, columnHints);

  const hardRowHints: RowHint[] = [
    new RowHint([2, 1]),
    new RowHint([2]),
    new RowHint([3, 1]),
    new RowHint([2, 1]),
    new RowHint([2, 1]),
  ];
  const hardColumnHints: ColumnHint[] = [
    // top to bottom
    new ColumnHint([1, 2]),
    new ColumnHint([5]),
    new ColumnHint([2, 1]),
    new ColumnHint([1]),
    new ColumnHint([3]),
  ];

  const hard5x5 = new Board(5, 5, hardRowHints, hardColumnHints);

  boards.push(easy5x5);
  boards.push(allZero5x5);
  boards.push(hard5x5);

  boards.forEach((board) => board.getResults());
};

main();
