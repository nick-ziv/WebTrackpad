/*
  Web Trackpad Client
  Nicholas Zivkovic, Feb 10, 2021
*/

function ge(x) {
  return document.getElementById(x)
}
function postReq(url, data) {
	return new Promise(function (resolve, reject) {
		const XHR = new XMLHttpRequest();
	  let urlEncodedData = "";
	  let urlEncodedDataPairs = [];
	  let name;
	  for( name in data ) {//encode data to a url
	    urlEncodedDataPairs.push( encodeURIComponent( name ) + '=' + encodeURIComponent( data[name] ) );
	  }
	 	urlEncodedData = urlEncodedDataPairs.join( '&' ).replace( /%20/g, '+' );
	  XHR.addEventListener( 'load', function(event) {
			if ((event.target.status == 200) && (event.target.readyState == 4)) {
        //console.log(event.target.response)
				resolve(JSON.parse(event.target.response));
			}
	  });
		XHR.addEventListener( 'error', function(event) {
			reject(event);
	  });
		XHR.open('POST', url);
		XHR.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
  	XHR.send(urlEncodedData);
	});
}

newTouch = true;
holdingClick = false;
scrolling = false;
oXPos = 0
oYPos = 0
xPos = 0;
yPos = 0;
speedMult = 1
hcTimeout = setTimeout(()=>{}, 10000)
totalToMovex = 0;
totalToMovey = 0;

function sizeCanv() {
  var bw = document.body.scrollWidth
  var bh = document.body.scrollHeight
  var c = ge('touchpad')
  c.style.height = bh + 'px'
  c.height = bh
  c.style.width = bw + 'px'
  c.width = bw
}
function updPos(color) {
  if (color != undefined) {
    var ctx = ge('touchpad').getContext("2d");
    cv = ge('touchpad')
    ctx.fillStyle = "#000000";
    ctx.fillStyle = color
    ctx.fillRect(0, 0, cv.clientWidth, cv.clientHeight);
  }
  if (!newTouch) {
    totalToMovex += (xPos-oXPos)*speedMult
    totalToMovey += (yPos-oYPos)*speedMult
  }
}

window.onload = function() {
  sizeCanv()
  window.onresize = sizeCanv
  var el = ge('touchpad')
  el.addEventListener("touchstart", function(event){
    event.preventDefault();
    touch = event.touches[0]
    if (holdingClick) {
      postReq('api', {action:'nhlclick'})
    }
    holdingClick = false;
    scrolling = false;
    newTouch = true;
    xPos = touch.clientX
    yPos = touch.clientY
    oXPos = xPos
    oYPos = yPos
    updPos('#000000')
    hcTimeout = setTimeout(function() {
      if (scrolling == false) {
        holdingClick = true
        updPos("#004275")
        postReq('api', {action:'hlclick'})
      }
    }, 500)
  });
  el.addEventListener("touchmove", function(event){
    event.preventDefault();
    touch = event.touches[0]
    oXPos = xPos
    oYPos = yPos
    xPos = touch.clientX
    yPos = touch.clientY
    touchMovedALot = (Math.abs((xPos - oXPos) > 1) || (Math.abs(yPos - oYPos) > 1))
    if (touchMovedALot) {
		newTouch = false;
	}
    if (event.touches.length > 1) {
      scrolling = true
    } else {
		
		if (newTouch == true && (!touchMovedALot)) {
			holdingClick = True
		}
	}
    
    if (!holdingClick) {
      clearTimeout(hcTimeout)
    }
    updPos()
  });
  el.addEventListener("touchend", function(event){
    event.preventDefault();
    scrolling = false
    clearTimeout(hcTimeout)
    if (newTouch) {
      postReq('api', {action:'lclick'})
    } else if (holdingClick) {
      postReq('api', {action:'nhlclick'})
    }
    updPos('#000000')
  });
  el.addEventListener("touchcancel", function(event){
    event.preventDefault();
  });
  setInterval(function() {
    if (totalToMovex != 0  || totalToMovey != 0) {
      postReq('api', {action:'newpos', datax: totalToMovex, datay: totalToMovey, scroll: scrolling})
      totalToMovex = 0
      totalToMovey = 0
    }
  }, 50)
}
