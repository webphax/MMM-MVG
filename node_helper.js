var NodeHelper = require("node_helper");
var request = require('request');

module.exports = NodeHelper.create({
	// Subclass start method.
	start: function () {
		var self = this;
		console.log("Starting module: " + this.name);
	},

	// Override socketNotificationReceived method.
	socketNotificationReceived: function (notification, payload) {
		if (notification === "ADD_ITEMS") {
			this.sendBackData(payload);
		}
	},

	/* sendBackData(payload)
	 * Request data for all given stations.
	 */
	sendBackData: function (payload) {
		var self = this;
		var completed_requests = 0;
		var responses = [];
		
		payload.stations.forEach(function (station) {
			request({
				url: station.url,
				encoding: 'binary',
			}, function (error, response, body) {
				if (!error && response.statusCode == 200) {
					responses.push(body);
					if (completed_requests++ == payload.stations.length - 1) {
						self.sendSocketNotification("ITEMS_ADDED", {
							identifier: payload.identifier,
							data: responses
						});
					}
				}
			})
		}, this);
	}
});