import { Equal, Expect } from 'type-testing';

// type definitions
type TicTacToeChip = '❌' | '⭕';
type TicTacToeEndState = '❌ Won' | '⭕ Won' | 'Draw';
type TicTacToeState = TicTacToeChip | TicTacToeEndState;
type TicTacToeEmptyCell = '  '
type TicTacToeCell = TicTacToeChip | TicTacToeEmptyCell;
type TicTacToeYPositions = 'top' | 'middle' | 'bottom';
type TicTacToeXPositions = 'left' | 'center' | 'right';
type TicTacToePositions = `${TicTacToeYPositions}-${TicTacToeXPositions}`;
type TicTactToeBoard = TicTacToeCell[][];
type TicTacToeGame = {
  board: TicTactToeBoard;
  state: TicTacToeState;
};

type EmptyBoard = [
  ['  ', '  ', '  '], 
  ['  ', '  ', '  '], 
  ['  ', '  ', '  ']
];

type NewGame = {
  board: EmptyBoard;
  state: '❌';
};

type ToBoardIndices<Position extends TicTacToePositions> =
  Position extends 'top-center' ? [0, 1] :
  Position extends 'top-right' ? [0, 2] :
  Position extends 'middle-right' ? [1, 2] :
  Position extends 'bottom-right' ? [2, 2] :
  Position extends 'bottom-center' ? [2, 1] :
  Position extends 'bottom-left' ? [2, 0] :
  Position extends 'middle-left' ? [1, 0] :
  Position extends 'top-left' ? [0, 0] :
  Position extends 'middle-center' ? [1, 1] : never
;

type SameChip<Board extends TicTactToeBoard, P1 extends TicTacToePositions, P2 extends TicTacToePositions, P3 extends TicTacToePositions, Chip extends TicTacToeChip> =
  Board[ToBoardIndices<P1>[0]][ToBoardIndices<P1>[1]] extends Chip ?
    Board[ToBoardIndices<P2>[0]][ToBoardIndices<P2>[1]] extends Chip ?
      Board[ToBoardIndices<P3>[0]][ToBoardIndices<P3>[1]] extends Chip ? true
      : false
    : false
  : false
;

type IsWinning<Board extends TicTactToeBoard, Player extends TicTacToeChip> =
  SameChip<Board, 'top-left', 'top-center', 'top-right', Player> extends true ? true :
  SameChip<Board, 'middle-left', 'middle-center', 'middle-right', Player> extends true ? true :
  SameChip<Board, 'bottom-left', 'bottom-center', 'bottom-right', Player> extends true ? true :
  SameChip<Board, 'top-left', 'middle-left', 'bottom-left', Player> extends true ? true :
  SameChip<Board, 'top-center', 'middle-center', 'bottom-center', Player> extends true ? true :
  SameChip<Board, 'top-right', 'middle-right', 'bottom-right', Player> extends true ? true :
  SameChip<Board, 'top-left', 'middle-center', 'bottom-right', Player> extends true ? true :
  SameChip<Board, 'bottom-left', 'middle-center', 'top-right', Player> extends true ? true :
  false
;

type IsFull<Board extends TicTactToeBoard> =
  Board[0][0] extends TicTacToeEmptyCell ? false :
  Board[0][1] extends TicTacToeEmptyCell ? false :
  Board[0][2] extends TicTacToeEmptyCell ? false :
  Board[1][0] extends TicTacToeEmptyCell ? false :
  Board[1][1] extends TicTacToeEmptyCell ? false :
  Board[1][2] extends TicTacToeEmptyCell ? false :
  Board[2][0] extends TicTacToeEmptyCell ? false :
  Board[2][1] extends TicTacToeEmptyCell ? false :
  Board[2][2] extends TicTacToeEmptyCell ? false :
  true
;

// calculate the next board
type NextBoard<Board extends TicTactToeBoard, Move extends TicTacToePositions, Chip extends TicTacToeChip> =
  [
    [Move extends 'top-left' ? Chip : Board[0][0], Move extends 'top-center' ? Chip : Board[0][1], Move extends 'top-right' ? Chip : Board[0][2]],
    [Move extends 'middle-left' ? Chip : Board[1][0], Move extends 'middle-center' ? Chip : Board[1][1], Move extends 'middle-right' ? Chip : Board[1][2]],
    [Move extends 'bottom-left' ? Chip : Board[2][0], Move extends 'bottom-center' ? Chip : Board[2][1], Move extends 'bottom-right' ? Chip : Board[2][2]]
  ]
;

// calculate the next state of the game based on the current board and player
type NextState<Board extends TicTactToeBoard, Player extends TicTacToeChip> =
  IsWinning<Board, Player> extends true ? `${Player} Won` :
  IsFull<Board> extends true ? 'Draw' :
  Player extends '❌' ? '⭕' : '❌'
;

// entry point
type TicTacToe<Game extends TicTacToeGame, Move extends TicTacToePositions> =
  Game["board"][ToBoardIndices<Move>[0]][ToBoardIndices<Move>[1]] extends TicTacToeEmptyCell ?
    Game["state"] extends TicTacToeChip ? { board: NextBoard<Game["board"], Move, Game["state"]>, state: NextState<NextBoard<Game["board"], Move, Game["state"]>, Game["state"]> } : never
  : Game // invalid move, do nothing
;

// tests
type test_move1_actual = TicTacToe<NewGame, 'top-center'>;
//   ^?
type test_move1_expected = {
  board: [
    [ '  ', '❌', '  ' ],
    [ '  ', '  ', '  ' ],
    [ '  ', '  ', '  ' ]
  ];
  state: '⭕';
};
type test_move1 = Expect<Equal<test_move1_actual, test_move1_expected>>;

type test_move2_actual = TicTacToe<test_move1_actual, 'top-left'>;
//   ^?
type test_move2_expected = {
  board: [
    ['⭕', '❌', '  '], 
    ['  ', '  ', '  '], 
    ['  ', '  ', '  ']];
  state: '❌';
}
type test_move2 = Expect<Equal<test_move2_actual, test_move2_expected>>;

type test_move3_actual = TicTacToe<test_move2_actual, 'middle-center'>;
//   ^?
type test_move3_expected = {
  board: [
    [ '⭕', '❌', '  ' ],
    [ '  ', '❌', '  ' ],
    [ '  ', '  ', '  ' ]
  ];
  state: '⭕';
};
type test_move3 = Expect<Equal<test_move3_actual, test_move3_expected>>;

type test_move4_actual = TicTacToe<test_move3_actual, 'bottom-left'>;
//   ^?
type test_move4_expected = {
  board: [
    [ '⭕', '❌', '  ' ],
    [ '  ', '❌', '  ' ],
    [ '⭕', '  ', '  ' ]
  ];
  state: '❌';
};
type test_move4 = Expect<Equal<test_move4_actual, test_move4_expected>>;


type test_x_win_actual = TicTacToe<test_move4_actual, 'bottom-center'>;
//   ^?
type test_x_win_expected = {
  board: [
    [ '⭕', '❌', '  ' ],
    [ '  ', '❌', '  ' ],
    [ '⭕', '❌', '  ' ]
  ];
  state: '❌ Won';
};
type test_x_win = Expect<Equal<test_x_win_actual, test_x_win_expected>>;

type type_move5_actual = TicTacToe<test_move4_actual, 'bottom-right'>;
//   ^?
type type_move5_expected = {
  board: [
    [ '⭕', '❌', '  ' ],
    [ '  ', '❌', '  ' ],
    [ '⭕', '  ', '❌' ]
  ];
  state: '⭕';
};
type test_move5 = Expect<Equal<type_move5_actual, type_move5_expected>>;

type test_o_win_actual = TicTacToe<type_move5_actual, 'middle-left'>;
//   ^?
type test_o_win_expected = {
  board: [
    [ '⭕', '❌', '  ' ],
    [ '⭕', '❌', '  ' ],
    [ '⭕', '  ', '❌' ]
  ];
  state: '⭕ Won';
};

// invalid move don't change the board and state
type test_invalid_actual = TicTacToe<test_move1_actual, 'top-center'>;
//   ^?
type test_invalid_expected = {
  board: [
    [ '  ', '❌', '  ' ],
    [ '  ', '  ', '  ' ],
    [ '  ', '  ', '  ' ]
  ];
  state: '⭕';
};
type test_invalid = Expect<Equal<test_invalid_actual, test_invalid_expected>>;

type test_before_draw = {
  board: [
    ['⭕', '❌', '⭕'], 
    ['⭕', '❌', '❌'], 
    ['❌', '⭕', '  ']];
  state: '⭕';
}
type test_draw_actual = TicTacToe<test_before_draw, 'bottom-right'>;
//   ^?
type test_draw_expected = {
  board: [
    ['⭕', '❌', '⭕'], 
    ['⭕', '❌', '❌'], 
    ['❌', '⭕', '⭕']];
  state: 'Draw';
}
type test_draw = Expect<Equal<test_draw_actual, test_draw_expected>>;
