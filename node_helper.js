/* Live Route Info */

/* Magic Mirror
 * Module: NSW Live Transport Route Info
 * By Ant Cole
 * MIT Licensed.
 */

var NodeHelper = require('node_helper');
var request = require('request');

module.exports = NodeHelper.create({
    start: function() {
        console.log('NSWLiveTransport helper started ...');
    },


    /* getTimetable()
     * Requests new data from https://transportnsw.info/
     * Sends data back via socket on succesfull response.
     */
    getTimetable: function(url, key) {
        var self = this;
        var retry = true;

        request({ url: url, method: 'GET', headers: {'authorization': key} }, function(error, response, body) {
            if (!error && response.statusCode == 200) {
                self.sendSocketNotification('BUS_DATA', { 'data': JSON.parse(body), 'url': url });
            }
        });
    },

    //Subclass socketNotificationReceived received.
    socketNotificationReceived: function(notification, payload) {
        if (notification === 'GET_BUSINFO') {
            this.getTimetable(payload.url, payload.key);
        }
    }

});