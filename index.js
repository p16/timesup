var menubar = require('menubar');
var electron = require('electron');
var _ = require('lodash');
var fs = require('fs');
var jsonfile = require('jsonfile');
var moment = require('moment');

const {ipcMain, BrowserWindow, app} = electron;

var mb = menubar({
  index: 'file://' + __dirname + '/index.html',
  icon: __dirname + '/timer.png',
  width: 250,
  height: 250
});

let mainWindow;
let interval;
let seconds;
let activity = {};

ipcMain.on('close-done-window', (event, arg) => {
  mainWindow.hide();
});

function readFile(file) {
  try {
    return jsonfile.readFileSync(file, {throws: false});
  } catch(e) {
  }

  return null;
}

function writeFile(file, content) {
  try {
    jsonfile.writeFileSync(file, content, {throws: false});
  } catch(e) {
    console.log('Could not write your activity to filesystem :( [' + e.message + ']');
  }

  return null;
}

function saveActivity(activity, callback) {
  var file = __dirname + '/storage.json';
  var today = moment().format('YYYYMMDD');
  var content = readFile(file);

  if (!content) {
    content = {};
  }

  if (!content[today]) {
    content[today] = [];
  }

  content[today].push(activity);
  writeFile(file, content);
}

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
  if (interval) {
    clearInterval(interval);
    mb.tray.setTitle('00:00');
    activity = {};
  }

  activity = options;
  seconds = options.minutes * 60;
  var format = _.padStart(parseInt(seconds/60), 2, '0') + ':' + _.padStart(seconds % 60, 2, '0');
  mb.tray.setTitle(format);

  interval = setInterval(() => {
      seconds = seconds - 1;

      var format = _.padStart(parseInt(seconds/60), 2, '0') + ':' + _.padStart(seconds % 60, 2, '0');
      mb.tray.setTitle(format);

      if (seconds === 0) {
        mainWindow.show();
        mb.tray.setTitle('00:00');
        clearInterval(interval);
        saveActivity(activity, () => {
          activity = {};
        });
      }
  }, 1000);
})

ipcMain.on('stop-coundown-timer', (event, arg) => {
  mb.tray.setTitle('00:00');
  clearInterval(interval);
  activity = {};
})

ipcMain.on('quit-timestop-app', (event) => {
  clearInterval(interval);
  mb.tray.setTitle('00:00');
  activity = {};
  app.quit();
})
