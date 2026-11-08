import fs from 'node:fs';
import { stringify } from 'yaml';
import { themes } from '../src/lib/content.mjs';
import { textGroups } from '../src/lib/page-text.mjs';

const f = (name, label, type = 'string', extra = {}) => ({ name, label, type, ...extra });
const required = (name, label, type = 'string', extra = {}) => f(name, label, type, { required: true, ...extra });
const select = (name, label, values, extra = {}) => required(name, label, 'select', { options: { values }, ...extra });
const date = (name, label) => f(name, label, 'string', { description: 'YYYY-MM-DD; leave blank when unknown.' });
const ref = (name, label, collection, multiple = true, mandatory = false) => f(name, label, 'reference', {
  required: mandatory,
  options: { collection, multiple, value: '{fields.id}', label: collection === 'people' ? '{fields.name}' : '{fields.title}', search: collection === 'people' ? 'name,id' : 'title,id' }
});
const links = () => f('links', 'External links', 'object', { list: true, fields: [required('label', 'Link label'), required('url', 'URL')] });
const shared = () => [required('id', 'Permanent ID', 'string', { description: 'Set once: lowercase letters, numbers and hyphens. Keep this ID when editing names or titles. Filename must match ID.' }), f('published', 'Publish on website', 'boolean', { default: false, description: 'Off hides this record from the website. Repository files remain public.' })];
const projectRefs = () => ref('projectIds', 'Related projects', 'projects');
const fields = {
  people: [...shared(), required('name', 'Full name'), required('role', 'Role / title'),
    select('category', 'Category', ['director', 'graduate', 'undergraduate', 'collaborator']),
    select('membershipStatus', 'Membership', ['current', 'alumni']), f('degree', 'Degree / program'), f('bio', 'Short biography', 'text'),
    date('startDate', 'Joined'), date('endDate', 'Left'), f('position', 'Current position'), date('positionVerified', 'Position last verified'),
    f('photo', 'Photograph', 'image'), f('photoAlt', 'Photograph description (required with a photo)', 'string', {description:'Add a short description whenever you select a photograph, for example: Portrait of Suman Saha. This is used by screen readers; leaving it blank prevents the site from publishing.'}), links(),
    f('memberships', 'Project participation', 'object', {list: true, fields: [ref('projectId', 'Project', 'projects', false, true), required('role', 'Project role'), date('startDate', 'Started'), date('endDate', 'Ended')]})
  ],
  projects: [...shared(), required('slug', 'URL name', 'string', {description: 'Lowercase letters, numbers and hyphens. Keep this stable to preserve links.'}), required('title', 'Project name'), f('expansion', 'Expanded name'),
    required('summary', 'Short summary', 'text'), f('research', 'Research overview', 'text'),
    select('theme', 'Research theme', Object.entries(themes).map(([name,label])=>({name,label}))),
    select('status', 'Project status', ['active', 'completed']), f('featured', 'Feature on homepage', 'boolean', {default: false}),
    f('image', 'Project image', 'image'), f('imageAlt', 'Image description'), links()
  ],
  publications: [...shared(), required('title', 'Paper title'),
    required('authors', 'Authors in citation order', 'object', {list: true, fields: [required('name', 'Name as published'), ref('personId', 'Lab member (optional)', 'people', false)]}),
    required('year', 'Year', 'number'), required('venue', 'Venue'),
    select('type', 'Publication type', ['conference','journal','workshop','poster','preprint','other']),
    select('status', 'Scholarly status', ['preprint','accepted','published']), projectRefs(),
    f('doi', 'DOI identifier', 'string', {description: 'Enter 10.xxxx/... without https://doi.org/.'}),
    f('pdf', 'Uploaded PDF', 'file'), f('url', 'Publication URL'), links(), f('featured', 'Feature on homepage', 'boolean', {default: false})
  ],
  news: [...shared(), required('title','Headline'), required('date','Date (YYYY-MM-DD)'), required('body','Announcement','text'),
    f('featured','Feature on homepage','boolean',{default:false}), projectRefs(), ref('personIds','Related people','people'),
    ref('publicationIds','Related publications','publications'), ref('fundingIds','Related funding','funding'), links()
  ],
  funding: [...shared(), required('title','Award title'), required('sponsor','Sponsor'), f('awardId','Award number'),
    date('startDate','Starts'), date('endDate','Ends'), select('status','Award status',['active','completed']),
    f('amount','Amount (optional)','number'), select('currency','Currency',['USD','EUR','GBP'],{default:'USD'}),
    f('amountLabel','Amount meaning','string',{description:'Required with an amount, e.g. Total award or Penn State allocation.'}),
    f('investigators','Investigators and roles','string',{list:true}), projectRefs(), f('url','Award URL')
  ],
  resources: [...shared(), required('title','Resource title'), f('description','Description','text'),
    select('type','Resource type',['software','dataset','demo','documentation','teaching','other']), required('url','Resource URL'), projectRefs()
  ],
  opportunities: [...shared(), required('title','Thesis idea'), required('question','Research question','text'),
    required('contribution','Possible contribution and scope','text'), f('background','Useful background','text'),
    required('levels','Thesis pathways','select',{options:{values:[{name:'ms',label:'M.S. thesis'},{name:'honors',label:'Undergraduate honors thesis'}],multiple:true,min:1}}),
    select('availability','Availability',[{name:'discuss',label:'Discuss an idea'},{name:'open',label:'Open for inquiries'},{name:'closed',label:'Closed'}]),
    ref('projectIds','Related projects','projects',true,true)
  ]
};
const labels={people:'People',projects:'Projects',publications:'Publications',news:'News',funding:'Funding (project sections)',resources:'Resources (project sections)',opportunities:'Thesis opportunities'};
export function cmsConfig() {
  return {
    media: { input: 'public/uploads', output: '/uploads', extensions: ['jpg','jpeg','png','webp','svg','pdf'] },
    content: [
      { name:'pageText', label:'Website text', type:'file', path:'content/page-text.json', format:'json', fields:
        Object.entries(textGroups).map(([name,group])=>required(name,group.label,'object',{fields:Object.entries(group.fields).map(([key,[label,,type]])=>required(key,label,type==='text'?'text':'string'))}))
      },
      { name:'settings', label:'Lab settings', type:'file', path:'content/site.json', format:'json', fields:[
        required('title','Lab name'), required('expansion','Expanded name'), required('affiliation','Affiliation'),
        required('intro','Homepage introduction','text'), required('about','About the lab','text'), required('email','Contact email'),
        ref('directorId','Director','people',false,true), f('cvPath','Public CV (PDF)','file'),
        f('heroImage','Homepage background image','image',{description:'Decorative image without text. A wide, dark image works best. Leave blank for a plain background.'}),
        required('opportunityIntro','Opportunities introduction','text'), required('inquiryInstructions','Inquiry instructions','text'),
        required('featuredProjectLimit','Homepage projects','number'),required('recentNewsLimit','Homepage news items','number'),required('selectedPublicationLimit','Homepage publications','number')
      ]},
      ...Object.entries(fields).map(([name, list]) => ({ name, label:labels[name], type:'collection', path:`content/${name}`, format:'json',
        filename:{template:'{fields.id}.json',field:false}, exclude:['.gitkeep'], subfolders:false,
        view:{primary:name==='people'?'name':'title',fields:[name==='people'?'name':'title','published']}, fields:list
      }))
    ]
  };
}
if (process.argv[1] && new URL(import.meta.url).pathname === process.argv[1]) {
  fs.writeFileSync('.pages.yml','# Generated by npm run cms:generate. Change scripts/generate-cms.mjs, then regenerate.\n'+stringify(cmsConfig(),{lineWidth:0}));
  console.log('Generated .pages.yml for all content collections.');
}
