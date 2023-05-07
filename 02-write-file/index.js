const fs = require('fs');
const path = require('path');
const {stdin, stdout, exit} = require('process');
const readline = require('readline');
const rl = readline.createInterface(stdin);

process.on('exit', () => {
  stdout.write('Досвидания!\n');
});

process.on('SIGINT', () => {
  exit();
});

fs.writeFile(
  path.join(__dirname, 'file.txt'),
  '',
  (err) => {
    if (err) throw err;
  }
);

console.log('Приветствую! Введите ваш текст:');

rl.on('line', (input) => {
  if(input === 'exit') exit();
  fs.appendFile(
    path.join(__dirname, 'file.txt'),
    `${input}\n`,
    (err) => {
      if (err) throw err;
    }
  );
});
