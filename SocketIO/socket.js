/**
 * Created by Thomas on 2/3/2016.
 */
var schedule = require('node-schedule');
var CurrTcQuery = require('./../DTO/curr_tc_query');

var socket = {
    io: null,

    buffer: {
        'record': [],
        'track': []
    },

    BUFFER_TYPE: {
        RECORD: 'record',
        TRACK: 'track'
    },

    init: function(server, port){
        this.io = require('socket.io').listen(server);


        var typ_socket = this.io.of('/socket_curr_typ');

        typ_socket.on('connection', function(getSocketInfo, io, socket){
            console.log('SOCKET(CONN): ' + getSocketInfo(socket));
            CurrTcQuery(5000, function(records){
                socket.emit('init', records);
            });
        }.bind(null, this.getSocketInfo, this.io));

        typ_socket.on('message', function(getSocketInfo, socket){
            console.log('SOCKET(MSG): ' + this.getSocketInfo(socket));
        }.bind(null, this.getSocketInfo));

        typ_socket.on('disconnect', function(getSocketInfo, socket){
            console.log('SOCKET(DISCONN): ' + this.getSocketInfo(socket));
        }.bind(null, this.getSocketInfo));

    },

    cacheUpdate: function(type, object){
        this.buffer[type].push(object);
    },

    broadcast: function(){
        this.io.emit('update', this.buffer);
        this.emptyCache();
    },

    emptyCache: function(){
        for(each in this.buffer){
            buffer[each] = [];
        }
    },

    getSocketInfo: function(socket){
        var idArr = socket.id.split('#');
        return 'OF: '+ idArr[0] + ', TOKEN: ' + idArr[1];
    },

}

module.exports = socket;