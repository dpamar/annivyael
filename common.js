var timeout = null;

function getParam(paramName)
{
  return ((window.location.href.split('?')[1]||'').split('&').map(x=>x.split("=")).filter(x=>x[0]==paramName)[0]||[null,null])[1];
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
    if(distance(x[0],x[1],lat,lon) < effectiveRange)
      success();
    else
      failure();
  });
}

function showMessage(msg, keepDisplayed)
{
  window.clearTimeout(timeout);
  var elem = document.getElementById('message');
  elem.innerHTML = msg;
  elem.style.display = 'inline';
  if(!keepDisplayed)
	timeout = window.setTimeout(function(){elem.style.display = 'none';}, 2000);
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}