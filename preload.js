const {contextBridge,ipcRenderer}=require('electron');
contextBridge.exposeInMainWorld('studio',{
  onOpen:cb=>ipcRenderer.on('studio:open',(_e,d)=>cb(d)),
  onSave:cb=>ipcRenderer.on('studio:save',()=>cb()),
  saveAs:(name,data)=>ipcRenderer.invoke('studio:saveAs',{name,data})
});
