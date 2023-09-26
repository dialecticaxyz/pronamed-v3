const url = location.href.split("/")[0]+"//"+(location.href.split("/")[2]).split(":")[0]
let serverURL
if(location.href.split("/")[0]=="http:"){
  serverURL = 'ws://'+(location.href.split("/")[2]).split(":")[0]
}else{
  serverURL = 'wss://'+(location.href.split("/")[2]).split(":")[0]
}
const token = JSON.parse((localStorage.getItem("datUser")==null||localStorage.getItem("datUser")=="")?"{}":localStorage.getItem("datUser")).token
function apiPostJsonCrud(metodo,dat,coleccion){//requests json token - respons json
  return new Promise(function(resolve,reject){
    dat["coleccion"] = coleccion
    fetch(url+`/`+metodo,{method:'post',headers:{'Accept':'application/json,text/plain','Content-Type':'application/json','x-access-token':token},body:JSON.stringify(dat)}).then(rsp=>{ if(rsp.ok){ rsp.json().then(d=>{ resolve(d) })}});
  })
}
function apiPostJsonRut(metodo,dat){//requests json token - respons json
  return new Promise(function(resolve,reject){
    fetch(url+`/`+metodo,{method:'post',headers:{'Accept':'application/json,text/plain','Content-Type':'application/json','x-access-token':token},body:JSON.stringify(dat)}).then(rsp=>{ if(rsp.ok){ rsp.json().then(d=>{ resolve(d) })}});
  })
}
/////////// SINCRO DATA BASE //////////
function timCol(tim){ return (localStorage.getItem(tim)==null||localStorage.getItem(tim)=="")?0:parseInt(localStorage.getItem(tim)) }
function elemtDif(d1,d2){
  var ar = [];
  for (var i = 0; i < d1.length; i++) {
    var ig = false;
    for (var j = 0; j < d2.length & !ig; j++){ if(d1[i].id == d2[j]){ ig=true } }
    if(!ig){ ar.push(d1[i].id) }
  }
  return ar
}
async function sincroBD(col,tp){
  console.log("bajando "+col);iniSinAmi(tp)
  let datCloud
  if(col=="ventas"){
    let fil = await storageJsonSetup("filvent",{"fechaVentas":fecActInp()})
    let f = new Date(fil.fechaVentas)  
    const tim1 = new Date(f.getFullYear(),f.getMonth(),f.getDate(),0,0,0).getTime();
    const tim2 = new Date(f.getFullYear(),f.getMonth(),f.getDate(),23,59,59).getTime();
    datCloud = await apiPostJsonCrud("readTimeTime",{"tim1":tim1,"tim2":tim2},col)
  }else{
    datCloud = await apiPostJsonCrud("readTime",{"time":timCol(col+"Time")},col)
  }
  let datos = datCloud["record"]
  for (let i = 0; i < datos.length; i++) {
    let item = datos[i];
    await write_DB(item,col)
    if(col=="ventas"){await write_DB(item,'archivos')}//archivo
    if(col=="inventarios"){
      if( document.getElementById(item.id+"cant") ){
        document.getElementById(item.id+"cant").textContent = item.cant //item
      }
    }
    if(col!="ventas"){
      if(item["time"]>timCol(col+"Time")){ localStorage.setItem(col+"Time",item["time"]) }
    }
  }
  var datLocal = await read_DB(col)
  if(datCloud["count"]<datLocal.length){ 
    let arrCloud = await apiPostJsonCrud("readIds",{},col)
    let sincroDel = elemtDif(datLocal,arrCloud)
    for (let i = 0; i < sincroDel.length; i++) {
      let id = sincroDel[i];
      await del_DB(id,col)
      console.log("eleiminando..!!")
    }
    console.log(col+" bajado...!!!");finSinAmi(tp)
  }else{
    console.log(col+" bajado...!!!");finSinAmi(tp)
  }
}
function iniSinAmi(t){
  if(t=="m"){loadData()}
  if(t=="a"){sincConect()}
  if(t=="r"){sincConect()}
}
function finSinAmi(t){
  if(t=="m"){successDat("r")}
  if(t=="a"){sincConectStop();renderTab()}
  if(t=="r"){sincConectStop();renderTab()}
}
/////////// SINCRO DATA BASE //////////
/////////// WEBSOCKET CONECCION //////////
let sinAct 
let socket;
function openSocket(act){
  sinAct = act
  socket = new WebSocket(serverURL);
  socket.addEventListener('open', openConnection);
  socket.addEventListener('close', closeConnection);
  socket.addEventListener('message', readMessage);
}
function closeConnection(){ setTimeout(openSocket(sinAct),500) }
function openConnection(){
  if(socket.readyState===WebSocket.OPEN){
    if(sinAct=="sincVEN"){ sincroBD('ventas','a') }
    if(sinAct=="sincINV"){ sincroBD('inventarios','a') }
  }
}
function readMessage(e){ 
  console.log(e.data); 
  if(sinAct=="sincVEN"){ sincroBD('ventas','r') }
  if(sinAct=="sincINV"){ sincroBD('inventarios','r') }
}
function sendMessage(){
  return new Promise(function(resolve,reject){
    if(socket.readyState===WebSocket.OPEN){ 
      socket.send("upDB"); 
      resolve(true)
    } 
  })
}
/////////// WEBSOCKET CONECCION //////////
