const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  minimize: () => ipcRenderer.send('window-minimize'),
  maximizeRestore: () => ipcRenderer.send('window-maximize-restore'),
  close: () => ipcRenderer.send('window-close'),
  isMaximized: (callback) => ipcRenderer.on('window-is-maximized', callback)
});
