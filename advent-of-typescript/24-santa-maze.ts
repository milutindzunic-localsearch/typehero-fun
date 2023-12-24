import { Expect, Equal } from "type-testing";

// type definitions
type Alley = "  ";
type MazeItem = "🎄" | "🎅" | Alley;
type DELICIOUS_COOKIES = "🍪";
type MazeMatrix = MazeItem[][];
type Directions = "up" | "down" | "left" | "right";

type ContainsSanta<Arr extends any> =
  Arr extends [] ?
	  false :
	Arr extends [infer First, ...infer Rest] ?
	  First extends "🎅" ?
	    true :
		ContainsSanta<Rest> :
	false
;

type FilledWithCookies<Maze extends any[][], Acc extends any[] = []> =
  Maze extends [infer First, ...infer Rest] ?
    // I hate these checks..
		First extends any[] ? Rest extends any[][] ? FilledWithCookies<Rest, [...Acc, RowFilledWithCookies<First>]> : never : never :
	Acc
;

type RowFilledWithCookies<Arr extends any[], Acc extends any[] = []> =
	Arr extends [infer _First, ...infer Rest] ? RowFilledWithCookies<Rest, [...Acc, DELICIOUS_COOKIES]> : Acc
;

type MoveSantaLeft<Arr extends any[], Acc extends any[] = []> =
  Arr extends [infer First, infer Second, ...infer Rest] ?
	  Second extends "🎅" ?
		  First extends Alley ?
			  MoveSantaLeft<[...Rest], [...Acc, Second, First]> : // santa can move left!
			MoveSantaLeft<[Second, ...Rest], [...Acc, First]> : // santa can't move here... keep going
		MoveSantaLeft<[Second, ...Rest], [...Acc, First]> : // no santa here
	  Arr extends [infer Last] ?
		  MoveSantaLeft<[], [...Acc, Last]> :
	Acc
;

type MoveSantaRight<Arr extends any[], Acc extends any[] = []> =
  Arr extends [infer First, infer Second, ...infer Rest] ?
	  First extends "🎅" ?
		  Second extends Alley ?
			  MoveSantaRight<[...Rest], [...Acc, Second, First]> : // santa can move right!
			MoveSantaRight<[Second, ...Rest], [...Acc, First]> : // santa can't move here... keep going
		MoveSantaRight<[Second, ...Rest], [...Acc, First]> : // no santa here
	  Arr extends [infer Last] ?
		  MoveSantaRight<[], [...Acc, Last]> :
	Acc
;

type MoveSantaLeftMatrix<Matrix extends MazeMatrix, AccMatrix extends MazeMatrix = [], OrigMatrix extends MazeMatrix = Matrix> =
	Matrix extends [infer FirstRow, ...infer RestRows] ?
	  // again, the checks...
		FirstRow extends MazeItem[] ?
		  FirstRow[0] extends "🎅" ? 
		    FilledWithCookies<OrigMatrix> : // santa escaped the maze!
      RestRows extends MazeItem[][] ?
				MoveSantaLeftMatrix<RestRows, [...AccMatrix, MoveSantaLeft<FirstRow>], OrigMatrix> :
			never : // should not happen
		never : // should not happen
	AccMatrix
;

type LastElement<Arr extends any[]> =
  Arr extends [...infer _Rest, infer Last] ? Last : never
;

type MoveSantaRightMatrix<Matrix extends MazeMatrix, AccMatrix extends MazeMatrix = [], OrigMatrix extends MazeMatrix = Matrix> =
	Matrix extends [infer FirstRow, ...infer RestRows] ?
	  // again, the checks...
		FirstRow extends MazeItem[] ?
		  LastElement<FirstRow> extends "🎅" ? 
		    FilledWithCookies<OrigMatrix> : // santa escaped the maze!
      RestRows extends MazeItem[][] ?
				MoveSantaRightMatrix<RestRows, [...AccMatrix, MoveSantaRight<FirstRow>], OrigMatrix> :
			never : // should not happen
		never : // should not happen
	AccMatrix
;

type MoveSantaUpMatrix<Matrix extends MazeMatrix> =
  ContainsSanta<Matrix[0]> extends true ? FilledWithCookies<MazeMatrix> : // santa escaped the maze!
	MoveSantaUpMatrixRec<Matrix> // recursive solution
;

type MoveSantaDownMatrix<Matrix extends MazeMatrix> =
  ContainsSanta<LastElement<Matrix>> extends true ? FilledWithCookies<MazeMatrix> : // santa escaped the maze!
	MoveSantaDownMatrixRec<Matrix> // recursive solution
;

type MoveSantaUpBetweenRows<Row1 extends any[], Row2 extends any[], Acc1 extends any[] = [], Acc2 extends any[] = []> =
  Row1 extends [infer First1, ...infer Rest1] ?
	  Row2 extends [infer First2, ...infer Rest2] ?
		  // is the second element Santa?
			First2 extends "🎅" ?
				// and, is first element empty?
				First1 extends Alley ?
				  // ...then switch them up
				  MoveSantaUpBetweenRows<Rest1, Rest2, [...Acc1, First2], [...Acc2, First1]> :
					// else keep going...
				MoveSantaUpBetweenRows<Rest1, Rest2, [...Acc1, First1], [...Acc2, First2]> :
			MoveSantaUpBetweenRows<Rest1, Rest2, [...Acc1, First1], [...Acc2, First2]> :
    never : // should not happen
	[Acc1, Acc2] // recursion finished	  
;

type MoveSantaDownBetweenRows<Row1 extends any[], Row2 extends any[], Acc1 extends any[] = [], Acc2 extends any[] = []> =
  Row1 extends [infer First1, ...infer Rest1] ?
	  Row2 extends [infer First2, ...infer Rest2] ?
		  // is the first element Santa?
			First1 extends "🎅" ?
				// and, is second element empty?
				First2 extends Alley ?
				  // ...then switch them down
				  MoveSantaDownBetweenRows<Rest1, Rest2, [...Acc1, First2], [...Acc2, First1]> :
					// else keep going...
				MoveSantaDownBetweenRows<Rest1, Rest2, [...Acc1, First1], [...Acc2, First2]> :
			MoveSantaDownBetweenRows<Rest1, Rest2, [...Acc1, First1], [...Acc2, First2]> :
    never : // should not happen
	[Acc1, Acc2] // recursion finished	  
;

type MoveSantaUpMatrixRec<Matrix extends MazeMatrix, AccMatrix extends MazeMatrix = []> =
  Matrix extends [infer FirstRow, infer SecondRow, ...infer RestRows] ?
    FirstRow extends MazeItem[] ?
      SecondRow extends MazeItem[] ?
			  RestRows extends MazeMatrix ?
				  ContainsSanta<SecondRow> extends true ?
			      MoveSantaUpMatrixRec<RestRows, [...AccMatrix, MoveSantaUpBetweenRows<FirstRow, SecondRow>[0], MoveSantaUpBetweenRows<FirstRow, SecondRow>[1]]> :
					MoveSantaUpMatrixRec<[SecondRow, ...RestRows], [...AccMatrix, FirstRow]> :
				never : // should not happen
			never : // should not happen
		never : // should not happen
	Matrix extends [infer Last] ?
	  Last extends MazeItem[] ?
		  MoveSantaUpMatrixRec<[], [...AccMatrix, Last]> : // last row, just copy it
		never : // should not happen
	AccMatrix
;

type MoveSantaDownMatrixRec<Matrix extends MazeMatrix, AccMatrix extends MazeMatrix = []> =
  Matrix extends [infer FirstRow, infer SecondRow, ...infer RestRows] ?
    FirstRow extends MazeItem[] ?
      SecondRow extends MazeItem[] ?
			  RestRows extends MazeMatrix ?
				  ContainsSanta<FirstRow> extends true ?
			      MoveSantaDownMatrixRec<RestRows, [...AccMatrix, MoveSantaDownBetweenRows<FirstRow, SecondRow>[0], MoveSantaDownBetweenRows<FirstRow, SecondRow>[1]]> :
					MoveSantaDownMatrixRec<[SecondRow, ...RestRows], [...AccMatrix, FirstRow]> :
				never : // should not happen
			never : // should not happen
		never : // should not happen
	Matrix extends [infer Last] ?
		Last extends MazeItem[] ?
		  MoveSantaDownMatrixRec<[], [...AccMatrix, Last]> : // last row, just copy it
		never : // should not happen
	AccMatrix
;

type Move<Maze extends MazeMatrix, Direction extends Directions> =
	Direction extends 'left' ? MoveSantaLeftMatrix<Maze> :
	Direction extends 'right' ? MoveSantaRightMatrix<Maze> :
	Direction extends 'up' ? MoveSantaUpMatrix<Maze> :
	Direction extends 'down' ? MoveSantaDownMatrix<Maze> :
	never
;


// tests
type Maze0 = [
  ["🎄", "🎄", "🎄", "🎄", "🎄", "🎄", "🎄", "🎄", "🎄", "🎄"],
  ["🎄", "🎄", "🎄", "🎄", "🎄", "🎄", "🎅", "🎄", "🎄", "🎄"],
  ["🎄", "🎄", "🎄", "🎄", "  ", "🎄", "  ", "  ", "  ", "🎄"],
  ["🎄", "🎄", "🎄", "🎄", "  ", "🎄", "  ", "🎄", "  ", "🎄"],
  ["🎄", "  ", "  ", "  ", "  ", "🎄", "  ", "🎄", "  ", "🎄"],
  ["  ", "  ", "🎄", "🎄", "  ", "  ", "  ", "🎄", "🎄", "🎄"],
  ["🎄", "  ", "🎄", "🎄", "  ", "🎄", "  ", "🎄", "🎄", "🎄"],
  ["🎄", "  ", "🎄", "🎄", "  ", "🎄", "  ", "🎄", "🎄", "🎄"],
  ["🎄", "  ", "  ", "  ", "  ", "🎄", "  ", "🎄", "🎄", "🎄"],
  ["🎄", "🎄", "🎄", "🎄", "🎄", "🎄", "🎄", "🎄", "🎄", "🎄"],
];

// can't move up!
type test_maze0_up_actual = Move<Maze0, 'up'>;
//   ^?
type test_maze0_up = Expect<Equal<test_maze0_up_actual, Maze0>>;


// but Santa can move down!
type test_maze0_down_actual = Move<Maze0, 'down'>;
//   ^?
type Maze1 = [
  ["🎄", "🎄", "🎄", "🎄", "🎄", "🎄", "🎄", "🎄", "🎄", "🎄"],
  ["🎄", "🎄", "🎄", "🎄", "🎄", "🎄", "  ", "🎄", "🎄", "🎄"],
  ["🎄", "🎄", "🎄", "🎄", "  ", "🎄", "🎅", "  ", "  ", "🎄"],
  ["🎄", "🎄", "🎄", "🎄", "  ", "🎄", "  ", "🎄", "  ", "🎄"],
  ["🎄", "  ", "  ", "  ", "  ", "🎄", "  ", "🎄", "  ", "🎄"],
  ["  ", "  ", "🎄", "🎄", "  ", "  ", "  ", "🎄", "🎄", "🎄"],
  ["🎄", "  ", "🎄", "🎄", "  ", "🎄", "  ", "🎄", "🎄", "🎄"],
  ["🎄", "  ", "🎄", "🎄", "  ", "🎄", "  ", "🎄", "🎄", "🎄"],
  ["🎄", "  ", "  ", "  ", "  ", "🎄", "  ", "🎄", "🎄", "🎄"],
  ["🎄", "🎄", "🎄", "🎄", "🎄", "🎄", "🎄", "🎄", "🎄", "🎄"],
];
type test_maze0_down = Expect<Equal<test_maze0_down_actual, Maze1>>;


// Santa can move down again!
type test_maze1_down_actual = Move<Maze1, 'down'>;
type Maze2 = [
  ["🎄", "🎄", "🎄", "🎄", "🎄", "🎄", "🎄", "🎄", "🎄", "🎄"],
  ["🎄", "🎄", "🎄", "🎄", "🎄", "🎄", "  ", "🎄", "🎄", "🎄"],
  ["🎄", "🎄", "🎄", "🎄", "  ", "🎄", "  ", "  ", "  ", "🎄"],
  ["🎄", "🎄", "🎄", "🎄", "  ", "🎄", "🎅", "🎄", "  ", "🎄"],
  ["🎄", "  ", "  ", "  ", "  ", "🎄", "  ", "🎄", "  ", "🎄"],
  ["  ", "  ", "🎄", "🎄", "  ", "  ", "  ", "🎄", "🎄", "🎄"],
  ["🎄", "  ", "🎄", "🎄", "  ", "🎄", "  ", "🎄", "🎄", "🎄"],
  ["🎄", "  ", "🎄", "🎄", "  ", "🎄", "  ", "🎄", "🎄", "🎄"],
  ["🎄", "  ", "  ", "  ", "  ", "🎄", "  ", "🎄", "🎄", "🎄"],
  ["🎄", "🎄", "🎄", "🎄", "🎄", "🎄", "🎄", "🎄", "🎄", "🎄"],
];
type test_maze1_down = Expect<Equal<test_maze1_down_actual, Maze2>>;


// can't move left!
type test_maze2_left_actual = Move<Maze2, 'left'>;
//   ^?
type test_maze2_left = Expect<Equal<test_maze2_left_actual, Maze2>>;


// if Santa moves up, it's back to Maze1!
type test_maze2_up_actual = Move<Maze2, 'up'>;
//   ^?
type test_maze2_up = Expect<Equal<test_maze2_up_actual, Maze1>>;


// can't move right!
type test_maze2_right_actual = Move<Maze2, 'right'>;
//   ^?
type test_maze2_right = Expect<Equal<test_maze2_right_actual, Maze2>>;


// we exhausted all other options! guess we gotta go down!
type test_maze2_down_actual = Move<Maze2, 'down'>;
//   ^?
type Maze3 = [
  ["🎄", "🎄", "🎄", "🎄", "🎄", "🎄", "🎄", "🎄", "🎄", "🎄"],
  ["🎄", "🎄", "🎄", "🎄", "🎄", "🎄", "  ", "🎄", "🎄", "🎄"],
  ["🎄", "🎄", "🎄", "🎄", "  ", "🎄", "  ", "  ", "  ", "🎄"],
  ["🎄", "🎄", "🎄", "🎄", "  ", "🎄", "  ", "🎄", "  ", "🎄"],
  ["🎄", "  ", "  ", "  ", "  ", "🎄", "🎅", "🎄", "  ", "🎄"],
  ["  ", "  ", "🎄", "🎄", "  ", "  ", "  ", "🎄", "🎄", "🎄"],
  ["🎄", "  ", "🎄", "🎄", "  ", "🎄", "  ", "🎄", "🎄", "🎄"],
  ["🎄", "  ", "🎄", "🎄", "  ", "🎄", "  ", "🎄", "🎄", "🎄"],
  ["🎄", "  ", "  ", "  ", "  ", "🎄", "  ", "🎄", "🎄", "🎄"],
  ["🎄", "🎄", "🎄", "🎄", "🎄", "🎄", "🎄", "🎄", "🎄", "🎄"],
];
type test_maze2_down = Expect<Equal<test_maze2_down_actual, Maze3>>;


// maybe we just gotta go down all the time?
type test_maze3_down_actual = Move<Maze3, 'down'>;
//   ^?
type Maze4 = [
  ["🎄", "🎄", "🎄", "🎄", "🎄", "🎄", "🎄", "🎄", "🎄", "🎄"],
  ["🎄", "🎄", "🎄", "🎄", "🎄", "🎄", "  ", "🎄", "🎄", "🎄"],
  ["🎄", "🎄", "🎄", "🎄", "  ", "🎄", "  ", "  ", "  ", "🎄"],
  ["🎄", "🎄", "🎄", "🎄", "  ", "🎄", "  ", "🎄", "  ", "🎄"],
  ["🎄", "  ", "  ", "  ", "  ", "🎄", "  ", "🎄", "  ", "🎄"],
  ["  ", "  ", "🎄", "🎄", "  ", "  ", "🎅", "🎄", "🎄", "🎄"],
  ["🎄", "  ", "🎄", "🎄", "  ", "🎄", "  ", "🎄", "🎄", "🎄"],
  ["🎄", "  ", "🎄", "🎄", "  ", "🎄", "  ", "🎄", "🎄", "🎄"],
  ["🎄", "  ", "  ", "  ", "  ", "🎄", "  ", "🎄", "🎄", "🎄"],
  ["🎄", "🎄", "🎄", "🎄", "🎄", "🎄", "🎄", "🎄", "🎄", "🎄"],
];
type test_maze3_down = Expect<Equal<test_maze3_down_actual, Maze4>>;


// let's go left this time just to change it up?
type test_maze4_left_actual = Move<Maze4, 'left'>;
//   ^?
type Maze5 = [
  ["🎄", "🎄", "🎄", "🎄", "🎄", "🎄", "🎄", "🎄", "🎄", "🎄"],
  ["🎄", "🎄", "🎄", "🎄", "🎄", "🎄", "  ", "🎄", "🎄", "🎄"],
  ["🎄", "🎄", "🎄", "🎄", "  ", "🎄", "  ", "  ", "  ", "🎄"],
  ["🎄", "🎄", "🎄", "🎄", "  ", "🎄", "  ", "🎄", "  ", "🎄"],
  ["🎄", "  ", "  ", "  ", "  ", "🎄", "  ", "🎄", "  ", "🎄"],
  ["  ", "  ", "🎄", "🎄", "  ", "🎅", "  ", "🎄", "🎄", "🎄"],
  ["🎄", "  ", "🎄", "🎄", "  ", "🎄", "  ", "🎄", "🎄", "🎄"],
  ["🎄", "  ", "🎄", "🎄", "  ", "🎄", "  ", "🎄", "🎄", "🎄"],
  ["🎄", "  ", "  ", "  ", "  ", "🎄", "  ", "🎄", "🎄", "🎄"],
  ["🎄", "🎄", "🎄", "🎄", "🎄", "🎄", "🎄", "🎄", "🎄", "🎄"],
];
// it worked!
type test_maze4_left = Expect<Equal<test_maze4_left_actual, Maze5>>;


// couldn't hurt to try left again?
type test_maze5_left_actual = Move<Maze5, 'left'>;
//   ^?
type Maze6 = [
  ["🎄", "🎄", "🎄", "🎄", "🎄", "🎄", "🎄", "🎄", "🎄", "🎄"],
  ["🎄", "🎄", "🎄", "🎄", "🎄", "🎄", "  ", "🎄", "🎄", "🎄"],
  ["🎄", "🎄", "🎄", "🎄", "  ", "🎄", "  ", "  ", "  ", "🎄"],
  ["🎄", "🎄", "🎄", "🎄", "  ", "🎄", "  ", "🎄", "  ", "🎄"],
  ["🎄", "  ", "  ", "  ", "  ", "🎄", "  ", "🎄", "  ", "🎄"],
  ["  ", "  ", "🎄", "🎄", "🎅", "  ", "  ", "🎄", "🎄", "🎄"],
  ["🎄", "  ", "🎄", "🎄", "  ", "🎄", "  ", "🎄", "🎄", "🎄"],
  ["🎄", "  ", "🎄", "🎄", "  ", "🎄", "  ", "🎄", "🎄", "🎄"],
  ["🎄", "  ", "  ", "  ", "  ", "🎄", "  ", "🎄", "🎄", "🎄"],
  ["🎄", "🎄", "🎄", "🎄", "🎄", "🎄", "🎄", "🎄", "🎄", "🎄"],
];
type test_maze5_left = Expect<Equal<test_maze5_left_actual, Maze6>>;


// three time's a charm?
type test_maze6_left_actual = Move<Maze6, 'left'>;
//   ^?
// lol, nope.
type test_maze6_left = Expect<Equal<test_maze6_left_actual, Maze6>>;


// we haven't tried up yet (?)
type test_maze6_up_actual = Move<Maze6, 'up'>;
//   ^?
type Maze7 = [
  ["🎄", "🎄", "🎄", "🎄", "🎄", "🎄", "🎄", "🎄", "🎄", "🎄"],
  ["🎄", "🎄", "🎄", "🎄", "🎄", "🎄", "  ", "🎄", "🎄", "🎄"],
  ["🎄", "🎄", "🎄", "🎄", "  ", "🎄", "  ", "  ", "  ", "🎄"],
  ["🎄", "🎄", "🎄", "🎄", "  ", "🎄", "  ", "🎄", "  ", "🎄"],
  ["🎄", "  ", "  ", "  ", "🎅", "🎄", "  ", "🎄", "  ", "🎄"],
  ["  ", "  ", "🎄", "🎄", "  ", "  ", "  ", "🎄", "🎄", "🎄"],
  ["🎄", "  ", "🎄", "🎄", "  ", "🎄", "  ", "🎄", "🎄", "🎄"],
  ["🎄", "  ", "🎄", "🎄", "  ", "🎄", "  ", "🎄", "🎄", "🎄"],
  ["🎄", "  ", "  ", "  ", "  ", "🎄", "  ", "🎄", "🎄", "🎄"],
  ["🎄", "🎄", "🎄", "🎄", "🎄", "🎄", "🎄", "🎄", "🎄", "🎄"],
];
// NOICE.
type test_maze6_up = Expect<Equal<test_maze6_up_actual, Maze7>>;


// maybe another left??
type test_maze7_left_actual = Move<Maze7, 'left'>;
//   ^?
type Maze8 = [
  ["🎄", "🎄", "🎄", "🎄", "🎄", "🎄", "🎄", "🎄", "🎄", "🎄"],
  ["🎄", "🎄", "🎄", "🎄", "🎄", "🎄", "  ", "🎄", "🎄", "🎄"],
  ["🎄", "🎄", "🎄", "🎄", "  ", "🎄", "  ", "  ", "  ", "🎄"],
  ["🎄", "🎄", "🎄", "🎄", "  ", "🎄", "  ", "🎄", "  ", "🎄"],
  ["🎄", "  ", "  ", "🎅", "  ", "🎄", "  ", "🎄", "  ", "🎄"],
  ["  ", "  ", "🎄", "🎄", "  ", "  ", "  ", "🎄", "🎄", "🎄"],
  ["🎄", "  ", "🎄", "🎄", "  ", "🎄", "  ", "🎄", "🎄", "🎄"],
  ["🎄", "  ", "🎄", "🎄", "  ", "🎄", "  ", "🎄", "🎄", "🎄"],
  ["🎄", "  ", "  ", "  ", "  ", "🎄", "  ", "🎄", "🎄", "🎄"],
  ["🎄", "🎄", "🎄", "🎄", "🎄", "🎄", "🎄", "🎄", "🎄", "🎄"],
];
type test_maze7_left = Expect<Equal<test_maze7_left_actual, Maze8>>;


// haven't tried a right yet.. let's give it a go!
type test_maze7_right_actual = Move<Maze8, 'right'>;
//   ^?
// not this time...
type test_maze7_right = Expect<Equal<test_maze7_right_actual, Maze7>>;


// probably just need to stick with left then
type test_maze8_left_actual = Move<Maze8, 'left'>;
//   ^?
type Maze9 = [
  ["🎄", "🎄", "🎄", "🎄", "🎄", "🎄", "🎄", "🎄", "🎄", "🎄"],
  ["🎄", "🎄", "🎄", "🎄", "🎄", "🎄", "  ", "🎄", "🎄", "🎄"],
  ["🎄", "🎄", "🎄", "🎄", "  ", "🎄", "  ", "  ", "  ", "🎄"],
  ["🎄", "🎄", "🎄", "🎄", "  ", "🎄", "  ", "🎄", "  ", "🎄"],
  ["🎄", "  ", "🎅", "  ", "  ", "🎄", "  ", "🎄", "  ", "🎄"],
  ["  ", "  ", "🎄", "🎄", "  ", "  ", "  ", "🎄", "🎄", "🎄"],
  ["🎄", "  ", "🎄", "🎄", "  ", "🎄", "  ", "🎄", "🎄", "🎄"],
  ["🎄", "  ", "🎄", "🎄", "  ", "🎄", "  ", "🎄", "🎄", "🎄"],
  ["🎄", "  ", "  ", "  ", "  ", "🎄", "  ", "🎄", "🎄", "🎄"],
  ["🎄", "🎄", "🎄", "🎄", "🎄", "🎄", "🎄", "🎄", "🎄", "🎄"],
];
type test_maze8_left = Expect<Equal<test_maze8_left_actual, Maze9>>;


// why fix what's not broken?
type test_maze9_left_actual = Move<Maze9, 'left'>;
//   ^?
type Maze10 = [
  ["🎄", "🎄", "🎄", "🎄", "🎄", "🎄", "🎄", "🎄", "🎄", "🎄"],
  ["🎄", "🎄", "🎄", "🎄", "🎄", "🎄", "  ", "🎄", "🎄", "🎄"],
  ["🎄", "🎄", "🎄", "🎄", "  ", "🎄", "  ", "  ", "  ", "🎄"],
  ["🎄", "🎄", "🎄", "🎄", "  ", "🎄", "  ", "🎄", "  ", "🎄"],
  ["🎄", "🎅", "  ", "  ", "  ", "🎄", "  ", "🎄", "  ", "🎄"],
  ["  ", "  ", "🎄", "🎄", "  ", "  ", "  ", "🎄", "🎄", "🎄"],
  ["🎄", "  ", "🎄", "🎄", "  ", "🎄", "  ", "🎄", "🎄", "🎄"],
  ["🎄", "  ", "🎄", "🎄", "  ", "🎄", "  ", "🎄", "🎄", "🎄"],
  ["🎄", "  ", "  ", "  ", "  ", "🎄", "  ", "🎄", "🎄", "🎄"],
  ["🎄", "🎄", "🎄", "🎄", "🎄", "🎄", "🎄", "🎄", "🎄", "🎄"],
];
type test_maze9_left = Expect<Equal<test_maze9_left_actual, Maze10>>;


// do you smell cookies?? it's coming from down..
type test_maze10_down_actual = Move<Maze10, 'down'>;
//   ^?
type Maze11 = [
  ["🎄", "🎄", "🎄", "🎄", "🎄", "🎄", "🎄", "🎄", "🎄", "🎄"],
  ["🎄", "🎄", "🎄", "🎄", "🎄", "🎄", "  ", "🎄", "🎄", "🎄"],
  ["🎄", "🎄", "🎄", "🎄", "  ", "🎄", "  ", "  ", "  ", "🎄"],
  ["🎄", "🎄", "🎄", "🎄", "  ", "🎄", "  ", "🎄", "  ", "🎄"],
  ["🎄", "  ", "  ", "  ", "  ", "🎄", "  ", "🎄", "  ", "🎄"],
  ["  ", "🎅", "🎄", "🎄", "  ", "  ", "  ", "🎄", "🎄", "🎄"],
  ["🎄", "  ", "🎄", "🎄", "  ", "🎄", "  ", "🎄", "🎄", "🎄"],
  ["🎄", "  ", "🎄", "🎄", "  ", "🎄", "  ", "🎄", "🎄", "🎄"],
  ["🎄", "  ", "  ", "  ", "  ", "🎄", "  ", "🎄", "🎄", "🎄"],
  ["🎄", "🎄", "🎄", "🎄", "🎄", "🎄", "🎄", "🎄", "🎄", "🎄"],
];
type test_maze10_down = Expect<Equal<test_maze10_down_actual, Maze11>>;


// the cookies must be freshly baked.  I hope there's also the customary glass of milk!
type test_maze11_left_actual = Move<Maze11, 'left'>;
//   ^?
type Maze12 = [
  ["🎄", "🎄", "🎄", "🎄", "🎄", "🎄", "🎄", "🎄", "🎄", "🎄"],
  ["🎄", "🎄", "🎄", "🎄", "🎄", "🎄", "  ", "🎄", "🎄", "🎄"],
  ["🎄", "🎄", "🎄", "🎄", "  ", "🎄", "  ", "  ", "  ", "🎄"],
  ["🎄", "🎄", "🎄", "🎄", "  ", "🎄", "  ", "🎄", "  ", "🎄"],
  ["🎄", "  ", "  ", "  ", "  ", "🎄", "  ", "🎄", "  ", "🎄"],
  ["🎅", "  ", "🎄", "🎄", "  ", "  ", "  ", "🎄", "🎄", "🎄"],
  ["🎄", "  ", "🎄", "🎄", "  ", "🎄", "  ", "🎄", "🎄", "🎄"],
  ["🎄", "  ", "🎄", "🎄", "  ", "🎄", "  ", "🎄", "🎄", "🎄"],
  ["🎄", "  ", "  ", "  ", "  ", "🎄", "  ", "🎄", "🎄", "🎄"],
  ["🎄", "🎄", "🎄", "🎄", "🎄", "🎄", "🎄", "🎄", "🎄", "🎄"],
];
type test_maze11_left = Expect<Equal<test_maze11_left_actual, Maze12>>;


// COOKIES!!!!!
type test_maze12_left_actual = Move<Maze12, 'left'>;
//   ^?
type MazeWin = [
  ["🍪", "🍪", "🍪", "🍪", "🍪", "🍪", "🍪", "🍪", "🍪", "🍪"],
  ["🍪", "🍪", "🍪", "🍪", "🍪", "🍪", "🍪", "🍪", "🍪", "🍪"],
  ["🍪", "🍪", "🍪", "🍪", "🍪", "🍪", "🍪", "🍪", "🍪", "🍪"],
  ["🍪", "🍪", "🍪", "🍪", "🍪", "🍪", "🍪", "🍪", "🍪", "🍪"],
  ["🍪", "🍪", "🍪", "🍪", "🍪", "🍪", "🍪", "🍪", "🍪", "🍪"],
  ["🍪", "🍪", "🍪", "🍪", "🍪", "🍪", "🍪", "🍪", "🍪", "🍪"],
  ["🍪", "🍪", "🍪", "🍪", "🍪", "🍪", "🍪", "🍪", "🍪", "🍪"],
  ["🍪", "🍪", "🍪", "🍪", "🍪", "🍪", "🍪", "🍪", "🍪", "🍪"],
  ["🍪", "🍪", "🍪", "🍪", "🍪", "🍪", "🍪", "🍪", "🍪", "🍪"],
  ["🍪", "🍪", "🍪", "🍪", "🍪", "🍪", "🍪", "🍪", "🍪", "🍪"],
];
type test_maze12_left = Expect<Equal<test_maze12_left_actual, MazeWin>>;
