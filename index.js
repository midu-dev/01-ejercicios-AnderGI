const fs = require("node:fs/promises");
const path = require("node:path");
// Ejercicio 2
async function writeFile(filePath, data, callback) {
  const NO_DIRECTORY_OR_FILE_ERROR = "ENOENT";
  const exampleFile = "ejemplo.txt";
  //ver si el path existe
  try {
    const pathStats = await fs.stat(filePath);
    //Existe el path porque hemos obtenido el stat
    //cuando la promesa resuelva puede ser un fichero o un directorio el path
    //si es directorio añadimos fichero
    if (pathStats.isDirectory()) {
      filePath = path.join(filePath, exampleFile);
    }

    //escribimos sobre ese fichero para ello esperamos a que esa promesa resuelva para seguir con le ejecucion de codigo
    await fs.writeFile(filePath, data, "utf8");
    //llamamos al callback una vez se haya completado la escritura
    //null porque no se han producido errores
    callback(null);
  } catch (err) {
    //No existe el path por que no hemos obtenido el stat
    if (err.code === NO_DIRECTORY_OR_FILE_ERROR) {
      //esperamos a que se resuelva la creacion del path
      await fs.mkdir(filePath, { recursive: true });

      //esperamos a que se obtenga el stat del path creado
      const createdPathStat = await fs.stat(filePath);

      //verificamos si es un direcotiro
      if (createdPathStat.isDirectory()) {
        filePath = path.join(filePath, exampleFile);
      }

      //escribimos sobre ese fichero para ello esperamos a que esa promesa resuelva para seguir con le ejecucion de codigo

      await fs.writeFile(filePath, data, "utf8");

      //llamamos al callback una vez se haya completado la escritura
      callback(null);
    }
  }
}

// Ejercicio 3
async function readFileAndCount(word, callback) {}

module.exports = {
  writeFile,
  readFileAndCount,
};
