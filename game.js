var defaultRange = 30;
var invalidPlaceErrorMessage = '<b>Non, ce n\'est pas ici...</b>';
var finalMessage = 'Je crois qu\'on est arrivé...';

var nbPlaces = places.length;

function getId()
{
  var h = window.location.href.split('?');
  if(h.length == 1)
  {
    window.location.href += '?place=0';
  }
  else
  {
    debug = getParam('debug')||0;
    return getParam('place');
  }
}

var targetLat = null;
var targetLong = null;
var hint = null;
var id = null;
var debug = 0;
window.onload = function()
{
  id = getId();
  if(id == nbPlaces)
  {
    showMessage(finalMessage, true);
    var btns = document.getElementsByTagName('input');
    for(var i=0; i<btns.length; i++)
      btns[i].disabled = 'disabled';
  }
  else if(id != undefined)
  {
    targetLat = places[id][0];
    targetLong = places[id][1];
    hint = `<i>${places[id][2]}</i>`;
    document.getElementById('photo').src = id+'.png';
  }
  if(id != undefined) 
  {
    var progress = document.getElementById('progressbar');
    progress.className = `w3-${['red', 'yellow', 'green'][~~(id * 3/(nbPlaces + 1))]}`;
    progress.style.width = ~~(id*100/nbPlaces)+'%';
  }
}

function testFind()
{
  var successFunction = ()=>window.location.href = window.location.href.replace(/place=[0-9]+/,'place='+(++id));
  if (debug)
 	  successFunction();
  else
	  isCloseTo(targetLat, targetLong, defaultRange,
    successFunction,
    ()=>showMessage(invalidPlaceErrorMessage));
}

function showDistance()
{
  getLocationAndThen(x=>showMessage(`C'est à environ ${~~distance(targetLat, targetLong, x[0], x[1])}m d'ici`));
}

function showHint()
{
  showMessage(hint);
}
