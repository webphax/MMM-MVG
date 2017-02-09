Module.register("MMM-MVG",{
	// Default module config.
	defaults: {
			url: "http://www.mvg-live.de/ims/dfiStaticAnzeige.svc?haltestelle=hackerbr%FCcke&ubahn=checked&bus=checked&tram=checked&sbahn=checked"
	},

	// Override start method.
	start: function () {
		Log.log("Starting module: " + this.name);

		this.mvgData = "";

		this.sendSocketNotification("ADD_ITEMS", {
			url: this.config.url
		});
	},

	// Override socket notification handler.
	socketNotificationReceived: function (notification, payload) {
		if (notification === "ITEMS_ADDED") {
			this.mvgData = payload
		} else {
			Log.log(this.name + " received an unknown socket notification: " + notification);
		}

		this.updateDom();
	},


	// Override dom generator.
    getDom: function() {
		var wrapper = document.createElement("div");
		wrapper.className = "small";

		var parser = new DOMParser();
		var doc = parser.parseFromString(this.mvgData, "text/html");

		var rows = doc.getElementsByTagName('tr');
		for(var cnt = 1; cnt < 6; cnt++) {
			var cells = rows[cnt].getElementsByTagName('td');
			var row = [];
			for (var count = 0; count < cells.length; count++) {
				if(cells[count].className == "lineColumn"){
					wrapper.innerHTML += cells[count].innerText.trim()+" / ";
				}
				if(cells[count].className == "stationColumn"){
					wrapper.innerHTML += cells[count].innerText.trim()+" / ";
				}
				if(cells[count].className == "inMinColumn"){
					wrapper.innerHTML += cells[count].innerText.trim();
				}
				
			}
			wrapper.innerHTML += "</br>";   
		}
		return wrapper;
    },
});