const electron = require('electron');
const express = require('express');
let cashUtil = require("./cash")
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;

var window = null;

app.on('ready', function () {
  window = new BrowserWindow({ width: 800, height: 600 });
  // 打开开发工具
  window.openDevTools();
  window.loadURL('file://' + __dirname + '/index.html');
});

const webapp = express()
const port = 3000
webapp.use(express.json()) // for parsing application/json
webapp.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded
webapp.get('/hosts', (req, res) => {
  let hosts = require("./hosts")
  let _hosts = hosts.map((item, idx) => {
    return { "id": idx + 1, host: item }
  })
  let result = { "code": 0, "msg": "", "count": hosts.length, "data": _hosts }
  res.json(result)
})
webapp.post('/check', (req, res) => {
  let host = req.body.host;
  cashUtil.cashoutOne(host).then((data) => {
    res.json(data)
  }).catch((ex) => {
    res.status(503).end()
  })
})
webapp.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
try {
  require('electron-reloader')(module)
} catch (_) { }