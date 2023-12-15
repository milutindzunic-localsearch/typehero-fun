import { Expect, Equal } from "type-testing";

// type definition
type BoxToys<
  Toy extends string,
  Num extends number,
  Acc extends string[] = never,
  Cnt extends Toy[] = []
> = Cnt["length"] extends Num
  ? BoxToys<Toy, Num, Acc | Cnt, [...Cnt, Toy]> // current number is in the union
  : Acc["length"] extends 0
  ? BoxToys<Toy, Num, Acc, [...Cnt, Toy]> // we still haven't reached the union's numbers
  : Acc; // finished recursing

// tests
type test_doll_actual = BoxToys<"doll", 1>;
//   ^?
type test_doll_expected = ["doll"];
type test_doll = Expect<Equal<test_doll_expected, test_doll_actual>>;

type test_nutcracker_actual = BoxToys<"nutcracker", 3 | 4>;
//   ^?
type test_nutcracker_expected =
  | ["nutcracker", "nutcracker", "nutcracker"]
  | ["nutcracker", "nutcracker", "nutcracker", "nutcracker"];
type test_nutcracker = Expect<
  Equal<test_nutcracker_expected, test_nutcracker_actual>
>;
