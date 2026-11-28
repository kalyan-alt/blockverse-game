const {app,BrowserWindow,Menu,dialog,ipcMain,shell}=require('electron');
const fs=require('fs'),path=require('path');
let win, pendingOpen=null;
function create(){
  win=new BrowserWindow({width:1180,height:780,minWidth:760,minHeight:540,backgroundColor:'#bfe6ff',title:'Blockverse Avatar Creator',
    webPreferences:{preload:path.join(__dirname,'preload.js'),contextIsolation:true,nodeIntegration:false}});
  win.loadFile(path.join(__dirname,'app-avatar','index.html'));
  win.webContents.setWindowOpenHandler(({url})=>{ shell.openExternal(url); return {action:'deny'}; });
  win.webContents.on('did-finish-load',()=>{ if(pendingOpen){ openFile(pendingOpen); pendingOpen=null; } });
  const click=id=>()=>win.webContents.executeJavaScript(`document.getElementById('${id}').click()`);
  Menu.setApplicationMenu(Menu.buildFromTemplate([
    {label:'File',submenu:[{label:'New Item',accelerator:'CmdOrCtrl+N',click:click('bNew')},
      {label:'Open…',accelerator:'CmdOrCtrl+O',click:async()=>{ const r=await dialog.showOpenDialog(win,{filters:[{name:'Blockverse Item',extensions:['bvi','json']}],properties:['openFile']}); if(!r.canceled) openFile(r.filePaths[0]); }},
      {label:'Save',accelerator:'CmdOrCtrl+S',click:()=>win.webContents.send('studio:save')},{label:'Publish…',accelerator:'CmdOrCtrl+P',click:click('bPublish')},{type:'separator'},{role:'quit'}]},
    {label:'Edit',submenu:[{label:'Undo',accelerator:'CmdOrCtrl+Z',click:click('bUndo')},{label:'Redo',accelerator:'CmdOrCtrl+Y',click:click('bRedo')}]},
    {label:'View',submenu:[{role:'reload'},{role:'togglefullscreen'},{role:'toggleDevTools'}]},
    {label:'Help',submenu:[{label:'Play Blockverse online',click:()=>shell.openExternal('https://kalyan-alt.github.io/blockverse-game/')}]}
  ]));
}
function openFile(p){ try{ win.webContents.send('studio:open',fs.readFileSync(p,'utf8')); }catch(e){ dialog.showErrorBox('Could not open',e.message); } }
ipcMain.handle('studio:saveAs',async(_e,{name,data})=>{ const r=await dialog.showSaveDialog(win,{defaultPath:name,filters:[{name:'Blockverse Item',extensions:['bvi']}]}); if(r.canceled) return false; fs.writeFileSync(r.filePath,data); return true; });
app.on('open-file',(e,p)=>{ e.preventDefault(); if(win) openFile(p); else pendingOpen=p; });
const argFile=process.argv.slice(1).find(a=>a.endsWith('.bvi')); if(argFile) pendingOpen=argFile;
app.whenReady().then(create);
app.on('window-all-closed',()=>{ if(process.platform!=='darwin') app.quit(); });
app.on('activate',()=>{ if(BrowserWindow.getAllWindows().length===0) create(); });
