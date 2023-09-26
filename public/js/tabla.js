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

function limpiarBus(){
  document.getElementById("buscar").value = ""
  renderTab() 
}