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
