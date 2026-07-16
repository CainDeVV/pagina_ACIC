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

  if (content.includes('@Transform(({ value }): any =>')) {
    content = content.replace(/@Transform\(\(\{ value \}\): any =>/g, '@Transform(({ value }: { value: unknown }): unknown =>');
    changed = true;
  }
  
  if (content.includes('@Type((): any =>')) {
    content = content.replace(/@Type\(\(\): any =>/g, '@Type(() =>');
    changed = true;
  }
  
  if (content.includes('@Transform(({ value }): any => {')) {
    content = content.replace(/@Transform\(\(\{ value \}\): any => \{/g, '@Transform(({ value }: { value: unknown }): unknown => {');
    changed = true;
  }
  
  if (content.includes('@Transform(({ value }): any => value === \'true\' || value === true)')) {
    content = content.replace(/@Transform\(\(\{ value \}\): any => value === 'true' \|\| value === true\)/g, '@Transform(({ value }: { value: unknown }): boolean => value === \'true\' || value === true)');
    changed = true;
  }

  if (changed) {
    fs.writeFileSync(file, content, 'utf8');
    replacedCount++;
    console.log(`Updated ${file}`);
  }
});

console.log(`Finished. Updated ${replacedCount} files.`);
