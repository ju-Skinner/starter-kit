#!/usr/bin/env node

import fs from "fs";
import path from "path";
import readline from "readline";

// CLI args
const [,, rowsArg, colsArg] = process.argv;
const rows = parseInt(rowsArg, 10);
const cols = parseInt(colsArg, 10);

if (isNaN(rows) || isNaN(cols) || rows <= 0 || cols <= 0) {
  console.error("Usage: createGridSelection <rows> <cols>");
  process.exit(1);
}

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Regex is my Kryptonite, used google for this
function toPascalCase(str) {
  return str
    .replace(/(^\w|_\w)/g, m => m.replace('_', '').toUpperCase())
    .replace(/[^a-zA-Z0-9]/g, '');
}

rl.question("Enter output filename (with path): ", (fileName) => {
  const baseName = path.basename(fileName, path.extname(fileName));
  let componentName = toPascalCase(baseName);

  const content = `export const ${componentName} = {
    GridSelection: {
      props: { rows: ${rows}, cols: ${cols} }
    }
}
`;

  fs.writeFileSync(fileName, content, "utf-8");
  console.log(`✅ File created: ${fileName}`);

  rl.close();
});


