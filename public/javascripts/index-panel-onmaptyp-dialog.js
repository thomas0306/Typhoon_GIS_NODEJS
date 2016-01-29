/**
 * Created by Thomas on 27/1/2016.
 */
Polymer({
    is: "index-panel-onmaptyp-dialog",

    properties: {
        req_intl_no: {
            type: String,
            value: ''
        },

        shownTypList: {
            type: Object,
            value: []
        },

        res: {
            type: Object
        }

    },

    listeners: {

    },

    ready: function () {
        Util.log("index-panel-onmaptyp-dialog ready!");
    },

    addShownTyp: function(e, detail, sender){
        Util.log('Receive added intl_no: ' + detail.intl_no);
        this.req_intl_no = detail.intl_no;
        this.$.getTypInfo.generateRequest();
    },

    addTypToList: function(e){
        var res = this.$.getTypInfo.lastResponse;
        if(this.shownTypList.length == 0){
            this.$.emptyTypList.setAttribute('style', 'display: none;');
        }
        this.shownTypList.push(res);
        var item = document.createElement('index-panel-onmaptyp-dialog-typ-list-item');
        item.name = res.name;
        item.intl_no = res.intl_no;
        item.last_status = res.last_status;
        document.querySelector('#typList').appendChild(item);
        Util.log(this.shownTypList);
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

    checkDisplaying: function(e, detail, sender){
        var isDisplaying = false;
        for(var x = 0; x < this.shownTypList.length; x++){
            if(this.shownTypList[x].intl_no === detail.intl_no)
                isDisplaying = true;
        }

        this.fire('iron-signal', {
            name: 'rtnisdisplaying',
            data: {
                intl_no: detail.intl_no,
                name: detail.name,
                isDisplaying: isDisplaying
            }
        });
    },

    deleteShownTyp: function(e, detail, sender){
        Util.log('receive delete request...')
        var intl_no = detail.intl_no;
        var found = false;
        for(var x = 0; x < shownTypList.length;  x++){
            if(shownTypList[x].intl_no === intl_no){
                found = true;
                shownTypList.splice(x, 1);
                break;
            }
        }
        if(found){
            //fire to main to delete markers
            Util.log('check complete, fire delete command to map');
        }
    }
});