const {app,BrowserWindow,Menu,dialog,ipcMain}=require('electron');
const fs=require('fs'),path=require('path');
let win, pendingOpen=null;
function create(){
  win=new BrowserWindow({width:1280,height:800,minWidth:800,minHeight:560,backgroundColor:'#8fd3ff',title:'Blockverse Studio',icon:path.join(__dirname,'build','icon.png'),
    webPreferences:{preload:path.join(__dirname,'preload.js'),contextIsolation:true,nodeIntegration:false}});
  win.loadFile(path.join(__dirname,'app','index.html'));
  win.webContents.on('did-finish-load',()=>{ if(pendingOpen){ openFile(pendingOpen); pendingOpen=null; } });
  const tpl=[
    {label:'File',submenu:[
      {label:'New World',accelerator:'CmdOrCtrl+N',click:()=>win.webContents.executeJavaScript("document.getElementById('bNew').click()")},
      {label:'Open…',accelerator:'CmdOrCtrl+O',click:async()=>{ const r=await dialog.showOpenDialog(win,{filters:[{name:'Blockverse World',extensions:['bvw','json']}],properties:['openFile']}); if(!r.canceled) openFile(r.filePaths[0]); }},
      {label:'Save',accelerator:'CmdOrCtrl+S',click:()=>win.webContents.send('studio:save')},
      {type:'separator'},{role:'quit'}]},
    {label:'Edit',submenu:[{label:'Undo',accelerator:'CmdOrCtrl+Z',click:()=>win.webContents.executeJavaScript("document.getElementById('bUndo').click()")},{label:'Redo',accelerator:'CmdOrCtrl+Y',click:()=>win.webContents.executeJavaScript("document.getElementById('bRedo').click()")}]},
    {label:'View',submenu:[{role:'reload'},{role:'togglefullscreen'},{role:'toggleDevTools'}]},
    {label:'Help',submenu:[{label:'Play Blockverse online',click:()=>require('electron').shell.openExternal('https://kalyan-alt.github.io/blockverse-game/')}]}
  ];
  Menu.setApplicationMenu(Menu.buildFromTemplate(tpl));
}
function openFile(p){ try{ win.webContents.send('studio:open',fs.readFileSync(p,'utf8')); }catch(e){ dialog.showErrorBox('Could not open',e.message); } }
// Save goes through the native dialog so files land where the user wants
ipcMain.handle('studio:saveAs',async(_e,{name,data})=>{ const r=await dialog.showSaveDialog(win,{defaultPath:name,filters:[{name:'Blockverse World',extensions:['bvw']}]}); if(r.canceled) return false; fs.writeFileSync(r.filePath,data); return true; });
// .bvw double-click handling
app.on('open-file',(e,p)=>{ e.preventDefault(); if(win) openFile(p); else pendingOpen=p; });
const argFile=process.argv.slice(1).find(a=>a.endsWith('.bvw')); if(argFile) pendingOpen=argFile;
app.whenReady().then(create);
app.on('window-all-closed',()=>{ if(process.platform!=='darwin') app.quit(); });
app.on('activate',()=>{ if(BrowserWindow.getAllWindows().length===0) create(); });
