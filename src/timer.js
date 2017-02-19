'use strict'

const _ = require('lodash')

let interval
let activity
let seconds

function startCountdownTimer(mainWindow, mb, options, saveActivity) {
  activity = options

  if (interval) {
    clearInterval(interval)
    mb.tray.setTitle('00:00')
  }

  seconds = 10 //activity.minutes * 60
  var format = _.padStart(parseInt(seconds/60), 2, '0') + ':' + _.padStart(seconds % 60, 2, '0')
  mb.tray.setTitle(format)

  interval = setInterval(() => {
      seconds = seconds - 1

      var format = _.padStart(parseInt(seconds/60), 2, '0') + ':' + _.padStart(seconds % 60, 2, '0')
      mb.tray.setTitle(format)

      if (seconds === 0) {
        mainWindow.show()
        mb.tray.setTitle('00:00')
        clearInterval(interval)
        saveActivity(activity)
      }
  }, 1000)

  return activity
}

function stopCountdownTimer(mb) {
  mb.tray.setTitle('00:00')
  clearInterval(interval)
  activity = {}
}

module.exports = {
  startCountdownTimer,
  stopCountdownTimer
}