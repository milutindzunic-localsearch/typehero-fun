import { Expect, Equal } from 'type-testing';

// type definitions
type Present = '🛹' | '🚲' | '🛴' | '🏄';
type NextPresent<T extends Present> = T extends '🛹' ? '🚲' : T extends '🚲' ? '🛴' : T extends '🛴' ? '🏄' : '🛹';
type Repeat<T extends Present, N extends unknown, Acc extends Present[] = []> = 
	Acc["length"] extends N ? Acc : Repeat<T, N, [...Acc, T]>;
type Rebuild<T extends unknown[], Cnt extends any[] = [], Acc extends unknown[] = [], CurrPresent extends Present = '🛹'> =
	T extends [infer First, ...infer Rest] ?
	  Rebuild<Rest, [...Cnt, 0], [...Acc, ...Repeat<CurrPresent, First>], NextPresent<CurrPresent>> :
		Acc
	;

// tests
type test_0_actual = Rebuild<[2, 1, 3, 3, 1, 1, 2]>;
//   ^?
type test_0_expected =  [
  '🛹', '🛹',
	'🚲',
	'🛴', '🛴', '🛴',
	'🏄', '🏄', '🏄',
	'🛹',
	'🚲',
	'🛴', '🛴',
];
type test_0 = Expect<Equal<test_0_expected, test_0_actual>>;

type test_1_actual = Rebuild<[3, 3, 2, 1, 2, 1, 2]>;
//   ^?
type test_1_expected = [
	'🛹', '🛹', '🛹',
	'🚲', '🚲', '🚲',
	'🛴', '🛴',
	'🏄',
	'🛹', '🛹',
	'🚲',
	'🛴', '🛴'
];
type test_1 = Expect<Equal<test_1_expected, test_1_actual>>;

type test_2_actual = Rebuild<[2, 3, 3, 5, 1, 1, 2]>;
//   ^?
type test_2_expected = [
	'🛹', '🛹',
	'🚲', '🚲', '🚲',
	'🛴', '🛴', '🛴',
	'🏄', '🏄', '🏄', '🏄', '🏄',
	'🛹',
	'🚲',
	'🛴', '🛴',
];
type test_2 = Expect<Equal<test_2_expected, test_2_actual>>;
