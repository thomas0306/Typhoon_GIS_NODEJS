/**
 * Created by Thomas on 18/2/2016.
 */
var JmaCrawler = require('./crawler/jma_crawler').JmaCrawler;
var ScheduleMining = require('./data_mining/schedule_mining').ScheduleMining;

JmaCrawler.init();
ScheduleMining.init();