const { app, BrowserWindow, dialog, ipcMain } = require('electron');
const fs = require('fs');
const path = require('path');

const storageFile = () => path.join(app.getPath('userData'), 'budget_pro_data.json');

const readStore = () => {
  const target = storageFile();
  if (!fs.existsSync(target)) {
    return {};
  }
  try {
    const raw = fs.readFileSync(target, 'utf-8');
    return raw ? JSON.parse(raw) : {};
  } catch (e) {
    console.error('Erreur lecture stockage natif', e);
    return {};
  }
};

const writeStore = (data) => {
  const target = storageFile();
  const dir = path.dirname(target);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  try {
    fs.writeFileSync(target, JSON.stringify(data, null, 2), 'utf-8');
    return true;
  } catch (e) {
    console.error('Erreur écriture stockage natif', e);
    return false;
  }
};

const getIndexPath = () => path.join(__dirname, 'index.html');

const ensureIndexExists = () => {
  const indexPath = getIndexPath();
  if (fs.existsSync(indexPath)) return true;

  dialog.showErrorBox(
    'Fichier manquant',
    [
      'Le fichier index.html est introuvable.',
      '',
      'Assurez-vous d\'exécuter l\'application depuis le dossier du projet',
      'et que les fichiers sources sont présents.',
    ].join('\n')
  );

  return false;
};

const createWindow = () => {
  const indexPath = getIndexPath();
  if (!ensureIndexExists()) {
    app.quit();
    return;
  }

  const win = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 1200,
    minHeight: 720,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false
    }
  });

  win.setMenuBarVisibility(false);
  win.loadFile(indexPath);

  win.webContents.on('did-fail-load', (_event, errorCode, errorDescription) => {
    dialog.showErrorBox(
      'Chargement impossible',
      `Échec du chargement de l\'interface (code ${errorCode}).\n${errorDescription}\nVérifiez que les fichiers du projet sont présents dans le dossier courant.`
    );
  });
};

ipcMain.on('native-storage-get', (event, key) => {
  const store = readStore();
  event.returnValue = Object.prototype.hasOwnProperty.call(store, key) ? store[key] : null;
});

ipcMain.on('native-storage-set', (event, payload) => {
  const store = readStore();
  const next = Object.assign({}, store, { [payload.key]: String(payload.value) });
  writeStore(next);
  event.returnValue = true;
});

ipcMain.on('native-storage-remove', (event, key) => {
  const store = readStore();
  if (Object.prototype.hasOwnProperty.call(store, key)) {
    delete store[key];
    writeStore(store);
  }
  event.returnValue = true;
});

ipcMain.on('native-storage-clear', (event) => {
  writeStore({});
  event.returnValue = true;
});

ipcMain.on('native-storage-path', (event) => {
  event.returnValue = storageFile();
});

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
