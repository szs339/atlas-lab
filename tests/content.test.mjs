import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { parse } from 'yaml';
import { fixture } from './fixtures.mjs';
import { loadContent, validateRecords, publicContent, forProject, personGroups, collectionNames, schemas, settingsSchema, displayDate } from '../src/lib/content.mjs';
import { cmsConfig } from '../scripts/generate-cms.mjs';
import { pageTextSchema, defaultPageText } from '../src/lib/page-text.mjs';

test('all real content validates independently of collection size', () => {
  const d=loadContent(); assert.ok(d.people.some(p=>p.id===d.settings.directorId));
});
test('one shared paper and announcement appear on both linked projects', () => {
  const d=fixture();
  d.publications[0].title='Updated in one place';
  for(const id of ['alaaska','cisb-bench']) {
    assert.equal(forProject(d,id).publications[0].title,'Updated in one place');
    assert.equal(forProject(d,id).news[0].id,'test-news');
  }
});
test('draft records stay out of public lists and project sections', () => {
  const d=fixture();
  for(const n of collectionNames) assert.ok(publicContent(d)[n].every(r=>r.published));
  assert.equal(forProject(d,'draft-project'),null);
  assert.deepEqual(forProject(d,'alaaska').publications.map(r=>r.id),['test-paper']);
  assert.ok(forProject(d,'alaaska').opportunities.every(o=>o.availability!=='closed'));
});
test('moving a person to alumni preserves project and publication relationships', () => {
  const d=fixture(); const p=d.people.find(p=>p.id==='test-grad');
  p.membershipStatus='alumni'; p.position='Research engineer';
  const groups=personGroups(d);
  assert.equal(groups['current-graduate'].length,0);
  assert.equal(groups['alumni-graduate'][0].position,'Research engineer');
  assert.ok(forProject(d,'alaaska').people.some(p=>p.id==='test-grad'));
  assert.equal(d.publications[0].authors[0].personId,'test-grad');
});
test('external authors work without creating person pages or lab memberships', () => {
  const d=fixture(); assert.equal(d.publications[0].authors[1].personId,'');
  assert.ok(!d.people.some(p=>p.name==='External Author'));
});
test('news uses chronological ordering and dates do not shift with timezone', () => {
  const d=fixture(); d.news.push({...d.news[0],id:'earlier-news',date:'2026-02-01'});
  assert.deepEqual(publicContent(d).news.map(n=>n.id),['test-news','earlier-news']);
  assert.equal(displayDate('2026-01-01'),'Jan 1, 2026');
});
test('unknown references and accidental deletion are blocked', () => {
  const d=fixture(); d.people=d.people.filter(p=>p.id!=='test-grad');
  assert.throws(()=>validateRecords(d),/Unknown people reference 'test-grad'/);
});
test('duplicate IDs, URL slugs and relationship entries are blocked', () => {
  for(const change of [d=>d.people.push(d.people[0]),d=>d.projects[1].slug=d.projects[0].slug,d=>d.publications[0].projectIds.push('alaaska')]) {
    const d=fixture();change(d);assert.throws(()=>validateRecords(d),/Duplicate/);
  }
});
test('invalid dates and reversed membership dates are blocked', () => {
  for(const change of [d=>d.news[0].date='2026-02-30',d=>d.people[1].memberships[0].endDate='2020-01-01']) {
    const d=fixture();change(d);assert.throws(()=>validateRecords(d),/valid YYYY-MM-DD|before it starts/);
  }
});
test('unsafe links, images without alt text, and ambiguous award amounts are blocked', () => {
  for(const change of [d=>d.resources[0].url='javascript:alert(1)',d=>d.projects[0].image='/uploads/image.png',d=>d.funding[0].amountLabel='']) {
    const d=fixture();change(d);assert.throws(()=>validateRecords(d));
  }
});
test('CMS blank optional values normalize and required values still fail', () => {
  const d=fixture(); d.people[1].photo=null;d.people[1].links=null;d.funding[0].amount=null;
  assert.equal(validateRecords(d).people[1].photo,'');
  d.publications[0].title=' ';assert.throws(()=>validateRecords(d),/This field is required/);
});
test('draft director cannot break global site settings', () => {
  const d=fixture();d.people.find(p=>p.id===d.settings.directorId).published=false;
  assert.throws(()=>validateRecords(d),/published director/);
});
test('missing uploads and mismatched filenames fail before publication', () => {
  const tmp=fs.mkdtempSync(path.join(os.tmpdir(),'atlas-data-'));
  try {
    fs.cpSync('content',path.join(tmp,'content'),{recursive:true});
    const file=path.join(tmp,'content/site.json'); const settings=JSON.parse(fs.readFileSync(file));
    settings.cvPath='/uploads/missing.pdf';fs.writeFileSync(file,JSON.stringify(settings));
    assert.throws(()=>loadContent(tmp),/Missing uploaded file/);
    settings.cvPath='';fs.writeFileSync(file,JSON.stringify(settings));
    fs.renameSync(path.join(tmp,'content/people',settings.directorId+'.json'),path.join(tmp,'content/people/renamed.json'));
    assert.throws(()=>loadContent(tmp),/Filename must match/);
  } finally { fs.rmSync(tmp,{recursive:true,force:true}); }
});
test('checked-in CMS configuration matches generator and every schema field', () => {
  const config=parse(fs.readFileSync('.pages.yml','utf8'));
  assert.deepEqual(config,cmsConfig());
  for(const name of ['settings',...collectionNames]) {
    const form=config.content.find(c=>c.name===name);assert.ok(form);
    const schema=name==='settings'?settingsSchema:schemas[name];
    assert.deepEqual(form.fields.map(f=>f.name).sort(),Object.keys(schema.shape).sort(),name);
    if(name!=='settings') assert.equal(form.filename.template,'{fields.id}.json');
  }
  const pageText=config.content.find(c=>c.name==='pageText');
  assert.equal(pageText.path,'content/page-text.json');
  assert.deepEqual(pageText.fields.map(f=>f.name).sort(),Object.keys(pageTextSchema.shape).sort());
  for(const group of pageText.fields) assert.deepEqual(group.fields.map(f=>f.name).sort(),Object.keys(pageTextSchema.shape[group.name].shape).sort());
});

test('website wording is independently editable without changing record IDs', () => {
  const d=fixture();d.pageText.navigation.projects='Research';d.pageText.themes.learning='Learning sciences';
  const validated=validateRecords(d);
  assert.equal(validated.pageText.navigation.projects,'Research');
  assert.equal(validated.projects[0].theme,'learning');
  assert.equal(forProject(validated,'alaaska').publications[0].id,'test-paper');
  assert.deepEqual(pageTextSchema.parse(defaultPageText),defaultPageText);
});
test('invalid website-text fields fail with an actionable path', () => {
  const d=fixture();d.pageText.home.title='';
  assert.throws(()=>validateRecords(d),/pageText.home.title/);
  d.pageText.home.title='A valid heading';d.pageText.brand.institutionUrl='javascript:alert(1)';
  assert.throws(()=>validateRecords(d),/pageText.brand.institutionUrl/);
});
