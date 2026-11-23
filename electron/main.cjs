// BassForge – Desktop-App (Windows) auf Basis von Electron
const { app, BrowserWindow, ipcMain, dialog, shell } = require('electron');
const path = require('node:path');
const fs = require('node:fs');

app.commandLine.appendSwitch('autoplay-policy', 'no-user-gesture-required');

function defaultFolder() {
  return path.join(app.getPath('music'), 'BassForge');
}

function uniquePath(dir, name) {
  const ext = path.extname(name), base = path.basename(name, ext);
  let p = path.join(dir, name), i = 2;
  while (fs.existsSync(p)) p = path.join(dir, `${base} (${i++})${ext}`);
  return p;
}

function createWindow() {
  const win = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 380,
    minHeight: 500,
    backgroundColor: '#000000',
    title: 'BassForge',
    icon: path.join(__dirname, '..', 'build', 'icon.png'),
    autoHideMenuBar: true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.cjs'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
    },
  });
  win.removeMenu();
  win.loadFile(path.join(__dirname, '..', 'www', 'index.html'));
  // Links (z. B. in der Anleitung) im normalen Browser öffnen
  win.webContents.setWindowOpenHandler(({ url }) => {
    if (/^https?:/.test(url)) shell.openExternal(url);
    return { action: 'deny' };
  });
  win.webContents.on('will-navigate', (e, url) => {
    if (!url.startsWith('file:')) { e.preventDefault(); if (/^https?:/.test(url)) shell.openExternal(url); }
  });
}

ipcMain.handle('bf:defaultFolder', () => defaultFolder());

ipcMain.handle('bf:chooseFolder', async (e) => {
  const win = BrowserWindow.fromWebContents(e.sender);
  const r = await dialog.showOpenDialog(win, { properties: ['openDirectory', 'createDirectory'], defaultPath: defaultFolder() });
  return r.canceled || !r.filePaths.length ? null : r.filePaths[0];
});

ipcMain.handle('bf:saveFile', async (e, dir, name, data) => {
  const target = dir && dir.trim() ? dir : defaultFolder();
  fs.mkdirSync(target, { recursive: true });
  const safe = String(name).replace(/[\\/:*?"<>|]+/g, '').trim() || 'BassForge Export';
  const p = uniquePath(target, safe);
  fs.writeFileSync(p, Buffer.from(data));
  return { path: p };
});

ipcMain.handle('bf:showInFolder', (e, p) => { shell.showItemInFolder(p); });
ipcMain.handle('bf:openFolder', (e, p) => { fs.mkdirSync(p, { recursive: true }); return shell.openPath(p); });

app.whenReady().then(() => {
  createWindow();
  app.on('activate', () => { if (BrowserWindow.getAllWindows().length === 0) createWindow(); });
});
app.on('window-all-closed', () => { if (process.platform !== 'darwin') app.quit(); });
