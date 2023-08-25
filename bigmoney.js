const path = require('path');
const fs = require('fs');

const findInFileFunctionNames = (fileContentStr) => {
  let inFileFunctionNames = [];
  let regex = /function\s+([a-zA-Z_][a-zA-Z0-9_]*)\s*\(/g;
  inFileFunctionNames = inFileFunctionNames.concat(fileContentStr.match(/(?<=async\s+)(.*)(?=\s \()/g));
  inFileFunctionNames = inFileFunctionNames.concat(fileContentStr.match(/(?<=const\s+)(.*)(?=\s *=\s*async)/g));
  inFileFunctionNames = inFileFunctionNames.concat(fileContentStr.match(/(?<=const\s+)(.*)(?=\s *=\s*function)/g));
  inFileFunctionNames = inFileFunctionNames.concat(fileContentStr.match(/(?<=const\s+)(.*)(?=\s *=\s*\()/g));

  return inFileFunctionNames.filter((funcName) => funcName);
}

const findImportedFunctionNames = (fileContentStr) => {
  let importedFunctionNames = [];

  importedFunctionNames = importedFunctionNames.concat(fileContentStr.match(/(?<=import\s+)(.*)(?= from)/g));
  console.log(importedFunctionNames)

  return importedFunctionNames;
}

const bigMoney = (directory) => {
  const testArr = []
  fs.readdirSync(directory).forEach(file => {
    const filePath = path.join(directory, file);

    if (fs.statSync(filePath).isDirectory()) {
      const hello = bigMoney(filePath);
      testArr.push({ [file]: hello });
      return testArr;
    } else {
      const splitFile = file.split('.');
      const extension = splitFile[splitFile.length - 1];

      let inFileFunctionNames = [];
      let importedFunctionNames = [];
      if (extension === 'js' || extension === 'jsx' || extension === 'ts' || extension === 'tsx') {
        const fileContentStr = fs.readFileSync(filePath, 'utf8');
        inFileFunctionNames = findInFileFunctionNames(fileContentStr);
        // console.log(inFileFunctionNames)
        console.log(file);
        importedFunctionNames = findImportedFunctionNames(fileContentStr);
        // console.log(importedFunctionNames)
      }

      testArr.push({ [file]: {
        inFileFunctionNames,
        importedFunctionNames
      } });
    }
  });

  return testArr;
}

const moneyArr = bigMoney('../lo-mein/src');
console.log(moneyArr);