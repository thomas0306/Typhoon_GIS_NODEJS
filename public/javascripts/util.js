/**
 * Created by Thomas on 6/8/15.
 */
var Util = {};

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

var iconSVG = {
    ONE_DIRECTION:  'M -2,3 L 0,-3 L 2,3 C 1,1.5 -1,1.5 -2,3 Z ' +
                    'M-5,0a5,5 0 1,0 10,0a5,5 0 1,0 -10,0',
    NO_DATA:        'M 0.5,2 L 0.5,3 L -0.5,3  L -0.5,2 Z ' +
                    'M -1,-1.5 L -2,-1.5 C -1.5,-4 1.5,-4, 2,-1.5 C 2,0 1,0 0.5,1.5 L -0.5,1.5 C 0,0 1,0 1,-1.5 C 1,-3 -1,-3 -1,-1.5 Z ' +
                    'M-5,0a5,5 0 1,0 10,0a5,5 0 1,0 -10,0',
    SYMMETRIC:      'M-4.5,0.5a4.5,4.5 0 1,0 9,0 a3,3 0 1,0 -6,0 a2.5,2.5 0 1,0 5,0 a1.5,1.5 0 1,0 -3,0 '+
                    'M-5,0a5,5 0 1,0 10,0a5,5 0 1,0 -10,0'

};

function drawTyphoonICON(the_lat, the_lng, angle, color){
    var map = document.querySelector('google-map').map;
    var iconPATH;
    var rotation = 0;
    switch(angle){
        case -1:
            iconPATH = iconSVG.NO_DATA;
            break;
        case 360:
            iconPATH = iconSVG.SYMMETRIC;
            break;
        default:
            iconPATH = iconSVG.ONE_DIRECTION;
            rotation = angle;
            break;
    }
    var mkr = new google.maps.Marker({
        position: {lat: the_lat, lng: the_lng},
        map: map,
        icon: {
            path: iconPATH,
            scale: 4,
            strokeColor: '#000000',
            fillColor: 'hsl('+color.join()+')',
            fillOpacity: .8,
            rotation: rotation,
            strokeWeight: 2
        }
    });

    //spinningIcon(mkr, 100);

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

function getTyphoonAngle(dirValue, ref){
    if(dirValue === -1)
        return -1;
    return ref[dirValue-1].angle;
}

function getColorByTyphoonGrade(grade, ref){
    return ref[grade-1].colorHSB;
}


//{lat,lng}
function addCoord(path, coord){
    var coordObj = new google.maps.LatLng(coord);
    path.getPath.push(coordObj);
    return path;
}

