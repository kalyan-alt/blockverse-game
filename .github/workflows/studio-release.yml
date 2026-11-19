// Copies studio.html into app/ and vendors three.js so the desktop app works offline.
const fs=require('fs'),path=require('path'),https=require('https');
const app=path.join(__dirname,'app'); fs.mkdirSync(app,{recursive:true});
let html=fs.readFileSync(path.join(__dirname,'studio.html'),'utf8');
html=html.replace(/<script src="https:\/\/cdnjs\.cloudflare\.com\/ajax\/libs\/three\.js\/r128\/three\.min\.js"><\/script>/,'<script src="three.min.js"></script>');
fs.writeFileSync(path.join(app,'index.html'),html);
const dest=path.join(app,'three.min.js');
if(fs.existsSync(dest)){ console.log('three.min.js already vendored'); process.exit(0); }
https.get('https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js',r=>{ const w=fs.createWriteStream(dest); r.pipe(w); w.on('finish',()=>console.log('vendored three.min.js')); }).on('error',e=>{ console.error('download failed',e.message); process.exit(1); });
