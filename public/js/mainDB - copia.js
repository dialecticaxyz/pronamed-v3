var indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
var dataBase
function startDB(){
  dataBase = indexedDB.open("inventario", 10);
  dataBase.onupgradeneeded = function (e){
    var active = dataBase.result; 
    if (!active.objectStoreNames.contains('inventarios')) {
      var object = active.createObjectStore('inventarios', { keyPath : 'id'});
    }
    if (!active.objectStoreNames.contains('ventas')) {
      var object = active.createObjectStore('ventas', { keyPath : 'id'});
    }
    if (!active.objectStoreNames.contains('archivos')) {
      var object = active.createObjectStore('archivos', { keyPath : 'id'});
    }
    if (!active.objectStoreNames.contains('usuarios')) {
      var object = active.createObjectStore('usuarios', { keyPath : 'id'});
    }
    if (!active.objectStoreNames.contains('clientes')) {
      var object = active.createObjectStore('clientes', { keyPath : 'id'});
    }
  };
  dataBase.onsuccess = function (e){ init_m() };
  dataBase.onerror = function (e){console.log(e)};
}
/******* promeas generales BD ******/
function write_DB(f,col){
  return new Promise(function(resolve,reject){  
    var active = dataBase.result;
    var data = active.transaction([col], "readwrite");
    var object = data.objectStore(col);
    var request = object.put(f);
    request.onerror = function (e) {alert("Ya existe el registro");};
    data.oncomplete = function (e){ resolve(true) };
  }) 
}
function update_DB(id,f,col){
  return new Promise(function(resolve,reject){
    var active = dataBase.result;
    var data = active.transaction([col], "readwrite");
    var object = data.objectStore(col);
    var elemento = object.get(id);
    elemento.onsuccess = function(e){
      var result = e.target.result;
      for (const key in f){ result[key] = f[key]; }
      object.put(result); 
    };
    elemento.onerror = function (e) {console.log(e)};
    data.oncomplete = function (e){ resolve(true) };
  });
}
function read_DB(col){
  return new Promise(function(resolve,reject){
    var elts = [];
    var active = dataBase.result;
    var data = active.transaction([col], "readonly");
    var object = data.objectStore(col);
    var cursor = object.openCursor();
    cursor.onsuccess = function (e) {
      var result = e.target.result;
      if (result === null) {return;}
      elts.push(result.value);
      result.continue();
    };
    data.oncomplete = function() { resolve(elts) };
  });
}
function read_DB_ids(col){
  return new Promise(function(resolve,reject){
    var elts = [];
    var active = dataBase.result;
    var data = active.transaction([col], "readonly");
    var object = data.objectStore(col);
    var cursor = object.openCursor();
    cursor.onsuccess = function (e) {
      var result = e.target.result;
      if (result === null) {return;}
      elts.push(result.value.id);
      result.continue();
    };
    data.oncomplete = function() { resolve(elts) };
  });
}
function read_ID_DB(id,col){
  return new Promise(function(resolve,reject){
    var active = dataBase.result;
    var data = active.transaction([col], "readonly");
    var object = data.objectStore(col);
    var request = object.get(id);
    request.onsuccess = function (){
      var result = request.result;
      if (result !== undefined){ resolve(result) }else{ resolve(false) }
    };
  });
}
function del_DB(id,col){
  return new Promise(function(resolve,reject){
    var active = dataBase.result;
    var data = active.transaction([col], "readwrite");
    var object = data.objectStore(col);
    var request = object.delete(id);
    request.onsuccess = function (){ resolve(true) };
  })
}
function clear_coleccion(col){
  return new Promise(function(resolve,reject){
    var active = dataBase.result;
    var data = active.transaction([col], "readwrite");
    var object = data.objectStore(col);
    var objectStoreRequest = object.clear();
    objectStoreRequest.onsuccess = function(event) {resolve(true)};
  })
}
/******* promeas generales BD ******/
//////////////////////// MANEJO DE FORMULARIO //////////////////////////
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
function itemFilter(val,act,fil,mat,elm){
  return new Promise(function(resolve,reject){ 
    let p = mat.indexOf(elm); 
    if(act){
      if(p==-1){ mat.push(elm); }
      resolve(true); 
    }else{
      if(val==fil){ 
        if(p==-1){ mat.push(elm); }
        resolve(true)
      }else{
        if(p!=-1){ mat.splice(p,1) }
        resolve(false)
      }
    }
  }) 
}

function ValNum(id){
  let nod = document.getElementById(id)
  if(nod.tagName=="INPUT"){
    let val = nod.value
    return (val==""?0:parseFloat(val))
  }else{
    let val = nod.textContent
    return (val==""?0:parseFloat(val))
  }
}
function saveText(e,i){
  let js = Object.keys(e.target.dataset)[0] 
  let jsv = storageJson(js)
  jsv[e.target.id] = e.target.value
  localStorage.setItem(js,JSON.stringify(jsv))
  if(e.target.type=="date"){
    document.getElementById(e.target.id+"_Txt").textContent = fechaForma2(e.target.value)
  }
  if(e.target.type=="number"){
    if(e.target.dataset[js]=="text"){
      jsv[e.target.id] = e.target.value
    }else{
      jsv[e.target.id] = parseFloat(e.target.value)
    }
    localStorage.setItem(js,JSON.stringify(jsv))
  }
  if(e.target.type=="option"){
    jsv[e.target.id] = e.target.value 
    localStorage.setItem(js,JSON.stringify(jsv))
  }
  if(i==true){renderVentas()}
  if(i=="init"){init_m()}
}
function checkbox(e,i){
  let js = Object.keys(e.target.dataset)[0] 
  let jsv = storageJson(js)
  jsv[e.target.id] = e.target.checked
  localStorage.setItem(js,JSON.stringify(jsv))
  if(i==true){renderVentas()}
}
function dc2(n){ return parseFloat((n).toFixed(2)) }
function dc1(n){ return parseFloat((n).toFixed(1)) }
//////////////////////// MANEJO DE FORMULARIO //////////////////////////
function json_to_from(idf,stg){
  return new Promise(function(resolve,reject){
    let js
    if(stg==undefined){js = storageJson(idf)}else{js=stg}
    const f = document.querySelectorAll('[data-'+idf+']')
    for (let i = 0; i < f.length; i++) {
      if(f[i].tagName=="INPUT"){ if(js[f[i].id]){ document.getElementById(f[i].id).value = js[f[i].id] } }
      if(f[i].type=="date"){
        if(js[f[i].id]){ 
          document.getElementById(f[i].id).value = js[f[i].id] 
          document.getElementById(f[i].id+"_Txt").textContent = fechaForma2(js[f[i].id])
        }else{
          document.getElementById(f[i].id+"_Txt").textContent = fechaActualTxt()
          document.getElementById(f[i].id).value = fecActInp
        }
      }
      if(f[i].tagName=="SELECT"){ if(js[f[i].id]){ document.getElementById(f[i].id).value = js[f[i].id] } }
      if(f[i].tagName=="IMG"){ if(js[f[i].id]){ document.getElementById(f[i].id).src = js[f[i].id] }  }
      if(f[i].tagName=="LABEL"){ if(js[f[i].id]){ document.getElementById(f[i].id).textContent = js[f[i].id] } }
      if(f[i].type=="checkbox"){ if(js[f[i].id]){ document.getElementById(f[i].id).checked = js[f[i].id] } }
      /*fecha compuesta*/
      let fc = f[i].dataset[idf]
      let fe = f[i].dataset["fechcomp"]
      if(fc=="fechComp"){
        let f = document.querySelectorAll('[data-fecha='+fe+']')
        if(js[fe]==undefined){continue}
        f[0].value = parseInt(js[fe].split("-")[2]) 
        f[1].value = js[fe].split("-")[1]
        f[2].value = js[fe].split("-")[0]
        continue
      }
      /*fecha compuesta*/
      /*secion info*/
      let set =  f[i].dataset[Object.keys(f[i].dataset)[0]]  
      if(f[i].tagName=="DIV" || f[i].tagName=="SPAN"){
        document.getElementById(f[i].id).textContent = js[f[i].id];
        if(set=="fechaForma2"){ if(js[f[i].id]){ document.getElementById(f[i].id).textContent = fechaForma2( js[(f[i]).id]) } }
        if(set=="checkbox"){
          if(js[f[i].id]){
            document.getElementById(f[i].id).textContent=f[i].dataset.check.split("_")[0] 
          }else{
            document.getElementById(f[i].id).textContent=f[i].dataset.check.split("_")[1]
          }
        }
        if(set=="fechTxtFull"){
          if(js[f[i].id]){
            document.getElementById(f[i].id).textContent = fechTxtFull( js[(f[i]).id] )  
          }
        }
      }
      /*secion info*/
    }
    resolve(true)
  })
}
function form_to_json(set){
  return new Promise(function(resolve,reject){
    const f = document.querySelectorAll('[data-'+set+']')
    let j = {}
    for (let i = 0; i < f.length; i++) {
      let id = f[i].id
      let v = f[i].value
      let t = f[i].type
      let tag = f[i].tagName
      if(t=="number"){
        if(v==""){
          if(f[i].dataset[set]=="text"){j[id]=""}else{j[id]=0}
        }else{
          if(f[i].dataset[set]=="text"){j[id]=v}else{j[id]=parseFloat(v)}
        }
      }
      if(t=="text"){j[id] = v}
      if(t=="password"){j[id] = v}
      if(t=="date"){j[id] = v}
      if(t=="checkbox"){j[id] = f[i].checked}
      if(t=="select-one"){j[id] = v}
      if(t=="email"){j[id] = v}
      if(tag=="IMG"){j[id] = f[i].src}
      if(tag=="LABEL"){j[id] = f[i].textContent}
      let fc = f[i].dataset.user
      let fe = f[i].dataset["fechcomp"]
      if(fc=="fechComp"){
        let f = document.querySelectorAll('[data-fecha='+fe+']')
        let dia = f[0].value<10?("0"+f[0].value):f[0].value;if(dia=="0"){continue}
        let mes = f[1].value
        let ano = f[2].value;if(ano==""){continue}
        let fecha = ano+"-"+mes+"-"+dia
        j[fe] = fecha
      }
      //required
      if(f[i].required){
        if(j[id]==""||j[fe]==""){
          document.getElementById(id).style.backgroundColor="rgb(255, 200, 200)"
          alert("existen datos faltantes")
          resolve(false)
        }else{
          document.getElementById(id).style.backgroundColor="rgb(255, 255, 255)"
        }
      }
      //required
    }
    resolve(j)
  })
}
//////////////////////// MANEJO DE FORMULARIO //////////////////////////
function lnk(e){ var a = document.createElement("a"); a.href = e+".html"; a.click() }
function verPdf(i){
  localStorage.setItem('idVenta',i);
  var a = document.createElement("a"); 
  a.href = location.href.split("/")[0]+"//"+(location.href.split("/")[2]).split(":")[0]+":"+window.location.port+"/pdfVenta/pdfVenta.html" 
  a.click()
}
function filtroDiaVen(){
  var a = document.createElement("a"); 
  a.href = location.href.split("/")[0]+"//"+(location.href.split("/")[2]).split(":")[0]+":"+window.location.port+"/filtroSet/filtroDiaVen.html" 
  a.click()
}
function filtroMes(){
  var a = document.createElement("a"); 
  a.href = location.href.split("/")[0]+"//"+(location.href.split("/")[2]).split(":")[0]+":"+window.location.port+"/filtroSet/filtroMes.html" 
  a.click()
}
///////////////////// FECHAS /////////////////////// 
const nombreMeses =  'Enero Febrero Marzo Abril Mayo Junio Julio Agosto Septiembre Octubre Noviembre Diciembre'.split(' ')
const nombreMesesCorto =  'Ene. Feb. Mar. Abr. May. Jun. Jul. Ago. Sep. Oct. Nov. Dic.'.split(' ')
const NombreDias= 'Domingo Lunes Martes Miércoles Jueves Viernes Sábado '.split(' ')
const nomDiaCor= 'Dom. Lun. Mar. Mié. Jue. Vie. Sáb. '.split(' ')
function dateTOtxt(tim){
  let d 
  if(tim==undefined){d = new Date()}else{d = new Date(tim)}
  let s = d.getSeconds()<10?("0"+d.getSeconds()):d.getSeconds()
  let m = d.getMinutes()<10?("0"+d.getMinutes()):d.getMinutes()
  let h = d.getHours()<10?("0"+d.getHours()):d.getHours()
  let diN = d.getDate()<10?("0"+d.getDate()):d.getDate()
  let diTc = nomDiaCor[d.getDay()]
  let diT = NombreDias[d.getDay()]
  let meN = (d.getMonth()+1)<10?("0"+(d.getMonth()+1)):(d.getMonth()+1)
  let meTc = nombreMesesCorto[d.getMonth()]
  let meT = nombreMeses[d.getMonth()]
  let ye = d.getFullYear()
  return {s,m,h,diN,diTc,diT,meN,meTc,meT,ye}
}
function timeToMesDia(t){// 1655244456367 > 20 Mayo
  let d = dateTOtxt(t);return (d.diN+" "+d.meT);
}
function timeToMesDiaShort(t){// 1655244456367 > 05 May.
  let d = dateTOtxt(t);return (d.diN+" "+d.meTc);
}
function fechaActualTxt(){// 20/May./202
  let d = dateTOtxt();return (d.diN+"/"+d.meTc+"/"+d.ye);
}
function fecActInp(){// 2023-05-24
  let d = dateTOtxt();return (d.ye+"-"+d.meN+"-"+d.diN);
}
function fechTxtFull(tim){//time 1655244456367
  let d = dateTOtxt(tim);return (d.h+":"+d.m+":"+d.s+" hrs. / "+d.diTc +" / "+d.diN+" "+d.meTc+" "+d.ye)
}
function fechaForma2(f){//2023-05-20 -> 20/May./2023
  let fc = f.split("-");return (fc[2]+"/"+nombreMesesCorto[fc[1]-1] +"/"+fc[0])
}
function timeTOinput(tim){//1655244456367 > 2023-05-24
  let d = dateTOtxt(tim);return (d.ye+"-"+d.meN+"-"+d.diN);
}
function month(){
  let d = dateTOtxt();return (d.ye+"-"+d.meN);
}
function monthTOtxt(f){
  let fc = f.split("-");return (nombreMeses[fc[1]-1] +" / "+fc[0])
}
function timToMontfYear(tim){
  let d = dateTOtxt(tim);return (d.ye+"-"+d.meN);
}
///////////////////// FECHAS /////////////////////// 
/*pantalla spiner succses contador*/
const divLoad = document.createElement("div");
divLoad.innerHTML = `
<div id="pantallaSpiner">
<div class="modalSpiner">
  <div id="spinner" class="lds-spinner">
    <div></div>
    <div></div>
    <div></div>
    <div></div>
    <div></div>
    <div></div>
    <div></div>
    <div></div>
    <div></div>
    <div></div>
    <div></div>
    <div></div>
  </div>
  <div class="conter">
    <div id="conter">.</div>
  </div>  
  <div id="cajaSuccess">
    <div class="circle">
      <div id="checkSucc" class=""></div>
    </div>
  </div> 
</div>
</div>` 
function loadData(){
  document.body.appendChild(divLoad);
  document.getElementById("pantallaSpiner").style.display = "inline-block"
  document.getElementById("spinner").style.display = "block"
} 
function successDat(r,l){
  document.getElementById("spinner").style.display = "none"
  document.getElementById("cajaSuccess").style.display= 'block';
  document.getElementById("checkSucc").classList.add('success');
  setTimeout(noSucsesDat,1000);
  if(l!=undefined){ localStorage.setItem(limp,"") } 
  if(r=="r"){ setTimeout(window.location.reload(),2500) } 
  if(r=="b"){ setTimeout(window.history.back(),3000) }
}
function noSucsesDat(){
  document.getElementById("pantallaSpiner").style.display = "none"
  document.getElementById("cajaSuccess").classList.add('desapareser');
  setTimeout(restarSucessesDat,750); 
}
function restarSucessesDat(){
  document.getElementById("cajaSuccess").style.display= 'none';
  document.getElementById("cajaSuccess").classList.remove('desapareser');
  document.getElementById("checkSucc").classList.remove('success');
}
/*pantalla spiner succses contador*/
let sincConectInd
function sincConect(){
  document.getElementById("conection").classList.remove("cloudDowRed")
  sincConectInd = setInterval(()=>{
    document.getElementById("conection").classList.toggle("cloudDowGrend")
  },500)
}
function sincConectStop(){
  clearInterval(sincConectInd);
  document.getElementById("conection").classList.add("cloudDowGrend")
}
///////////////////////////// secion manejo de tablas //////////////////////////////
function filtroBus(){
  const text = document.getElementById("buscar").value.toUpperCase()
  for (let i = 0; i < items.length; i++) {
    const txtItm = items[i].txt.toUpperCase()
    const idItm = items[i].id
    if(txtItm.indexOf(text)>-1){document.getElementById(idItm).style.display=""}else{document.getElementById(idItm).style.display = "none" }
  }
  localStorage.setItem("buscar",document.getElementById("buscar").value)
}
let listCol
function manejoColumnas(tab){
  listCol = storageJson(tab)
  const head = document.getElementById("headColm").querySelectorAll("th")
  let listCkeck = ``;
  for (let i = 0; i < head.length; i++) {
    const td = head[i];
    listCkeck += 
    `<div>
      <input onclick="togleColm('cr${i+1}','${tab}')" type="checkbox" id="cr${i+1}" >
      <label for="cr${i+1}">${td.textContent}</label>
    </div>` 
    if(listCol["cr"+(i+1)]==undefined){listCol["cr"+(i+1)] = true}
  }
  document.querySelector("#contedOcultador").innerHTML = listCkeck;
  for (const key in listCol) { document.getElementById(key).checked = listCol[key]; }
  establacerColumnas(listCol)
}
function togleColm(id,tab){
  listCol[id] = document.getElementById(id).checked
  localStorage.setItem(tab, JSON.stringify(listCol))
  establacerColumnas(listCol)
}
function establacerColumnas(listCol){
  let head = document.getElementById("headColm").querySelectorAll("th")
  for (let i = 0; i < head.length; i++) {
    listCol["cr"+(i+1)]
    head[i].style.display = listCol["cr"+(i+1)]?"":"none"
  }
  var body = document.getElementById("listaDitem").querySelectorAll("tr")
  for (let i = 0; i < body.length; i++) {
    const fila = body[i].querySelectorAll("td");
    for (let i = 0; i < fila.length; i++) {
      listCol["cr"+(i+1)]
      fila[i].style.display = listCol["cr"+(i+1)]?"":"none"
    }
  }
  let tfoot = document.getElementById("headColm").querySelectorAll("th")
  for (let i = 0; i < tfoot.length; i++) {
    listCol["cr"+(i+1)]
    tfoot[i].style.display = listCol["cr"+(i+1)]?"":"none"
  }
}
function listVer(){ document.getElementById("contedOcultador").classList.add("listVer") }
function oculVer(){ document.getElementById("contedOcultador").classList.remove("listVer") }
let asend = true
function sortTable(ord,typ,elm,arr){
  return new Promise(function(resolve,reject){
    if(ord){
      if(typ=='txt'){
        if(asend){
          arr.sort((a, b) => {
            if(a[elm] < b[elm]) return 1;
            if(a[elm] > b[elm]) return -1;
            return 0;
          })
          asend = false
        }else{
          arr.sort((a, b) => {
            if(a[elm] < b[elm]) return -1;
            if(a[elm] > b[elm]) return 1;
            return 0;
          })
          asend = true
        }  
      }else{
        if(asend){
          arr.sort(((a, b) => b[elm] - a[elm]));
          asend = false
        }else{
          arr.sort(((a, b) => a[elm] - b[elm]));
          asend = true
        }
      }
      resolve(arr)
    }else{ resolve(arr) }
  })
}
///////////////////////////// secion manejo de tablas //////////////////////////////