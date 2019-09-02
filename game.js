var defaultRange = 30;
var invalidPlaceErrorMessage = '<b>Non, ce n\'est pas ici...</b>';
var finalMessage = 'Je crois qu\'on est arrivé...';

var nbPlaces = places.length;

function getId()
{
  var h = window.location.href.indexOf('?');
  reverse = getParam('reverse')||0;
  debug = getParam('debug')||0;
  var result = getParam('place');
  if(!result)
  {
    window.location.href += (h == -1 ? '?' : '&') + 'place=' + (reverse ? nbPlaces - 1 : 0);
  }
  return result;
}

var targetLat = null;
var targetLong = null;
var hint = null;
var id = null;
var debug = 0;
var reverse = 0;
window.onload = function()
{
  id = getId();
  if(id == nbPlaces || id == -1)
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
  var successFunction = ()=>window.location.href = window.location.href.replace(/place=[0-9]+/,'place='+(reverse?--id:++id));
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
