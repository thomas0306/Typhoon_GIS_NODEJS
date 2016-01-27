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
        'typListbox.iron-select': 'addTyphoon'
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

    addTyphoon: function(e){
        Util.log('Typhoon list on select!');
        var idx = this.selectedTyp;
        var typ_obj = this.ajaxResponse[idx];
        var intl_no = typ_obj.intl_no;
        var name = typ_obj.name;
        this.fire('iron-signal', {
            name: 'addintlno',
            data: {
                intl_no:intl_no,
                name: name
            }
        });
        var dialog = document.getElementById('searchDialog');
        if(dialog)
            dialog.close();
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
