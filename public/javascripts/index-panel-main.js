/**
 * Created by Thomas on 18/1/2016.
 */
Polymer({
    is: "index-panel-main",

    ready: function(){
        Util.log("index-panel-main ready!");
        this.$$('#getDirIdx').generateRequest();

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
        disableUI: {
            type: Boolean,
            value: true
        },

        typ_paths: {
            value: [],
            writable: true
        },

        dirs: {
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
        }
    },

    listeners: {
        'drawer-toggle.tap' : 'toggleDrawer',
        'search-dialog-toggle.tap' : 'toggleSearchDialog',
    },

    toggleDrawer: function(e){
        Util.log("drawer-toggle onTap");
        var pdp = document.getElementById('paperDrawerPanel');
        pdp.togglePanel();
    },

    toggleSearchDialog: function(e){
        Util.log("search-dialog-toggle onTap");
        var dialog = document.getElementById('searchDialog');
        if(dialog)
            dialog.toggle();
    },

    reqPath: function(e, detail, sender){
        this.intl_req = detail.intl_no;
        this.intl_req_name = detail.name;
        this.$$('#getPathAjax').generateRequest();
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
            var mkr = drawTyphoonICON(lat, lng);

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
            this.setOptions({strokeColor: Util.ColorLuminance(this.oldColor, 0.4)});
        });

        path.addListener('mouseout', function(){
            Util.log('path mouseout');
            this.setOptions({strokeColor: this.oldColor});
        });

        path_map_obj.push(path);

        this.typ_paths.push(path_map_obj);

        var map = document.querySelector('google-map').map;
        map.fitBounds(bounds);

        Util.log(this.typ_paths);
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
        if(dir50 !== 'No Data' && this.dirs.length > parseInt(dir50)-1){
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