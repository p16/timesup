var menubar = require('menubar');
var electron = require('electron');
var _ = require('lodash');
const {ipcMain, BrowserWindow} = electron;
var mb = menubar({index: 'file://' + __dirname + '/index.html'});
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
  console.log('ok, we are ready :)');
  mb.tray.setTitle('0:00');
});


ipcMain.on('clear-timer', (event, arg) => {
  mb.tray.setTitle('0:00');
})

ipcMain.on('pop-the-stop', (event, arg) => {
  mb.tray.setTitle('0:00');
  createWindow();
})

ipcMain.on('timer-message', (event, time) => {
  try {
    mb.tray.setTitle(_.toString(time));
  } catch(e) {
    console.log(e)
  }
});

