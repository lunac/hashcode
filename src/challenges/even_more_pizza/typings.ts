export type problemSpace = {
  nOfPizzas: number;
  teams: number[];
  pizzas: pizzas;
  ingridientList: string[];
};

export type pizzas = { index: number; arr: boolean[] }[];
