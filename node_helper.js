var NodeHelper = require("node_helper");
var request = require('request');

module.exports = NodeHelper.create({
	// Subclass start method.
	start: function() {
		console.log("Starting module: " + this.name);
	},

    // Override socketNotificationReceived method.
	socketNotificationReceived: function(notification, payload) {
		if (notification === "ADD_ITEMS") {
			this.sendBackData(payload.url);
		}
	},

    /* sendBackData()
	 */
	sendBackData: function(url) {
        var self = this;
        request({
            url: url,
            encoding: 'binary',
        }, function (error, response, body) {
            if (!error && response.statusCode == 200) {
                self.sendSocketNotification("ITEMS_ADDED", body);
            }
        })
	}
});