// Grammars link: https://bnfplayground.pauliankline.com/?bnf=%3Cexpression%3E%20%3A%3A%3D%20%3Cstatement%3E%20%7C%20%3Cstatement%3E%20%3Cexpression%3E%0A%3Cstatement%3E%20%3A%3A%3D%20%3CaddTable%3E%20%3Csemicolon%3E%0A%3CaddTable%3E%20%3A%3A%3D%20%22AddTable%22%20%22(%22%20%3CaddTableArgs%3E%20%22)%22%0A%3CaddTableArgs%3E%20%3A%3A%3D%20%22tableName%3D%22%20%3CcamelCaseString%3E%20(%22%2C%22%20%22fields%3D%22%20%3CfieldsArray%3E)%0A%3CaddField%3E%20%3A%3A%3D%20%22AddField%22%20%22(%22%20%3CaddFieldArgs%3E%20%22)%22%0A%3CaddFieldArgs%3E%20%3A%3A%3D%20%22fieldName%3D%22%20%3CcamelCaseString%3E%20%22%2Ctype%3D%22%20%3CfieldType%3E%20(%22%2CrelatedEntity%3D%22%20%3CcamelCaseString%3E)%3F%0A%3CfieldsArray%3E%20%3A%3A%3D%20%22%5B%22%20%3CaddField%3E%20(%20%22%2C%22%20%3CaddField%3E%20)*%20%22%5D%22%0A%3Carray%3E%20%3A%3A%3D%20%22%5B%22%20%3Cexpression%3E%20(%20%22%2C%22%20%3Cexpression%3E%20)*%20%22%5D%22%0A%3CcamelCaseString%3E%20%3A%3A%3D%20%22%27%22%20%3ClowercaseLetter%3E%20(%3ClowercaseLetter%3E%20%7C%20%3CuppercaseLetter%3E)*%20%22%27%22%0A%3ClowercaseLetter%3E%20%3A%3A%3D%20(%5Ba-z%5D)%0A%3CuppercaseLetter%3E%20%3A%3A%3D%20(%5BA-Z%5D)%0A%3Csemicolon%3E%20%3A%3A%3D%20%22%3B%22%0A%3CfieldType%3E%20%3A%3A%3D%20%22%27%22%20(%22longitude%22%20%7C%20%22latitude%22%20%7C%20%22price%22%20%7C%20%22percentage%22%20%7C%20%22url%22%20%7C%20%22json%22%20%7C%20%22primary-key%22%20%7C%20%22relation%22%20%7C%20%22relation-id%22%20%7C%20%22uuid%22%20%7C%20%22email%22%20%7C%20%22password%22%20%7C%20%22single-line%22%20%7C%20%22multi-line%22%20%7C%20%22local-tel%22%20%7C%20%22international-tel%22%20%7C%20%22select%22%20%7C%20%22boolean%22%20%7C%20%22datetime%22%20%7C%20%22timestamp%22%20%7C%20%22date%22%20%7C%20%22time%22%20%7C%20%22decimal%22%20%7C%20%22integer%22%20%7C%20%22file%22)%20%22%27%22%0A&name=
const { stripIndents, oneLine } = require('common-tags');

const fs = require('fs');
const { join } = require('path');
const { render } = require('template-file');
const DSL_SYNTAX = fs.readFileSync(join(__dirname, 'grammars.ebnf'), {
  encoding: 'utf-8',
});

const trainingDir = join(process.cwd(), 'datasets', 'training');
const outputDir = join(process.cwd(), 'datasets', 'output');
const outputFilePath = join(outputDir, 'dataset.jsonl');
fs.mkdirSync(outputDir, { recursive: true });
fs.readdir(trainingDir, (err, files) => {
  if (err) {
    console.error(`Error reading directory: ${err}`);
    return;
  }

  const outputStream = fs.createWriteStream(outputFilePath);
  const promptTemplate = fs.readFileSync(join(__dirname, 'prompt'), 'utf-8');
  files.forEach((filename) => {
    if (filename.endsWith('.json')) {
      const filePath = join(trainingDir, filename);
      const fileData = fs.readFileSync(filePath, { encoding: 'utf-8' });
      const jsonArray = JSON.parse(fileData);

      jsonArray.forEach((jsonObject) => {
        const stop = `###`;
        const completionPrefix = ' ';
        jsonObject.completion = `${completionPrefix}${jsonObject.completion}${stop}`;
        jsonObject.prompt = render(stripIndents(promptTemplate), {
          TASK: jsonObject.prompt,
          DSL_SYNTAX: oneLine(DSL_SYNTAX.split('\n').join(';')),
        });
        const jsonLine = JSON.stringify(jsonObject);
        outputStream.write(`${jsonLine}\n`);
      });

      console.log(`Finished reading file: ${filePath}`);
    }
  });

  outputStream.on('close', () => {
    console.log(`Finished writing JSONL output to file: ${outputFilePath}`);
  });
});
