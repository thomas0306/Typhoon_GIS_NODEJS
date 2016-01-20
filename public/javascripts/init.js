/**
 * Created by Thomas on 6/8/15.
 */

var map;
function initMap() {
    map = new google.maps.Map(document.getElementById('map-canvas'), {
        zoom: defZoomLvl,
        center: {lat: defMapCent[0], lng: defMapCent[1]},
        disableDefaultUI: true
    });
}


//google.maps.event.addDomListener(window, 'load', initiMap);
