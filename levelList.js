levelListOpen = false

function Side_Change(){
 if(levelListOpen){levelListOpen = false}else{levelListOpen = true}
 if(levelListOpen){
  document.getElementById("LevelList").style.left = "0px";
  document.getElementById("LevelListButton").style.left = "308px";
  document.getElementById("LevelListButton").style.borderRadius = "10px 0px 0px 10px";
  document.getElementById("LevelListButton").innerHTML = "&laquo;";
 }else{
  if(loaded<0){return;}
  document.getElementById("LevelList").style.left = "-325px";
  document.getElementById("LevelListButton").style.left = "0px";
  document.getElementById("LevelListButton").style.borderRadius = "0px 10px 10px 0px";
  document.getElementById("LevelListButton").innerHTML = "&raquo;";
 }
}


function allowDrop(ev) {
 ev.preventDefault();
}

function drag(ev) {
 ev.dataTransfer.setData("text", ev.target.id);
 document.getElementById("newPhase").style.display = "block"
 document.getElementById("phasePaperbin").style.display = "block"
}

function stopDrag(){
 document.getElementById("newPhase").style.display = "none"	
 document.getElementById("phasePaperbin").style.display = "none"	
}

function drop(ev) {
 ev.preventDefault();
 var data = ev.dataTransfer.getData("text");
 var target = ev.target
 if(target.className!="phaseBox"){return;}
	 
 if(target.id=="newPhasebox"){
  var newTarget = addNewPhaseBox()
  target = newTarget
 }
 if(target.id!="phaseTrashBox"){
  target.appendChild(document.getElementById(data));
 }else{
  var element = document.getElementById(data); 
  element.parentNode.removeChild(element);
 }
 //checkForEmptyPhases()
}

