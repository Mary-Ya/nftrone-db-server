import fs from 'fs';
import path from 'path';
import readline from 'readline';
import chalk from 'chalk';
import figlet from 'figlet';
import Table from 'cli-table3';

const __dirname = path.resolve();

const sharedDirName = 'shared';

const sourceDir = path.join(__dirname, '..', sharedDirName);
const destinationDir = process.argv[2] || path.join(__dirname, '../../');

const copyFiles = (source: string, destination: string) => {
  try {

    fs.readdirSync(source).forEach((file) => {
      const sourcePath = path.join(source, file);
      const destinationPath = path.join(destination, file);

      if (fs.statSync(sourcePath).isDirectory()) {
        fs.mkdirSync(destinationPath, { recursive: true });
        copyFiles(sourcePath, destinationPath);
      } else {
        fs.copyFileSync(sourcePath, destinationPath);
      }
    }
    );
  } catch (error) {
    console.error(error);
  }
}

export function copyShared(source = sourceDir, destination = destinationDir) {
  console.log(
    chalk.yellow(figlet.textSync("Copy shared dir", { horizontalLayout: "full" }))
  );
  const sourceFiles = fs.readdirSync(source);
  const destFiles = fs.readdirSync(destination);


  let maxFileLength = 0;
  const order = [0, 1];

  if (sourceFiles.length > destFiles.length) {
    maxFileLength = sourceFiles.length;
  } else {
    maxFileLength = destFiles.length;
  }

  var table = new Table({
    head: ['Source Files ' + chalk.cyan(sourceDir), 'Destination Files ' + chalk.magenta(destinationDir)]
    , colWidths: [100, 100]
  });

  console.log(maxFileLength)
  for (let i = 0; i < maxFileLength; i++) {
    const newLine = [];
    console.log(sourceFiles[i], destFiles[i]);
    newLine[order[0]] = sourceFiles[i] || "";
    newLine[order[1]] = destFiles[i] || "";

    table.push(newLine);
  }

  console.log(table.toString());

  if (destFiles.indexOf(sharedDirName) > -1) {
    console.log('File exists');
  } else {
    console.log('File does not exist');
    fs.mkdirSync(path.join(destinationDir, sharedDirName));
  }

  sourceFiles.forEach((file) => {
    const sourcePath = path.join(source, file);
    const destinationPath = path.join(destination, sharedDirName, file);

    if (fs.statSync(sourcePath).isDirectory()) {
      fs.mkdirSync(destinationPath, { recursive: true });
      copyFiles(sourcePath, destinationPath);
    } else {
      if (fs.existsSync(destinationPath)) {
        const rl = readline.createInterface({
          input: process.stdin,
          output: process.stdout
        });

        rl.question(`File ${file} already exists. Replace it? (y/n): `, (answer) => {
          if (answer.toLowerCase() === 'y') {
            fs.copyFileSync(sourcePath, destinationPath);
            console.log(`File ${file} replaced.`);
          } else {
            console.log(`File ${file} skipped.`);
          }

          rl.close();
        });
      } else {
        fs.copyFileSync(sourcePath, destinationPath);
        console.log(`File ${file} copied.`);
      }
    }
  });
}


copyShared();