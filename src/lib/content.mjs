import fs from 'node:fs';
import path from 'node:path';
import { z } from 'zod';
import { pageTextSchema, defaultPageText } from './page-text.mjs';

export const themes = {
  learning: 'AI-supported learning and instruction',
  interaction: 'Learning analytics and human–AI interaction',
  systems: 'Trustworthy AI and software systems'
};
export const collectionNames = ['people', 'projects', 'publications', 'news', 'funding', 'resources', 'opportunities'];
const id = z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Use a stable lowercase ID with hyphens.');
const optionalText = z.preprocess(v => v == null ? '' : v, z.string());
const text = z.string().trim().min(1, 'This field is required.');
const array = schema => z.preprocess(v => v == null ? [] : v, z.array(schema));
const ids = array(id);
const url = z.string().url().refine(v => /^https?:\/\//.test(v), 'Use an https:// or http:// URL.');
const optionalUrl = z.preprocess(v => v == null ? '' : v, z.union([z.literal(''), url]));
const asset = z.string().regex(/^\/(uploads|files)\/[a-zA-Z0-9/_ .-]+$/, 'Use an uploaded /uploads/ or /files/ path.').refine(v => !v.includes('..'), 'Parent paths are not allowed.');
const optionalAsset = z.preprocess(v => v == null ? '' : v, z.union([z.literal(''), asset]));
const fileUrl = z.preprocess(v => v == null ? '' : v, z.union([z.literal(''), asset, url]));
const date = z.string().regex(/^\d{4}-\d{2}-\d{2}$/).refine(v => {
  const d = new Date(v + 'T12:00:00Z');
  return !isNaN(d.valueOf()) && d.toISOString().slice(0, 10) === v;
}, 'Use a valid YYYY-MM-DD date.');
const optionalDate = z.preprocess(v => v == null ? '' : v, z.union([z.literal(''), date]));
const link = z.strictObject({ label: text, url });
const common = { id, published: z.boolean().default(false) };
const participation = z.strictObject({ projectId: id, role: text, startDate: optionalDate, endDate: optionalDate });

export const schemas = {
  people: z.strictObject({ ...common, name: text, role: text,
    category: z.enum(['director', 'graduate', 'undergraduate', 'collaborator']),
    membershipStatus: z.enum(['current', 'alumni']),
    bio: optionalText, degree: optionalText, startDate: optionalDate, endDate: optionalDate,
    position: optionalText, positionVerified: optionalDate,
    photo: optionalAsset, photoAlt: optionalText, links: array(link), memberships: array(participation)
  }),
  projects: z.strictObject({ ...common, slug: id, title: text, expansion: optionalText,
    summary: text, research: optionalText, theme: z.enum(['learning', 'interaction', 'systems']),
    status: z.enum(['active', 'completed']), featured: z.boolean().default(false),
    image: optionalAsset, imageAlt: optionalText, links: array(link)
  }),
  publications: z.strictObject({ ...common, title: text,
    authors: z.array(z.strictObject({ name: text, personId: z.preprocess(v => v == null ? '' : v, z.union([z.literal(''), id])) })).min(1),
    year: z.number().int().min(1900).max(2200), venue: text,
    type: z.enum(['conference', 'journal', 'workshop', 'poster', 'preprint', 'other']),
    status: z.enum(['preprint', 'accepted', 'published']), projectIds: ids,
    doi: optionalText, pdf: fileUrl, url: optionalUrl, links: array(link), featured: z.boolean().default(false)
  }),
  news: z.strictObject({ ...common, title: text, date, body: text, featured: z.boolean().default(false),
    projectIds: ids, personIds: ids, publicationIds: ids, fundingIds: ids, links: array(link)
  }),
  funding: z.strictObject({ ...common, title: text, sponsor: text, awardId: optionalText,
    startDate: optionalDate, endDate: optionalDate, status: z.enum(['active', 'completed']),
    amount: z.number().finite().nonnegative().nullish(), currency: z.enum(['USD', 'EUR', 'GBP']).default('USD'),
    amountLabel: optionalText, investigators: array(text), projectIds: ids, url: optionalUrl
  }),
  resources: z.strictObject({ ...common, title: text, description: optionalText,
    type: z.enum(['software', 'dataset', 'demo', 'documentation', 'teaching', 'other']),
    url: z.union([url, asset]), projectIds: ids
  }),
  opportunities: z.strictObject({ ...common, title: text, question: text, contribution: text,
    background: optionalText, levels: z.array(z.enum(['ms', 'honors'])).min(1),
    availability: z.enum(['discuss', 'open', 'closed']), projectIds: z.array(id).min(1)
  })
};
export const settingsSchema = z.strictObject({
  title: text, expansion: text, affiliation: text, intro: text, about: text,
  email: z.string().email(), directorId: id, cvPath: optionalAsset, heroImage: optionalAsset,
  opportunityIntro: text, inquiryInstructions: text,
  featuredProjectLimit: z.number().int().min(1).max(12),
  recentNewsLimit: z.number().int().min(1).max(12),
  selectedPublicationLimit: z.number().int().min(1).max(12)
});

export class ContentError extends Error {
  constructor(issues) { super('Content validation failed:\n' + issues.map(v => '  • ' + v).join('\n')); this.issues = issues; }
}

export function validateRecords(input) {
  const errors = [];
  const data = {};
  const pageText = pageTextSchema.safeParse(input.pageText ?? defaultPageText);
  if (!pageText.success) pageText.error.issues.forEach(e => errors.push(`pageText.${e.path.join('.')}: ${e.message}`));
  else data.pageText = pageText.data;
  const settings = settingsSchema.safeParse(input.settings);
  if (!settings.success) settings.error.issues.forEach(e => errors.push(`settings.${e.path.join('.')}: ${e.message}`));
  else data.settings = settings.data;
  for (const name of collectionNames) {
    data[name] = [];
    const seen = new Set();
    for (const [i, record] of (input[name] || []).entries()) {
      const result = schemas[name].safeParse(record);
      const label = `${name}/${record.id || i}`;
      if (!result.success) { result.error.issues.forEach(e => errors.push(`${label}.${e.path.join('.')}: ${e.message}`)); continue; }
      const r = result.data;
      if (seen.has(r.id)) errors.push(`${label}: Duplicate ID.`);
      seen.add(r.id); data[name].push(r);
      if (r.startDate && r.endDate && r.startDate > r.endDate) errors.push(`${label}: End date precedes start date.`);
      if (r.photo && !r.photoAlt.trim()) errors.push(`${label}: A photograph needs alternative text.`);
      if (r.image && !r.imageAlt.trim()) errors.push(`${label}: An image needs alternative text.`);
      if (name === 'funding' && r.amount != null && !r.amountLabel.trim()) errors.push(`${label}: Explain the amount (for example, total award).`);
      if (name === 'publications' && r.doi && !/^10\.\d{4,9}\/\S+$/.test(r.doi)) errors.push(`${label}: Enter the DOI identifier, starting with 10., not a URL.`);
    }
  }
  const by = Object.fromEntries(collectionNames.map(n => [n, new Map(data[n].map(r => [r.id, r]))]));
  const check = (target, refs, label) => {
    const seen = new Set();
    for (const ref of refs) {
      if (!by[target].has(ref)) errors.push(`${label}: Unknown ${target} reference '${ref}'.`);
      if (seen.has(ref)) errors.push(`${label}: Duplicate ${target} reference '${ref}'.`);
      seen.add(ref);
    }
  };
  if (data.settings) {
    check('people', [data.settings.directorId], 'settings.directorId');
    const director = by.people.get(data.settings.directorId);
    if (director && (!director.published || director.category !== 'director')) errors.push('settings.directorId: Select a published director record.');
  }
  const slugs = new Set();
  for (const p of data.projects) { if (slugs.has(p.slug)) errors.push(`projects/${p.id}: Duplicate project slug '${p.slug}'.`); slugs.add(p.slug); }
  for (const p of data.people) {
    check('projects', p.memberships.map(m => m.projectId), `people/${p.id}.memberships`);
    for (const m of p.memberships) if (m.startDate && m.endDate && m.startDate > m.endDate) errors.push(`people/${p.id}: A project membership ends before it starts.`);
  }
  for (const n of ['publications', 'news', 'funding', 'resources', 'opportunities']) {
    for (const r of data[n]) check('projects', r.projectIds, `${n}/${r.id}.projectIds`);
  }
  for (const r of data.publications) check('people', r.authors.map(a => a.personId).filter(Boolean), `publications/${r.id}.authors`);
  for (const r of data.news) for (const [field, target] of [['personIds', 'people'], ['publicationIds', 'publications'], ['fundingIds', 'funding']]) check(target, r[field], `news/${r.id}.${field}`);
  if (errors.length) throw new ContentError(errors);
  return data;
}

export function loadContent(root = process.cwd()) {
  const contentDir = path.join(root, 'content');
  const input = { settings: JSON.parse(fs.readFileSync(path.join(contentDir, 'site.json'), 'utf8')) };
  const textFile = path.join(contentDir, 'page-text.json');
  if (fs.existsSync(textFile)) {
    try { input.pageText = JSON.parse(fs.readFileSync(textFile, 'utf8')); }
    catch (e) { throw new ContentError([`page-text.json: Invalid JSON: ${e.message}`]); }
  }
  for (const name of collectionNames) {
    const dir = path.join(contentDir, name);
    input[name] = fs.existsSync(dir) ? fs.readdirSync(dir).filter(f => f.endsWith('.json')).sort().map(file => {
      let record;
      try { record = JSON.parse(fs.readFileSync(path.join(dir, file), 'utf8')); }
      catch (e) { throw new ContentError([`${name}/${file}: Invalid JSON: ${e.message}`]); }
      if (file !== `${record.id}.json`) throw new ContentError([`${name}/${file}: Filename must match its stable ID (${record.id}.json).`]);
      return record;
    }) : [];
  }
  const data = validateRecords(input);
  const issues = [];
  function checkFiles(value) {
    if (typeof value === 'string' && /^\/(uploads|files)\//.test(value)) {
      if (!fs.existsSync(path.join(root, 'public', value.slice(1)))) issues.push(`Missing uploaded file: ${value}`);
    } else if (Array.isArray(value)) value.forEach(checkFiles);
    else if (value && typeof value === 'object') Object.values(value).forEach(checkFiles);
  }
  checkFiles(data);
  if (issues.length) throw new ContentError([...new Set(issues)]);
  return data;
}

export function publicContent(data) {
  const result = { settings: data.settings, pageText: data.pageText };
  for (const n of collectionNames) result[n] = data[n].filter(r => r.published);
  result.news.sort((a, b) => b.date.localeCompare(a.date) || a.id.localeCompare(b.id));
  result.publications.sort((a, b) => b.year - a.year || a.title.localeCompare(b.title));
  result.people.sort((a, b) => a.name.localeCompare(b.name));
  return result;
}
export function forProject(data, projectId) {
  const pub = publicContent(data);
  const project = pub.projects.find(p => p.id === projectId);
  if (!project) return null;
  return { project,
    people: pub.people.filter(p => p.memberships.some(m => m.projectId === projectId)),
    publications: pub.publications.filter(r => r.projectIds.includes(projectId)),
    news: pub.news.filter(r => r.projectIds.includes(projectId)),
    funding: pub.funding.filter(r => r.projectIds.includes(projectId)),
    resources: pub.resources.filter(r => r.projectIds.includes(projectId)),
    opportunities: pub.opportunities.filter(r => r.projectIds.includes(projectId) && r.availability !== 'closed')
  };
}
export function projectLinks(data, ids) { return data.projects.filter(p => p.published && ids.includes(p.id)); }
export function personGroups(data) {
  return Object.fromEntries(['director', 'current-graduate', 'current-undergraduate', 'alumni-graduate', 'alumni-undergraduate', 'collaborator'].map(key => [key,
    data.people.filter(p => p.published && (key === 'director' || key === 'collaborator' ? p.category === key : `${p.membershipStatus}-${p.category}` === key))
  ]));
}
export function displayDate(value) { return value ? new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' }).format(new Date(value + 'T12:00:00Z')) : ''; }
