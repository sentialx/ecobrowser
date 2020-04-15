const { app, BrowserWindow, ipcMain, Menu } = require('electron');

app.allowRendererProcessReuse = true;

const createWindow = () => {
  const window = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      enableRemoteModule: false,
    },
  });

  Menu.setApplicationMenu(null);

  window.loadFile('./src/ui/index.html');
};

const onReady = async () => {
  createWindow();
};

app.whenReady().then(onReady);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});

ipcMain.on('close-window', (e) => {
  BrowserWindow.fromWebContents(e.sender).close();
});