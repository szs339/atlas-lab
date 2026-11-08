import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { spawnSync } from 'node:child_process';
import { fixture } from './fixtures.mjs';
import { collectionNames } from '../src/lib/content.mjs';
import { checkBuilt } from '../scripts/check-built.mjs';

test('populated site builds at root and a repository subpath, without draft routes or records', () => {
  const tmp=fs.mkdtempSync(path.join(os.tmpdir(),'atlas-build-'));
  try {
    for(const entry of ['src','public','content','astro.config.mjs','package.json']) fs.cpSync(entry,path.join(tmp,entry),{recursive:true});
    fs.symlinkSync(path.resolve('node_modules'),path.join(tmp,'node_modules'),'dir');
    const d=fixture();
    d.pageText.home.title='CMS edited homepage heading';
    d.pageText.home.accent='<script>text, not code</script>';
    d.pageText.navigation.projects='Research projects';
    d.pageText.themes.learning='Edited learning area';
    d.pageText.filters.manyResults='matches';
    d.settings.recentNewsLimit=1;
    d.news.push(
      {...d.news[0],id:'featured-news',title:'Featured news sentinel',date:'2026-09-01',featured:true},
      {...d.news[0],id:'older-featured-news',title:'Older featured news sentinel',date:'2026-08-01',featured:true},
      {...d.news[0],id:'draft-news',title:'Draft news sentinel',date:'2026-11-01',featured:true,published:false}
    );
    fs.writeFileSync(path.join(tmp,'content/page-text.json'),JSON.stringify(d.pageText));
    fs.writeFileSync(path.join(tmp,'content/site.json'),JSON.stringify(d.settings));
    for(const name of collectionNames) {
      fs.rmSync(path.join(tmp,'content',name),{recursive:true,force:true});fs.mkdirSync(path.join(tmp,'content',name),{recursive:true});
      for(const record of d[name]) fs.writeFileSync(path.join(tmp,'content',name,record.id+'.json'),JSON.stringify(record));
    }
    for(const base of ['/','/atlas-lab/']) {
      const result=spawnSync(process.execPath,[path.resolve('node_modules/astro/bin/astro.mjs'),'build'],{cwd:tmp,env:{...process.env,SITE_URL:'https://example.org',BASE_PATH:base,ASTRO_TELEMETRY_DISABLED:'1'},encoding:'utf8'});
      assert.equal(result.status,0,result.stdout+'\n'+result.stderr);
      assert.equal(checkBuilt(tmp,base).pages,11);
      const read=p=>fs.readFileSync(path.join(tmp,'dist',p,'index.html'),'utf8');
      const project=read('projects/alaaska');
      const home=fs.readFileSync(path.join(tmp,'dist/index.html'),'utf8');
      assert.ok(home.includes('CMS edited homepage heading'));
      assert.ok(home.includes('&lt;script&gt;text, not code&lt;/script&gt;'));
      assert.ok(project.includes('Edited learning area'));
      assert.ok(read('projects').includes('data-theme="learning"'));
      assert.ok(read('projects').includes('data-result-many="matches"'));
      assert.ok(home.includes('Research projects</a>'));
      assert.ok(home.includes('Featured news sentinel'));
      assert.ok(!home.includes('Older featured news sentinel'));
      assert.ok(!home.includes('Test announcement'));
      for(const phrase of ['Featured news sentinel','Older featured news sentinel','Test announcement']) assert.ok(read('news').includes(phrase),phrase);
      for(const phrase of ['Shared test publication','Test announcement','Test research support','Test Graduate']) assert.ok(project.includes(phrase),phrase);
      assert.ok(read('projects/cisb-bench').includes('Test dataset'));
      assert.ok(read('people').includes('Example University, graduate student'));
      assert.ok(!read('people').includes('listings are being prepared'));
      assert.ok(!read('opportunities').includes('Closed idea sentinel'));
      for(const file of fs.readdirSync(path.join(tmp,'dist'),{recursive:true}).filter(f=>f.endsWith('.html'))) {
        const html=fs.readFileSync(path.join(tmp,'dist',file),'utf8');
        assert.ok(!html.includes('Draft paper sentinel')&&!html.includes('Draft project sentinel')&&!html.includes('Draft news sentinel'),file);
      }
    }
  } finally { fs.rmSync(tmp,{recursive:true,force:true}); }
});
