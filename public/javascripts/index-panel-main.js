/**
 * Created by Thomas on 18/1/2016.
 */
Polymer({
    is: "index-panel-main",

    ready: function(){
        Util.log("index-panel-main ready!");
        this.$$('#getDirIdx').generateRequest();
        this.$$('#getGradesIdx').generateRequest();
    },

    properties: {
        apiKey:{
            type: String,
            value: 'AIzaSyCg41XC9fHNb22opdSPUWHrLSpS6dxzRzw',
            readOnly: true
        },
        latitude:{
            type: Number,
            value: 20.021561
        },
        longitude:{
            type: Number,
            value: 125.248601
        },
        zoom: {
            type: Number,
            value: 5
        },
        minZoom: {
            type: Number,
            value: 2
        },
        disableUI: {
            type: Boolean,
            value: true
        },

        mapStyle: {
            type: Object,
            value: [
                {
                    "stylers":[
                        {
                            "saturation":-100
                        },
                        {
                            "gamma":1
                        }
                    ]
                },
                {
                    "elementType":"labels.text.stroke",
                    "stylers":[
                        {
                            "visibility":"off"
                        }
                    ]
                },
                {
                    "featureType":"poi.business",
                    "elementType":"labels.text",
                    "stylers":[
                        {
                            "visibility":"off"
                        }
                    ]
                },
                {
                    "featureType":"poi.business",
                    "elementType":"labels.icon",
                    "stylers":[
                        {
                            "visibility":"off"
                        }
                    ]
                },
                {
                    "featureType":"poi.place_of_worship",
                    "elementType":"labels.text",
                    "stylers":[
                        {
                            "visibility":"off"
                        }
                    ]
                },
                {
                    "featureType":"poi.place_of_worship",
                    "elementType":"labels.icon",
                    "stylers":[
                        {
                            "visibility":"off"
                        }
                    ]
                },
                {
                    "featureType":"road",
                    "elementType":"geometry",
                    "stylers":[
                        {
                            "visibility":"simplified"
                        }
                    ]
                },
                {
                    "featureType":"water",
                    "stylers":[
                        {
                            "visibility":"on"
                        },
                        {
                            "saturation":50
                        },
                        {
                            "gamma":0
                        },
                        {
                            "hue":"#50a5d1"
                        }
                    ]
                },
                {
                    "featureType":"administrative.neighborhood",
                    "elementType":"labels.text.fill",
                    "stylers":[
                        {
                            "color":"#333333"
                        }
                    ]
                },
                {
                    "featureType":"road.local",
                    "elementType":"labels.text",
                    "stylers":[
                        {
                            "weight":0.5
                        },
                        {
                            "color":"#333333"
                        }
                    ]
                },
                {
                    "featureType":"transit.station",
                    "elementType":"labels.icon",
                    "stylers":[
                        {
                            "gamma":1
                        },
                        {
                            "saturation":50
                        }
                    ]
                }
            ]
        },

        menu_btns: {
            type: Array,
            value: [
                {
                    id: 'btn-my-location',
                    icon: 'maps:my-location',
                    tooltip: 'Find my location',
                    callback: null
                },
                {
                    id: 'btn-find-park',
                    icon: 'maps:local-florist',
                    tooltip: 'Find nearest park',
                    callback: null
                },
                {
                    id: 'btn-get-directions',
                    icon: 'maps:directions',
                    tooltip: 'Find cleanest route',
                    callback: null
                }
            ]
        },

        typ_paths: {
            value: [],
            writable: true
        },

        dirs: {
            value: [],
            writable: true
        },

        grades: {
            value: [],
            writable: true
        },

        intl_req: {
            value: '',
            type: String
        },

        intl_req_name:{
            value: '',
            type: String
        },

        map_rect: {
            type: Object,
            value: null
        },

        rect_srch_coord_lat1:{
            type: String,
            value: ''
        },
        rect_srch_coord_lng1:{
            type: String,
            value: ''
        },
        rect_srch_coord_lat2:{
            type: String,
            value: ''
        },
        rect_srch_coord_lng2:{
            type: String,
            value: ''
        },

        rect_srch_res: {
            type: [],
            writable: true
        }
    },

    listeners: {
        'drawer-toggle.tap' : 'toggleDrawer',
        'search-dialog-toggle.tap' : 'toggleSearchDialog',
        'map-canvas.google-map-ready' : 'rmCover'
    },

    observers: [
        'zoomChanged(zoom)'
    ],

    zoomChanged: function(zoom){
        console.log('On zoom! '+zoom);
        console.log(this.typ_paths);
        for(i in this.typ_paths){
            for (j in this.typ_paths[i].gl_obj){
                var map_obj = this.typ_paths[i].gl_obj[j];
                if(map_obj instanceof google.maps.Marker){
                    var icon = map_obj.getIcon();
                    icon.scale = zoom+1;
                    map_obj.setOptions({icon:icon});
                }
            }
        }
    },

    toggleDrawer: function(e){
        Util.log("drawer-toggle onTap");
        var pdp = document.getElementById('paperDrawerPanel');
        pdp.togglePanel();
    },

    toggleSearchDialog: function(e){
        Util.log("onmap-dialog-toggle onTap");
        var dialog = document.getElementById('onMapTypDialog');
        if(dialog)
            dialog.toggle();
    },

    rmCover: function(e){
        Util.log('maps ready!');
        var map = document.querySelector('google-map').map;
        //this.map_rect = new google.maps.Rectangle({
        //    bounds: {
        //        north: 20.2,
        //        south: 20.0,
        //        east: 125.3,
        //        west: 125.1
        //    },
        //    editable: true,
        //    draggable: true
        //});
        //this.map_rect.setMap(map);
        //this.map_rect.addListener('bounds_changed', this.mapRectBoundsChanged);
        google.maps.event.addListenerOnce(map, 'tilesloaded', function(){
            //this part runs when the mapobject is created and rendered
            var cover = document.querySelector('#cover');
            cover.parentNode.removeChild(cover);
        });
    },

    mapRectBoundsChanged: function(e){
        var ne = this.getBounds().getNorthEast();
        var sw = this.getBounds().getSouthWest();

        document.querySelector('#getRectSrch').fire('iron-signal', {
            name: 'rectsrchchg',
            data: {
                lat1: sw.lat(),
                lng1: sw.lng(),
                lat2: ne.lat(),
                lng2: ne.lng()
            }
        });
    },

    rectSrch: function(e, detail, sender){

        Util.log(detail.lat1);
        this.rect_srch_coord_lat1 = detail.lat1;
        this.rect_srch_coord_lng1 = detail.lng1;
        this.rect_srch_coord_lat2 = detail.lat2;
        this.rect_srch_coord_lng2 = detail.lng2;

        document.querySelector('#getRectSrch').generateRequest();
    },

    drawEach: function(e){
        Util.log(this.rect_srch_res);
        for(var x = 0; x < this.rect_srch_res.length; x++){
            this.fire('iron-signal', {
                name: 'addintlno',
                data: {
                    intl_no: this.rect_srch_res[x],
                    name: 'test'
                }
            });
        }
    },

    reqPath: function(e, detail, sender){
        this.intl_req = detail.intl_no;
        this.intl_req_name = detail.name;
        this.$$('#getPathAjax').generateRequest();
    },

    deletePath: function(e, detail, sender){
        for(x = 0; x < this.typ_paths.length; x++){
            if(this.typ_paths[x].intl_no === detail.intl_no){
                for(y = 0; y < this.typ_paths[x].gl_obj.length; y++){
                    this.typ_paths[x].gl_obj[y].setMap(null);
                }
                this.typ_paths.splice(x, 1);
            }
        }
    },

    addPathToList: function(e){
        var res = this.$.getPathAjax.lastResponse;

        var path_map_obj = [];
        var plyLn = []
        Util.log(res[0]);

        var infoWin = new google.maps.InfoWindow({
            content: ''
        });

        var bounds = new google.maps.LatLngBounds();

        for(var x = 0; x < res.length; x++){
            var lat = res[x].loc[1];
            var lng = res[x].loc[0];
            //getTyphoonAngle return:
            // 0: N
            // 45: NE
            // 90: E
            // 135: SE
            // 180: S
            // 225: SW
            // 270: W
            // 315: NW
            //===============
            // 360: Symmetric
            //===============
            // -1: No Data
            var angle = getTyphoonAngle(res[x].wind_dir_50kt_plus||res[x].wind_dir_30kt_plus||-1, this.dirs);
            var color = getColorByTyphoonGrade(res[x].grade||6, this.grades);
            var mkr = drawTyphoonICON(lat, lng, angle, color);

            mkr.iw_html = this.getContentStrIW(this.intl_req_name, res[x]);

            mkr.addListener('click', function(){
                Util.log('mkr click');
                var map = document.querySelector('google-map').map;
                infoWin.setContent(this.iw_html);
                infoWin.open(map, this);
            });

            mkr.addListener('mouseover', function(){
                Util.log('mkr mouseover');
            });
            mkr.addListener('mouseout', function(){
                Util.log('mkr mouseout');
            });

            path_map_obj.push(mkr);
            var pt = {lat: lat, lng: lng};
            plyLn.push(pt);

            bounds.extend(mkr.getPosition());
        }

        var path = drawPath(plyLn);
        path.addListener('mouseover', function(){
            Util.log('path mouseover');
            this.setOptions({strokeColor: Util.ColorLuminance(this.oldColor, 0.6)});
        });

        path.addListener('mouseout', function(){
            Util.log('path mouseout');
            this.setOptions({strokeColor: this.oldColor});
        });

        path_map_obj.push(path);

        this.typ_paths.push({intl_no: res[0].intl_no, gl_obj: path_map_obj});

        var map = document.querySelector('google-map').map;
        map.fitBounds(bounds);

        this.fire('iron-signal', {
            name: 'addshownintl',
            data: {
                intl_no:res[0].intl_no
            }
        });
    },

    getContentStrIW: function(name, track){
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
        str +=  "<div class='crow'>" +
            "<div class='ccolumn clabel'>Time: </div>" +
            "<div class='ccolumn'>" + Util.undef2Str(track.rec_time) + "</div>" +
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
        }else if(dir50 !== 'No Data' && this.dirs.length > parseInt(dir50)-1){
            dir50 = this.dirs[parseInt(dir50)-1].description;
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
        if(dir30 !== 'No Data' && this.dirs.length > parseInt(dir30)-1){
            dir30 = this.dirs[parseInt(dir30)-1].description;
            Util.log(dir30);
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
});
