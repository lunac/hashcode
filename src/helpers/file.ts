import fs from "fs-extra";

export const readFile = async (path: string) => {
  try {
    if (!fs.existsSync(path)) throw new Error("File does not exist!");
    return await fs.readFile(path, "utf8");
  } catch (e) {
    throw new Error("Error while reading file " + e);
  }
};

export const writeFile = async (
  path: string,
  write: string,
  overwrite: boolean
) => {
  try {
    if (!overwrite && !fs.existsSync(path))
      throw new Error("File does not exist!");
    const preWrite = !overwrite ? await fs.readFile(path, "utf8") : "";
    await fs.outputFile(path, preWrite + write);
  } catch (e) {
    throw new Error("Error while writing file " + e);
  }
};

export const appendToFile = async (path: string, write: string) =>
  await writeFile(path, "\n " + write, false);

export const replaceFile = async (path: string, write: string) =>
  await writeFile(path, write, true);

export const getDirectories = (path: string) =>
  fs
    .readdirSync(path, { withFileTypes: true })
    .filter((dir) => dir.isDirectory())
    .map((dir) => dir.name);

export const getFiles = (path: string) =>
  fs
    .readdirSync(path, { withFileTypes: true })
    .filter((dir) => !dir.isDirectory())
    .map((dir) => dir.name);
