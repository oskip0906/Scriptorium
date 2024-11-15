const { spawnSync } = require('child_process');
import { pythonCommand } from '@/lib/CodeRunner/execute';
export default function handler(req, res) {
  
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed, use POST' });
  }
  try {
  const { language, code, input, className } = req.body;
  
  if (!language || !code) {
    return res.status(400).json({ error: 'Missing required parameters' });
  }
  const defaults = {
    cwd: process.cwd()+`/DockerExec/${language}`,
  }
  const args = pythonCommand(code, input, className);
  console.log('docker run ', args, `${language}runner`);
  const runner = spawnSync('bash',['-c', `docker run ${args} ${language}runner`], defaults);
  const output = runner.stdout.toString();

  const error = runner.stderr.toString();

  console.log(output, error);

  return res.status(200).json({ output, error });
  } 
  catch (error) {
    return res.status(500).json({ error: error.message });
  }
}