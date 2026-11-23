// Schmale, sichere Brücke zwischen Oberfläche und Windows (nur Speichern/Ordner)
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('bassforgeNative', {
  platform: 'desktop',
  defaultFolder: () => ipcRenderer.invoke('bf:defaultFolder'),
  chooseFolder: () => ipcRenderer.invoke('bf:chooseFolder'),
  saveFile: (dir, name, arrayBuffer) => ipcRenderer.invoke('bf:saveFile', dir, name, arrayBuffer),
  showInFolder: (p) => ipcRenderer.invoke('bf:showInFolder', p),
  openFolder: (p) => ipcRenderer.invoke('bf:openFolder', p),
});
