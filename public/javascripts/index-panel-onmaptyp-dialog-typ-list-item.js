/**
 * Created by Thomas on 28/1/2016.
 */
Polymer({
    is: 'index-panel-onmaptyp-dialog-typ-list-item',

    ready: function(e){
        Util.log('index-panel-onmaptyp-dialog-typ-list-item is ready!');
    },

    listeners: {
        'delete-typhoon.tap': 'deleteTyphoon'
    },

    properties: {
        name: {
            type: String,
            value: ""
        },

        intl_no: {
            type: String,
            value: ""
        }
    },

    deleteTyphoon: function(e){
        Util.log('delete button on tap!');
        this.remove();
        this.fire('iron-signal', {
            name: 'deleteshownintl',
            data: {
                intl_no: this.intl_no
            }
        });
    },

    statusClass: function(idx){
        switch(idx){
            case 0:
                Util.log('inactive');
                return 'typhoon-status-inactive';
            case 1:
                Util.log('out of range');
                return 'typhoon-status-outofrange';
            default:
                Util.log('active');
                return 'typhoon-status-active';
        }
    }
});