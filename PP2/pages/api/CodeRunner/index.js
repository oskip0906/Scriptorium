const { spawnSync } = require('child_process');





export default function handler(req, res) {
  
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed, use POST' });
  }
  try {
  let { language, code, input, className } = req.body;
  
  if (!language || !code) {
    return res.status(400).json({ error: 'Missing required parameters' });
  }
  const defaults = {
    cwd: process.cwd()+`/DockerExec/${language}`,
    timeout: 5000,
  }
  !className && (className = 'main');
  !input && (input = '');
  let parsed_code = code.replace(/"/g, '\\"').replace(/\n/g, '\\n');

  let parsed_input = input.replace(/"/g, '\\"').replace(/\n/g, '\\n');
  const args = `-m 512m -e FILE_CONTENT="${parsed_code}" -e FILE_INPUT="${parsed_input}" -e FILE_NAME="${className}"`;

  const runner = spawnSync('bash',['-c', `docker run ${args} ${language}runner`], defaults);


  let output = '';
  let error = '';
  console.log(runner)
  if (runner.status === 137 || runner.error && runner.error.code === 'ETIMEDOUT') {
    return res.status(500).json({ error: 'Memory/Timeout Error' });
  }

  if (runner.output){
    output = runner.output.toString();
  }
  if (runner.error){
    error = runner.error.toString();
  }

  return res.status(200).json({ output, error });
  } 
  catch (error) {
    return res.status(500).json({ error: error.message });
  }
}