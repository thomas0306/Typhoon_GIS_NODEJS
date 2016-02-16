/**
 * Created by Thomas on 6/8/15.
 */
var Util = {};
Util.promptMsg = function(message, position){
    var n = noty({
        text        : message,
        type        : 'information',
        dismissQueue: true,
        layout      : position,
        closeWith   : ['click'],
        theme       : 'relax',
        maxVisible  : 10,
        animation   : {
            open  : 'animated bounceInRight',
            close : 'animated bounceOutRight',
            easing: 'swing',
            speed : 500
        }
    });

    //setTimeout(function () {
    //    $.noty.close(n.options.id);
    //}, 5000);

    Util.log('Prompted message id: ' + n.options.id);
}

Util.promptTopRightMsg = function(message){
    Util.promptMsg(message, 'topRight');
}

Util.log = function(message){
    if(mode == 'debug')
        console.log(message);
}

Util.undef2Str = function(str){
    if(str === undefined)
        return "No Data";
    else
        return str;
}

Util.ColorLuminance = function(hex, lum) {

    // validate hex string
    hex = String(hex).replace(/[^0-9a-f]/gi, '');
    if (hex.length < 6) {
        hex = hex[0]+hex[0]+hex[1]+hex[1]+hex[2]+hex[2];
    }
    lum = lum || 0;

    // convert to decimal and change luminosity
    var rgb = "#", c, i;
    for (i = 0; i < 3; i++) {
        c = parseInt(hex.substr(i*2,2), 16);
        c = Math.round(Math.min(Math.max(0, c + (c * lum)), 255)).toString(16);
        rgb += ("00"+c).substr(c.length);
    }

    return rgb;
}

//2016 colors
//var colors = [
//    '#F6CACA',
//    '#F5796E',
//    '#92A9CE',
//    '#0B5082',
//    '#F9DE4D',
//    '#9ADDDD',
//    '#9896A4',
//    '#DB4238',
//    '#B08F6C',
//    '#7BC55A',
//];

//london metro colors
var path_colors = [
    '#B36305',
    '#E32017',
    '#FFD300',
    '#00782A',
    '#00A4A7',
    '#F3A9BB',
    '#A0A5A9',
    '#9B0056',
    '#000000',
    '#EE7C0E',
    '#003688',
    '#84B817',
    '#0098D4',
    '#95CDBA'
];


function drawTyphoonICON(the_lat, the_lng){
    var map = document.querySelector('google-map').map;
    var mkr = new google.maps.Marker({
        position: {lat: the_lat, lng: the_lng},
        map: map,
        icon: {
            path: 'M53,35.7C58.2,19,22-1.7,9.5,33.1 M23.1,29.8 L9.2,33.4 L5.6,19.5 M46,44.8c-16.8,4.7-14.3,46.4,21.7,37.8 M57.4,73.1 L68,82.7 L58.4,93.3 M60.3,45.7C73.4,57.3,107,32.6,80.4,7 M77.9,20.8 L80.2,6.7 L94.4,9',
            scale: 0.2,
            strokeColor: '#393',
            rotation: 100,
            strokeWeight: 3,
            anchor: new google.maps.Point(52.2, 42.5)
        }
        //icon:{
        //    url: 'images/Typhoon_ICON.png',
        //    // This marker is 20 pixels wide by 32 pixels high.
        //    scaledSize: new google.maps.Size(20, 20),
        //    // The origin for this image is (0, 0).
        //    origin: new google.maps.Point(0, 0),
        //    // The anchor for this image is the base of the flagpole at (0, 32).
        //    anchor: new google.maps.Point(10, 10),
        //    rotation: 70
        //}
    });

    spinningIcon(mkr, 100);

    return mkr;
}

function spinningIcon(mkr, ms){
    var count = 0;
    window.setInterval(function(){
        count = (count - 1) % 360;

        var icon = mkr.get('icon');
        icon.rotation = count;
        mkr.set('icon', icon);
    }, ms);
}

//[{lat:lat1, lng:lng1}, {lat2, lng2}, ... ,{latX, lngX}]
function drawPath(coords){
    var map = document.querySelector('google-map').map;

    var lineSymbol = {
        path: 'M 0,2 L 2,-3 L 0,-1 L -2,-3 Z M 0,0 L 0,1',
        strokeOpacity: 1,
        scale: 2
    }

    var randCol = path_colors[Math.round(Math.random()*100%path_colors.length)];
    var path = new google.maps.Polyline({
        path: coords,
        geodesic: true,
        strokeColor: randCol,
        strokeOpacity: 0,
        icons: [{
            icon: lineSymbol,
            offset: '0',
            repeat: '15px'
        }],
        strokeWeight: 10,
        map: map
    });

    //path.setMap(map);
    path.oldColor = randCol;

    return path;
}

function drawPredictedCircle(center, radius){
    var map = document.querySelector('google-map').map;

    var circle = new google.maps.Circle({
        strokeColor: '#FF0000',
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: '#FF0000',
        fillOpacity: 0.35,
        map: map,
        center: center,
        radius: radius
    });

    return circle;
}


//{lat,lng}
function addCoord(path, coord){
    var coordObj = new google.maps.LatLng(coord);
    path.getPath.push(coordObj);
    return path;
}

