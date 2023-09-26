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
