export function pythonCommand(parsed_code, parsed_input, className) {
  if (!className) {
    className = "main"
  }
  return ` -e FILE_CONTENT="${parsed_code}" -e FILE_INPUT="${parsed_input}" -e FILE_NAME="${className}"`;
}

export function javaCommand(parsed_code, parsed_input, className) {
  if (!className) {
    className = "Main"
  }
  return ` -e FILE_CONTENT="${parsed_code}" -e FILE_INPUT="${parsed_input}" -e FILE_NAME="${className}"`;
}

export function javascriptCommand(parsed_code, parsed_input, className) {
  if (!className) {
    className = "main"
  }
  return ` -e FILE_CONTENT="${parsed_code}" -e FILE_INPUT="${parsed_input}" -e FILE_NAME="${className}"`;
}

export function cppCommand(parsed_code, parsed_input, className) {
  if (!className) {
    className = "main"
  }
  return ` -e FILE_CONTENT="${parsed_code}" -e FILE_INPUT="${parsed_input}" -e FILE_NAME="${className}"`;
}

