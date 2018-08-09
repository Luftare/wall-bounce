const port = 9999;
const fs = require("fs");
const express = require('express');
const app = express();
const http = require('http').Server(app);
const path = require('path');
const bodyParser = require('body-parser');

app.use('/', express.static(path.join(__dirname, '../editor')));
app.use('/', express.static(path.join(__dirname, '../')));

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json());

app.get('/', function(req, res) {
  res.sendFile(path.resolve(`../editor/index.html`));
});

app.get('/game', function(req, res) {
  res.sendFile(path.resolve(`../index.html`));
});

app.get('/levels', function(req, res) {
  fs.readdir('../levels/', (err, files) => {
    if(err) throw err;
    res.send(JSON.stringify(files));
  });
});

app.get('/levels/:fileName', function(req, res) {
  fs.readdir(`../levels/`, (err, data) => {
    if(err) throw err;
    res.send(JSON.stringify(data));
  });
});


app.post('/levels/:levelName', (req, res) => {
  fs.writeFile(`../levels/${req.params.levelName}`, JSON.stringify(req.body), err => {
    if(err) throw err;
    fs.readdir('../levels/', (err, files) => {
      if(err) throw err;
      res.send(JSON.stringify(files));
    });
  });
});

http.listen(port, e => {
  console.log(`editor at port: ${port}`);
});
