const fs = require("node:fs/promises");
const path = require("node:path");
const NO_DIRECTORY_OR_FILE_ERROR = "ENOENT";

// Ejercicio 2
async function writeFile(filePath, data, callback) {
  const exampleFile = "ejemplo.txt";

  try {
    const pathStats = await fs.stat(filePath);

    if (pathStats.isDirectory()) {
      filePath = path.join(filePath, exampleFile);
    }

    await fs.writeFile(filePath, data, "utf8");

    return callback(null);
  } catch (err) {
    if (err.code === NO_DIRECTORY_OR_FILE_ERROR) {
      try {
        await fs.mkdir(filePath, { recursive: true });

        const createdPathStat = await fs.stat(filePath);

        if (createdPathStat.isDirectory()) {
          filePath = path.join(filePath, exampleFile);
        }

        await fs.writeFile(filePath, data, "utf8");

        return callback(null);
      } catch (err) {
        console.log("Ha ocurrido un error");
      }
    }
  }
}

// Ejercicio 3
async function readFileAndCount(word, callback) {
  let wordCount = 0;
  //lee el archivo de la linea de comandos
  const file = process.argv[2];

  if (!file) {
    return callback(
      new Error("No se ha especificado el path del archivo"),
      wordCount
    );
  }

  if (!word) {
    return callback(
      new Error("No se ha especificado la palabra a buscar"),
      wordCount
    );
  }

  //se le pasa como argumento el path
  //ver si existe o no
  try {
    const readFile = await fs.readFile(file, "utf-8");
    wordCount = readFile.split(" ").filter((w) => w.includes(word)).length;
    return callback(null, wordCount);
  } catch (err) {
    if (err.code === NO_DIRECTORY_OR_FILE_ERROR) {
      return callback(null, wordCount);
    }

    console.log("Ha ocurrido un error");
    process.exit(1);
  }
}

module.exports = {
  writeFile,
  readFileAndCount,
};
