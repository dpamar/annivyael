var places = [
	[45.181892, 5.722390, 'Vers la caserne de Bonne'],
	[45.184168, 5.722311, 'En allant vers l\'école'],
	[45.185029, 5.723160, 'Piscine...'],
	[45.185624, 5.722760, 'De l\'autre côté de la rue'],
	[45.186533, 5.723624, 'En avançant dans la ruelle'],
	[45.186532, 5.722804, 'A gauche'],
	[45.187176, 5.722497, 'On peut demander de l\'aide aux gens'],
	[45.188017, 5.721318, 'En revenant sur la grande avenue'],
	[45.187903, 5.719111, 'Vers le tramway'],
	[45.183371, 5.718063, 'Direction la Makolette'],
	[45.182770, 5.717695, 'C\'est très grand !'],
	[45.182149, 5.717807, 'Derrière la Makolette'],
	[45.180376, 5.719218, 'Par dessus le pont'],
	[45.180516, 5.722224, 'Retour à la case départ ???']
];
var defaultRange = 30;

var nbPlaces = places.length;

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
		hint = 'Je crois qu\'on est arrivé...';
		showHint();
	}
	else if(id != undefined)
	{
		targetLat = places[id][0];
		targetLong = places[id][1];
		hint = places[id][2];
		document.getElementById('photo').src = id+'.png';
	}
	if(id != undefined) 
	{
		var progress = document.getElementById('progressbar');
		progress.className = `w3-${['red', 'yellow', 'green'][~~(id/5)]}`;
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
		err => alert(`ERREUR (${err.code}): ${err.message}`),
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
		()=>alert('Non, ce n\'est pas ici...'));
}

function showDistance()
{
	getLocationAndThen(x=>alert(`c'est à environ ${~~distance(targetLat, targetLong, x[0], x[1])}m d'ici`));
}

function showHint()
{
	var hintElem = document.getElementById('hint');	
	hintElem.innerText = hint;
	hintElem.style.display = 'inline';
}
