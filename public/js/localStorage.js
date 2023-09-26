function storage(key){ return (localStorage.getItem(key)==null?"":localStorage.getItem(key))}
function storageNum(key){ return (storage(key)==""?0:parseFloat(localStorage.getItem(key)))}
function storageJson(key){ return storage(key)==""?{}: JSON.parse(localStorage.getItem(key))}
function storageDef(key,def){ 
  if(typeof(def)=="number"){
    return storage(key)==""?def:parseFloat(storage(key)) 
  }else{
    return storage(key)==""?def:storage(key)
  }
}
function storageBolExi(key){ return storage(key)==""?false:true }
function storageBolean(key){ return storage(key)==""?false:true }
function storageJsonPre(key,js){ return storage(key)==""?js: JSON.parse(localStorage.getItem(key))}
function storageJsonSetup(key,jsn){
  return new Promise(function(resolve,reject){  
    let jl = storageJson(key)
    for (const key in jsn) {
      const el = jsn[key];
      const e = jl[key];
      if(e==undefined){ jl[key] = el }
    }
    resolve(jl)
  }) 
}
