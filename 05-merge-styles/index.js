const fs = require('fs');
const path = require('path');
const {readdir} = require('fs/promises');

const cssBundlePath = path.join(__dirname, 'project-dist', 'bundle.css');
const stylesPath = path.join(__dirname, 'styles');
const stylesNames = [];

const readFilesFromStyles = (position) => {
  let result = '';
  const readableStream = fs.createReadStream(path.join(stylesPath, `${stylesNames[position]}.css`), 'utf-8');
  readableStream.on(
    'data',
    chunk => {
      result += chunk;
    }
  );
  readableStream.on(
    'end',
    () => {
      fs.appendFile(
        cssBundlePath,
        result,
        (err) => {
          if (err) throw err;
        }
      );
      position += 1;
      if(position < stylesNames.length) {
        readFilesFromStyles(position);
      }
      else return;
    }
  );
};

fs.writeFile(
  cssBundlePath,
  '',
  (err) => {
    if (err) throw err;
  }
);

readdir(
  stylesPath,
  {withFileTypes:true}
)
  .then(data => {
    for(let file of data) {
      if(file.isFile() && file.name.endsWith('.css')) {
        const filePath = path.join(stylesPath, `${file.name}`);
        const fileName = path.basename(filePath, path.extname(filePath));
        stylesNames.push(fileName);
      }
    }
    let counter = 0;
    readFilesFromStyles(counter);
  });
