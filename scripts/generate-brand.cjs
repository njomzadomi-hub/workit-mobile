const fs=require('fs');const sharp=require('sharp');
const dir=process.cwd()+'/assets/brand';fs.mkdirSync(dir,{recursive:true});
const mark='<path d="M260 330 L370 650 L512 440 L654 650 L764 330" fill="none" stroke="white" stroke-width="82" stroke-linecap="square" stroke-linejoin="round"/>';
const svg=(bg=true)=>`<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="1024" viewBox="0 0 1024 1024">${bg?'<rect width="1024" height="1024" fill="#05070A"/><rect x="160" y="160" width="704" height="704" rx="184" fill="#8B5CF6"/>':''}${mark}</svg>`;
(async()=>{fs.writeFileSync(dir+'/icon.svg',svg());await sharp(Buffer.from(svg())).png().toFile(dir+'/icon.png');await sharp(Buffer.from(svg(false))).png().toFile(dir+'/adaptive-foreground.png');await sharp(Buffer.from(svg())).resize(256).png().toFile(dir+'/splash.png');await sharp(Buffer.from(svg(false))).resize(96).png().toFile(dir+'/notification.png');})();
