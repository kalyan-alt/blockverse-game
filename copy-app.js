// Prepares the web apps for desktop/Android packaging:
//   studio.html -> app/index.html         (Blockverse Studio)
//   avatar.html -> app-avatar/index.html  (Blockverse Avatar Creator)
// and vendors three.js into each so they work offline.
const fs=require('fs'),path=require('path'),https=require('https');
const CDN='https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js';
const jobs=[['studio.html','app'],['avatar.html','app-avatar']].filter(([src])=>fs.existsSync(path.join(__dirname,src)));
function fetchThree(cb){ const tmp=path.join(__dirname,'.three.min.js'); if(fs.existsSync(tmp)) return cb(tmp);
  https.get(CDN,r=>{ if(r.statusCode!==200){ console.error('three.js download failed',r.statusCode); process.exit(1); } const w=fs.createWriteStream(tmp); r.pipe(w); w.on('finish',()=>w.close(()=>cb(tmp))); }).on('error',e=>{ console.error('download failed',e.message); process.exit(1); }); }
fetchThree(tmp=>{ for(const [src,dir] of jobs){ const out=path.join(__dirname,dir); fs.mkdirSync(out,{recursive:true});
    let html=fs.readFileSync(path.join(__dirname,src),'utf8').replace(/<script src="https:\/\/cdnjs\.cloudflare\.com\/ajax\/libs\/three\.js\/r128\/three\.min\.js"><\/script>/,'<script src="three.min.js"></script>');
    fs.writeFileSync(path.join(out,'index.html'),html); fs.copyFileSync(tmp,path.join(out,'three.min.js')); console.log('prepared',dir); } });
