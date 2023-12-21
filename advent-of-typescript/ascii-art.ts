import { Equal, Expect } from "type-testing";

// type definitions
type Letters = {
  A: [
    '█▀█ ',
    '█▀█ ',
    '▀ ▀ ',
  ],
  B: [
    '█▀▄ ',
    '█▀▄ ',
    '▀▀  '
  ],
  C: [
    '█▀▀ ',
    '█ ░░',
    '▀▀▀ '
  ],
  E: [
    '█▀▀ ',
    '█▀▀ ',
    '▀▀▀ '
  ],
  H: [
    '█ █ ',
    '█▀█ ',
    '▀ ▀ '
  ],
  I: [
    '█ ',
    '█ ',
    '▀ '
  ],
  M: [
    '█▄░▄█ ',
    '█ ▀ █ ',
    '▀ ░░▀ '
  ],
  N: [
    '█▄░█ ',
    '█ ▀█ ',
    '▀ ░▀ '
  ],
  P: [
    '█▀█ ',
    '█▀▀ ',
    '▀ ░░'
  ],
  R: [
    '█▀█ ',
    '██▀ ',
    '▀ ▀ '
  ],
  S: [
    '█▀▀ ',
    '▀▀█ ',
    '▀▀▀ '
  ],
  T: [
    '▀█▀ ',
    '░█ ░',
    '░▀ ░'
  ],
  Y: [
    '█ █ ',
    '▀█▀ ',
    '░▀ ░'
  ],
  W: [
    '█ ░░█ ',
    '█▄▀▄█ ',
    '▀ ░ ▀ '
  ],
  ' ': [
    '░',
    '░',
    '░'
  ],
  ':': [
    '#',
    '░',
    '#'
  ],
  '*': [
    '░',
    '#',
    '░'
  ],
};

type ToLetter<Character extends string> =
  Character extends keyof Letters ?
   Letters[Character] :
  Capitalize<Character> extends keyof Letters ?
    Letters[Capitalize<Character>] :
  ['', '', '' ]; // no op

type PrintLetter<Text extends unknown[], Letter extends string[]> =
  Text extends [...infer Rest, infer First, infer Second, infer Third] ? // take the last three strings
    [
      ...Rest,
      `${First extends string ? First : never}${Letter[0]}`,
      `${Second extends string ? Second : never}${Letter[1]}`,
      `${Third extends string ? Third : never}${Letter[2]}`
    ] :
    never
;

type PrintNewLine<Text extends unknown[]> =
  [...Text, '', '', ''];

type ToAsciiArt<Input extends unknown, Text extends unknown[] = ['', '', '']> =
  Input extends `\n${infer Rest}` ?
    ToAsciiArt<Rest, PrintNewLine<Text>> : // print newline
  Input extends `${infer First}${infer Rest}` ?
    ToAsciiArt<Rest, PrintLetter<Text, ToLetter<First>>> : // print the current character
  Text
;

// tests
type test_0_actual = ToAsciiArt<"   * : * Merry * : *   \n  Christmas  ">;
//   ^?
type test_0_expected = [
  "░░░░░#░░░█▄░▄█ █▀▀ █▀█ █▀█ █ █ ░░░#░░░░░",
  "░░░#░░░#░█ ▀ █ █▀▀ ██▀ ██▀ ▀█▀ ░#░░░#░░░",
  "░░░░░#░░░▀ ░░▀ ▀▀▀ ▀ ▀ ▀ ▀ ░▀ ░░░░#░░░░░",
  "░░█▀▀ █ █ █▀█ █ █▀▀ ▀█▀ █▄░▄█ █▀█ █▀▀ ░░",
  "░░█ ░░█▀█ ██▀ █ ▀▀█ ░█ ░█ ▀ █ █▀█ ▀▀█ ░░",
  "░░▀▀▀ ▀ ▀ ▀ ▀ ▀ ▀▀▀ ░▀ ░▀ ░░▀ ▀ ▀ ▀▀▀ ░░",
];
type test_0 = Expect<Equal<test_0_actual, test_0_expected>>;

type test_1_actual = ToAsciiArt<"  Happy new  \n  * : * : * Year * : * : *  ">;
//   ^?
type test_1_expected = [
        "░░█ █ █▀█ █▀█ █▀█ █ █ ░█▄░█ █▀▀ █ ░░█ ░░",
        "░░█▀█ █▀█ █▀▀ █▀▀ ▀█▀ ░█ ▀█ █▀▀ █▄▀▄█ ░░",
        "░░▀ ▀ ▀ ▀ ▀ ░░▀ ░░░▀ ░░▀ ░▀ ▀▀▀ ▀ ░ ▀ ░░",
        "░░░░#░░░#░░░█ █ █▀▀ █▀█ █▀█ ░░░#░░░#░░░░",
        "░░#░░░#░░░#░▀█▀ █▀▀ █▀█ ██▀ ░#░░░#░░░#░░",
        "░░░░#░░░#░░░░▀ ░▀▀▀ ▀ ▀ ▀ ▀ ░░░#░░░#░░░░",
];
type test_1 = Expect<Equal<test_1_actual, test_1_expected>>;

type test_2_actual = ToAsciiArt<"  * : * : * : * : * : * \n  Trash  \n  * : * : * : * : * : * ">;
//   ^?
type test_2_expected = [
  "░░░░#░░░#░░░#░░░#░░░#░░░",
  "░░#░░░#░░░#░░░#░░░#░░░#░",
  "░░░░#░░░#░░░#░░░#░░░#░░░",
  "░░▀█▀ █▀█ █▀█ █▀▀ █ █ ░░",
  "░░░█ ░██▀ █▀█ ▀▀█ █▀█ ░░",
  "░░░▀ ░▀ ▀ ▀ ▀ ▀▀▀ ▀ ▀ ░░",
  "░░░░#░░░#░░░#░░░#░░░#░░░",
  "░░#░░░#░░░#░░░#░░░#░░░#░",
  "░░░░#░░░#░░░#░░░#░░░#░░░",
];
type test_2 = Expect<Equal<test_2_actual, test_2_expected>>;

type test_3_actual = ToAsciiArt<"  : * : * : * : * : * : * : \n  Ecyrbe  \n  : * : * : * : * : * : * : ">;
//   ^?
type test_3_expected = [
  "░░#░░░#░░░#░░░#░░░#░░░#░░░#░",
  "░░░░#░░░#░░░#░░░#░░░#░░░#░░░",
  "░░#░░░#░░░#░░░#░░░#░░░#░░░#░",
  "░░█▀▀ █▀▀ █ █ █▀█ █▀▄ █▀▀ ░░",
  "░░█▀▀ █ ░░▀█▀ ██▀ █▀▄ █▀▀ ░░",
  "░░▀▀▀ ▀▀▀ ░▀ ░▀ ▀ ▀▀  ▀▀▀ ░░",
  "░░#░░░#░░░#░░░#░░░#░░░#░░░#░",
  "░░░░#░░░#░░░#░░░#░░░#░░░#░░░",
  "░░#░░░#░░░#░░░#░░░#░░░#░░░#░",
];
type test_3 = Expect<Equal<test_3_actual, test_3_expected>>;
