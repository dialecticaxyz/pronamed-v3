const {readIdDB,updateDB} = require('../apiNedb/crudDb.js');

async function itemCantMas(req,resp){
  let rec = await readIdDB(req.body["id"],"inventarios")
  if(rec.length==0){ 
    resp.send({msg:"empty"}) 
  }else{
    let rsl = rec[0]["cant"] + req.body["ajuste"]
    await updateDB(req.body["id"],{cant:rsl},"inventarios")
    resp.send({msg:"success",cant:rsl})
  }
};
async function itemCantMenos(req,resp){
  let rec = await readIdDB(req.body["id"],"inventarios")
  if(rec.length==0){ 
    resp.send({msg:"empty"}) 
  }else{
    let rsl = rec[0]["cant"] - req.body["ajuste"]
    await updateDB(req.body["id"],{cant:rsl},"inventarios")
    resp.send({msg:"success",cant:rsl})
  }
};
function proformaRegister(proforma){
  return new Promise(function(resolve,reject){
    for (const key in proforma) {
      const id = proforma[key]["id"];
      const cant = proforma[key]["cant"];
      readIdDB(id,"inventarios").then((rec)=>{
        let dif = rec[0]["cant"] - cant
        updateDB(id,{cant:dif},"inventarios").then(()=>{ console.log("upCant") })
      })
    }
    resolve(true)
  })
}
function proformaUpdate(carroAnt,carroNue){
  return new Promise(function(resolve,reject){
    //////EDITANDO VENTA ITEMS//////
    var InvAjus = {}
    //for borrados o modificados//
    for (const key in carroAnt){
      const itemNue = carroNue[key];
      const itemAnt = carroAnt[key];
      if(itemNue == undefined){//borrados del carro
        InvAjus[key] = {id:key,cant:-itemAnt["cant"]} 
      }else{//modifico del carro
        InvAjus[key] = {id:key,cant: (itemNue["cant"]-itemAnt["cant"])} 
      }  
    }
    //for nuevos//
    for (const key in carroNue) {
      if(carroAnt[key] == undefined){
        InvAjus[key] = {id:key,cant:carroNue[key]["cant"]}
      }
    }
    /////EDITANDO VENTA ITEMS////// 
    ////// acualizando ajuste //////
    proformaRegister(InvAjus).then(()=>{ resolve(true) })
    ////// acualizando ajuste //////
  })
}

function proformaDelete(proforma){
  return new Promise(function(resolve,reject){
    for (const key in proforma) {
      const id = proforma[key]["id"];
      const cant = proforma[key]["cant"];
      rIdInv(id).then((rec)=>{
        if(rec.length!=0){
          let dif = rec[0]["cant"] + cant
          updateDB(id,{cant:dif},"inventarios").then(()=>{ console.log("upCant") })
        }
      })
    }
    resolve(true)
  })
}
module.exports = {
  itemCantMas,
  itemCantMenos,
  proformaRegister,
  proformaUpdate,
  proformaDelete
}
