const { app, BrowserWindow } = require('electron');
const path = require('path');
const url = require('url');

function createWindow() {
  const win = new BrowserWindow({
    width: 1400,
    height: 900,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
    }
  });

  // Load the app
  // Check if running in development by looking for ELECTRON_START_URL env variable
  const startUrl = process.env.ELECTRON_START_URL || url.format({
    pathname: path.join(__dirname, 'build', 'index.html'),
    protocol: 'file:',
    slashes: true
  });

  win.loadURL(startUrl);

  // Open DevTools only in development
  if (process.env.ELECTRON_START_URL) {
    win.webContents.openDevTools();
  }

  // Log to help debug
  win.webContents.on('did-fail-load', (event, errorCode, errorDescription) => {
    console.log('Failed to load:', errorDescription);
  });

  // Remove menu bar
  win.setMenuBarVisibility(false);
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
