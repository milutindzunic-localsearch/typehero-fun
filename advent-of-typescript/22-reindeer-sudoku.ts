import { Equal, Expect } from 'type-testing';

// type definitions
/** because "dashing" implies speed */
type Dasher = '💨';

/** representing dancing or grace */
type Dancer = '💃';

/** a deer, prancing */
type Prancer = '🦌';

/** a star for the dazzling, slightly mischievous Vixen */
type Vixen = '🌟';

/** for the celestial body that shares its name */
type Comet = '☄️';

/** symbolizing love, as Cupid is the god of love */
type Cupid = '❤️';

/** representing thunder, as "Donner" means thunder in German */
type Donner = '🌩️';

/** meaning lightning in German, hence the lightning bolt */
type Blitzen = '⚡';

/** for his famous red nose */
type Rudolph = '🔴';

type Reindeer = Dasher | Dancer | Prancer | Vixen | Comet | Cupid | Donner | Blitzen | Rudolph;

type Contains<Arr extends unknown[], Item extends string> =
  Arr extends [infer First, ...infer Rest] ?
	  First extends Item ?
		  true :
	    Contains<Rest, Item> :
	false
;

type NonRepeating<Arr extends unknown[]> =
  // going "brute-force" here, and checking if the array contains every kind of reindeer
  Contains<Arr, Dasher> extends false ? false :
	Contains<Arr, Dancer> extends false ? false :
	Contains<Arr, Prancer> extends false ? false :
	Contains<Arr, Vixen> extends false ? false :
	Contains<Arr, Comet> extends false ? false :
	Contains<Arr, Cupid> extends false ? false :
	Contains<Arr, Donner> extends false ? false :
	Contains<Arr, Blitzen> extends false ? false :
	Contains<Arr, Rudolph> extends false ? false :
	true
;

type Row<Board extends Reindeer[][][], M extends number> =
  [...Board[M][0], ...Board[M][1], ...Board[M][2]]
;

type Column<Board extends Reindeer[][][], N extends number> =
	// again, a brute force approach :)
	N extends 0 ? [Board[0][0][0], Board[1][0][0], Board[2][0][0], Board[3][0][0], Board[4][0][0], Board[5][0][0], Board[6][0][0], Board[7][0][0], Board[8][0][0]] :
	N extends 1 ? [Board[0][0][1], Board[1][0][1], Board[2][0][1], Board[3][0][1], Board[4][0][1], Board[5][0][1], Board[6][0][1], Board[7][0][1], Board[8][0][1]] :
	N extends 2 ? [Board[0][0][2], Board[1][0][2], Board[2][0][2], Board[3][0][2], Board[4][0][2], Board[5][0][2], Board[6][0][2], Board[7][0][2], Board[8][0][2]] :

	N extends 3 ? [Board[0][1][0], Board[1][1][0], Board[2][1][0], Board[3][1][0], Board[4][1][0], Board[5][1][0], Board[6][1][0], Board[7][1][0], Board[8][1][0]] :
	N extends 4 ? [Board[0][1][1], Board[1][1][1], Board[2][1][1], Board[3][1][1], Board[4][1][1], Board[5][1][1], Board[6][1][1], Board[7][1][1], Board[8][1][1]] :
	N extends 5 ? [Board[0][1][2], Board[1][1][2], Board[2][1][2], Board[3][1][2], Board[4][1][2], Board[5][1][2], Board[6][1][2], Board[7][1][2], Board[8][1][2]] :
  
	N extends 6 ? [Board[0][2][0], Board[1][2][0], Board[2][2][0], Board[3][2][0], Board[4][2][0], Board[5][2][0], Board[6][2][0], Board[7][2][0], Board[8][2][0]] :
	N extends 7 ? [Board[0][2][1], Board[1][2][1], Board[2][2][1], Board[3][2][1], Board[4][2][1], Board[5][2][1], Board[6][2][1], Board[7][2][1], Board[8][2][1]] :
	N extends 8 ? [Board[0][2][2], Board[1][2][2], Board[2][2][2], Board[3][2][2], Board[4][2][2], Board[5][2][2], Board[6][2][2], Board[7][2][2], Board[8][2][2]] :
	never
;

type Box<SubList1 extends Reindeer[], SubList2 extends Reindeer[], SubList3 extends Reindeer[]> =
  [...SubList1, ...SubList2, ...SubList3]
;

type Validate<Board extends Reindeer[][][]> =
  // more brutish behaviour
	// rows
	NonRepeating<Row<Board, 0>> extends false ? false :
  NonRepeating<Row<Board, 1>> extends false ? false :
	NonRepeating<Row<Board, 2>> extends false ? false :
	NonRepeating<Row<Board, 3>> extends false ? false :
	NonRepeating<Row<Board, 4>> extends false ? false :
	NonRepeating<Row<Board, 5>> extends false ? false :
	NonRepeating<Row<Board, 6>> extends false ? false :
	NonRepeating<Row<Board, 7>> extends false ? false :
	NonRepeating<Row<Board, 8>> extends false ? false :
	// columns
	NonRepeating<Column<Board, 0>> extends false ? false :
	NonRepeating<Column<Board, 1>> extends false ? false :
	NonRepeating<Column<Board, 2>> extends false ? false :
	NonRepeating<Column<Board, 3>> extends false ? false :
	NonRepeating<Column<Board, 4>> extends false ? false :
	NonRepeating<Column<Board, 5>> extends false ? false :
	NonRepeating<Column<Board, 6>> extends false ? false :
	NonRepeating<Column<Board, 7>> extends false ? false :
	NonRepeating<Column<Board, 8>> extends false ? false :
	// 3x3 regions
  NonRepeating<Box<Board[0][0], Board[1][0], Board[2][0]>> extends false ? false : // top-left
  NonRepeating<Box<Board[0][1], Board[1][1], Board[2][1]>> extends false ? false : // top-center
	NonRepeating<Box<Board[0][2], Board[1][2], Board[2][2]>> extends false ? false : // top-right
	NonRepeating<Box<Board[3][0], Board[4][0], Board[5][0]>> extends false ? false : // middle-left
  NonRepeating<Box<Board[3][1], Board[4][1], Board[5][1]>> extends false ? false : // middle-center
	NonRepeating<Box<Board[3][2], Board[4][2], Board[5][2]>> extends false ? false : // middle-right
	NonRepeating<Box<Board[6][0], Board[7][0], Board[8][0]>> extends false ? false : // bottom-left
  NonRepeating<Box<Board[6][1], Board[7][1], Board[8][1]>> extends false ? false : // bottom-center
	NonRepeating<Box<Board[6][2], Board[7][2], Board[8][2]>> extends false ? false : // bottom-right
	true
;

// tests
type test_sudoku_1_actual = Validate<[
//   ^?
  [['💨', '💃', '🦌'], ['☄️', '❤️', '🌩️'], ['🌟', '⚡', '🔴']],
  [['🌟', '⚡', '🔴'], ['💨', '💃', '🦌'], ['☄️', '❤️', '🌩️']],
  [['☄️', '❤️', '🌩️'], ['🌟', '⚡', '🔴'], ['💨', '💃', '🦌']],
  [['🦌', '💨', '💃'], ['⚡', '☄️', '❤️'], ['🔴', '🌩️', '🌟']],
  [['🌩️', '🔴', '🌟'], ['🦌', '💨', '💃'], ['⚡', '☄️', '❤️']],
  [['⚡', '☄️', '❤️'], ['🌩️', '🔴', '🌟'], ['🦌', '💨', '💃']],
  [['💃', '🦌', '💨'], ['❤️', '🌟', '☄️'], ['🌩️', '🔴', '⚡']],
  [['🔴', '🌩️', '⚡'], ['💃', '🦌', '💨'], ['❤️', '🌟', '☄️']],
  [['❤️', '🌟', '☄️'], ['🔴', '🌩️', '⚡'], ['💃', '🦌', '💨']]
]>;
type test_sudoku_1 = Expect<Equal<test_sudoku_1_actual, true>>;

type test_sudoku_2_actual = Validate<[
//   ^?
  [['🌩️', '💨', '☄️'], ['🌟', '🦌', '⚡'], ['❤️', '🔴', '💃']],
  [['🌟', '⚡', '❤️'], ['🔴', '💃', '☄️'], ['🌩️', '💨', '🦌']],
  [['🔴', '🦌', '💃'], ['💨', '❤️', '🌩️'], ['🌟', '⚡', '☄️']],
  [['❤️', '☄️', '🌩️'], ['💃', '⚡', '🔴'], ['💨', '🦌', '🌟']],
  [['🦌', '💃', '⚡'], ['🌩️', '🌟', '💨'], ['🔴', '☄️', '❤️']],
  [['💨', '🌟', '🔴'], ['🦌', '☄️', '❤️'], ['⚡', '💃', '🌩️']],
  [['☄️', '🔴', '💨'], ['❤️', '🌩️', '🦌'], ['💃', '🌟', '⚡']],
  [['💃', '❤️', '🦌'], ['⚡', '🔴', '🌟'], ['☄️', '🌩️', '💨']],
  [['⚡', '🌩️', '🌟'], ['☄️', '💨', '💃'], ['🦌', '❤️', '🔴']]
]>;
type test_sudoku_2 = Expect<Equal<test_sudoku_2_actual, true>>;

type test_sudoku_3_actual = Validate<[
//   ^?
  [['🦌', '🔴', '💃'], ['🌩️', '☄️', '💨'], ['⚡', '❤️', '🌟']],
  [['🌟', '⚡', '💨'], ['❤️', '💃', '🔴'], ['☄️', '🌩️', '🦌']],
  [['☄️', '🌩️', '❤️'], ['⚡', '🌟', '🦌'], ['💃', '🔴', '💨']],
  [['🌩️', '💃', '🔴'], ['🦌', '💨', '⚡'], ['🌟', '☄️', '❤️']],
  [['❤️', '☄️', '⚡'], ['💃', '🌩️', '🌟'], ['🦌', '💨', '🔴']],
  [['💨', '🌟', '🦌'], ['☄️', '🔴', '❤️'], ['🌩️', '💃', '⚡']],
  [['💃', '💨', '🌟'], ['🔴', '🦌', '☄️'], ['❤️', '⚡', '🌩️']],
  [['🔴', '❤️', '☄️'], ['🌟', '⚡', '🌩️'], ['💨', '🦌', '💃']],
  [['⚡', '🦌', '🌩️'], ['💨', '❤️', '💃'], ['🔴', '🌟', '☄️']]
]>;
type test_sudoku_3 = Expect<Equal<test_sudoku_3_actual, true>>;

type test_sudoku_4_actual = Validate<[
//   ^?
  [['💨', '💃', '🦌'], ['☄️', '❤️', '🌩️'], ['🌟', '⚡', '🔴']],
  [['🌟', '⚡', '🔴'], ['💨', '💃', '🦌'], ['☄️', '❤️', '🌩️']],
  [['☄️', '❤️', '🌩️'], ['🌟', '⚡', '🔴'], ['💨', '💃', '🦌']],
  [['🦌', '💨', '💃'], ['⚡', '☄️', '❤️'], ['🔴', '🌩️', '🌟']],
  [['🌩️', '🔴', '🌟'], ['🦌', '💨', '💃'], ['⚡', '☄️', '❤️']],
  [['⚡', '☄️', '❤️'], ['🌩️', '🔴', '🌟'], ['🦌', '💨', '💃']],
  [['💃', '🦌', '💨'], ['❤️', '🌟', '☄️'], ['⚡', '🔴', '🌟']],
  [['🔴', '🌩️', '⚡'], ['💃', '🦌', '💨'], ['❤️', '🌟', '☄️']],
  [['❤️', '🌟', '☄️'], ['🔴', '🌩️', '⚡'], ['💃', '🦌', '💨']]
]>;
type test_sudoku_4 = Expect<Equal<test_sudoku_4_actual, false>>;

type test_sudoku_5_actual = Validate<[
//   ^?
  [['🌩️', '💨', '☄️'], ['🌟', '🦌', '⚡'], ['❤️', '🔴', '💃']],
  [['🌟', '⚡', '❤️'], ['🔴', '💃', '☄️'], ['🌩️', '💨', '🦌']],
  [['🔴', '🦌', '💃'], ['💨', '❤️', '🌩️'], ['🌟', '⚡', '☄️']],
  [['❤️', '☄️', '🌩️'], ['💃', '⚡', '🔴'], ['💨', '🦌', '🌟']],
  [['🦌', '💃', '⚡'], ['🌩️', '🌟', '💨'], ['🔴', '☄️', '❤️']],
  [['💨', '🌟', '🔴'], ['🦌', '☄️', '❤️'], ['⚡', '💃', '🌩️']],
  [['☄️', '🔴', '💨'], ['❤️', '💃', '🦌'], ['💃', '🌟', '⚡']],
  [['💃', '❤️', '🦌'], ['⚡', '🔴', '🌟'], ['☄️', '🌩️', '💨']],
  [['⚡', '🌩️', '🌟'], ['☄️', '💨', '💃'], ['🦌', '❤️', '🔴']]
]>;
type test_sudoku_5 = Expect<Equal<test_sudoku_5_actual, false>>;

type test_sudoku_6_actual = Validate<[
//   ^?
  [['⚡', '🔴', '🌩️'], ['🦌', '❤️', '💨'], ['💨', '🌟', '☄️']],
  [['❤️', '🦌', '🌟'], ['💨', '🌟', '🔴'], ['💃', '⚡', '🌩️']],
  [['💨', '💃', '🌟'], ['☄️', '⚡', '🌩️'], ['🔴', '❤️', '🦌']],
  [['🦌', '⚡', '🔴'], ['❤️', '💃', '💨'], ['☄️', '🌩️', '🌟']],
  [['🌟', '🌩️', '💃'], ['⚡', '🔴', '☄️'], ['❤️', '🦌', '💨']],
  [['☄️', '💨', '❤️'], ['🌟', '🌩️', '🦌'], ['⚡', '💃', '🔴']],
  [['🌩️', '☄️', '💨'], ['💃', '🦌', '⚡'], ['🌟', '🔴', '❤️']],
  [['🔴', '❤️', '⚡'], ['🌩️', '☄️', '🌟'], ['🦌', '💨', '💃']],
  [['💃', '🌟', '🦌'], ['🔴', '💨', '❤️'], ['🌩️', '☄️', '⚡']]
]>;
type test_sudoku_6 = Expect<Equal<test_sudoku_6_actual, false>>;
