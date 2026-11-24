// Tope de `any` explícitos (7.6): falla si el número sube. Al bajarlo, actualizar MAX.
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

const MAX = Number(process.argv[2] ?? 179);
let count = 0;
const walk = (dir) => {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walk(p);
    else if (/\.tsx?$/.test(name) && !name.endsWith('database.types.ts')) {
      count += (readFileSync(p, 'utf8').match(/\bany\b/g) ?? []).length;
    }
  }
};
['src', 'app'].forEach(walk);
console.log(`any explícitos: ${count} (tope ${MAX})`);
if (count > MAX) {
  console.error('Subió la cantidad de `any`. Tipá el código nuevo en lugar de usar any.');
  process.exit(1);
}
