const path = require('path');
const fs = require('fs');

const findFunctionNames = (str) => {
  let functionNames = [];
  let regex = /function\s+([a-zA-Z_][a-zA-Z0-9_]*)\s*\(/g;

  functionNames = functionNames.concat(str.match(regex));
  functionNames = functionNames.concat(str.match(/(?<=async )(.*)(?=\()/g));
  functionNames = functionNames.concat(str.match(/(?<=const )(.*)(?=\s*=\s*async)/g));
  functionNames = functionNames.concat(str.match(/(?<=const )(.*)(?=\s*=\s*function)/g));
  functionNames = functionNames.concat(str.match(/(?<=const )(.*)(?=\s*=\s*\()/g));

  return functionNames.filter((funcName) => funcName);
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

      let functionNames = [];
      if (extension === 'js' || extension === 'jsx' || extension === 'ts' || extension === 'tsx') {
        const fileContents = fs.readFileSync(filePath, 'utf8');
        functionNames = findFunctionNames(fileContents);
      }

      testArr.push({ [file]: functionNames });
    }
  });

  return testArr;
}

const moneyArr = bigMoney('../lo-mein/src');
console.log(moneyArr);