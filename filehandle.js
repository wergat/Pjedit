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
 $id('phases').innerHTML = $id('phases').innerHTML + "<fieldset id='fieldsetPhase"+i+"'><legend>Phase "+i+"</legend><div class='phaseBox' id='phases"+i+"' ondrop='drop(event)' ondragover='allowDrop(event)'></div></fieldset>";
 
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
	$id('phases').innerHTML = $id('phases').innerHTML + "<fieldset><legend>Phase "+i+"</legend><div class='phaseBox' id='phases"+i+"' ondrop='drop(event)' ondragover='allowDrop(event)'></div></fieldset>";
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
    }
   }else{
    if(upperKeyName=="resources"){
     $id('resourcesData').innerHTML = $id('resourcesData').innerHTML + "<div>"+key+"<input id='resourceInput_"+key+"' type='text' name='"+key+"' value='"+array[key]+"'></div>"
    }else{
     if(key=="group"){
      addToPhase(array[key],"<div class='event "+upperUpperKeyName+"'>"+ upperUpperKeyName + " (ID "+ upperKeyName +")</div>") 
     }else{		
	 
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
       $id('data').innerHTML = $id('data').innerHTML + '<div> '+ space + key +' { '+ (array[key].length) +' } </div>'
	drawDataToDiv(array[key],(space+"&nbsp;|&nbsp;"),key,upperKeyName)
   }else{
	$id('data').innerHTML = $id('data').innerHTML + '<div> '+ space + key +' [ '+ Object.size(array[key]) +' ] </div>'
    drawDataToDiv(array[key],(space+"&nbsp;|&nbsp;"),key,upperKeyName)
   }
  }else{
   if(upperKeyName=="resources"){
	$id('resources').innerHTML = $id('resources').innerHTML + "<div>" + key + ":" + array[key] + "</div>"
   }else{
    if(key=="group"){
	 addToPhase(array[key],"<div>"+ upperUpperKeyName + " (ID "+ upperKeyName +")</div>") 
    }else{		
     $id('data').innerHTML = $id('data').innerHTML + '<div> '+ space + key +' is a '+ (typ) +' ['+ array[key] +']</div>'
	}
   }
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
//drawDataToDiv(obj,"",[(saves.length-1)])
  }
  reader.readAsText(file);
 }else{alert("The file '"+file.name+"' is not a valid file to use for this editor!")}
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