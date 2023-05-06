const {mkdir,readdir} = require('fs/promises');
const {copyFile} = require('fs')
const path = require('path');

const newPath = path.join(__dirname, 'files-copy')
const oldPath = path.join(__dirname, 'files')

mkdir(
  newPath,
  {recursive: true},
  (err) => {
    if (err) throw err
  }
)
.then(() => {
  readdir(
    oldPath
  )
  .then((files) => {
    for(let file of files) {
      copyFile(
        path.join(oldPath, file),
        path.join(newPath, file),
        (err) => {
          if (err) throw err
        }
      )
    }
  })
})
.catch(err => {
  if (err) throw err
})
