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
    ONE_DIRECTION: 'M-49.6,105.5C-200.7-79,42.3-202.3,204-137.2c0,0-120.4-7.4-146.8,41.8 c114,49.9,29.2,332.1-252.2,243.7 z M-26.5,4.7a31.7,31.7 0 1,0 63.4,0a31.7,31.7 0 1,0 -63.4,0',
};

var iconSVGDir = {
    0: 'M-4.84,-206.28a10,10 0 1,0 20,0a10,10 0 1,0 -20,0',
    45: 'M209,-206.28a10,10 0 1,0 20,0a10,10 0 1,0 -20,0',
    90: 'M209,5a10,10 0 1,0 20,0a10,10 0 1,0 -20,0',
    135: 'M209,215.57a10,10 0 1,0 20,0a10,10 0 1,0 -20,0',
    180: 'M-4.84,215.57a10,10 0 1,0 20,0a10,10 0 1,0 -20,0',
    225: 'M-219.27,215.57a10,10 0 1,0 20,0a10,10 0 1,0 -20,0',
    270: 'M-219.27,5a10,10 0 1,0 20,0a10,10 0 1,0 -20,0',
    315: 'M-219.27,-206.28a10,10 0 1,0 20,0a10,10 0 1,0 -20,0',
    360:    'M-242.2,5.7a248.2,248.2 0 1,0 496.4,0a248.2,248.2 0 1,0 -496.4,0 ' +
            'M23.8,-218.5 L-24.2,-242.5 L24.2,-266.5 ' +
            'M-30.3,230 L17.7,254 L-30.8,278'
}

function renderTyphoonMkr(angle, the_lat, the_lng, color) {
    var iconPATH = iconSVG.ONE_DIRECTION;
    var iconAngle = '';
    if(iconSVGDir[angle] !== undefined)
        iconAngle = iconSVGDir[angle];

    var mkr = new google.maps.Marker({
        position: {lat: the_lat, lng: the_lng},
        icon: {
            path: iconAngle + " " + iconPATH,
            scale: 0.1,
            strokeColor: '#000000',
            fillColor: 'hsl(' + color.join() + ')',
            fillOpacity: .95,
            strokeWeight: 2,
            anchor: new google.maps.Point(5.2, 4.7)
        }
    });
    return mkr;
}
function drawTyphoonICON(the_lat, the_lng, angle, color){
    var map = document.querySelector('google-map').map;
    var mkr = renderTyphoonMkr(angle, the_lat, the_lng, color);
    mkr.setMap(map);

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
function drawPath(coords, color, invert){
    var map = document.querySelector('google-map').map;

    var path = renderPath(coords, color, invert);

    path.setMap(map);

    return path;
}

function renderPath(coords, color, invert){
    var lineSymbol = {
        path: 'M 0,2 L 2,-3 L 0,-1 L -2,-3 Z M 0,0 L 0,1',
        strokeOpacity: 1,
        scale: 2
    }
    if(invert)
        lineSymbol.path = 'M 0,-2 L -2,3 L 0,1 L 2,3 Z M 0,0 L 0,-1';

    if(!color)
        color = path_colors[Math.round(Math.random()*100%path_colors.length)];

    var path = new google.maps.Polyline({
        path: coords,
        geodesic: true,
        strokeColor: color,
        strokeOpacity: 0,
        icons: [{
            icon: lineSymbol,
            offset: '0',
            repeat: '15px'
        }],
        strokeWeight: 10,
        oldColor: color
    });
    return path;
}

function drawStaticCircle(coord, radius){
    var map = document.querySelector('google-map').map;
    var circle = new google.maps.Circle({
        center: coord,
        radius: radius,
        strokeWeight: 2,
        strokeColor: '#FFFF00',
        fillColor: '#FFFF00',
        fillOpacity: 0.6,
        map: map
    });

    return circle;
}

function drawPredictedCircle(center, radius, src){
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

    var line = new google.maps.Polyline({
        path: [center, src],
        geodesic: true,
        strokeColor: '#FF0000',
        strokeOpacity: 1.0,
        strokeWeight: 2,
        map: map
    });

    circle.line = line;
    line.circle = circle;

    circle.addListener('click', function(ev) {
        this.setMap(null);
        this.line.setMap(null);
    });

    line.addListener('click', function(e){
        this.setMap(null);
        this.circle.setMap(null);
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

function bulkSetMap(map, gmElems){
    gmElems.forEach(function(each){
        each.setMap(map);
    });
}

function getContentStrIW(name, track){
    var str = "";

    str += "<div class='ctable'>";
    //Typhoon name
    str += "<div class='crow'><div class='ccolumn cheading'>"+ name + "</div></div>";

    //each
    //international number
    str +=  "<div class='crow'>" +
        "<div class='ccolumn clabel'>International number: </div>" +
        "<div class='ccolumn'>" + Util.undef2Str(track.intl_no) + "</div>" +
        "</div>";
    //coordinates
    str +=  "<div class='crow'>" +
        "<div class='ccolumn clabel'>Coordinates: </div>" +
        "<div class='ccolumn'>" + Util.undef2Str(track.loc) + "</div>" +
        "</div>";
    //grade
    str +=  "<div class='crow'>" +
        "<div class='ccolumn clabel'>Grade: </div>" +
        "<div class='ccolumn'>" + Util.undef2Str(track.grade) + "</div>" +
        "</div>";
    //record time
    var rec_time = Util.undef2Str(track.rec_time);
    if(rec_time !== 'No Data'){
        rec_time = moment.tz(rec_time,moment.tz.guess()).format('lll z')
    }
    str +=  "<div class='crow'>" +
        "<div class='ccolumn clabel'>Time: </div>" +
        "<div class='ccolumn'>" + rec_time + "</div>" +
        "</div>";
    //center pressure
    str +=  "<div class='crow'>" +
        "<div class='ccolumn clabel'>Center Pressure: </div>" +
        "<div class='ccolumn'>" + Util.undef2Str(track.cent_pressure) + "</div>" +
        "</div>";
    //maximum sustain wind speed
    str +=  "<div class='crow'>" +
        "<div class='ccolumn clabel'>Max Sustain Wind Speed: </div>" +
        "<div class='ccolumn'>" + Util.undef2Str(track.max_sus_wind_spd) + "</div>" +
        "</div>";
    //wind_dir_50kt_plus
    var dir50 = Util.undef2Str(track.wind_dir_50kt_plus);
    if(parseInt(dir50) === 0){
        dir50 = 'No Data';
    }else if(dir50 !== 'No Data' && document.querySelector('#mainPanel').dirs.length > parseInt(dir50)-1){
        dir50 = document.querySelector('#mainPanel').dirs[parseInt(dir50)-1].description;
    }
    str +=  "<div class='crow'>" +
        "<div class='ccolumn clabel'>Wind Direction (>50kt): </div>" +
        "<div class='ccolumn'>" + dir50 + "</div>" +
        "</div>";
    //max_wind_50kt_plus_radius
    str +=  "<div class='crow'>" +
        "<div class='ccolumn clabel'>Maximum Wind Radius (>50kt): </div>" +
        "<div class='ccolumn'>" + Util.undef2Str(track.max_wind_50kt_plus_radius) + "</div>" +
        "</div>";
    //min_wind_50kt_plus_radius
    str +=  "<div class='crow'>" +
        "<div class='ccolumn clabel'>Minumum Wind Radius (>50kt): </div>" +
        "<div class='ccolumn'>" + Util.undef2Str(track.min_wind_50kt_plus_radius) + "</div>" +
        "</div>";
    //wind_dir_30kt_plus
    var dir30 = Util.undef2Str(track.wind_dir_30kt_plus);
    if(dir30 !== 'No Data' && document.querySelector('#mainPanel').dirs.length > parseInt(dir30)-1){
        dir30 = document.querySelector('#mainPanel').dirs[parseInt(dir30)-1].description;
    }
    str +=  "<div class='crow'>" +
        "<div class='ccolumn clabel'>Wind Direction (>30kt): </div>" +
        "<div class='ccolumn'>" + dir30 + "</div>" +
        "</div>";
    //max_wind_30kt_plus_radius
    str +=  "<div class='crow'>" +
        "<div class='ccolumn clabel'>Maximum Wind Radius (>30kt): </div>" +
        "<div class='ccolumn'>" + Util.undef2Str(track.max_wind_30kt_plus_radius) + "</div>" +
        "</div>";
    //min_wind_30kt_plus_radius
    str +=  "<div class='crow'>" +
        "<div class='ccolumn clabel'>Minimum Wind Radius (>30kt): </div>" +
        "<div class='ccolumn'>" + Util.undef2Str(track.min_wind_30kt_plus_radius) + "</div>" +
        "</div>";
    //landfall_passage_indi
    var indicator = "";
    switch(track.landfall_passage_indi){
        case undefined:
        default:
            indicator = 'No Data';
            break;
        case true:
            indicator = 'Existed';
            break;
        case false:
            indicator = 'Not Existed';
            break;
    }
    str +=  "<div class='crow'>" +
        "<div class='ccolumn clabel'>Landfall or Passage (Japan): </div>" +
        "<div class='ccolumn'>" + indicator + "</div>" +
        "</div>";

    str += "</div>";

    return str;
}

function drawUsrPrediction(latLng){
    var map = document.querySelector('google-map').map;
    var circle = new google.maps.Circle({
        center: latLng,
        radius: 50000,
        draggable: true,
        editable: true,
        map: map,
        strokeColor: '#FFFF00',
        strokeOpacity: 0.8,
        strokeWeight: 1,
        fillColor: '#FFFF00',
        fillOpacity: 0.4
    });

    return circle;
}
