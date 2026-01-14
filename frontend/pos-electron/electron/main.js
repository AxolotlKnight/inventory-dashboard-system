const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const { autoUpdater } = require('electron-updater');
const log = require('electron-log');

log.transports.file.level = 'info';
autoUpdater.logger = log;

let win;

function createWindow() {
  win = new BrowserWindow({
    width: 1200,
    height: 800,
    frame: false,
    icon: path.join(__dirname, 'icon.png'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false
    }
  });

  win.maximize();
  win.setMenuBarVisibility(false);
  win.loadURL('http://localhost:4200');

  // Enviar evento de maximizado al renderer
  win.on('maximize', () => win.webContents.send('window-is-maximized', true));
  win.on('unmaximize', () => win.webContents.send('window-is-maximized', false));
}

app.whenReady().then(() => {
  createWindow();

  // Revisa actualizaciones al inicio
  autoUpdater.checkForUpdatesAndNotify();
});

// Eventos de autoUpdater
autoUpdater.on('checking-for-update', () => {
  log.info('Buscando actualizaciones...');
});

autoUpdater.on('update-available', (info) => {
  log.info('Actualización disponible: ', info.version);
});

autoUpdater.on('update-not-available', () => {
  log.info('No hay actualizaciones.');
});

autoUpdater.on('error', (err) => {
  log.error('Error en actualizador: ', err);
});

autoUpdater.on('download-progress', (progressObj) => {
  let logMessage = `Descargando: ${Math.round(progressObj.percent)}%`;
  log.info(logMessage);
});

autoUpdater.on('update-downloaded', () => {
  log.info('Actualización descargada, reiniciando app...');
  autoUpdater.quitAndInstall();
});

// Escuchar eventos del renderer (barra personalizada)
ipcMain.on('window-minimize', () => win.minimize());
ipcMain.on('window-maximize-restore', () => {
  if (win.isMaximized()) win.unmaximize();
  else win.maximize();
});
ipcMain.on('window-close', () => win.close());
