function downloadTxt(arr,txt){
  return new Promise(function(resolve,reject){  
    let jsonTxt = JSON.stringify(arr); 
    let data = new Blob([jsonTxt], {type: 'text/plain'});
    textFile = window.URL.createObjectURL(data);
    let a = document.createElement("a");
    a.download = txt+".txt"
    a.href = textFile;
    a.click()
  }) 
}
