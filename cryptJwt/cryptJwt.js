const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('../config.js');

function passwordCript(password){
  return new Promise(function(resolve,reject){
    bcrypt.genSalt(10).then((salt)=>{
      bcrypt.hash(password, salt).then((paswCript)=>{
        resolve(paswCript)
      })
    })
  })
}
function bcryptCompare(password,paswCript){
  return new Promise(function(resolve,reject){
    bcrypt.compare(password,paswCript,(err,rsl)=>{
      resolve(rsl)
    });
  })
}
function jwtVerify(token){
  return new Promise(function(resolve,reject){
    jwt.verify(token,config.SECRET,(err,dec)=>{
      resolve(dec) 
    });
  })
}
function jwtSign(dat){
  return new Promise(function(resolve,reject){
    jwt.sign(dat,config.SECRET,{expiresIn:'30d'},(err,token)=>{
      resolve(token)
    });
  })
}

module.exports = {
  passwordCript,
  bcryptCompare,
  jwtVerify,
  jwtSign
}
