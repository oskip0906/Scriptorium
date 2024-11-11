
const { spawnSync } = require('node:child_process');
import { runPython3Code, runJavaCode, runCCode, runCppCode, runJavaScriptCode } from '@/lib/CodeRunner/execute.js';
const fs = require('node:fs');
// C, C++, Java, Python, and JavaScript
// Given a language, code, input, we need to execute the code, and return the output
const cmds = {
  python: (code, input) => runPython3Code(code, input),
  java: (code, input, className) => runJavaCode(code, input, className),
  c: (code, input) => runCCode(code, input),
  cpp: (code, input) => runCppCode(code, input),
  javascript: (code, input) => runJavaScriptCode(code, input)
}

export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed, use POST' });
  }
  const { language, code, input, className } = req.body;
  
  if (!language || !code) {
    return res.status(400).json({ error: 'Missing required parameters' });
  }

  if (!cmds[language]) {
    return res.status(400).json({ error: 'Unsupported language' });
  }
  if (!fs.existsSync(process.cwd()+"/RunningFiles")){
    fs.mkdirSync(process.cwd()+"/RunningFiles");
  }
  const defaults = {
    cwd: process.cwd()+"/RunningFiles"+"/",
  }
  try {
  const args = cmds[language](code, input, className);
  const runner = spawnSync('bash', args, defaults);

  const output = runner.stdout.toString();

  const error = runner.stderr.toString();

  if (error) {
    return res.status(400).json({ error });
  }
  return res.status(200).json({ output });
  }
  catch (error) {
    return res.status(500).json({ error: error.message });
  }
  

}