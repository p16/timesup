var menubar = require('menubar');
var electron = require('electron');
const {ipcMain, BrowserWindow} = electron;
var mb = menubar();
let mainWindow;

ipcMain.on('asynchronous-message', (event, arg) => {
  mainWindow.hide();
});

function createWindow() {
  const {width, height} = electron.screen.getPrimaryDisplay().workAreaSize;
  mainWindow = new BrowserWindow({
    width,
    height,
    frame: false
  });
  // mainWindow.webContents.openDevTools();
  mainWindow.loadURL('file://' + __dirname + '/done.html');

  mainWindow.on('closed', function() {
    mainWindow = null;
  });
}

mb.on('ready', function ready() {
  createWindow();
  mb.tray.setTitle('ciao');
});
