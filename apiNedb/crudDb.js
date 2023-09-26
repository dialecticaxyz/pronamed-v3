const Datastore = require('nedb');
db = {};
db.usuarios = new Datastore({filename:'./data/usuarios.dat', autoload: true});
db.ventas = new Datastore({filename:'./data/ventas.dat', autoload: true});
db.inventarios = new Datastore({filename:'./data/inventarios.dat', autoload: true});
db.clientes = new Datastore({filename:'./data/clientes.dat', autoload: true});

function createdDB(dat,col){
  return new Promise((resolve,reject)=>{
    let colDB
    if(col=="usuarios"){ colDB = db.usuarios }
    if(col=="ventas"){ colDB = db.ventas }
    if(col=="inventarios"){ colDB = db.inventarios }
    if(col=="clientes"){ colDB = db.clientes }
    dat["time"]=Date.now(); dat["_id"]=dat["id"]; delete dat["coleccion"]
    colDB.insert(dat,(err,rc)=>{ if(rc){resolve(true)}else{resolve(false)} }) 
  })
}
function readAllDB(col){
  return new Promise(function(resolve,reject){
    let colDB
    if(col=="usuarios"){ colDB = db.usuarios }
    if(col=="ventas"){ colDB = db.ventas }
    if(col=="inventarios"){ colDB = db.inventarios }
    if(col=="clientes"){ colDB = db.clientes }
    colDB.find({},(err,rc)=>{ colDB.count({},(err,cn)=>{ resolve({"record":rc,"count":cn}) }) }) 
  })
}
function readTimeDB(t,col){/*time mayores*/
  return new Promise(function(resolve,reject){
    let colDB
    if(col=="usuarios"){ colDB = db.usuarios }
    if(col=="ventas"){ colDB = db.ventas }
    if(col=="inventarios"){ colDB = db.inventarios }
    if(col=="clientes"){ colDB = db.clientes }
    colDB.find({ time:{$gt:t} },(err,rc)=>{ colDB.count({},(err,cn)=>{ resolve({"record":rc,"count":cn}) }) }) 
  })
}
function readUserDB(us){/// especifico ususarios
  return new Promise(function(resolve,reject){
    let colDB = db.usuarios
    colDB.find({"user":us},(err,rec)=>{ resolve(rec) }) 
  })
}
function readTimeTimeDB(dat){///especifico para ventas "fechVent"
  return new Promise(function(resolve,reject){
    let colDB = db.ventas
    let tim1 = dat["tim1"];let tim2 = dat["tim2"]
    colDB.find({$and:[{"fechVent":{$gte:tim1}},{"fechVent":{$lte:tim2}}]},(err,rc)=>{ colDB.count({},(err,cn)=>{ resolve({"record":rc,"count":cn}) }) })
  })
}
function readTimeTimeUserDB(dat){/// especifico ventas "fechVent" "cel"
  return new Promise(function(resolve,reject){
    let colDB = db.ventas
    let cel=dat["cel"]; let tim1=dat["tim1"]; let tim2=dat["tim2"]
    colDB.find({$and:[{fechVent:{$gt:tim1}},{fechVent:{$lt:tim2}},{"dataVenden.cel":cel} ]},(err,rc)=>{ resolve({"record":rc}) });
  })
}
function readTimeUserDB(dat){/// especifico ventas "fechVent" "cel"
  return new Promise(function(resolve,reject){
    let colDB = db.ventas
    let cel = dat["cel"]; let tim = dat["time"]
    colDB.find({$and:[{fechVent:{$gt:tim}},{"dataVenden.cel":cel} ]},(err,rc)=>{ resolve({rc}) })
  })
}
function readIdDB(id,col){
  return new Promise(function(resolve,reject){
    let colDB
    if(col=="usuarios"){ colDB = db.usuarios }
    if(col=="ventas"){ colDB = db.ventas }
    if(col=="inventarios"){ colDB = db.inventarios }
    if(col=="clientes"){ colDB = db.clientes }
    colDB.find({_id:id},(err,rec)=>{ resolve(rec) }); 
  })
}
function updateDB(id,dat,col){
  return new Promise(function(resolve,reject){
    let colDB
    if(col=="usuarios"){ colDB = db.usuarios }
    if(col=="ventas"){ colDB = db.ventas }
    if(col=="inventarios"){ colDB = db.inventarios }
    if(col=="clientes"){ colDB = db.clientes }
    dat["time"]=Date.now(); delete dat["coleccion"] 
    colDB.update({ _id:id},{$set:dat},{},(err,n)=>{ if(n==1){resolve(true)}else{resolve(false)} }) 
  })
}
function deleteDB(id,col){
  return new Promise(function(resolve,reject){
    let colDB
    if(col=="usuarios"){ colDB = db.usuarios }
    if(col=="ventas"){ colDB = db.ventas }
    if(col=="inventarios"){ colDB = db.inventarios }
    if(col=="clientes"){ colDB = db.clientes }
    colDB.remove({_id:id},{},(err,r)=>{ if(r==1){resolve(true)}else{resolve(false)} }) 
  })
};
function readIdsDB(col){
  return new Promise(function(resolve,reject){
    let colDB
    if(col=="usuarios"){ colDB = db.usuarios }
    if(col=="ventas"){ colDB = db.ventas }
    if(col=="inventarios"){ colDB = db.inventarios }
    if(col=="clientes"){ colDB = db.clientes }
    colDB.find({},(err, rec)=>{
      let ids = []; 
      for (let i=0; i<rec.length; i++){ ids.push(rec[i]["id"]) }; 
      resolve(ids)
    });
  })
}
function countDB(col){
  return new Promise(function(resolve,reject){
    let colDB
    if(col=="usuarios"){ colDB = db.usuarios }
    if(col=="ventas"){ colDB = db.ventas }
    if(col=="inventarios"){ colDB = db.inventarios }
    if(col=="clientes"){ colDB = db.clientes }
    colDB.count({},(err,count)=>{resolve(count)}) 
  })
}
module.exports = {
  createdDB,
  readAllDB,
  readTimeDB,
  readTimeUserDB,
  readTimeTimeDB,
  readTimeTimeUserDB,
  readIdDB,
  readUserDB,
  updateDB,
  deleteDB,
  readIdsDB,
  countDB
}
