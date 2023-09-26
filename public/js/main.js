function loadScript(url){
  return new Promise(function(resolve,reject){  
		var style = document.getElementsByTagName('style')[0];
    var head = document.getElementsByTagName('head')[0];
    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = url;
    script.addEventListener("load",(event)=>{resolve()})
    head.insertBefore(script, style);
  }) 
}
function loadCSS(url){
  return new Promise(function(resolve,reject){  
		var style = document.getElementsByTagName('style')[0];
    var head = document.getElementsByTagName('head')[0];
		var link = document.createElement('link');
		link.rel = "stylesheet";
		link.type = "text/css";
		link.href = url;
    link.addEventListener("load",(event)=>{resolve()})
    head.insertBefore(link, style);
  }) 
}
let urlRef = location.href.split("/")[0]+"//"+(location.href.split("/")[2]).split(":")[0]+":"+window.location.port
let archivosCSS= [
	"menu.css",
	"estilos.css"
]
let archivosJS= [
  "utilidades.js",
  "tabla.js",
  "fecha.js",
  "lnk.js",
	"loadAnimacion.js",
	"localStorage.js",
  "formulario.js",
	"apiBakend.js",
	"indexedDB.js",
]
async function startDB(){
	for (let i = 0; i < archivosCSS.length; i++) {
		await loadCSS(urlRef+"/css/"+archivosCSS[i])
	}
	for (let i = 0; i < archivosJS.length; i++) {
		await loadScript(urlRef+"/js/"+archivosJS[i])
	}

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
;