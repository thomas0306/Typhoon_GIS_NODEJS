/**
 * Created by Thomas on 18/1/2016.
 */

var IW_STATUS = {
    CLOSE: 0,
    SEMI: 1,
    OPEN: 2
}

Polymer({
    is: "index-panel-main",

    ready: function(){
        Util.log("index-panel-main ready!");
        this.$$('#getDirIdx').generateRequest();
        this.$$('#getGradesIdx').generateRequest();

        setTimeout(this.$$('#socketCurrTyp').connect, 3000);
    },

    properties: {
        infoWin: {
            type: Object
        },

        curr_typ: {
            type: Object,
            writable: true
        },

        exist_curr_typ:{
            type: Boolean,
            value: false
        },

        uploadMenuClass: {
            type: String,
            value: 'bottom-overlay bottom-panel-hide'
        },

        uploadFormClass: {
            type: String,
            value: 'bottom-form-overlay bottom-panel-hide'
        },

        uploadCompleteClass: {
            type: String,
            value: 'bottom-overlay bottom-panel-hide'
        },

        retrieveMenuClass: {
            type: String,
            value: 'bottom-overlay bottom-panel-hide'
        },

        retrieveInfoClass: {
            type: String,
            value: 'bottom-overlay bottom-panel-hide'
        },

        retrieveInfoStatus: {
            type: Number,
            value: IW_STATUS.CLOSE
        },

        srch_token: {
            type: String,
            value:''
        },

        complete_token: {
            type: String,
            value: ''
        },

        usr_predict: {
            type: Object,
            value: {
                name: '',
                last_update: '',
                comment: '',
                message: '',
                intl_no: '',
                rec_time: Object,
                record: Object
            },
            notify: true
        },

        gm_usr_predict_obj: {
            type: Array,
            value: function(){ return []; }
        },

        usr_predict_ln: {
            type: Object,
            notify: true
        },
        usr_predict_circle: {
            type: Array,
            value: function() {
                return [];
            }
        },

        typ_heat_map_data: {
            type:Object
        },

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

        predict_criteria: {
            type: Object,
            value: {
                intl_no: 'Nothing',
                date: new Date(),
                name: 'Nothing',
                latLng: {
                    type: Object
                }
            },
            notify: true
        },

        predict_basic_result: {
            type: Object,
            value: {}
        },

        predict_advance_result: {
            type: Object,
            value: {}
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

    observers: [
        'isDrawn(usr_predict_circle.*)'
    ],

    isDrawn: function(chg){
        Util.log('array change');
        var submit_btn = document.querySelector('#btn-draw-forward');
        if(submit_btn)
            submit_btn.disabled = !this.usr_predict_circle.length > 0 || false;

    },

    listeners: {
        'drawer-toggle.tap' : 'toggleDrawer',
        'search-dialog-toggle.tap' : 'toggleSearchDialog',
        'btn-information.tap': 'toggleInfoPage',
        'map-canvas.google-map-ready' : 'rmCover',
        'close-predict-info.tap' : 'predictIWClose',
        'show-basic-predict.tap': 'drawPredictedBasicCircle',
        'show-advance-predict.tap': 'drawPredictedAdvancedCircle',
        'btn-user-predict.tap': 'toggleDrawPredict',
        'btn-retrieve-prediction.tap': 'toggleRetrievePredictionPanel',
        'btn-draw-cancel.tap': 'dismissUploadPanel',
        'btn-draw-forward.tap': 'forwardSelfPrediction',
        'btn-predict-form-back.tap': 'backwardSelfPrediction',
        'btn-predict-form-submit.tap': 'submitSelfPrediction',
        'btn-retrieve-cancel.tap': 'dismissRetrievePanel',
        'btn-retrieve-submit.tap': 'submitRetrieve',
        'info_detail.tap': 'toggleCommentSection',
        'btn-close-retrieve-info.tap': 'dismissRetrieveInfo',
        'btn-close-curr-typ-info.tap': 'dismissCurrTypInfo',
        'btn-copy.tap': 'copyToken2Clipboard',
        'btn-complete-close.tap': 'dismissCompleteInfo',
        'btn-legend.tap': 'toggleLegendInfo'
    },

    zoomChanged: function(zoom){
        Util.log('On zoom! '+zoom);
        for(i in this.typ_paths){
            for (j in this.typ_paths[i].gl_obj){
                var map_obj = this.typ_paths[i].gl_obj[j];
                if(map_obj instanceof google.maps.Marker){
                    var icon = map_obj.getIcon();
                    icon.scale = Math.pow(zoom,2);
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

    toggleInfoPage: function(e){
        window.open('./static/information.html');
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
            init_ib();
            var iw_opt = {
                boxClass: 'cus_iw',
                closeBoxURL: "images/close_iw.png"
            };

            //this part runs when the mapobject is created and rendered
            var cover = document.querySelector('#cover');
            cover.parentNode.removeChild(cover);
            var infoWin = new InfoBox(iw_opt);

            document.querySelector('#mainPanel').infoWin = infoWin;


            custom_circle();
            //document.querySelector('#getCurrTc').generateRequest();

            //var hmData = JSON.parse(localStorage.getItem('typ-heat-map'));
            //hmData = hmData.map(function(each){
            //    each.location = new google.maps.LatLng(each._id[1], each._id[0]);
            //    return each;
            //});
            //console.log(hmData);
            //var heatmap = new google.maps.visualization.HeatmapLayer({
            //    data: hmData,
            //    radius: 2
            //});
            //heatmap.setMap(map);
        });
    },

    predictIWClose: function(e){
      this.$$('#predict-info').close();
    },

    drawPredictedBasicCircle: function(e){
        var circle = drawPredictedCircle(this.predict_basic_result.center, this.predict_basic_result.radius, this.predict_basic_result.src);
        var map = document.querySelector('google-map').map;

        var bounds = circle.getBounds();
        circle.line.getPath().forEach(function(each){
           bounds.extend(each);
        });

        map.fitBounds(bounds);
    },
    drawPredictedAdvancedCircle: function(e){
        var circle = drawPredictedCircle(this.predict_advance_result.center, this.predict_advance_result.radius, this.predict_advance_result.src);
        var map = document.querySelector('google-map').map;

        var bounds = circle.getBounds();
        circle.line.getPath().forEach(function(each){
            bounds.extend(each);
        });

        map.fitBounds(bounds);
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

    predictRequests: function(e, detail, sender){
        Util.log('predict Requests trigger!');
        this.predict_criteria = {intl_no: detail.intl_no, name: detail.typ_name, date: detail.date, latLng: detail.latLng};
        this.usr_predict.intl_no = detail.intl_no;
        this.usr_predict.rec_time = detail.date
        this.$$('#getBasicPredict').generateRequest();
        this.$$('#getAdvancePredict').generateRequest();
    },

    processPredictBasic: function(e){
        if(this.predict_basic_result.message === 'Predicted'){
            //enable
            this.$$('#show-basic-predict').disabled = false;
        }else{
            //disable
            this.$$('#show-basic-predict').disabled = true;
        }
    },

    processPredictAdvance: function(e){
        if(this.predict_advance_result.message === 'Predicted'){
            //enable
            this.$$('#show-advance-predict').disabled = false;
        }else{
            //disable
            this.$$('#show-advance-predict').disabled = true;
        }
    },

    //populateCurrTyp: function(e){
    //    Util.log('Populate curr typ!');
    //    console.log(this.curr_typ);
    //    if(!this.curr_typ || !this.curr_typ.length){
    //        //no current typ
    //    }else{
    //
    //    }
    //},

    _enableSelfPredict: function(e){
        Util.log('enable self predict');
        this.$$('#btn-user-predict').disabled = false;
    },

    _disableSelfPredict: function(e){
        Util.log('disable self predict');
        this.$$('#btn-user-predict').disabled = true;
    },

    toggleDrawPredict: function(push, e){
        Util.log('Toggle draw predict');
        this.uploadMenuClass = 'bottom-overlay upload-overlay-open';
        var map = document.querySelector('google-map').map;
        var panel = document.querySelector('#mainPanel');
        panel.infoWin.close();
        var predict_origin = panel.predict_criteria.latLng;
        console.log(predict_origin);
        panel.usr_predict_ln = drawPath([predict_origin], '#371F12', true);

        map.addListener('click', function(e){
            var circleArr = panel.usr_predict_circle;
            var circle = new DistanceWidget(map, e.latLng, function(e) {
                var idx = circleArr.indexOf(circle);
                panel.usr_predict_ln.getPath().setAt(idx + 1, this.getCenter());
            }, function(e){

            }, function(e){
                var idx = circleArr.indexOf(circle);
                if(idx === -1) return;
                circle.set('map', null);
                panel.splice('usr_predict_circle', idx, 1);
                panel.usr_predict_ln.getPath().removeAt(idx+1);
            });
            panel.push('usr_predict_circle', circle);
            panel.usr_predict_ln.getPath().push(e.latLng);
        });
    },

    dismissUploadPanel: function(e){
        Util.log('Dismiss upload panel');
        this.uploadMenuClass = 'bottom-overlay upload-overlay-close';
        var map = document.querySelector('google-map').map;
        google.maps.event.clearListeners(map, 'click');
        document.querySelector('#mainPanel').clearPredict();
    },

    forwardSelfPrediction: function(e){
        Util.log('forward upload panel');
        this.uploadMenuClass = 'bottom-overlay upload-overlay-close';
        this.uploadFormClass = 'bottom-form-overlay form-overlay-open';
        //var map = document.querySelector('google-map').map;
        //google.maps.event.clearListeners(map, 'click');
    },

    backwardSelfPrediction: function(e){
        Util.log('backward upload panel');
        this.uploadMenuClass = 'bottom-overlay upload-overlay-open';
        this.uploadFormClass = 'bottom-form-overlay form-overlay-close';
    },

    _usrPredict2Str: function(){
        var predictObj = this.usr_predict_circle.map(function(each){
            return {
                coord: {
                    lat: each.position.lat(),
                    lng: each.position.lng()
                },
                radius: each.get('radius')
            }
        });

        var json = {
            "name": this.usr_predict.name,
            "comment": this.usr_predict.comment,
            "intl_no": this.usr_predict.intl_no,
            "rec_time": this.usr_predict.rec_time,
            "path": predictObj
        };

        Util.log(json);

        return json;
    },

    submitSelfPrediction: function(e){
        Util.log('submit self prediction');
        this.$$('#uploadProgress').disabled = false;
        this.$$('#putUsrPredict').body=document.querySelector('#mainPanel')._usrPredict2Str();
        this.$$('#putUsrPredict').generateRequest();
    },

    postPutUsrPredictHook: function(e){
        console.log(e.detail.response);
        var token;
        if(e.detail.response.message !== 'success')
            token = e.detail.response.message;
        else
            token = e.detail.response.token;
        var progress = document.querySelector('#uploadProgress');
        progress._toggleIndeterminate(false)
        var prog_complete = setInterval(
            function(){
                var progress = document.querySelector('#uploadProgress');
                if(progress.value >= 100) {
                    clearInterval(prog_complete);
                    var panel = document.querySelector('#mainPanel');
                    panel.uploadFormClass = 'bottom-form-overlay form-overlay-close';
                    panel.uploadCompleteClass = 'bottom-overlay complete-overlay-open';
                    panel.complete_token = token;
                }
                else
                    progress.value +=2;
            }
            ,10);
    },

    copyToken2Clipboard: function(e){
        var input = document.querySelector('#complete-token-input').$.input;
        input.focus();
        input.setSelectionRange(0, input.value.length);
    },

    dismissCompleteInfo: function(e){
        var panel = document.querySelector('#mainPanel');
        panel.uploadCompleteClass = 'bottom-overlay complete-overlay-close';
        panel.clearPredict();
    },

    toggleLegendInfo: function(e){
        Util.log('toggle legend info');
        var e = document.querySelector('#legendInfo');
        if(e.style.display == 'block')
            e.style.display = 'none';
        else
            e.style.display = 'block';

    },

    clearPredict: function(){
        this.usr_predict_circle = this.usr_predict_circle.filter(function(each){
            if(each instanceof google.maps.MVCObject){
                each.set('map',null);
            }
            return false;
        });
        this.usr_predict_ln.setMap(null);
        this.usr_predict_ln = null;
        this.usr_predict.name = '';
        this.usr_predict.last_update = '';
        this.usr_predict.comment = '';
        this.usr_predict.intl_no = '';
        this.usr_predict.rec_time = new Date();
        this.complete_token = '';
        var progress = document.querySelector('#uploadProgress');
        progress.disabled = true;
        progress.value = 0;
        progress._toggleIndeterminate(true);
    },



    toggleRetrievePredictionPanel: function(e){
        Util.log('Toggle retrieve prediction panel');
        this.retrieveMenuClass = 'bottom-overlay retrieve-overlay-open';
    },

    dismissRetrievePanel: function(e){
        Util.log('Dismiss retrieve panel');
        this.retrieveMenuClass = 'bottom-overlay retrieve-overlay-close';
    },

    submitRetrieve: function(e){
        Util.log('Submit retrieve');
        if(this.srch_token !== '')
            this.$$('#getUsrPredict').generateRequest();
        else
            this.$$('#toast-token-empty').show();
    },

    toggleCommentSection: function(e){
        Util.log('Toggle comment section');
        if(this.retrieveInfoStatus === IW_STATUS.SEMI){
            this.retrieveInfoClass = 'retrieve-info-overlay retrieve-info-semi-open';
            this.retrieveInfoStatus = IW_STATUS.OPEN;
        }
        else if(this.retrieveInfoStatus === IW_STATUS.OPEN){
            this.retrieveInfoClass = 'retrieve-info-overlay retrieve-info-open-semi';
            this.retrieveInfoStatus = IW_STATUS.SEMI;
        }
    },

    dismissRetrieveInfo: function(e){
        Util.log('Dismiss Retrieve Info');
        if(this.retrieveInfoStatus === IW_STATUS.OPEN)
            this.retrieveInfoClass = 'retrieve-info-overlay retrieve-info-open-close';
        else if(this.retrieveInfoStatus === IW_STATUS.SEMI)
            this.retrieveInfoClass = 'retrieve-info-overlay retrieve-info-semi-close';
        this.retrieveInfoStatus === IW_STATUS.CLOSE;

        this.rmUsrPredict();
    },

    rmUsrPredict: function(){
        console.log(this.gm_usr_predict_obj);
        this.gm_usr_predict_obj.filter(function(each){
            each.setMap(null);
            //anchor
            return false;
        });
    },

    retrieveUsrPredictRes: function(e){
        if(this.$.getUsrPredict.lastResponse.message === 'fail')
            this.$$('#toast-token-invalid').show();
        else{
            this.dismissRetrievePanel();
            this.retrieveInfoClass = 'retrieve-info-overlay retrieve-info-close-semi';
            this.retrieveInfoStatus = IW_STATUS.SEMI;
            document.querySelector('#mainPanel').drawRetrievePredict();
        }
    },

    drawRetrievePredict: function(){
        //draw path from jma
        var res = this.usr_predict.record.tracks;
        var info = this.usr_predict.info;
        var info_path_src;
        var gm_store = this.gm_usr_predict_obj;
        var bounds = new google.maps.LatLngBounds();
        var plyLn = [];
        for(x in res) {
            var lat = res[x].loc[1];
            var lng = res[x].loc[0];
            var angle = getTyphoonAngle(res[x].wind_dir_50kt_plus || res[x].wind_dir_30kt_plus || -1, document.querySelector('#mainPanel').dirs);
            var color = getColorByTyphoonGrade(res[x].grade || 6, document.querySelector('#mainPanel').grades);
            var mkr = drawTyphoonICON(lat, lng, angle, color);
            var coord = {lat:lat,lng:lng};
            plyLn.push(coord);
            gm_store.push(mkr);
            if(info.rec_time === res[x].rec_time){
                info_path_src = coord;
                bounds.extend(mkr.getPosition());
            }
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

        gm_store.push(path);

        //draw usr predict circles
        //circles
        var p_path = [];
        p_path.push(info_path_src);
        for(x in info.path){
            var each = info.path[x];
            var circle = drawStaticCircle(each.coord, each.radius);
            gm_store.push(circle);
            p_path.push(each.coord);
            bounds.extend(circle.getCenter());
        }

        //path
        path = drawPath(p_path, 'yellow', true);
        gm_store.push(path);
        var map = document.querySelector('google-map').map;
        map.fitBounds(bounds);
    },

    toggleCurrTypToast: function(e){
        this.$$('#toast-exist-curr-typ').toggle();
    },

    dismissCurrTypInfo: function(e){
        this.$$('#toast-exist-curr-typ').close();
    },

    addPathToList: function(e){
        var res = this.$.getPathAjax.lastResponse;

        var path_map_obj = [];
        var plyLn = [];

        var infoWin = this.infoWin;

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
            var angle = getTyphoonAngle(res[x].wind_dir_50kt_plus||res[x].wind_dir_30kt_plus||-1, document.querySelector('#mainPanel').dirs);
            var color = getColorByTyphoonGrade(res[x].grade||6, document.querySelector('#mainPanel').grades);
            var mkr = drawTyphoonICON(lat, lng, angle, color);

            mkr.iw_html = getContentStrIW(this.intl_req_name, res[x]);
            mkr.intl_no = res[x].intl_no;
            mkr.date = res[x].rec_time;
            mkr.typ_name = this.intl_req_name;

            mkr.addListener('click', function(e){
                Util.log('mkr click');
                var map = document.querySelector('google-map').map;
                infoWin.setContent(this.iw_html);
                infoWin.open(map, this);

                document.querySelector('#predict-info').fire('iron-signal', {
                    name: 'predictinfotrigger',
                    data: {
                        intl_no: this.intl_no,
                        date: this.date,
                        typ_name: this.typ_name,
                        latLng: this.getPosition()
                    }
                });
                document.querySelector('#predict-info').show();
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

    getTypHeatMapData: function(){
        this.$$('#getTypHeatMapDataAjax').generateRequest();
    },

    _computeTimezone: function(date){
        return moment.tz(date,moment.tz.guess()).format('MMM DD YYYY HH:mm z');
    },

    _currTypInit: function(e, detail, sender){
        Util.log('Inbound init data...');
        this.curr_typ = detail.map(function(each){
            each.isOnMap = false;
            each.gmElems = document.querySelector('#mainPanel').renderGmElements(each);
            return each;
        });
        this.exist_curr_typ = !(this.curr_typ.length === 0);
    },

    _currTypUpdate: function(e, detail, sender){
        Util.log("Inbound update data...");

        detail.record.forEach(function(each){
            each.isOnMap = false
            each.gmElems = [];
            document.querySelector('#mainPanel').curr_typ = document.querySelector('#mainPanel').curr_typ.push(each);
        });
        var curr_typ = document.querySelector('#mainPanel').curr_typ;
        detail.track.forEach(function(each){
            for(idx in curr_typ){
                if(curr_typ[idx].intl_no === each.intl_no){
                    curr_typ[idx].tracks.unshift(each);
                    var angle = getTyphoonAngle(each.wind_dir_50kt_plus||each.wind_dir_30kt_plus||-1, document.querySelector('#mainPanel').dirs);
                    var color = getColorByTyphoonGrade(each.grade||6, document.querySelector('#mainPanel').grades);
                    var lat = each.loc[1];
                    var lng = each.loc[0];
                    var mkr = renderTyphoonMkr(angle, lat, lng, color);
                    mkr.iw_html = getContentStrIW(temp[idx].name, each);
                    mkr.intl_no = each.intl_no;
                    mkr.date = each.rec_time;
                    mkr.typ_name = temp[idx].name;

                    mkr.addListener('click', function(e){
                        Util.log('mkr click');
                        var map = document.querySelector('google-map').map;
                        document.querySelector('#mainPanel').infoWin.setContent(this.iw_html);
                        document.querySelector('#mainPanel').infoWin.open(map, this);
                        document.querySelector('#predict-info').fire('iron-signal', {
                            name: 'predictinfotrigger',
                            data: {
                                intl_no: this.intl_no,
                                date: this.date,
                                typ_name: this.typ_name,
                                latLng: this.getPosition()
                            }
                        });
                        document.querySelector('#predict-info').show();
                    });
                    curr_typ[idx].gmElems.unshift(mkr);

                    if(curr_typ[idx].gmElems.length === 1){
                        //create
                        var path = renderPath([{lat:each.loc[1], lng:each.loc[0]}]);
                        path.addListener('mouseover', function(){
                            Util.log('path mouseover');
                            this.setOptions({strokeColor: Util.ColorLuminance(this.oldColor, 0.6)});
                        });

                        path.addListener('mouseout', function(){
                            Util.log('path mouseout');
                            this.setOptions({strokeColor: this.oldColor});
                        });

                        curr_typ[idx].gmElems.push(path);
                    }else{
                        //push latlng
                        var path = curr_typ[idx].gmElems.pop();
                        path.setPath(path.getPath().unshift({lat:each.loc[1], lng:each.loc[0]}));
                        curr_typ[idx].gmElems.push(path);
                    }

                    break;
                }
            }
        });
    },

    renderGmElements: function(tcRecord){
        var tracks = tcRecord.tracks;

        //toMarkers
        var gmElems = tracks.map(function(each){
            var angle = getTyphoonAngle(each.wind_dir_50kt_plus||each.wind_dir_30kt_plus||-1, document.querySelector('#mainPanel').dirs);
            var color = getColorByTyphoonGrade(each.grade||6, document.querySelector('#mainPanel').grades);
            var lat = each.loc[1];
            var lng = each.loc[0];
            var mkr = renderTyphoonMkr(angle, lat, lng, color);
            mkr.iw_html = getContentStrIW(tcRecord.name, each);
            mkr.intl_no = each.intl_no;
            mkr.date = each.rec_time;
            mkr.typ_name = tcRecord.name;

            mkr.addListener('click', function(e){
                Util.log('mkr click');
                var map = document.querySelector('google-map').map;
                document.querySelector('#mainPanel').infoWin.setContent(this.iw_html);
                document.querySelector('#mainPanel').infoWin.open(map, this);
                document.querySelector('#predict-info').fire('iron-signal', {
                    name: 'predictinfotrigger',
                    data: {
                        intl_no: this.intl_no,
                        date: this.date,
                        typ_name: this.typ_name,
                        latLng: mkr.getPosition()
                    }
                });
                document.querySelector('#predict-info').show();
            });
            return mkr;
        });

        var coords = tracks.map(function(each){
            return {lat: each.loc[1], lng: each.loc[0]};
        });

        var path = renderPath(coords);
        path.addListener('mouseover', function(){
            Util.log('path mouseover');
            this.setOptions({strokeColor: Util.ColorLuminance(this.oldColor, 0.6)});
        });

        path.addListener('mouseout', function(){
            Util.log('path mouseout');
            this.setOptions({strokeColor: this.oldColor});
        });

        gmElems.push(path);

        return gmElems;
    },

    toggleShowCurrTyp: function(e){
        var index = e.model.index;
        if(this.curr_typ[index].isOnMap){
            this.curr_typ[index].isOnMap = false;
            //setmap null
            bulkSetMap(null, this.curr_typ[index].gmElems);
        }else{
            this.curr_typ[index].isOnMap = true;
            //setmap map
            var map = document.querySelector('google-map').map;
            bulkSetMap(map, this.curr_typ[index].gmElems);
        }
    },

    _isUsing: function(des){
        return 'Not used' !== des;
    },

    _joinHSB: function(hsb){
        return hsb.join();
    }
});