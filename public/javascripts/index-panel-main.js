/**
 * Created by Thomas on 18/1/2016.
 */
Polymer({
    is: "index-panel-main",

    ready: function(){
        Util.log("index-panel-main ready!");
    },

    properties: {
        googleMap: {
            apiKey: 'AIzaSyCg41XC9fHNb22opdSPUWHrLSpS6dxzRzw',
            defMapCent: {lat: 20.021561, lng:125.248601},
            defZoomLvl: 5
        }
    },

    listeners: {
        'drawer-toggle.tap' : 'toggleDrawer',
        'search-dialog-toggle.tap' : 'toggleSearchDialog'
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
            dialog.open();
    }
});
