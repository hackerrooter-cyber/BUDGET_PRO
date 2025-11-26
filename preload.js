const { contextBridge, ipcRenderer } = require('electron');

const nativeStorage = {
  getItem: (key) => ipcRenderer.sendSync('native-storage-get', key),
  setItem: (key, value) => ipcRenderer.sendSync('native-storage-set', { key, value }),
  removeItem: (key) => ipcRenderer.sendSync('native-storage-remove', key),
  clear: () => ipcRenderer.sendSync('native-storage-clear'),
  storagePath: () => ipcRenderer.sendSync('native-storage-path')
};

contextBridge.exposeInMainWorld('nativeStorage', nativeStorage);

window.addEventListener('DOMContentLoaded', () => {
  // Future hooks si nécessaires.
});
