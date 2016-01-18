/**
 * Created by Thomas on 6/8/15.
 */

var map;
function initialize() {
    map = new google.maps.Map(document.getElementById('map-canvas'), {
        zoom: defZoomLvl,
        center: {lat: defMapCent[0], lng: defMapCent[1]},
        disableDefaultUI: true

    });
}

google.maps.event.addDomListener(window, 'load', initialize);

function drawTyphoonICON(the_lat, the_lng){
    var beachMarker = new google.maps.Marker({
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
}