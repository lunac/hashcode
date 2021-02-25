import { problemSpace } from "./typings";

export const calculateCombination = (
  problem: problemSpace,
  indexes: number[]
) => {
  const arr = problem.ingridientList.map((ing, ind) =>
    indexes.reduce((pv, cv) => pv + (problem.pizzas[cv].arr[ind] ? 1 : 0), 0)
  );
  return [arr.filter((i) => i > 0).length, arr.reduce((pv, cv) => pv + cv, 0)];
};

export const createProblemObject = (file: string) => {
  const lines = file.split("\n");
  const firstLine = lines[0].split(" ");
  let result: problemSpace = {
    nOfPizzas: parseInt(firstLine[0]),
    teams: firstLine.slice(1).map((n) => parseInt(n)),
    pizzas: [],
    ingridientList: [],
  };
  let index = 0;
  lines.slice(1).map((l) => {
    const pizza: boolean[] = [];
    const ingridients = l.split(" ").slice(1);
    result.ingridientList = [
      ...result.ingridientList,
      ...ingridients.filter((i) => result.ingridientList.indexOf(i) === -1),
    ];
    ingridients.map((i) => {
      pizza[result.ingridientList.indexOf(i)] = true;
    });
    result.pizzas.push({ index: index, arr: pizza });
    index = index + 1;
  });
  return result;
};
