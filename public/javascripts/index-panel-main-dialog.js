/**
 * Created by Thomas on 18/1/2016.
 */
Polymer({
    is: "index-panel-main-dialog",

    listeners: {
        'searchAjax.request': 'searchAjaxOnReq',
        'searchAjax.response': 'searchAjaxOnRes'
    },

    properties: {
      selectedTyp: {
          type: Object
      }
    },

    ready: function(){
        Util.log("index-panel-main-dialog ready!");
    },

    searchAjaxOnReq: function(e){
        Util.log('searchAjax obj on request!');
        this.$$('#search-spinner').active = true;
    },

    searchAjaxOnRes: function(e){
        Util.log('searchAjax obj on response!');
        this.$$('#search-spinner').active = false;
    },

    listAllTyphoon: function(e){
        this.criteria = 'list';
    },

    isDisplaying: function(e){
        Util.log('Typhoon list on select!');
        var idx = e.model.index;
        var typ_obj = this.ajaxResponse[idx];
        var intl_no = typ_obj.intl_no;
        var name = typ_obj.name;
        this.fire('iron-signal', {
            name: 'checkdisplaying',
            data: {
                intl_no:intl_no,
                name: name
            }
        });
    },

    addTyphoon: function(e, detail, sender){
        Util.log('Check displaying return!');
        if(detail.isDisplaying === false) {
            var intl_no = detail.intl_no;
            var name = detail.name;
            this.fire('iron-signal', {
                name: 'addintlno',
                data: {
                    intl_no: intl_no,
                    name: name
                }
            });
            var dialog = document.getElementById('paperDrawerPanel');
            if (dialog)
                dialog.closeDrawer();
        }else{
            Util.log('Already displaying...');
            this.$.t_isdisplaying.open();
        }
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
    },

    _computedClass: function(isSelected) {
        var classes = 'item';
        if (isSelected) {
            classes += ' selected';
        }
        return classes;
    },

    _computeTimezone: function(date){
        return moment.tz(date,moment.tz.guess()).format('lll z');
    }
});
