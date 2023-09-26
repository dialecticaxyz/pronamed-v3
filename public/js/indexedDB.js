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
