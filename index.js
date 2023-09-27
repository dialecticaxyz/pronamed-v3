const cors = require('cors')
const path = require('path');
const express = require('express');
const app = express();
const wsServer = require('express-ws')(app); 
const router = require('./routes/routes.js');
const {LocalStorage} = require("node-localstorage");
const localStorage = new LocalStorage('./localStorage');
const { exec } = require('child_process');

let clients = new Array;
function handleWs(ws, request) {
  console.log("New Connection");        
  clients.push(ws);
  function endClient(){
    var position = clients.indexOf(ws);
    clients.splice(position, 1);
    console.log("connection closed");
  } 
  function clientResponse(data){
    for (let c in clients) { //brocast
      if(!(clients[c]==ws)){
        clients[c].send(data);
      }
    }
  }
  ws.on('message', clientResponse);
  ws.on('close', endClient);
}

app.set('port', process.env.PORT || 80);
app.use(express.static(path.join(__dirname,'public')));

app.use(cors())
app.use(express.json()); 
app.use('/', router);
app.ws('/', handleWs);

const server = app.listen(app.get('port'),()=>{ 
  console.log("http://127.0.0.1:"+server.address().port) 
  exec('du -s', (error, stdout, stderr) => {
    if(error){console.error(`error: ${error.message}`); return; }
    if (stderr) { console.error(`stderr: ${stderr}`);  return;  }
    console.log(stdout);
    localStorage.setItem('disk', stdout)
  });
});