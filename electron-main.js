const { app, BrowserWindow, dialog } = require('electron');
const fs = require('fs');
const path = require('path');

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
