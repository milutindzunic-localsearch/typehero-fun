import { Expect, Equal } from "type-testing";

// type definitions
// super brute-force approach this time...
type Connect4Chips = '🔴' | '🟡';
type Connect4EmptyCell = '  ';
type Connect4Cell = Connect4Chips | Connect4EmptyCell;
type Connect4State = '🔴' | '🟡' | '🔴 Won' | '🟡 Won' | 'Draw';

type Connect4Board = [
  [Connect4Cell, Connect4Cell, Connect4Cell, Connect4Cell, Connect4Cell, Connect4Cell, Connect4Cell],
  [Connect4Cell, Connect4Cell, Connect4Cell, Connect4Cell, Connect4Cell, Connect4Cell, Connect4Cell],
  [Connect4Cell, Connect4Cell, Connect4Cell, Connect4Cell, Connect4Cell, Connect4Cell, Connect4Cell],
  [Connect4Cell, Connect4Cell, Connect4Cell, Connect4Cell, Connect4Cell, Connect4Cell, Connect4Cell],
  [Connect4Cell, Connect4Cell, Connect4Cell, Connect4Cell, Connect4Cell, Connect4Cell, Connect4Cell],
  [Connect4Cell, Connect4Cell, Connect4Cell, Connect4Cell, Connect4Cell, Connect4Cell, Connect4Cell],
];

type EmptyBoard = [
  ["  ", "  ", "  ", "  ", "  ", "  ", "  "],
  ["  ", "  ", "  ", "  ", "  ", "  ", "  "],
  ["  ", "  ", "  ", "  ", "  ", "  ", "  "],
  ["  ", "  ", "  ", "  ", "  ", "  ", "  "],
  ["  ", "  ", "  ", "  ", "  ", "  ", "  "],
  ["  ", "  ", "  ", "  ", "  ", "  ", "  "],
];

type Connect4Game = {
  board: Connect4Board,
  state: Connect4State
}

type NewGame = {
  board: EmptyBoard;
  state: "🟡";
};

type Row<Board extends Connect4Board, M extends number> =
  Board[M]
;

type Column<Board extends Connect4Board, N extends number> =
  [Board[0][N], Board[1][N], Board[2][N], Board[3][N], Board[4][N], Board[5][N]]
;

type Diagonals = 'top-left' | 'one-below' | 'two-below' | 'one-right' | 'two-right' | 'three-right';

type Diagonal<Board extends Connect4Board, D extends Diagonals> =
  D extends 'top-left'    ? [Board[0][0], Board[1][1], Board[2][2], Board[3][3], Board[4][4], Board[5][5]] :
  D extends 'one-below'   ? [Board[1][0], Board[2][1], Board[3][2], Board[4][3], Board[5][4]] :
  D extends 'two-below'   ? [Board[2][0], Board[3][1], Board[4][2], Board[5][3]] :
  D extends 'one-right'   ? [Board[0][1], Board[1][2], Board[2][3], Board[3][4], Board[4][5], Board[5][6]] :
  D extends 'two-right'   ? [Board[0][2], Board[1][3], Board[2][4], Board[3][5], Board[4][6]] :
  D extends 'three-right' ? [Board[0][3], Board[1][4], Board[2][5], Board[3][6]] :
  never
;

type AntiDiagonals = 'top-right' | 'one-below' | 'two-below' | 'one-left' | 'two-left' | 'three-left';

type AntiDiagonal<Board extends Connect4Board, AD extends AntiDiagonals> =
  AD extends 'top-right'  ? [Board[0][6], Board[1][5], Board[2][4], Board[3][3], Board[4][2], Board[5][1]] :
  AD extends 'one-below'  ? [Board[1][6], Board[2][5], Board[3][4], Board[4][3], Board[5][2]] :
  AD extends 'two-below'  ? [Board[2][6], Board[3][5], Board[4][4], Board[5][3]] :
  AD extends 'one-left'   ? [Board[0][5], Board[1][4], Board[2][3], Board[3][2], Board[4][1], Board[5][0]] :
  AD extends 'two-left'   ? [Board[0][4], Board[1][3], Board[2][2], Board[3][1], Board[4][0]] :
  AD extends 'three-left' ? [Board[0][3], Board[1][2], Board[2][1], Board[3][0], Board[4][2], Board[5][1]] :
  never
;

type HasFreeSpace<Arr extends unknown[]> =
  Arr extends [infer First, ...infer Rest] ?
    First extends Connect4EmptyCell ? true : HasFreeSpace<Rest> :
  false
;

type WithMove<Board extends Connect4Board, MoveColumn extends number, MoveChip extends Connect4Chips> =
  // not a very pretty solution here...
  HasFreeSpace<Column<Board, MoveColumn>> extends true ?
    Board[5][MoveColumn] extends Connect4EmptyCell ? [Board[0], Board[1], Board[2], Board[3], Board[4], RowWithMove<Board[5], MoveColumn, MoveChip>] :
    Board[4][MoveColumn] extends Connect4EmptyCell ? [Board[0], Board[1], Board[2], Board[3], RowWithMove<Board[4], MoveColumn, MoveChip>, Board[5]] :
    Board[3][MoveColumn] extends Connect4EmptyCell ? [Board[0], Board[1], Board[2], RowWithMove<Board[3], MoveColumn, MoveChip>, Board[4], Board[5]] :
    Board[2][MoveColumn] extends Connect4EmptyCell ? [Board[0], Board[1], RowWithMove<Board[2], MoveColumn, MoveChip>, Board[3], Board[4], Board[5]] :
    Board[1][MoveColumn] extends Connect4EmptyCell ? [Board[0], RowWithMove<Board[1], MoveColumn, MoveChip>, Board[2], Board[3], Board[4], Board[5]] :
    Board[0][MoveColumn] extends Connect4EmptyCell ? [RowWithMove<Board[0], MoveColumn, MoveChip>, Board[1], Board[2], Board[3], Board[4], Board[5]] :
    never :
  never
;

type RowWithMove<Row extends unknown[], N extends number, MoveChip extends Connect4Chips> =
  N extends 0 ? [MoveChip, Row[1], Row[2], Row[3], Row[4], Row[5], Row[6]] :
  N extends 1 ? [Row[0], MoveChip, Row[2], Row[3], Row[4], Row[5], Row[6]] :
  N extends 2 ? [Row[0], Row[1], MoveChip, Row[3], Row[4], Row[5], Row[6]] :
  N extends 3 ? [Row[0], Row[1], Row[2], MoveChip, Row[4], Row[5], Row[6]] :
  N extends 4 ? [Row[0], Row[1], Row[2], Row[3], MoveChip, Row[5], Row[6]] :
  N extends 5 ? [Row[0], Row[1], Row[2], Row[3], Row[4], MoveChip, Row[6]] :
  N extends 6 ? [Row[0], Row[1], Row[2], Row[3], Row[4], Row[5], MoveChip] :
  never
;

type IsFilled<Board extends Connect4Board> =
  HasFreeSpace<Row<Board, 0>> extends true ? false :
  HasFreeSpace<Row<Board, 1>> extends true ? false :
  HasFreeSpace<Row<Board, 2>> extends true ? false :
  HasFreeSpace<Row<Board, 3>> extends true ? false :
  HasFreeSpace<Row<Board, 4>> extends true ? false :
  HasFreeSpace<Row<Board, 5>> extends true ? false :

  HasFreeSpace<Column<Board, 0>> extends true ? false :
  HasFreeSpace<Column<Board, 1>> extends true ? false :
  HasFreeSpace<Column<Board, 2>> extends true ? false :
  HasFreeSpace<Column<Board, 3>> extends true ? false :
  HasFreeSpace<Column<Board, 4>> extends true ? false :
  HasFreeSpace<Column<Board, 5>> extends true ? false :
  HasFreeSpace<Column<Board, 6>> extends true ? false :

  HasFreeSpace<Diagonal<Board, 'top-left'>> extends true ? false :
  HasFreeSpace<Diagonal<Board, 'one-below'>> extends true ? false :
  HasFreeSpace<Diagonal<Board, 'two-below'>> extends true ? false :
  HasFreeSpace<Diagonal<Board, 'one-right'>> extends true ? false :
  HasFreeSpace<Diagonal<Board, 'two-right'>> extends true ? false :
  HasFreeSpace<Diagonal<Board, 'three-right'>> extends true ? false :

  HasFreeSpace<AntiDiagonal<Board, 'top-right'>> extends true ? false :
  HasFreeSpace<AntiDiagonal<Board, 'one-below'>> extends true ? false :
  HasFreeSpace<AntiDiagonal<Board, 'two-below'>> extends true ? false :
  HasFreeSpace<AntiDiagonal<Board, 'one-left'>> extends true ? false :
  HasFreeSpace<AntiDiagonal<Board, 'two-left'>> extends true ? false :
  HasFreeSpace<AntiDiagonal<Board, 'three-left'>> extends true ? false :

  true
;

type HasFourInARow<Arr extends unknown[], Chip extends Connect4Chips, Cnt extends any[] = []> =
  Cnt["length"] extends 4 ? true : // 4 chips in a row found
  Arr extends [] ? false :         // end of array
  Arr extends [infer First, ...infer Rest] ?
    First extends Chip ?
      HasFourInARow<Rest, Chip, [...Cnt, 0]> :
      HasFourInARow<Rest, Chip, []> :
  false
;

type ChipWon<Board extends Connect4Board, Chip extends Connect4Chips> =
  
  HasFourInARow<Row<Board, 0>, Chip> extends true ? true :
  HasFourInARow<Row<Board, 1>, Chip> extends true ? true :
  HasFourInARow<Row<Board, 2>, Chip> extends true ? true :
  HasFourInARow<Row<Board, 3>, Chip> extends true ? true :
  HasFourInARow<Row<Board, 4>, Chip> extends true ? true :
  HasFourInARow<Row<Board, 5>, Chip> extends true ? true :

  HasFourInARow<Column<Board, 0>, Chip> extends true ? true :
  HasFourInARow<Column<Board, 1>, Chip> extends true ? true :
  HasFourInARow<Column<Board, 2>, Chip> extends true ? true :
  HasFourInARow<Column<Board, 3>, Chip> extends true ? true :
  HasFourInARow<Column<Board, 4>, Chip> extends true ? true :
  HasFourInARow<Column<Board, 5>, Chip> extends true ? true :
  HasFourInARow<Column<Board, 6>, Chip> extends true ? true :

  HasFourInARow<Diagonal<Board, 'top-left'>, Chip> extends true ? true :
  HasFourInARow<Diagonal<Board, 'one-below'>, Chip> extends true ? true :
  HasFourInARow<Diagonal<Board, 'two-below'>, Chip> extends true ? true :
  HasFourInARow<Diagonal<Board, 'one-right'>, Chip> extends true ? true :
  HasFourInARow<Diagonal<Board, 'two-right'>, Chip> extends true ? true :
  HasFourInARow<Diagonal<Board, 'three-right'>, Chip> extends true ? true :

  HasFourInARow<AntiDiagonal<Board, 'top-right'>, Chip> extends true ? true :
  HasFourInARow<AntiDiagonal<Board, 'one-below'>, Chip> extends true ? true :
  HasFourInARow<AntiDiagonal<Board, 'two-below'>, Chip> extends true ? true :
  HasFourInARow<AntiDiagonal<Board, 'one-left'>, Chip> extends true ? true :
  HasFourInARow<AntiDiagonal<Board, 'two-left'>, Chip> extends true ? true :
  HasFourInARow<AntiDiagonal<Board, 'three-left'>, Chip> extends true ? true :

  false;

type YellowWon<Board extends Connect4Board> =
  ChipWon<Board, '🟡'>;

type RedWon<Board extends Connect4Board> =
  ChipWon<Board, '🔴'>;

type CalculateState<Board extends Connect4Board, Chip extends Connect4Chips> =
  IsFilled<Board> extends true ?
    'Draw' :
  YellowWon<Board> extends true ?
    '🟡 Won' :
  RedWon<Board> extends true ?
    '🔴 Won' :
  Chip extends '🟡' ? '🔴' : '🟡'
;

type Connect4Next<Board extends unknown, Chip extends Connect4Chips> = {
  // calculate the game based on the game after the move
  board: Board,
  state: Board extends Connect4Board ? CalculateState<Board, Chip> : never // just want to protect from having unknowns everywhere...
};

type Connect4<Game extends Connect4Game, MoveColumn extends number> =
  Game["state"] extends '🔴' | '🟡' ?
     Connect4Next<WithMove<Game["board"], MoveColumn, Game["state"]>, Game["state"]> :
  never // game already finished
;

// tests
type test_move1_actual = Connect4<NewGame, 0>;
//   ^?
type test_move1_expected = {
  board: [
    ["  ", "  ", "  ", "  ", "  ", "  ", "  "],
    ["  ", "  ", "  ", "  ", "  ", "  ", "  "],
    ["  ", "  ", "  ", "  ", "  ", "  ", "  "],
    ["  ", "  ", "  ", "  ", "  ", "  ", "  "],
    ["  ", "  ", "  ", "  ", "  ", "  ", "  "],
    ["🟡", "  ", "  ", "  ", "  ", "  ", "  "],
  ];
  state: "🔴";
};
type test_move1 = Expect<Equal<test_move1_actual, test_move1_expected>>;

type test_move2_actual = Connect4<test_move1_actual, 0>;
//   ^?
type test_move2_expected = {
  board: [
    ["  ", "  ", "  ", "  ", "  ", "  ", "  "],
    ["  ", "  ", "  ", "  ", "  ", "  ", "  "],
    ["  ", "  ", "  ", "  ", "  ", "  ", "  "],
    ["  ", "  ", "  ", "  ", "  ", "  ", "  "],
    ["🔴", "  ", "  ", "  ", "  ", "  ", "  "],
    ["🟡", "  ", "  ", "  ", "  ", "  ", "  "],
  ];
  state: "🟡";
};
type test_move2 = Expect<Equal<test_move2_actual, test_move2_expected>>;

type test_move3_actual = Connect4<test_move2_actual, 0>;
//   ^?
type test_move3_expected = {
  board: [
    ["  ", "  ", "  ", "  ", "  ", "  ", "  "],
    ["  ", "  ", "  ", "  ", "  ", "  ", "  "],
    ["  ", "  ", "  ", "  ", "  ", "  ", "  "],
    ["🟡", "  ", "  ", "  ", "  ", "  ", "  "],
    ["🔴", "  ", "  ", "  ", "  ", "  ", "  "],
    ["🟡", "  ", "  ", "  ", "  ", "  ", "  "],
  ];
  state: "🔴";
};
type test_move3 = Expect<Equal<test_move3_actual, test_move3_expected>>;

type test_move4_actual = Connect4<test_move3_actual, 1>;
//   ^?
type test_move4_expected = {
  board: [
    ["  ", "  ", "  ", "  ", "  ", "  ", "  "],
    ["  ", "  ", "  ", "  ", "  ", "  ", "  "],
    ["  ", "  ", "  ", "  ", "  ", "  ", "  "],
    ["🟡", "  ", "  ", "  ", "  ", "  ", "  "],
    ["🔴", "  ", "  ", "  ", "  ", "  ", "  "],
    ["🟡", "🔴", "  ", "  ", "  ", "  ", "  "],
  ];
  state: "🟡";
};
type test_move4 = Expect<Equal<test_move4_actual, test_move4_expected>>;

type test_move5_actual = Connect4<test_move4_actual, 2>;
//   ^?
type test_move5_expected = {
  board: [
    ["  ", "  ", "  ", "  ", "  ", "  ", "  "],
    ["  ", "  ", "  ", "  ", "  ", "  ", "  "],
    ["  ", "  ", "  ", "  ", "  ", "  ", "  "],
    ["🟡", "  ", "  ", "  ", "  ", "  ", "  "],
    ["🔴", "  ", "  ", "  ", "  ", "  ", "  "],
    ["🟡", "🔴", "🟡", "  ", "  ", "  ", "  "],
  ];
  state: "🔴";
};
type test_move5 = Expect<Equal<test_move5_actual, test_move5_expected>>;

type test_move6_actual = Connect4<test_move5_actual, 1>;
//   ^?
type test_move6_expected = {
  board: [
    ["  ", "  ", "  ", "  ", "  ", "  ", "  "],
    ["  ", "  ", "  ", "  ", "  ", "  ", "  "],
    ["  ", "  ", "  ", "  ", "  ", "  ", "  "],
    ["🟡", "  ", "  ", "  ", "  ", "  ", "  "],
    ["🔴", "🔴", "  ", "  ", "  ", "  ", "  "],
    ["🟡", "🔴", "🟡", "  ", "  ", "  ", "  "],
  ];
  state: "🟡";
};
type test_move6 = Expect<Equal<test_move6_actual, test_move6_expected>>;

type test_red_win_actual = Connect4<
  {
    board: [
      ['  ', '  ', '  ', '  ', '  ', '  ', '  '],
      ['  ', '  ', '  ', '  ', '  ', '  ', '  '],
      ['🟡', '  ', '  ', '  ', '  ', '  ', '  '],
      ['🟡', '  ', '  ', '  ', '  ', '  ', '  '],
      ['🔴', '🔴', '🔴', '  ', '  ', '  ', '  '],
      ['🟡', '🔴', '🟡', '🟡', '  ', '  ', '  ']
    ];
    state: '🔴';
  },
  3
>;

type test_red_win_expected = {
  board: [
    ['  ', '  ', '  ', '  ', '  ', '  ', '  '],
    ['  ', '  ', '  ', '  ', '  ', '  ', '  '],
    ['🟡', '  ', '  ', '  ', '  ', '  ', '  '],
    ['🟡', '  ', '  ', '  ', '  ', '  ', '  '],
    ['🔴', '🔴', '🔴', '🔴', '  ', '  ', '  '],
    ['🟡', '🔴', '🟡', '🟡', '  ', '  ', '  ']
  ];
  state: '🔴 Won';
};

type test_red_win = Expect<Equal<test_red_win_actual, test_red_win_expected>>;

type test_yellow_win_actual = Connect4<
  {
    board: [
      ['  ', '  ', '  ', '  ', '  ', '  ', '  '],
      ['  ', '  ', '  ', '  ', '  ', '  ', '  '],
      ['🔴', '  ', '  ', '  ', '  ', '  ', '  '],
      ['🟡', '  ', '  ', '  ', '  ', '  ', '  '],
      ['🔴', '  ', '🔴', '🔴', '  ', '  ', '  '],
      ['🟡', '  ', '🟡', '🟡', '  ', '  ', '  ']
    ];
    state: '🟡';
  },
  1
>;

type test_yellow_win_expected = {
  board: [
    ['  ', '  ', '  ', '  ', '  ', '  ', '  '],
    ['  ', '  ', '  ', '  ', '  ', '  ', '  '],
    ['🔴', '  ', '  ', '  ', '  ', '  ', '  '],
    ['🟡', '  ', '  ', '  ', '  ', '  ', '  '],
    ['🔴', '  ', '🔴', '🔴', '  ', '  ', '  '],
    ['🟡', '🟡', '🟡', '🟡', '  ', '  ', '  ']
  ];
  state: '🟡 Won';
};

type test_yellow_win = Expect<
  Equal<test_yellow_win_actual, test_yellow_win_expected>
>;

type test_diagonal_yellow_win_actual = Connect4<
  {
    board: [
      ['  ', '  ', '  ', '  ', '  ', '  ', '  '],
      ['  ', '  ', '  ', '  ', '  ', '  ', '  '],
      ['  ', '  ', '  ', '  ', '  ', '  ', '  '],
      ['  ', '  ', '🟡', '🔴', '  ', '  ', '  '],
      ['🔴', '🟡', '🔴', '🔴', '  ', '  ', '  '],
      ['🟡', '🔴', '🟡', '🟡', '  ', '  ', '  ']
    ];
    state: '🟡';
  },
  3
>;

type test_diagonal_yellow_win_expected = {
  board: [
    ['  ', '  ', '  ', '  ', '  ', '  ', '  '],
    ['  ', '  ', '  ', '  ', '  ', '  ', '  '],
    ['  ', '  ', '  ', '🟡', '  ', '  ', '  '],
    ['  ', '  ', '🟡', '🔴', '  ', '  ', '  '],
    ['🔴', '🟡', '🔴', '🔴', '  ', '  ', '  '],
    ['🟡', '🔴', '🟡', '🟡', '  ', '  ', '  ']
  ];
  state: '🟡 Won';
};

type test_diagonal_yellow_win = Expect<
  Equal<test_diagonal_yellow_win_actual, test_diagonal_yellow_win_expected>
>;

type test_draw_actual = Connect4<
  {
    board: [
      ['🟡', '🔴', '🔴', '🟡', '🟡', '🔴', '  '],
      ['🔴', '🟡', '🟡', '🔴', '🔴', '🟡', '🔴'],
      ['🟡', '🔴', '🔴', '🟡', '🟡', '🔴', '🟡'],
      ['🔴', '🟡', '🟡', '🔴', '🔴', '🟡', '🔴'],
      ['🟡', '🔴', '🔴', '🟡', '🟡', '🔴', '🟡'],
      ['🔴', '🟡', '🟡', '🔴', '🔴', '🟡', '🔴']
    ];
    state: '🟡';
  },
  6
>;

type test_draw_expected = {
  board: [
    ['🟡', '🔴', '🔴', '🟡', '🟡', '🔴', '🟡'],
    ['🔴', '🟡', '🟡', '🔴', '🔴', '🟡', '🔴'],
    ['🟡', '🔴', '🔴', '🟡', '🟡', '🔴', '🟡'],
    ['🔴', '🟡', '🟡', '🔴', '🔴', '🟡', '🔴'],
    ['🟡', '🔴', '🔴', '🟡', '🟡', '🔴', '🟡'],
    ['🔴', '🟡', '🟡', '🔴', '🔴', '🟡', '🔴']
  ];
  state: 'Draw';
};

type test_draw = Expect<Equal<test_draw_actual, test_draw_expected>>;
