/**
 * Created by Thomas on 6/8/15.
 */
var Util = {};
Util.promptMsg = function(message, position){
    var n = noty({
        text        : message,
        type        : 'information',
        dismissQueue: true,
        layout      : position,
        closeWith   : ['click'],
        theme       : 'relax',
        maxVisible  : 10,
        animation   : {
            open  : 'animated bounceInRight',
            close : 'animated bounceOutRight',
            easing: 'swing',
            speed : 500
        }
    });

    //setTimeout(function () {
    //    $.noty.close(n.options.id);
    //}, 5000);

    Util.log('Prompted message id: ' + n.options.id);
}

Util.promptTopRightMsg = function(message){
    Util.promptMsg(message, 'topRight');
}

Util.log = function(message){
    if(mode == 'debug')
        console.log(message);
}