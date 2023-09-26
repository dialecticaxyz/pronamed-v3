const {createdDB,readUserDB,countDB} = require('../apiNedb/crudDb.js');
const {passwordCript} = require("../cryptJwt/cryptJwt");

async function createdAdminInit(req,rsp){
  let count = await countDB("usuarios") 
  if(count==0){
    req.body["id"] = req.body["user"]
    req.body["rol"] = "Administrar"
    let paswCript = await passwordCript(req.body["user"])
    req.body["password"] = paswCript
    await createdDB(req.body,"usuarios")
    rsp.send({msg:"success"})
  }else{ 
    rsp.send({msg:"fail"}) 
  }
};
async function createdUse(req,rsp){
  let r = await readUserDB(req.body["user"],"usuarios") 
  if(r.length!=0){ 
    rsp.send({msg:"exists"}) 
  }else{
    let paswCript = await passwordCript(req.body["user"])
    req.body["password"] = paswCript
    await createdDB(req.body,"usuarios")
    rsp.send({msg:"success"})
  }
};

module.exports = {
  createdAdminInit,
  createdUse,
}
