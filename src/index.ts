#! /usr/bin/env node

//importem el mòdul commander.js
//i extraiem la class Command
const{Command}=require("commander")

//importem fs i path
const fs = require("fs")
const path = require("path")

//importem el modul Figlet
const figlet = require("figlet")

//establim la variable program en
//una instància de la class Command
const program = new Command()

//invoquem el mètode amb l'string com a argument
//per convertir el text en art ASCII
//i el mostrem a la console
console.log(figlet.textSync("Aredhel"))

program
  .version("1.0.0")
  .description("An example CLI for managing a directory")
  .option("-l, --ls  [value]", "List directory contents")
  .option("-m, --mkdir <value>", "Create a directory")
  .option("-t, --touch <value>", "Create a file")
  .parse(process.argv);

const options = program.opts();

//definim listDirContents() amb un gestor d'excepcions
async function listDirContents(filepath: string) {
    try {
        const files = await fs.promises.readdir(filepath);
        const detailedFilesPromises = files.map(async (file:string)=>{
            let fileDetails = await fs.promises.lstat(path.resolve(filepath, file));
            const {size, birthtime}= fileDetails;
            return{filename: file, "size(KB)": size, created_at: birthtime};
        });
        const detailedFiles = await Promise.all(detailedFilesPromises);
        console.table(detailedFiles)
      } catch (error) {//registrarà un missatge si 'try' té una excepció.
      console.error("Error occurred while reading the directory!", error);
    }
  }
  //La funció asíncrona 'listDirContents()' pren el paràmetre 'filepath'
  //El tipus garanteix que la funció només accepta strings com a arguments 
  //La paraula clau 'async' fa que la funció sigui asíncrona. 
  //Això ens permetrà, despés, utilitzar la paraula clau 'await' dins de la funció.

//Dins de la funció, definim el bloc 'try', que de moment està buit. 
//Contindrà la funcionalitat que enumera el contingut del directori 
//i formateja el resultat en una taula. 
//Després, definim el bloc 'catch' que registrarà un missatge a la consola 
//si el codi contingut al bloc 'try' té una excepció.

//comprovem si el directori path existeix, sino, el creem
function createDir(filepath: string){
    if(!fs.existsSync(filepath)){
        fs.mkdirSync(filepath);
        console.log("The directory has been created successfully")
    }
}

function createFile(filepath: string){
    fs.openSync(filepath, "w")
    console.log("An empty file has been created")
}

if(options.ls){
    const filepath = typeof options.ls === "string"? options.ls: __dirname;
    listDirContents(filepath)
}
if(options.mkdir){
    createDir(path.resolve(__dirname, options.mkdir))
}
if(options.touch){
    createFile(path.resolve(__dirname, options.touch))
}

if(!process.argv.slice(2).length){
    program.outputHelp()
}