export type ProfessionProfileConfig={
  key:string;
  label:string;
  proofLabel:string;
  primarySections:Array<'portfolio'|'qualifications'|'certifications'|'tools'|'skills'>;
  highlightTerms:string[];
  pitchHint:string;
};

const includesAny=(s:string,terms:string[])=>terms.some(t=>s.includes(t));

export function getProfessionProfile(title?:string):ProfessionProfileConfig{
  const s=String(title||'').toLowerCase();
  if(includesAny(s,['architect','interior','civil engineer','engineer'])) return {key:'architecture',label:'Built work',proofLabel:'Projects',primarySections:['portfolio','tools','qualifications','certifications','skills'],highlightTerms:['Revit','AutoCAD','Rhino','BIM','SketchUp'],pitchHint:'Show a completed project, your role and the result.'};
  if(includesAny(s,['electrician','welder','plumber','carpenter','mechanic','technician','installer'])) return {key:'trades',label:'Site work',proofLabel:'Work proof',primarySections:['certifications','portfolio','tools','skills','qualifications'],highlightTerms:['License','Safety','MIG','TIG','Installation','Tools'],pitchHint:'Show the job site, the task and the finished result.'};
  if(includesAny(s,['nurse','care assistant','doctor','dentist','physio','therapist','health'])) return {key:'healthcare',label:'Clinical experience',proofLabel:'Credentials',primarySections:['qualifications','certifications','skills','portfolio','tools'],highlightTerms:['License','Registration','BLS','ACLS','Clinical'],pitchHint:'Introduce your experience, setting and patient-care strengths.'};
  if(includesAny(s,['dancer','performer','actor','singer','musician','artist','model'])) return {key:'performer',label:'Showreel',proofLabel:'Performances',primarySections:['portfolio','skills','certifications','tools','qualifications'],highlightTerms:['Live','Stage','Showreel','Performance'],pitchHint:'Lead with your strongest performance clip.'};
  if(includesAny(s,['chef','cook','baker','pastry'])) return {key:'hospitality',label:'Kitchen work',proofLabel:'Dishes',primarySections:['portfolio','skills','certifications','tools','qualifications'],highlightTerms:['HACCP','Cuisine','Kitchen','Food Safety'],pitchHint:'Show your dish, station and speed under real conditions.'};
  if(includesAny(s,['barber','hair','nail','beauty','makeup','stylist'])) return {key:'beauty',label:'Transformations',proofLabel:'Client work',primarySections:['portfolio','skills','certifications','tools','qualifications'],highlightTerms:['Fade','Colour','BIAB','Makeup','Client'],pitchHint:'Use before/after work and let the result speak first.'};
  if(includesAny(s,['developer','designer','software','product','ux','ui'])) return {key:'digital',label:'Case studies',proofLabel:'Projects',primarySections:['portfolio','tools','skills','qualifications','certifications'],highlightTerms:['Figma','React','Node','Adobe','GitHub'],pitchHint:'Show what you shipped and the measurable result.'};
  if(includesAny(s,['teacher','tutor','trainer','coach'])) return {key:'education',label:'Teaching proof',proofLabel:'Lessons',primarySections:['qualifications','certifications','portfolio','skills','tools'],highlightTerms:['Teaching','IELTS','Training','Coaching'],pitchHint:'Teach something useful in under 30 seconds.'};
  return {key:'general',label:'Work proof',proofLabel:'Projects',primarySections:['portfolio','qualifications','certifications','tools','skills'],highlightTerms:[],pitchHint:'Show who you are, what you do and one real example of your work.'};
}
