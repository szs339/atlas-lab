import { loadContent, collectionNames } from '../src/lib/content.mjs';
try {
  const data = loadContent();
  console.log('Content valid. ' + collectionNames.map(n => `${n}: ${data[n].length}`).join(' · '));
} catch (error) { console.error(error.message); process.exitCode = 1; }
