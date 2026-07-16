const fs = require('fs');
const path = require('path');

function walkDir(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(walkDir(file));
    } else {
      if (file.endsWith('.dto.ts')) {
        results.push(file);
      }
    }
  });
  return results;
}

const files = walkDir(path.join(__dirname, 'src'));

let replacedCount = 0;

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let changed = false;

  if (content.includes('../../common/validators/is-editorjs.validator')) {
    content = content.replace(/\.\.\/\.\.\/common\/validators\/is-editorjs\.validator/g, '../../../common/validators/is-editorjs.validator');
    changed = true;
  }
  
  if (content.includes('../../common/types/editor-js.type')) {
    content = content.replace(/\.\.\/\.\.\/common\/types\/editor-js\.type/g, '../../../common/types/editor-js.type');
    changed = true;
  }

  if (changed) {
    fs.writeFileSync(file, content, 'utf8');
    replacedCount++;
    console.log(`Updated paths in ${file}`);
  }
});

console.log(`Finished. Updated ${replacedCount} files.`);
