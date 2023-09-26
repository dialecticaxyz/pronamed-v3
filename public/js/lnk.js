
function lnk(e){ var a = document.createElement("a"); a.href = e+".html"; a.click() }
function ventaPdf(){
  var a = document.createElement("a"); 
  a.href = location.href.split("/")[0]+"//"+(location.href.split("/")[2]).split(":")[0]+":"+window.location.port+"/ventaVer/ventaPdf.html" 
  a.click()
}
function ventaInfo(){
  var a = document.createElement("a"); 
  a.href = location.href.split("/")[0]+"//"+(location.href.split("/")[2]).split(":")[0]+":"+window.location.port+"/ventaVer/ventaInfo.html" 
  a.click()
}
function descargaVentas(t){
  localStorage.setItem("tipoDescarga",t)
  var a = document.createElement("a"); 
  a.href = location.href.split("/")[0]+"//"+(location.href.split("/")[2]).split(":")[0]+":"+window.location.port+"/utilidades/descargaVentas.html" 
  a.click()
}
function filtroDiaVen(){
  var a = document.createElement("a"); 
  a.href = location.href.split("/")[0]+"//"+(location.href.split("/")[2]).split(":")[0]+":"+window.location.port+"/filtroSet/filtroDiaVen.html" 
  a.click()
}
function filtroTabVendedor(){
  var a = document.createElement("a"); 
  a.href = location.href.split("/")[0]+"//"+(location.href.split("/")[2]).split(":")[0]+":"+window.location.port+"/filtroSet/filtroTabVendedor.html" 
  a.click()
}
function filtroMes(){
  var a = document.createElement("a"); 
  a.href = location.href.split("/")[0]+"//"+(location.href.split("/")[2]).split(":")[0]+":"+window.location.port+"/filtroSet/filtroMes.html" 
  a.click()
}
function filtroMesOnly(){
  var a = document.createElement("a"); 
  a.href = location.href.split("/")[0]+"//"+(location.href.split("/")[2]).split(":")[0]+":"+window.location.port+"/filtroSet/filtroMesOnly.html" 
  a.click()
}