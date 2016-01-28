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

        var item = document.createElement('div');
        item.setAttribute('class', 'cus-item-body');
        var firstNode = document.createElement('div');
        firstNode.setAttribute('class', 'cus-inner-item');
        item.appendChild(firstNode);
        var middleNode = document.createElement('div');
        middleNode.setAttribute('class', 'cus-inner-item');
        middleNode.innerHTML = res.name;
        item.appendChild(middleNode);
        var lastNode = document.createElement('div');
        lastNode.setAttribute('class', 'cus-inner-item');
        lastNode.innerHTML = res.intl_no;
        item.appendChild(lastNode);
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
    }
});