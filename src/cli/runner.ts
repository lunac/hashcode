import inquirer, { Answers, ListQuestion, QuestionCollection } from "inquirer";
import { Observable, Subscriber } from "rxjs";
import { getDirectories, getFiles } from "./../helpers/file";
import path from "path";
import { execSync, spawnSync } from "child_process";

const challengesPath = ["./src/challenges"];
const challenges = getDirectories(path.resolve(challengesPath[0]));

console.log(challenges);

let emitter: Subscriber<inquirer.DistinctQuestion<inquirer.Answers>>;
const prompts: QuestionCollection<Answers> = new Observable((e) => {
  emitter = e;
  emitter.next({
    type: "list",
    name: "challenge",
    message: "Pick a challenge:",
    choices: challenges.map((c) => ({ name: c })),
  });
});

const getInput = (inputs: string[]) => ({
  type: "list",
  name: "input",
  message: "Pick a input",
  choices: [...inputs].map((i) => ({ name: i })),
});

const getIndexFile = (paths: string[]) =>
  path.resolve(
    path.join(
      paths[0].replace("/src/", "/dist/"),
      ...paths.slice(1),
      paths.slice(-1) + ".js"
    )
  );

inquirer.prompt(prompts).ui.process.subscribe(
  (q: inquirer.Answers) => {
    switch (q.name) {
      case "challenge":
        challengesPath.push(q.answer);
        const inputs = getFiles(
          path.resolve(path.join(...challengesPath, "input"))
        );
        emitter.next(getInput(inputs) as ListQuestion);
        break;
      case "input":
        execSync(
          `node ${path.resolve(
            path.join(getIndexFile(challengesPath))
          )} --input ${path.resolve(
            path.join(...challengesPath, "input", q.answer)
          )}`,
          { stdio: "inherit" }
        );
        emitter.complete();
    }
  },
  (error) => {
    console.log("Hm, an error happened. Why?" + error);
  },
  () => {
    console.log("I think we are done now.");
  }
);
