/**
 * Created by Thomas on 18/1/2016.
 */
Polymer({
    is: "index-panel-main-toolbar",

    ready: function(){
        console.log("index-panel-main-toolbar ready!");
    },

    listeners: {
        'drawer-toggle.tap' : 'toggleDrawer'
    },

    toggleDrawer: function(e){
        console.log("drawer-toggle onTap");
        
    }
});
