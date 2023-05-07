const fs = require('fs');
const path = require('path');
const {readdir} = require('fs/promises');

const cssBundlePath = path.join(__dirname, 'project-dist', 'bundle.css');
const stylesPath = path.join(__dirname, 'styles');
const readAndWriteFile = (filePath) => {
  const readableStream = fs.createReadStream(filePath, 'utf-8');
  readableStream.on(
    'data',
    chunk => fs.appendFile(
      cssBundlePath,
      chunk,
      (err) => {
        if (err) throw err;
      }
    )
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
        readAndWriteFile(filePath);
      }
    }
  });
