const fs = require("node:fs/promises");
const path = require("node:path");
const NO_DIRECTORY_OR_FILE_ERROR = "ENOENT";
const exampleFile = "ejemplo.txt";

// Ejercicio 2
async function writeFile(filePath, data, callback) {
  try {
    const pathStats = await fs.stat(filePath);

    if (pathStats.isDirectory()) {
      filePath = path.join(filePath, exampleFile);
    }

    await fs.writeFile(filePath, data, "utf8");

    return callback(null);
  } catch (err) {
    if (err.code === NO_DIRECTORY_OR_FILE_ERROR) {
      createRecursivePath(filePath, data, callback);
    }
  }
}

async function createRecursivePath(filePath, data, callback) {
  try {
    await fs.mkdir(filePath, { recursive: true });

    const createdPathStat = await fs.stat(filePath);

    if (createdPathStat.isDirectory()) {
      filePath = path.join(filePath, exampleFile);
    }

    await fs.writeFile(filePath, data, "utf8");

    return callback(null);
  } catch (err) {
    return callback(err);
  }
}

// Ejercicio 3
async function readFileAndCount(word, callback) {
  let wordCount = 0;
  //lee el archivo de la linea de comandos
  const file = process.argv[2];

  if (!file) {
    return callback(new Error("No se ha especificado el path del archivo"));
  }

  if (!word) {
    return callback(new Error("No se ha especificado la palabra a buscar"));
  }

  //se le pasa como argumento el path
  //ver si existe o no
  try {
    const readFile = await fs.readFile(file, "utf-8");
    const fileWordsArray = readFile.split(" ");
    const wordInFileWordsArray = fileWordsArray.filter((w) => w.includes(word));
    wordCount = wordInFileWordsArray.length;
    return callback(null, wordCount);
  } catch (err) {
    if (err.code === NO_DIRECTORY_OR_FILE_ERROR) {
      return callback(null, wordCount);
    }

    return callback(new Error("Ha ocurrido un error"));
  }
}

module.exports = {
  writeFile,
  readFileAndCount,
};
