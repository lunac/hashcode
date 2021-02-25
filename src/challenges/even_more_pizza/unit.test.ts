import { calculateCombination } from "./helpers";
import { problemSpace } from "./typings";
const testFile = `5 1 2 1
3 onion pepper olive
3 mushroom tomato basil
3 chicken mushroom pepper
3 tomato mushroom basil
2 chicken basil`;
const problemTest: problemSpace = {
  nOfPizzas: 5,
  teams: [1, 2, 1],
  pizzas: [
    { index: 0, arr: [true, true, true] },
    { index: 1, arr: [false, false, false, true, true, true] },
    { index: 2, arr: [false, true, false, true, false, false, true] },
    { index: 3, arr: [false, false, false, true, true, true] },
    { index: 4, arr: [false, false, false, false, false, true, true] },
  ],
  ingridientList: [
    "onion",
    "pepper",
    "olive",
    "mushroom",
    "tomato",
    "basil",
    "chicken",
  ],
};

it("calculates correct pizzas weigth", () => {
  expect(calculateCombination(problemTest, [0, 1])).toEqual([6, 6]);
  expect(calculateCombination(problemTest, [0, 2])).toEqual([5, 6]);
  expect(calculateCombination(problemTest, [0, 1, 2, 3])).toEqual([7, 12]);
});
