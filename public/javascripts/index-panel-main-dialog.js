/**
 * Created by Thomas on 18/1/2016.
 */
Polymer({
    is: "index-panel-main-dialog",

    listeners: {
        'searchAjax.request': 'searchAjaxOnReq',
        //'searchAjax.response': 'searchAjaxOnRes',
        'listAll.tap': 'listAllTyphoon',
        'typListbox.iron-items-changed': 'searchAjaxOnRes',
        'typListbox.iron-select': 'drawTyphoon'
    },

    ready: function(){
        Util.log("index-panel-main-dialog ready!");
    },

    searchAjaxOnReq: function(e){
        Util.log('searchAjax obj on request!');
        this.$$('#search-progress-bar').disabled = false;
    },

    searchAjaxOnRes: function(e){
        Util.log('searchAjax obj on response!');
        this.$$('#search-progress-bar').disabled = true;
    },

    listAllTyphoon: function(e){
        this.criteria = 'list';
    },

    drawTyphoon: function(e){
        Util.log('onselect');
        Util.log(this.ajaxResponse[this.selectedTyp]);
    },

    statusClass: function(idx){
        switch(idx){
            case 0:
                return 'typhoon-status-inactive';
            case 1:
                return 'typhoon-status-outofrange';
            default:
                return 'typhoon-status-active';
        }
    }
});
