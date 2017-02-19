'use strict'

var menubar = require('menubar');
var electron = require('electron');
var _ = require('lodash');
var timer = require('./src/timer');
var storage = require('./src/storage');

const {ipcMain, BrowserWindow, app} = electron;

var mb = menubar({
  index: 'file://' + __dirname + '/index.html',
  icon: __dirname + '/timer.png',
  width: 250,
  height: 300
});

let storageWindow;
let mainWindow;
let activity;

/******* main *******/
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
  mb.tray.setTitle('00:00');
  createWindow();
});

ipcMain.on('start-coundown-timer', (event, options) => {
  activity = timer.startCountdownTimer(mainWindow, mb, options, storage.saveActivity)
})

ipcMain.on('close-done-window', (event, arg) => {
  mainWindow.hide();
});

ipcMain.on('close-done-window-and-start-again', (event, arg) => {
  mainWindow.hide();
  activity = timer.startCountdownTimer(mainWindow, mb, _.cloneDeep(activity), storage.saveActivity)
});

ipcMain.on('stop-coundown-timer', (event, arg) => {
  timer.stopCountdownTimer(mb)
})

ipcMain.on('show-saved-activities', (event, arg) => {
  const {width, height} = electron.screen.getPrimaryDisplay().workAreaSize;
  storageWindow = new BrowserWindow({
    width,
    height
  });
  // storageWindow.webContents.openDevTools();
  storageWindow.loadURL('file://' + __dirname + '/storage.html');

  storageWindow.on('closed', function() {
    storageWindow = null;
  });
})

ipcMain.on('storage-view-ready', (event) => {
  var content = storage.readFile(__dirname + '/storage.json');
  storageWindow.webContents.send('storerage-cotent', content);
})

ipcMain.on('quit-timestop-app', (event) => {
  timer.stopCountdownTimer(mb)
  app.quit();
})
/******* main *******/