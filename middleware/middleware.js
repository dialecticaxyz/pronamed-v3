const {jwtVerify} = require("../cryptJwt/cryptJwt");

function verifyLog(req,res,next) {
  const token = req.headers["x-access-token"];
  if(!token) { return res.send({msg:"fail"}) }
  jwtVerify(token).then((rs)=>{
    if(rs.id==undefined){ return res.send({msg:"fail"}) }else{ return next() }
  })
}
function verifyUser(req, res, next) {
  const token = req.headers["x-access-token"];
  if(!token) { return res.status(401).send({msg:"No Token"}); }
  jwtVerify(token).then((rs)=>{
    if(rs.id==undefined){
      return res.send({msg:"No Token"});
    }else{ return next(); }
  })
}
async function verifyAdmin(req, res, next) {
  const token = req.headers["x-access-token"];
  if(!token) { return res.send({msg:"No Token"}); }
  jwtVerify(token).then((rs)=>{
    if(rs.id==undefined){
      return res.send({msg:"No Autorised"});
    }else{
      if(rs.rol=="Administrar"){ return  next(); }else{
        return res.send({msg:"No Autorised"});
      }
    }
  })
}
async function verifyVendor(req, res, next) {
  const token = req.headers["x-access-token"];
  if(!token) { return res.send({msg:"No Token"}); }
  jwtVerify(token).then((rs)=>{
    if(rs.id==undefined){
      return res.send({msg:"No Autorised"});
    }else{
      if(rs.rol=="Vender"){ return  next(); }else{
        return res.send({msg:"No Autorised"});
      }
    }
  })
}
async function verifyAdminAlma(req, res, next) {
  const token = req.headers["x-access-token"];
  if(!token){ return res.send({msg:"No Token"}); }
  jwtVerify(token).then((rs)=>{
    if(rs.id==undefined){
      return res.send({msg:"No Autorised"});
    }else{
      if(rs.rol=="Administrar"||rs.rol=="Almacen"){ return  next(); }else{
        return res.send({msg:"No Autorised"});
      }
    }
  })
}

module.exports = { 
  verifyLog,
  verifyVendor,
  verifyUser,
  verifyAdmin,
  verifyAdminAlma
}