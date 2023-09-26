const {passwordCript,bcryptCompare,jwtSign} = require("../cryptJwt/cryptJwt");
const {readUserDB,updateDB} = require('../apiNedb/crudDb');
async function login(req,rsp){
  const password = req.headers["x-access-token"];
  const user = req.body["user"] //numero de celular
  let rc = await readUserDB(user,"usuarios")
  if(rc.length==0){ rsp.send({msg:"emptyUser"}) }else{
    let comparePas = await bcryptCompare(password,rc[0].password)
    if(!comparePas){ rsp.send({msg:"errorPsw"}) }else{
      let token = await jwtSign({"rol":rc[0].rol,"id":rc[0].id})
      rsp.send({"token":token,"nom":rc[0].nom,"cel":rc[0].user,"rol":rc[0].rol,"msg":"success"})
    }
  }
};
async function updatePassword(req,res){
  const user = req.body["user"] //numero de celular
  const pas = req.body["pas"]
  const newPas = req.body["newPas"]
  let rc = await readUserDB(user,"usuarios")
  if(rc.length==0){ rsp.send({msg:"emptyUser"}) }else{
    let comparePas = await bcryptCompare(pas,rc[0].password)
    if(comparePas){ rsp.send({msg:"fail"}) }else{
      let paswCript = await passwordCript(newPas)
      let rs = await updateDB(rc[0].id,{"password":paswCript},"usuarios")
      res.send({msg:"success"})
    }
  }
}
module.exports = {
  login,
  updatePassword,
}
