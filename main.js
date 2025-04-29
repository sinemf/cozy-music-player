const { app, BrowserWindow } = require('electron');
const path = require('path');

app.disableHardwareAcceleration();

function createWindow() {
  const win = new BrowserWindow({
    width: 320,
    height: 480,
    transparent: true,               
    frame: false,                    
    resizable: false,
    alwaysOnTop: true,
    hasShadow: false,                
    backgroundColor: '#00000000',    
    titleBarStyle: 'customButtonsOnHover', 

    webPreferences: {
      preload: path.join(__dirname, 'renderer.js'),
      nodeIntegration: true,
      contextIsolation: false
    }
  });

  win.loadFile('index.html');
}

app.whenReady().then(createWindow);
