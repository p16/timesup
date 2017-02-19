'use strict'

const jsonfile = require('jsonfile')
const moment = require('moment');

function readFile(file) {
  try {
    return jsonfile.readFileSync(file, {throws: false})
  } catch(e) {
  }

  return null
}

function writeFile(file, content) {
  try {
    jsonfile.writeFileSync(file, content, {throws: false})
  } catch(e) {
    console.log('Could not write your activity to filesystem :( [' + e.message + ']')
  }

  return null
}

function saveActivity(activity) {
  var file = __dirname + '/../storage.json'
  var today = moment().format('YYYYMMDD')
  var content = readFile(file)

  if (!content) {
    content = {}
  }

  if (!content[today]) {
    content[today] = []
  }

  content[today].push(activity)
  writeFile(file, content)
}

module.exports = {
  readFile,
  saveActivity
}