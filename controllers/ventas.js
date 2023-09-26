const {readIdDB,createdDB,updateDB,deleteDB} = require('../apiNedb/crudDb.js');
const {LocalStorage} = require("node-localstorage");
const localStorage = new LocalStorage('./localStorage');
const {proformaRegister,proformaUpdate,proformaDelete} = require('./inventarios');

function createdVenta(req, resp){
  let numNot = (localStorage.getItem('numNota')==null?0:parseInt(localStorage.getItem('numNota'))) + 1
  req.body["numNota"] = numNot
  localStorage.setItem('numNota', numNot)
  createdDB(req.body,"ventas").then(()=>{
    proformaRegister(req.body["proforma"]).then(()=>{
      resp.send({"msg":"success","numNota":numNot})
    })
  })
};
function updateVenta(req, resp){
  updateDB(req.body["id"],req.body,"ventas").then(()=>{
    readIdDB(req.body["id"],"ventas").then((rec)=>{
      proformaUpdate(rec[0]["proforma"],req.body["proforma"]).then(()=>{ resp.send({msg:"success"}) })
    })
  })
};
function deleteVenta(req, resp){
  deleteDB(req.body["id"]).then((r)=>{
    if(r){ proformaDelete(rec[0]["proforma"]).then(()=>{ resp.send({msg:"success"}) }) }else{ resp.send({msg:"fail"}) }
  })
};
module.exports = {
  createdVenta,
  updateVenta,
  deleteVenta
}