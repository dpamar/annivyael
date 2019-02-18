var smoothLocationIterationCount = 5;
var smoothLocationIterationDelay = 100;

var currentPlaces = eval(atob(getParam("places")||'W10='));

window.onload = function()
{
	showMessage('var places = ['
		+ currentPlaces
			.map(x=>`<br/>&nbsp;&nbsp;&nbsp;&nbsp;[${x[0]}, ${x[1]}, '${x[2].replace(/'/g,"\\'")}']`)
			.join(',')
		+'<br/>];<br/>//Resume game designer URL: '+generateUrl(), true);
}

var currentCount = 0;
var currentLat = 0;
var currentLong = 0;

function addPlace()
{
	if(currentCount == smoothLocationIterationCount)
	{
		addPlace_final();
		return;
	}
	getLocationAndThen(async (coords)=>
	{
		currentCount++;
		currentLat += coords[0];
		currentLong += coords[1];
		await sleep(smoothLocationIterationDelay);
		addPlace();
	});
}

function addPlace_final()
{
	currentLat /= currentCount;
	currentLong /= currentCount;
	var hint = prompt('Indice ? ');
	currentPlaces.push([currentLat, currentLong, hint]);
	window.location.href = generateUrl();
}

function generateUrl()
{
	var param = '['
		+ currentPlaces
			.map(x=>`[${x[0].toFixed(6)}, ${x[1].toFixed(6)}, '${x[2].replace(/'/g,"\\'")}']`)
			.join(',')
		+ ']';
	return window.location.href.split('?')[0]+'?places='+btoa(param);
}