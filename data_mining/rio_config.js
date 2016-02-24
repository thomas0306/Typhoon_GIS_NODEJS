/**
 * Created by Thomas on 23/2/2016.
 */
var rio_helper = {
    rio: require('rio'),
    options : {
        host : "localhost",
        port : 6311,
        callback: this.callback
    },
    code:[],
    code2command: function(){
        var cmd = this.code.join(';');
        this.code = [];
        return cmd;
    },
    evaluate: function(){
        if(!this.code.length){
            return "No code to be processed!";
        }

        this.options.command = this.code2command();
        this.rio.enableDebug(true);
        this.rio.evaluate(this.options);
    },
    callback: function(err, val){
        if (!err) {
            console.log("RETURN:"+val);
        } else {
            console.log("ERROR:Rserve call failed");
            console.error(err);
        }
    }
};

module.exports.rio_helper = rio_helper;