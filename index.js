const path = require('path')
const express = require('express')
const can = require('rawcan');
const exphbs = require('express-handlebars')
const port = 3000
const app = express()

var bodyParser = require('body-parser')
app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
})); 

const motorsId = 456;


var socket = can.createSocket('can0');

  function moveCode(direction) {
     if (direction == "up")
  	  return "VICTORYGY";
  }

  var cansignal;
  var canlog = {}
  var candumps = []
  canlog.candump = candumps;

  app.use('/', express.static(__dirname + '/'));
  app.use(express.json());       
  app.use(express.urlencoded()); 

  app.post('/form', function (req, res) {
    console.log("recieved form" + req.body.cansignal);
    
    if (req.body != null)
        cansignal = req.body.cansignal;
    var parsedCan = cansignal.split('#');

    socket.send(parseInt(parsedCan[0], 16), parsedCan[1].substring(0, 8));
    console.log(parseInt(parsedCan[0], 16) + "#" + parsedCan[1].substring(0, 8));
    res.send({success:"true"});
  });

  socket.on('message', (id, buffer) => {
    var tempstring = 'received frame [' + id.toString(16) + '] ' + buffer.toString('hex');
    console.log(tempstring);
    var dump = {
      "id" : id.toString(16),
      "frame" : buffer.toString('hex')
    }
    canlog.candump.unshift(dump);
  });

  app.post('/dump', function (req, res) {
    res.send(canlog);
    canlog.candump = [];
  });

  app.listen(port, (err) => {
    if (err) {
      return console.log('something bad happened', err);
    }

    console.log(`server is listening on ${port}`)
  });
