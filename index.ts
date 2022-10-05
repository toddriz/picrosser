import _ from 'lodash';
import { Board, ColumnHint, RowHint } from './Board';

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

  const zeroesRowHints: RowHint[] = [
    new RowHint([0]),
    new RowHint([0]),
    new RowHint([0]),
    new RowHint([0]),
    new RowHint([0]),
  ];
  const zeroesColumnHints: ColumnHint[] = [
    new ColumnHint([0]),
    new ColumnHint([0]),
    new ColumnHint([0]),
    new ColumnHint([0]),
    new ColumnHint([0]),
  ];

  const allZero5x5 = new Board(5, 5, zeroesRowHints, zeroesColumnHints);

  const mediumRowHints: RowHint[] = [
    new RowHint([3]),
    new RowHint([1]),
    new RowHint([3]),
    new RowHint([1]),
    new RowHint([5]),
  ];
  const mediumColumnHints: ColumnHint[] = [
    new ColumnHint([1, 1, 1]),
    new ColumnHint([5]),
    new ColumnHint([1, 1, 1]),
    new ColumnHint([1]),
    new ColumnHint([1]),
  ];

  const medium5x5 = new Board(5, 5, mediumRowHints, mediumColumnHints);

  const mediumHardRowHints: RowHint[] = [
    new RowHint([5]),
    new RowHint([4]),
    new RowHint([3]),
    new RowHint([2]),
    new RowHint([1]),
  ];
  const mediumHardColumnHints: ColumnHint[] = [
    new ColumnHint([5]),
    new ColumnHint([4]),
    new ColumnHint([3]),
    new ColumnHint([2]),
    new ColumnHint([1]),
  ];

  const mediumHard5x5 = new Board(5, 5, mediumHardRowHints, mediumHardColumnHints);

  const veryHardRowHints: RowHint[] = [
    new RowHint([2, 1]),
    new RowHint([2]),
    new RowHint([3, 1]),
    new RowHint([2, 1]),
    new RowHint([2, 1]),
  ];
  const veryHardColumnHints: ColumnHint[] = [
    // top to bottom
    new ColumnHint([1, 2]),
    new ColumnHint([5]),
    new ColumnHint([2, 1]),
    new ColumnHint([1]),
    new ColumnHint([3]),
  ];

  const veryHard5x5 = new Board(5, 5, veryHardRowHints, veryHardColumnHints);

  boards.push(easy5x5);
  boards.push(allZero5x5);
  boards.push(medium5x5);
  boards.push(mediumHard5x5);
  boards.push(veryHard5x5);

  const boardSolvedCount = boards
    .map((board) => board.getResults(true))
    .reduce((acc, isSolved) => {
      if (isSolved) {
        return ++acc;
      }

      return acc;
    }, 0);

  console.log(
    `*----------------------${boardSolvedCount} board(s)out of ${boards.length} boards------------------------`
  );
};

main();
