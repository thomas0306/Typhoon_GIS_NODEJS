/**
 * Created by Thomas on 18/1/2016.
 */
function drawTyphoonICON(the_lat, the_lng){
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

//[{lat1, lng1}, {lat2, lng2}, ... ,{latX, lngX}]
function drawPath(coords){
    var path = new google.maps.Polyline({
        path: coords,
        geodesic: true,
        strokeColor: '#FF0000',
        strokeOpacity: 1.0,
        strokeWeight: 2
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