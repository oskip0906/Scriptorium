import { parse } from "path";

export function pythonCommand(code, input, className) {
  if (!className) {
    className = "main"
  }
  let parsed_code = code.replace(/"/g, '\\"').replace(/\n/g, '\\n');
  let parsed_input = input = input.replace(/"/g, '\\"').replace(/\n/g, '\\n');
  return ` -e FILE_CONTENT="${parsed_code}" -e FILE_INPUT="${parsed_input}" -e FILE_NAME="${className}"`;
}

