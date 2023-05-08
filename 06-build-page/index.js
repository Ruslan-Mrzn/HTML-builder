const fs = require('fs');
const path = require('path');
const {readdir, mkdir, rm} = require('fs/promises');

const projectDistPath = path.join(__dirname, 'project-dist');
const componentsPath = path.join(__dirname, 'components');
const cssBundlePath = path.join(__dirname, 'project-dist', 'style.css');
const stylesPath = path.join(__dirname, 'styles');
const componentsNames = [];
const map = {};
const settings = {
  templateHtml: '',
  resultHtml: '',
};

/* Замена темплэйтов и формирование index.html */
const replaceComponents = () => {
  let result = settings.templateHtml;
  for (let component in map) {
    result = result.replaceAll(`{{${component}}}`, map[component] );
  }
  settings.resultHtml = result;
  fs.appendFile(
    path.join(projectDistPath, 'index.html'),
    settings.resultHtml,
    (err) => {
      if (err) throw err;
    }
  );
};
/* =========================== */

/* Собрать данные из template.html*/
const readTemplateHtml = () => {
  let result = '';
  const readableStream = fs.createReadStream(path.join(__dirname, 'template.html'), 'utf-8');
  readableStream.on(
    'data',
    chunk => {
      result += chunk;
    }
  );
  readableStream.on(
    'end',
    () => {
      settings.templateHtml = result;
    }
  );
};
/* =========================== */

/* Собрать данные из темплэйтов и запустить формирование index.html */
const readFilesFromComponents = (position) => {
  let result = '';
  const readableStream = fs.createReadStream(path.join(componentsPath, `${componentsNames[position]}.html`), 'utf-8');
  readableStream.on(
    'data',
    chunk => {
      result += chunk;
    }
  );
  readableStream.on(
    'end',
    () => {
      map[componentsNames[position]] = result;
      position += 1;
      if(position < componentsNames.length-1) {
        readFilesFromComponents(position);
      }
      else {
        let result = '';
        const readableStream = fs.createReadStream(path.join(componentsPath, `${componentsNames[position]}.html`), 'utf-8');
        readableStream.on(
          'data',
          chunk => {
            result += chunk;
          }
        );
        readableStream.on(
          'end',
          () => {
            map[componentsNames[position]] = result;
            replaceComponents();
          }
        );
      }
    }
  );
};
/* =========================== */

/* Собрать данные из css файлов и записываем в style.css */
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
/* =========================== */

/* Запись template.html в объект */
readTemplateHtml();
/* =========================== */

/* Рекурсивное копирование папки и всех вложенных подпапок с файлами */
const copyDir = (from, to) => {
  rm(
    to,
    {
      recursive: true,
      force: true,
    },
    () => {
    }
  )
    .then(()=> {
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
        });
    })
    .catch(err => {
      if (err) throw err;
    });
};
/* =========================== */

/* Обновление index.html при каждом запуске */
mkdir(
  projectDistPath,
  {recursive: true},
  (err) => {
    if (err) throw err;
  }
)
  .then(() => {
    fs.writeFile(
      path.join(projectDistPath, 'index.html'),
      '',
      (err) => {
        if (err) throw err;
      }
    );
    fs.writeFile(
      cssBundlePath,
      '',
      (err) => {
        if (err) throw err;
      }
    );
  });
/* =========================== */

/* Создание массива имен компонентов */
readdir(
  componentsPath,
  {withFileTypes:true}
)
  .then(data => {
    for(let file of data) {
      if(file.isFile() && file.name.endsWith('.html')) {
        const filePath = path.join(componentsPath, `${file.name}`);
        const fileName = path.basename(filePath, path.extname(filePath));
        componentsNames.push(fileName);
      }
    }
    let counter = 0;
    readFilesFromComponents(counter);
  });
/* =========================== */

/* Создание бандла .css */
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
/* =========================== */

/* Копирование папки assets */
copyDir(path.join(__dirname, 'assets'), path.join(projectDistPath, 'assets'));
/* =========================== */
