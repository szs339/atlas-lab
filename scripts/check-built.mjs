import fs from 'node:fs';
import path from 'node:path';
import { loadContent, publicContent } from '../src/lib/content.mjs';

export function checkBuilt(root = process.cwd(), base = process.env.BASE_PATH || '/') {
  const dist = path.join(root, 'dist');
  const errors = [];
  const all = loadContent(root);
  const data = publicContent(all);
  const prefix = '/' + base.split('/').filter(Boolean).join('/');
  const basePath = prefix === '/' ? '' : prefix;
  const files = fs.readdirSync(dist, { recursive: true }).filter(f => f.endsWith('.html'));
  const documents = new Map(files.map(f => [path.resolve(dist, f), fs.readFileSync(path.join(dist, f), 'utf8')]));
  const decode = s => s.replace(/&amp;/g, '&').replace(/&#39;/g, "'").replace(/&quot;/g, '"');
  const expected = ['index.html', 'projects/index.html', 'people/index.html', 'publications/index.html', 'news/index.html', 'opportunities/index.html', 'about/index.html', 'cv/index.html', '404.html', ...data.projects.map(p => `projects/${p.slug}/index.html`)];
  for (const f of expected) if (!files.includes(f)) errors.push(`Missing page: ${f}`);
  for (const f of files) if (!expected.includes(f)) errors.push(`Unexpected individual or stale page: ${f}`);
  for (const [file, html] of documents) {
    const relative = path.relative(dist, file);
    if ((html.match(/<h1(?:\s|>)/g) || []).length !== 1) errors.push(`${relative}: Expected one main heading.`);
    if (!html.includes('lang="en"') || !html.includes('name="description"')) errors.push(`${relative}: Missing page language or description.`);
    const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(m => decode(m[1]));
    if (new Set(ids).size !== ids.length) errors.push(`${relative}: Duplicate HTML IDs.`);
    for (const match of html.matchAll(/\b(?:href|src)="([^"]+)"/g)) {
      const value = decode(match[1]);
      if (/^(https?:|mailto:|data:)/.test(value)) continue;
      if (/^[a-z][a-z0-9+.-]*:/i.test(value) || value.startsWith('//')) { errors.push(`${relative}: Unsafe URL ${value}`); continue; }
      const [targetWithQuery, fragment] = value.split('#');
      const target = decodeURIComponent(targetWithQuery.split('?')[0]);
      let local;
      if (!target) local = file;
      else if (target.startsWith('/')) {
        if (basePath && target !== basePath && !target.startsWith(basePath + '/')) { errors.push(`${relative}: Link escapes repository base: ${value}`); continue; }
        local = path.resolve(dist, '.' + (target.slice(basePath.length) || '/'));
      } else local = path.resolve(path.dirname(file), target);
      if (fs.existsSync(local) && fs.statSync(local).isDirectory()) local = path.join(local, 'index.html');
      if (!fs.existsSync(local)) { errors.push(`${relative}: Broken local link ${value}`); continue; }
      if (fragment && local.endsWith('.html')) {
        const targetHtml = documents.get(local) || '';
        if (![...targetHtml.matchAll(/\bid="([^"]+)"/g)].some(m => decode(m[1]) === decodeURIComponent(fragment))) errors.push(`${relative}: Missing anchor ${value}`);
      }
    }
  }
  for (const project of all.projects.filter(p => !p.published)) {
    if (files.includes(`projects/${project.slug}/index.html`)) errors.push(`Draft project was published: ${project.id}`);
  }
  if (errors.length) throw new Error('Generated-site checks failed:\n' + errors.map(e => '  • ' + e).join('\n'));
  return { pages: files.length, base: basePath || '/' };
}
if (process.argv[1] && new URL(import.meta.url).pathname === process.argv[1]) {
  try { const result = checkBuilt(); console.log(`Checked ${result.pages} pages: headings, metadata, routes, assets, local links and anchors (base ${result.base}).`); }
  catch (e) { console.error(e.message); process.exitCode = 1; }
}
