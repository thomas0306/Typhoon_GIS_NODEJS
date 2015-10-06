/**
 * Created by Thomas on 6/8/15.
 */

var map;
function initialize() {
    map = new google.maps.Map(document.getElementById('map-canvas'), {
        zoom: 8,
        center: {lat: -34.397, lng: 150.644}
    });
}

google.maps.event.addDomListener(window, 'load', initialize);

$(document).ready(function() {
    $('#simple-menu').sidr({
        name: 'left_sidr',
        source: '#leftheader, #sidr',
        displace: false
    });

    $('.js-example-basic-multiple').select2({
        placeholder: "Search for TC..."
    });

    Util.promptTopRightMsg('Welcome to GIS system.');

    $('#sidr-id-close-menu-icon').click(function(){
        $.sidr('close', 'left_sidr');
    })
});