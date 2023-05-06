const {readdir} = require('fs/promises');
const {stat} = require('fs');
const path = require('path');

readdir(
  path.join(__dirname, 'secret-folder'),
  {withFileTypes:true}
)
  .then(data => {
    for(let file of data) {
      if(file.isFile()) {
        const filePath = path.join(__dirname, 'secret-folder', `${file.name}`);
        stat(
          filePath,
          (err, stats) => {
            if (err) throw err;
            const fileName = path.basename(filePath, path.extname(filePath));
            const fileExtension = `${file.name}`.split('.').at(-1);
            const fileSize = `${stats.size/1024}kb`;
            console.log(`${fileName} - ${fileExtension} - ${fileSize}`);
          }
        );
      }
    }
  });
