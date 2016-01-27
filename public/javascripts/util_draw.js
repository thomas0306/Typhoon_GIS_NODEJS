/**
 * Created by Thomas on 18/1/2016.
 */

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
        icon:{
            url: 'images/Typhoon_ICON.png',
            // This marker is 20 pixels wide by 32 pixels high.
            scaledSize: new google.maps.Size(20, 20),
            // The origin for this image is (0, 0).
            origin: new google.maps.Point(0, 0),
            // The anchor for this image is the base of the flagpole at (0, 32).
            anchor: new google.maps.Point(10, 10)
        }
    });

    return mkr;
}

//[{lat:lat1, lng:lng1}, {lat2, lng2}, ... ,{latX, lngX}]
function drawPath(coords){
    var map = document.querySelector('google-map').map;

    var path = new google.maps.Polyline({
        path: coords,
        geodesic: true,
        strokeColor: path_colors[Math.round(Math.random()*100%path_colors.length)],
        strokeOpacity: 1.0,
        strokeWeight: 4
    });

    path.setMap(map);

    return path;
}


//{lat,lng}
function addCoord(path, coord){
    var coordObj = new google.maps.LatLng(coord);
    path.getPath.push(coordObj);
    return path;
}