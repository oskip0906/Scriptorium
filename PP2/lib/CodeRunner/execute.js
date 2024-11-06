const fs = require('fs');
const path = require('path');


function createInputFile(data) {
    const inputPath = path.join(process.cwd(), 'RunningFiles','input.txt');
    fs.writeFileSync(inputPath, data);
}

function createRunFile(code, suffix, className='Main'){
    const filePath = path.join(process.cwd(), 'RunningFiles',`${className}.${suffix}`);
    fs.writeFileSync(filePath, code);
}
function runPython3Code(code, input) {
    createRunFile(code,'py');
  if (input) {
    createInputFile(input);
    return ['-c', 'python3 Main.py < input.txt'];
  }
  return ['-c', 'python3 Main.py'];
}

function runJavaCode(code, input, className) {
    createRunFile(code,'java', className);
    if (input) {
        createInputFile(input);
        return ['-c', `javac ${className}.java && java ${className} < input.txt`];
    }
    return  ['-c', `javac ${className}.java && java ${className}`];
}

function runCCode(code, input) {
    createRunFile(code,'c');
    if (input) {
        createInputFile(input);
        return ['-c', 'gcc -Wall -Werror Main.c -o Main && ./Main < input.txt'];
    }
    return ['-c', 'gcc -Wall -Werror Main.c -o Main && ./Main'];
}

function runCppCode(code, input) {
    createRunFile(code,'cpp');
    if (input) {
        createInputFile(input);
        return ['-c', 'g++ -Wall -Werror Main.cpp -o Main && ./Main < input.txt'];
    }
    return ['-c', 'g++ -Wall -Werror Main.cpp -o Main && ./Main'];
}

function runJavaScriptCode(code, input) {
    createRunFile(code,'js');
    if (input) {
        createInputFile(input);
        return ['-c', 'node Main.js < input.txt'];
    }
    return ['-c', 'node Main.js'];
}

export { runPython3Code, runJavaCode, runCCode, runCppCode, runJavaScriptCode };