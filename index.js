var menubar = require('menubar');
var electron = require('electron');
var _ = require('lodash');
const {ipcMain, BrowserWindow, app} = electron;
var mb = menubar({
  index: 'file://' + __dirname + '/index.html',
  icon: __dirname + '/timer.png'
});
let mainWindow;
let interval;
let seconds;

ipcMain.on('close-done-window', (event, arg) => {
  mainWindow.hide();
});

function createWindow() {
  const {width, height} = electron.screen.getPrimaryDisplay().workAreaSize;
  mainWindow = new BrowserWindow({
    width,
    height,
    frame: false,
    show: false
  });
  // mainWindow.webContents.openDevTools();
  mainWindow.loadURL('file://' + __dirname + '/done.html');

  mainWindow.on('closed', function() {
    mainWindow = null;
  });
}

mb.on('ready', function ready() {
  console.log('ok, we are ready :)');
  mb.tray.setTitle('00:00');
  createWindow();
});


ipcMain.on('start-coundown-timer', (event, minutes) => {
  if (interval) {
    clearInterval(interval);
    mb.tray.setTitle('00:00');
  }

  seconds = minutes * 60;

  interval = setInterval(() => {
      seconds = seconds - 1;
      var format = _.padStart(parseInt(seconds/60), 2, '0') + ':' + _.padStart(seconds % 60, 2, '0');
      mb.tray.setTitle(format);

      if (seconds === 0) {
        mainWindow.show();
        mb.tray.setTitle('00:00');
        clearInterval(interval);
      }
  }, 1000);
})

ipcMain.on('stop-coundown-timer', (event, arg) => {
  mb.tray.setTitle('00:00');
  clearInterval(interval);
})

ipcMain.on('quit-timestop-app', (event) => {
  clearInterval(interval);
  mb.tray.setTitle('00:00');
  app.quit();
})
