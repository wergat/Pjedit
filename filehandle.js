/*
filedrag.js - HTML5 File Drag & Drop demonstration
Featured on SitePoint.com
Developed by Craig Buckler (@craigbuckler) of OptimalWorks.net
*/

//(function() {
 var saves = [];
 loaded = -1
 var phases = []
 var phaseCount = 0
 
function clearBoard(){
 //phases
 phases = []
 $id('phases').innerHTML = ""
 $id('resourcesData').innerHTML = ""
 $id('anchorsData').innerHTML = ""
 $id('terrainsData').innerHTML = ""
 $id('vehicleEventsData').innerHTML = ""
 $id('shipEventsData').innerHTML = ""
 $id('bigDataBox').style.display = "initial"
}

function showClass(className){
 var x = document.getElementsByClassName(className);
 for (i=0;i<x.length; i++) { 
  x[i].style.background = "#9d9";
 }  
}

function hideClass(className){
 var x = document.getElementsByClassName(className);
 for (i=0;i<x.length; i++) { 
  x[i].style.background = "rgba(0,0,0,0)";
 }  
}

function addNewNPAPB(){
 $id('phases').innerHTML = $id('phases').innerHTML + "<fieldset id='newPhase'><legend>New Phase</legend><div class='phaseBox' id='newPhasebox' ondrop='drop(event)' ondragover='allowDrop(event)'></div></fieldset>";
 $id('phases').innerHTML = $id('phases').innerHTML + "<fieldset id='phasePaperbin'><legend>Delete Event</legend><div class='phaseBox' id='phaseTrashBox' ondrop='drop(event)' ondragover='allowDrop(event)'></div></fieldset>";
}

function loadLevel(levelID){
 clearBoard()
 if(loaded>=0){
  $id('levelButton_selected').setAttribute("id","levelButton"+loaded);
 }
 loadLevelData(saves[levelID]);
 loaded = levelID;
 $id('levelButton'+loaded).setAttribute("id","levelButton_selected");
 addNewNPAPB()
 $id('LevelName').innerHTML = "<p><strong>" + saves[levelID]["fileName"] + "</strong><br><i><input id='descriptionInput' type='text' name='descriptionInput' value='"+ saves[levelID]["description"] +"'></i></p>"
 Side_Change()
}

function checkForEmptyPhases(){
 var i = 0
 while(phases[i]==true){i++;}
 i--;
 while(document.getElementById("phases"+i).childNodes.length>0 && i>0){
  i--;
  var element = $id("fieldsetPhase"+i);
  element.parentNode.removeChild(element);
  phaseCount--;
 }
}

function addNewPhaseBox(){
 // Add new Phase
 var i = 0
 while(phases[i]==true){i++;}
 phases[i] = true
 $id('phases').innerHTML = $id('phases').innerHTML + "<fieldset id='fieldsetPhase"+i+"'><legend><a>Phase "+i+"</a></legend><div class='phaseBox' id='phases"+i+"' ondrop='drop(event)' ondragover='allowDrop(event)'></div></fieldset>";
 
 //Remove old newPhase/paperbin
 var element = $id("newPhase"); element.parentNode.removeChild(element);
 var element = $id("phasePaperbin"); element.parentNode.removeChild(element);
 
 //Add new newPhase/paperbin
 addNewNPAPB()
 return $id('phases'+i)
}
 
 // getElementById
function $id(id) {
 return document.getElementById(id);
}
 
function addToPhase(pID,text){
 if(phases[pID]!=true){
  for (i=0;i<=pID; i++) { 
   if(phases[i]!=true){
    phases[i]=true;
	$id('phases').innerHTML = $id('phases').innerHTML + "<fieldset><legend><a class='hoverSee EID"+i+"' onmouseover='showClass(\"EID"+i+"\")' onmouseout='hideClass(\"EID"+i+"\")'>Phase "+i+"</a></legend><div class='phaseBox' id='phases"+i+"' ondrop='drop(event)' ondragover='allowDrop(event)'></div></fieldset>";
   }
  }
 }
 phaseCount++
 $id('phases'+pID).innerHTML = $id('phases'+pID).innerHTML + "<div class='eventBox' draggable='true' ondragend='stopDrag()' ondragstart='drag(event)' id='phasePart"+phaseCount+"'>" + text +"</div>"
}

Object.size = function(obj) {
 var size = 0, key;
 for (key in obj) {
  if (obj.hasOwnProperty(key)) size++;
 }
 return size;
};

// output information
function AddFile(msg) {
 var m = $id("levels");
 m.innerHTML = m.innerHTML + "<div id='levelButton"+(saves.length-1)+"' onclick='loadLevel("+(saves.length-1)+")'>" + msg + "</div>";
}

 // file drag hover
function FileDragHover(e) {
 e.stopPropagation();
 e.preventDefault();
 e.target.className = (e.type == "dragover" ? "hover" : "");
}

function catchFileAnywhere(e){
 FileDragHover(e)
 levelListOpen = false
 Side_Change()
 $id('filedrag').innerHTML = "!!! DROP FILES HERE !!!"
 $id('filedrag').className = "hover"
}

// file selection
function FileSelectHandler(e) {
 $id('filedrag').innerHTML = "or drop files here"
 // cancel event and hover styling
 FileDragHover(e);
 // fetch FileList object
 var files = e.target.files || e.dataTransfer.files;
 // process all File objects
 for (var i = 0, f; f = files[i]; i++) {
  ParseFile(f,i);
 }
}

function loadLevelData(array,upperKeyName,upperUpperKeyName){
 for(var key in array) {
  if(array.hasOwnProperty(key)) { //to be safe
   if(key=="normalized"||key=="magnitude"||key=="sqrMagnitude"){continue;}
   var typ = typeof array[key]
   if(typ=="object"){
    if((typeof (array[key].length)) != "undefined"){
     loadLevelData(array[key],key,upperKeyName)
    }else{
     loadLevelData(array[key],key,upperKeyName)
	 if(upperKeyName=="anchors"){
	  $id('anchorsData').innerHTML = $id('anchorsData').innerHTML + "<div>#"+key+" at (<input id='anchorsInputX"+key+"' type='text' name='"+key+"' value='"+array[key]["pos"]["x"]+"'>/<input id='anchorsInputY"+key+"' type='text' name='"+key+"' value='"+array[key]["pos"]["y"]+"'>)</div>"
	 }else if(upperKeyName=="terrains"){
      $id('terrainsData').innerHTML = $id('terrainsData').innerHTML + "<div>#"+key+"</a> w/ id "+array[key]["terrainType"]+" ("+array[key]["layoutName"]+") at (<input id='terrainsInputX"+key+"' type='text' name='"+key+"' value='"+array[key]["pos"]["x"]+"'>/<input id='terrainsInputY"+key+"' type='text' name='"+key+"' value='"+array[key]["pos"]["y"]+"'>)</div>"		 
	 }else if(upperKeyName=="vehicleEvents"){
      $id('vehicleEventsData').innerHTML = $id('vehicleEventsData').innerHTML + "<div class='"+((key%2==0) ? "bright" : "dark")+"'><a class='vehicleEvents"+key+"' onmouseover='showClass(\"vehicleEvents"+ key +"\")' onmouseout='hideClass(\"vehicleEvents"+ key +"\")'>#"+key+"</a> of type "+array[key]["vehicleType"]+" at (<input id='vehicleEventsInputX"+key+"' type='text' name='"+key+"' value='"+array[key]["pos"]["x"]+"'>/<input id='vehicleEventsInputY"+key+"' type='text' name='"+key+"' value='"+array[key]["pos"]["y"]+"'>) <a class='hoverSee EID"+array[key]["group"]+"' onmouseover='showClass(\"EID"+array[key]["group"]+"\")' onmouseout='hideClass(\"EID"+array[key]["group"]+"\")'>EID "+array[key]["group"]+"</a>, <a class='hoverSee TG"+array[key]["targetGroup"]+"' onmouseover='showClass(\"TG"+array[key]["targetGroup"]+"\")' onmouseout='hideClass(\"TG"+array[key]["targetGroup"]+"\")'> TG "+array[key]["targetGroup"]+"</a>; speed <input id='vehicleEventsInputSpeed"+key+"' type='text' name='"+key+"' value='"+array[key]["speedMultiplier"]+"'></div>"		 
	 }else if(upperKeyName=="shipEvents"){
      $id('shipEventsData').innerHTML = $id('shipEventsData').innerHTML + "<div><a class='shipEvents"+key+"' onmouseover='showClass(\"shipEvents"+ key +"\")' onmouseout='hideClass(\"shipEvents"+ key +"\")'>#"+key+"</a> type "+array[key]["shipType"]+" at (<input id='shipEventsInputX"+key+"' type='text' name='"+key+"' value='"+array[key]["pos"]["x"]+"'>/<input id='shipEventsInputY"+key+"' type='text' name='"+key+"' value='"+array[key]["pos"]["y"]+"'>) <a class='hoverSee EID"+array[key]["group"]+"' onmouseover='showClass(\"EID"+array[key]["group"]+"\")' onmouseout='hideClass(\"EID"+array[key]["group"]+"\")'>EID "+array[key]["group"]+"</a></div>"		  
	 }else if(upperKeyName=="pistonEvents"){
      $id('pistonEventsData').innerHTML = $id('pistonEventsData').innerHTML + "<div><a class='pistonEvents"+key+"' onmouseover='showClass(\"pistonEvents"+ key +"\")' onmouseout='hideClass(\"pistonEvents"+ key +"\")'>#"+key+"</a> triggers at <a class='hoverSee EID"+array[key]["group"]+"' onmouseover='showClass(\"EID"+array[key]["group"]+"\")' onmouseout='hideClass(\"EID"+array[key]["group"]+"\")'>phase "+array[key]["group"]+"</a></div>"		  
	 }
	 
    }
   }else{
    if(upperKeyName=="resources"){
     $id('resourcesData').innerHTML = $id('resourcesData').innerHTML + "<div>"+key+"<input id='resourceInput_"+key+"' type='text' name='"+key+"' value='"+array[key]+"'></div>"
    }else{
     if(key=="group"){
      addToPhase(array[key],"<div class='event "+upperUpperKeyName+"'>"+ upperUpperKeyName + " (<a class='"+ upperUpperKeyName + upperKeyName +"' onmouseover='showClass(\""+ upperUpperKeyName + upperKeyName +"\")' onmouseout='hideClass(\""+ upperUpperKeyName + upperKeyName +"\")'>UUID "+ upperKeyName +"</a>)</div>") 
	 }
    }
   }
  }
 }  
}

function drawDataToDiv(array,space,upperKeyName,upperUpperKeyName){
 for(var key in array) {
  if(array.hasOwnProperty(key)) { //to be safe
   if(key=="normalized"||key=="magnitude"||key=="sqrMagnitude"){continue;}
   var typ = typeof array[key]	  
   if(typ=="object"){
    if((typeof (array[key].length)) != "undefined"){
     $id('saveData').innerHTML = $id('saveData').innerHTML + '<div> '+ space + key +' { '+ (array[key].length) +' } </div>'
	 drawDataToDiv(array[key],(space+"&nbsp;|&nbsp;"),key,upperKeyName)
    }else{
	 $id('saveData').innerHTML = $id('saveData').innerHTML + '<div> '+ space + key +' [ '+ Object.size(array[key]) +' ] </div>'
     drawDataToDiv(array[key],(space+"&nbsp;|&nbsp;"),key,upperKeyName)
    }
   }else{
    $id('saveData').innerHTML = $id('saveData').innerHTML + '<div> '+ space + key +' is a '+ (typ) +' ['+ array[key] +']</div>'
   }
  }
 }
}

// output file information
function ParseFile(file,fileID) {
 if (file.name.split('.').pop() == "pbl") {
  var reader = new FileReader();
  reader.onload = function(e) {
   // get file content
  var text = e.target.result;
  var obj = JSON.parse(text);
  saves.push(obj);
  saves[(saves.length-1)]["fileName"] = file.name
  AddFile("<p>#"+(saves.length)+" <strong>" + file.name + "</strong><br><i>"+ obj["description"] +"</i></p>");
  drawDataToDiv(obj,"",[(saves.length-1)])
 }
 reader.readAsText(file);
 }else{
  alert("The file '"+file.name+"' is not a valid file to use for this editor!")
 }
}

// initialize
function Init() {
 var fileselect = $id("fileselect"),
 filedrag = $id("filedrag"),
 catchFile = $id("catchFile"),
 submitbutton = $id("submitbutton");
 
 // file select
 fileselect.addEventListener("change", FileSelectHandler, false);
  // is XHR2 available?
 var xhr = new XMLHttpRequest();
 if (xhr.upload) {
  // file drop
  filedrag.addEventListener("dragover", FileDragHover, false);
  filedrag.addEventListener("dragleave", FileDragHover, false);
  filedrag.addEventListener("drop", FileSelectHandler, false);
  filedrag.style.display = "block";
  
  catchFile.addEventListener("dragover", catchFileAnywhere, false);
  catchFile.addEventListener("dragleave", catchFileAnywhere, false);
  
  // remove submit button
  submitbutton.style.display = "none";
 }
}
 // call initialization file
if (window.File && window.FileList && window.FileReader) {Init();}
//})();