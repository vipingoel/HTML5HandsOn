function setTheme(color, isNewTheme)
{
    //get theme color from storage if not setting a new theme
    if(isNewTheme)
    {
	if(localStorage)
	{
	    localStorage.themeColor = color;
	}
    }
    else
    {
	if(localStorage)
	{
	    if(localStorage.themeColor != null && localStorage.themeColor != "undefined")
	    {
		color = localStorage.themeColor;
		 //set color to input field
		document.getElementById("inputThemeColor").value = color;
		 
	    }
	}
    }
    
    $(document).ready(function(){
        $("section").css("border-color", color);
        $("header").css("background-color", color);
        $("footer").css("background-color", color);
        $("body").css("color", color);
        $("nav a").css("background-color", color);
    });
}

/*methods for online storage*/
function setOnlineStatus()
{
    onlineStatus = document.getElementById("onlineStatus");
    checkOnlineStatus();
    setInterval(checkOnlineStatus, 1000);
}

function checkOnlineStatus()
{
    if(navigator.onLine)
    {
        onlineStatus.innerHTML = "Online";
        onlineStatus.className = "online"
    }
    else
    {
        onlineStatus.innerHTML = "Offline";
        onlineStatus.className = "offline"
    }
}



function setSessionStartTime()
{
    if(window.sessionStorage)
    {
	var today = new Date();
	var sessionStartTime = document.getElementById("sessionStartTime");

	if(window.sessionStorage.startTime == null || window.sessionStorage.startTime == "undefined")
	{
	    window.sessionStorage.startTime = today.toTimeString();
	}
	
	if(window.sessionStorage.startTime != null && window.sessionStorage.startTime != "undefined")
	{
	    sessionStartTime.innerHTML = "Your current session started at " + window.sessionStorage.startTime.toString() + "&nbsp&nbsp&nbsp&nbsp";
	}	
    }
}

/*Methods to check geolocation position*/
function checkGeolocation()
{
    if(navigator.geolocation)
    {
	//document.write("Geolocation is supported (HTML5)</br>");
	navigator.geolocation.getCurrentPosition(successGeo, failGeo);
	
    }
    else
    {
	document.write("Geolocation is note supported.</br>");
    } 
}


function pointLocation(latitude, longitude)
{
    var mapOptions = {
	center: new google.maps.LatLng(latitude , longitude),
	zoom: 8,
	mapTypeId: google.maps.MapTypeId.ROADMAP
      };
      var map = new google.maps.Map(document.getElementById("divGeoLocationFacility"),
	  mapOptions);
      
      var markerOptions = {
	  position:new google.maps.LatLng(latitude , longitude),
	  map:map,
	  animation:google.maps.Animation.DROP,
	  title:"Facility location"
      }
      var marker = new google.maps.Marker(markerOptions);
}

function pathConnector(latitudeFrom, longitudeFrom, latitudeTo, longitudeTo)
{
	var latitudeCenter = (latitudeFrom + latitudeTo)/2;
	var longitudeCenter = (longitudeFrom + longitudeTo)/2;
	
    var mapOptions = {
		center: new google.maps.LatLng(latitudeCenter, longitudeCenter),
		zoom: 3,
		mapTypeId: google.maps.MapTypeId.ROADMAP
      };
	  
    var map = new google.maps.Map(document.getElementById("divGeoLocationPipeline"), mapOptions);
    
	var iconBase = 'http://maps.google.com/mapfiles/';
	
	var markerOptionsFrom = {
	  position:new google.maps.LatLng(latitudeFrom , longitudeFrom),
	  map:map,
	  animation:google.maps.Animation.DROP,
	  title:"Pipeline From",
	  icon: iconBase + "dd-start.png"
	}
	var markerFrom = new google.maps.Marker(markerOptionsFrom);
	  
	var markerOptionsTo = {
	  position:new google.maps.LatLng(latitudeTo, longitudeTo),
	  map:map,
	  animation:google.maps.Animation.DROP,
	  title:"Pipeline To",
	  icon: iconBase + "dd-end.png"
	}
	var markerTo = new google.maps.Marker(markerOptionsTo);
	  	  		  
	var pathCoordinates = [
		new google.maps.LatLng(latitudeFrom, longitudeFrom),
		new google.maps.LatLng(latitudeTo, longitudeTo),
		];

	var polyline = new google.maps.Polyline({
		path: pathCoordinates,
		strokeColor: "#FF4500",
		strokeOpacity: 1.0,
		strokeWeight: 2
		});
	polyline.setMap(map);
}


function successGeo(position)
{
    var mapOptions = {
	center: new google.maps.LatLng(position.coords.latitude , position.coords.longitude),
	zoom: 8,
	mapTypeId: google.maps.MapTypeId.ROADMAP 
      };
      var map = new google.maps.Map(document.getElementById("divGeoLocation"),
	  mapOptions);
      
      var markerOptions = {
	  position:new google.maps.LatLng(position.coords.latitude , position.coords.longitude),
	  map:map,
	  animation:google.maps.Animation.DROP,
	  title:"This is your current location"
      }
      var marker = new google.maps.Marker(markerOptions);
}

function failGeo(error)
{
    document.getElementById("divGeoLocation").innerHTML += "Current position could not be found." + getPositionErrorText(error);
}
/*end of methods for geolocation API*/


/*methods for video elements*/
var video;
var videoTimeline;
function loadVideoControls()
{
     video = document.getElementsByTagName("video")[0];
     videoTimeline = document.getElementById("videoTimeline");
     videoTimeline.addEventListener('change', changeTime, false);
     video.addEventListener('timeupdate', updateTime, false);
     video.addEventListener('durationchange', initvideoTimeline, false);
}

function initvideoTimeline()
{
  videoTimeline.min = 0;
  videoTimeline.max = video.duration;
  
  if(Modernizr.video)
    { 
        var videos = document.getElementsByTagName("video");
        var i = 0;
	
        for(i=1; i < videos.length; i++)
        {
	    videos[i].currentTime = video.duration *(i/videos.length);
        }
    }
}

function changeTime()
{
  video.currentTime = videoTimeline.value;
  
    if(Modernizr.video)
    { 
        var videos = document.getElementsByTagName("video");
        var i = 0;
	
        for(i=1; i < videos.length; i++)
        {
	    videos[i].currentTime = (video.currentTime + video.duration *(i/videos.length)) < video.duration?
		(video.currentTime + video.duration *(i/videos.length)):
		(video.currentTime + video.duration *(i/videos.length)) % video.duration;
        }
    }
}

function updateTime()
{
    if(Modernizr.video)
    {
	videoTimeline.min = video.startTime;
	videoTimeline.max = video.duration;
	videoTimeline.value = video.currentTime;
    }
}


function playVideos()
{
    var playButton = document.getElementById("playButton");
        
    if(playButton.value == "Play")
    {
        playButton.value = "Pause";
    }
    else
    {
        playButton.value = "Play";
    }
    
    if(Modernizr.video)
    { 
        var videos = document.getElementsByTagName("video");
        var i = 0;
	
        for(i=0; i < videos.length; i++)
        {
            if(playButton.value == "Play")
            {
                videos[i].pause();
            }
            else
            {
                videos[i].play();
            }
        }
    }
    else
    {
        alert("Video could not play as it is not supported in your browser.");
    }
}
/*end of video methods*/


/*demo of structural elements*/
function showStructuralElements(isCalledFirst)
{
    var arrayStructuralTags = ["header", "footer", "nav", "section", "article", "aside",
			       "div", "span", "table", "li", "ul", "ol", "body", "a", "td", "tr"];
    
    var ul = document.createElement("div");
    document.getElementById("divStructuralElements").appendChild(ul);
    
    var i=0;	
    for(i=0; i<arrayStructuralTags.length; i++)
    {
	var li = document.createElement("a");
	li.setAttribute('onmouseover', 'addStyleToStructuralElements(this)');
	li.setAttribute('onmouseout', 'removeStyleToStructuralElements(this)');
	li.innerHTML = arrayStructuralTags[i];
	li.className = "structuralElementsList";
	ul.appendChild(li);
    }  
}

function addStyleToStructuralElements(source)
{
    $(source.innerHTML).css("opacity", "0.5");
    $(source.innerHTML).css("border-style", "ridge");
    $(source.innerHTML).css("border-color", "black");
}

function removeStyleToStructuralElements(source)
{
    $(source.innerHTML).css("opacity", "1");
    $(source.innerHTML).css("border-style", "none");
}


/*methods to submit form and get response*/
/*
function sendForm(form)
{
    //var formData = new FormData(form);
  
    //formData.append('secret_token', '1234567890'); // Append extra data before send.
    debugger;
    xmlHTTPReq = new XMLHttpRequest();
    
    xmlHTTPReq.open('POST', form.action, true);
    xmlHTTPReq.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    
    xmlHTTPReq.onreadystatechange = function() {
		debugger;
		if(xmlHTTPReq.readyState == 4 && xmlHTTPReq.status == 200)
		{
		    var response = xmlHTTPReq.responseXML;
		}
	    };
  
    xmlHTTPReq.send();
    return false; // Prevent page from submitting.
}


function callAjax(form, target, method)
{
    debugger;
  params = 'q=' + encodeURIComponent(form.input.value) + '&target=' + target + '&method=' + method;
  return loadXMLDoc('http://localhost/placeOrderService/PlaceOrderService.asmx/PlaceOrder', params);
}

var xmlHTTPReq;

function loadXMLDoc(url, params)
{
    debugger;
    if(window.XMLHttpRequest)
    {
	try
	{
	      xmlHTTPReq = new XMLHttpRequest();
	}
	catch(e)
	{
	      xmlHTTPReq = false;
	}
    }
    else if(window.ActiveXObject)
    {
	try
	{
	    xmlHTTPReq = new ActiveXObject("Msxml2.XMLHTTP");
	}
	catch(e)
	{
	    try
	    {
		xmlHTTPReq = new ActiveXObject("Microsoft.XMLHTTP");
	    }
	    catch(e) {
		xmlHTTPReq = false;
	    }
	}
    }
    
    if(xmlHTTPReq)
    {
	xmlHTTPReq.onreadystatechange = processReqChange;
	xmlHTTPReq.open("POST", url, true);
	xmlHTTPReq.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
	xmlHTTPReq.send(params);
	return true;
    }
    return false;
}

function processReqChange()
{
    debugger;
    if(xmlHTTPReq.readyState == 4 && xmlHTTPReq.status == 200)
    {
	var response = xmlHTTPReq.responseXML;
	
    }
}

function submitForm()
{
    debugger;
        var formOrder = document.getElementById("formOrder");
	formOrder.reset();
}
*/

/*end of methods to submit form and get response*/
