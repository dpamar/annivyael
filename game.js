var defaultRange = 30;
var invalidPlaceErrorMessage = '<b>Non, ce n\'est pas ici...</b>';
var finalMessage = 'Je crois qu\'on est arrivé...';

var nbPlaces = places.length;
var timeout = null;

function getParam(paramName)
{
  return (window.location.href.split('?')[1].split('&').map(x=>x.split("=")).filter(x=>x[0]==paramName)[0]||[null,null])[1];
}

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
    showMessage(finalMessage);
    window.clearTimeout(timeout);
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

function degreesToRadians(degrees) {
  return degrees * Math.PI / 180;
}

function distance(lat1, lon1, lat2, lon2) {
  var earthRadiusM = 6371000;

  var dLat = degreesToRadians(lat2-lat1);
  var dLon = degreesToRadians(lon2-lon1);

  lat1 = degreesToRadians(lat1);
  lat2 = degreesToRadians(lat2);

  var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
          Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) * Math.cos(lat2); 
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  return earthRadiusM * c;
}

var options = {
  enableHighAccuracy: true,
  timeout: 5000,
  maximumAge: 0
};

function getLocationAndThen(doThis)
{
  navigator.geolocation.getCurrentPosition(
    pos => doThis([pos.coords.latitude, pos.coords.longitude, pos.coords.accuracy]),
    err => showMessage(`ERREUR (${err.code}): ${err.message}`),
    options);
}

function isCloseTo(lat, lon, range, success, failure)
{
  getLocationAndThen(x=>
  {
    var effectiveRange = x[2];
    if(effectiveRange < range) effectiveRange = range;
    if(debug) effectiveRange = 1000000;
    if(distance(x[0],x[1],lat,lon) < effectiveRange)
      success();
    else
      failure();
  });
}

function testFind()
{
  isCloseTo(targetLat, targetLong, defaultRange,
    ()=>window.location.href = window.location.href.replace(/place=[0-9]+/,'place='+(++id)),
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

function showMessage(msg)
{
  window.clearTimeout(timeout);
  var elem = document.getElementById('message');
  elem.innerHTML = msg;
  elem.style.display = 'inline';
  timeout = window.setTimeout(function(){elem.style.display = 'none';}, 2000);
}
