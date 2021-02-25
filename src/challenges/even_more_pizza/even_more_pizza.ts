import { readFile, writeFile } from "../../helpers/file";
import { createProblemObject, calculateCombination } from "./helpers";
import { problemSpace } from "./typings";
import yargs from "yargs";

const useMemo: Record<string, number[]> = {};

const getMemo = (indexes: number[]) => {
  const index = indexes.join(",");
  if (!!useMemo[index]) return useMemo[index];
  if (Object.keys(useMemo).length > 3000) {
    console.log("Reached 3000");
    return calculateCombination(problem, indexes);
  }
  setMemo(indexes);
  return useMemo[index];
};
const setMemo = (indexes: number[]) =>
  (useMemo[indexes.join(",")] = calculateCombination(problem, indexes));

const findBestComb = (
  team: number,
  leftPizzas: { index: number; arr: boolean[] }[],
  chosenPizzas: number[],
  limit: number
): { value: number; chosenPizzas: number[] } => {
  if (chosenPizzas.length === team) {
    return {
      value: (() => {
        const [a, b] = getMemo(chosenPizzas);
        return a / b;
      })(),
      chosenPizzas,
    };
  }
  if (!leftPizzas || leftPizzas.length === 0 || limit > 2000)
    return { value: 0, chosenPizzas };
  const add = findBestComb(
    team,
    leftPizzas.slice(1),
    [...chosenPizzas, leftPizzas[0].index],
    limit + 1
  );
  let skip;
  if (add.value < 0.9)
    skip = findBestComb(team, leftPizzas.slice(1), chosenPizzas, limit + 1);
  else skip = { value: 0, chosenPizzas: [] };
  if (add.value >= skip.value && team === add.chosenPizzas.length) {
    return {
      value: add.value,
      chosenPizzas: add.chosenPizzas,
    };
  }
  if (skip.chosenPizzas.length === team)
    return { value: skip.value, chosenPizzas: skip.chosenPizzas };
  return { value: 0, chosenPizzas: [] };
};

let problem: problemSpace;
const argv = yargs(process.argv.slice(2)).options({
  input: { type: "string", demandOption: true },
}).argv;

const getHigherTeam = (arr: number[]) => {
  if (arr[2] > 0) return 4;
  if (arr[1] > 0) return 3;
  if (arr[0] > 0) return 2;
  return 0;
};

const run = async () => {
  global.gc();
  const file = await readFile(argv.input);
  problem = createProblemObject(file);
  let leftPizzas = problem.pizzas;
  let solution = [];
  let teams = problem.teams;
  let team = getHigherTeam(teams);
  while (leftPizzas.length >= 2 && team > 0) {
    const result = findBestComb(team, leftPizzas, [], 0);
    if (result.value !== 0) {
      leftPizzas = leftPizzas.filter(
        (lp) => !result.chosenPizzas.some((cp) => cp === lp.index)
      );
      solution.push(`${team} ${result.chosenPizzas.join(" ")}`);
      teams[team - 2] = teams[team - 2] - 1;
    } else {
      teams[team - 2] = 0;
    }
    console.log("done ", leftPizzas.length);
    team = getHigherTeam(teams);
  }
  const resultString = `${solution.length}\n${solution.join("\n")}`;
  writeFile(argv.input.replace("/input/", "/output/"), resultString, true);
};

run();
