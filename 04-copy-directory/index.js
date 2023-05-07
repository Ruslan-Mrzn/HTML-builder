const {mkdir,readdir} = require('fs/promises');
const fs = require('fs');
const path = require('path');

const newPath = path.join(__dirname, 'files-copy');
const oldPath = path.join(__dirname, 'files');

const copyDir = (from, to) => {
  mkdir(
    to,
    {recursive: true},
    (err) => {
      if (err) throw err;
    }
  )
    .then(() => {
      readdir(
        from,
        {withFileTypes:true}
      )
        .then((files) => {
          for(let file of files) {
            if(!file.isFile()) copyDir(path.join(from, file.name), path.join(to, file.name));
            if(file.isFile()) {
              fs.copyFile(
                path.join(from, file.name),
                path.join(to, file.name),
                (err) => {
                  if (err) throw err;
                }
              );
            }
          }
        });
    })
    .catch(err => {
      if (err) throw err;
    });
};

copyDir(oldPath, newPath);
