/**
 * Created by Thomas on 2/3/2016.
 */
var schedule = require('node-schedule');
var CurrTcQuery = require('./../DTO/curr_tc_query');
var cluster = require('cluster');

var socket = {
    io: null,

    soc_curr_typ: null,

    buffer: {
        'record': [],
        'track': []
    },

    BUFFER_TYPE: {
        RECORD: 'record',
        TRACK: 'track'
    },

    init: function(server, port){
        console.log('Init socketIO instance on worker: '+cluster.worker.id);
        this.io = require('socket.io').listen(server);
        this.soc_curr_typ = this.io.of('/socket_curr_typ');
        var mongo = require('socket.io-adapter-mongo');
        this.io.adapter(mongo({ host: 'localhost', port: 27017, db: 'socketsub' }));

        this.soc_curr_typ.on('connection', function(getSocketInfo, io, socket){
            console.log('SOCKET(CONN,worker:' + cluster.worker.id + '): ' + getSocketInfo(socket));
            CurrTcQuery(6000, function(records){
                socket.emit('init', records);
            });
        }.bind(null, this.getSocketInfo, this.io));

        this.soc_curr_typ.on('message', function(getSocketInfo, socket){
            console.log('SOCKET(MSG): ' + this.getSocketInfo(socket));
        }.bind(null, this.getSocketInfo));

        this.soc_curr_typ.on('disconnect', function(getSocketInfo, socket){
            console.log('SOCKET(DISCONN): ' + this.getSocketInfo(socket));
        }.bind(null, this.getSocketInfo));

        console.log(new Date()+': Socket.IO listening...');

    },

    cacheUpdate: function(type, object){
        this.buffer[type].push(object);
    },

    broadcast: function(){
        //this.emit2Mongo('update', this.buffer, '/socket_curr_typ');
        CurrTcQuery(6000, function(emit, records){
            console.log('Emit update');
            emit('init', records, '/socket_curr_typ');
        }.bind(null, this.emit2Mongo));
        this.emptyCache();
    },

    emit2Mongo: function(event, obj, of){
        var io = require('socket.io-mongodb-emitter')({ host: 'localhost', port: 27017, db: 'socketsub' });
        if(of)
            io.of(of).emit(event, obj);
        else
            io.emit(event, obj);
    },

    emptyCache: function(){
        for(each in this.buffer){
            this.buffer[each] = [];
        }
    },

    getSocketInfo: function(socket){
        var idArr = socket.id.split('#');
        return 'OF: '+ idArr[0] + ', TOKEN: ' + idArr[1];
    },

}

module.exports = socket;