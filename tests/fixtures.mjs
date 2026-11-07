// Synthetic records used only by automated tests; never imported into the website.
import { collectionNames, validateRecords } from '../src/lib/content.mjs';
export function fixture() {
  const d = Object.fromEntries(collectionNames.map(n=>[n,[]]));
  d.settings={title:'Test Lab',expansion:'Test expansion',affiliation:'Example University',intro:'Test introduction',about:'Test about text',email:'test@example.org',directorId:'test-director',cvPath:'',opportunityIntro:'Test opportunities',inquiryInstructions:'Test instructions',featuredProjectLimit:3,recentNewsLimit:5,selectedPublicationLimit:3};
  d.people.push({id:'test-director',published:true,name:'Test Director',role:'Director',category:'director',membershipStatus:'current',memberships:[]});
  d.projects.push({id:'alaaska',slug:'alaaska',published:true,title:'Test Learning Project',summary:'Test summary',research:'Test research overview',theme:'learning',status:'active',featured:true},
    {id:'cisb-bench',slug:'cisb-bench',published:true,title:'Test Systems Project',summary:'Test summary',theme:'systems',status:'active'});
  d.opportunities.push({id:'test-idea',published:true,title:'Test thesis idea',question:'Test question',contribution:'Test contribution',levels:['ms','honors'],availability:'discuss',projectIds:['alaaska']});
  d.people.push({id:'test-grad',published:true,name:'Test Graduate',role:'Researcher',category:'graduate',membershipStatus:'current',degree:'M.S.',memberships:[{projectId:'alaaska',role:'Student researcher',startDate:'2025-01-01'}]},
    {id:'test-alum',published:true,name:'Test Alum',role:'Former researcher',category:'undergraduate',membershipStatus:'alumni',position:'Example University, graduate student',positionVerified:'2026-10-01',memberships:[{projectId:'cisb-bench',role:'Honors researcher',endDate:'2026-05-01'}]});
  d.publications.push({id:'test-paper',published:true,title:'Shared test publication',authors:[{name:'Test Graduate',personId:'test-grad'},{name:'External Author'}],year:2026,venue:'Example conference',type:'conference',status:'published',projectIds:['alaaska','cisb-bench'],featured:true,doi:'10.1234/example'});
  d.news.push({id:'test-news',published:true,title:'Test announcement',date:'2026-10-01',body:'A synthetic announcement for testing shared content.',projectIds:['alaaska','cisb-bench'],personIds:['test-grad'],publicationIds:['test-paper'],fundingIds:['test-grant']});
  d.funding.push({id:'test-grant',published:true,title:'Test research support',sponsor:'Example sponsor',status:'active',amount:1000,amountLabel:'Total award',projectIds:['alaaska']});
  d.resources.push({id:'test-resource',published:true,title:'Test dataset',type:'dataset',url:'https://example.org/dataset',projectIds:['cisb-bench']});
  d.projects.push({...d.projects[0],id:'draft-project',slug:'draft-project',title:'Draft project sentinel',published:false});
  d.publications.push({...d.publications[0],id:'draft-paper',title:'Draft paper sentinel',published:false});
  d.opportunities.push({...d.opportunities[0],id:'closed-idea',title:'Closed idea sentinel',availability:'closed'});
  return validateRecords(d);
}
