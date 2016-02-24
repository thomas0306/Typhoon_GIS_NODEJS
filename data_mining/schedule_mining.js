/**
 * Created by Thomas on 24/2/2016.
 */
var schedule = require('node-schedule');

var ScheduleMining = {
    instance: undefined,

    PATTERN: '00 00 03 * * *',

    rio_helper: require('./rio_config').rio_helper,

    init: function () {
        this.instance = schedule.scheduleJob(this.PATTERN, this.mine.bind(null, this));
    },

    mine: function (instance) {
        console.log(new Date()+': Start data mining');
        instance.rio_helper.code.push("source('/project/typhoon_gis/r_script/script.R');");
        instance.rio_helper.evaluate();
    }
}

module.exports.ScheduleMining = ScheduleMining;