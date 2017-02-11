Module.register("MMM-MVG",{
	// Default module config.
	defaults: {
			url: "http://www.mvg-live.de/ims/dfiStaticAnzeige.svc?haltestelle=hackerbr%FCcke&ubahn=checked&bus=checked&tram=checked&sbahn=checked",
			maxConn: 5,     // How many connections would you like to see? (Maximum: 10)
			reload: 30   	// How often should the information be updated? (In seconds)
	},

	getStyles: function () {
        return ["MMM-MVG.css"];
    },

	// Override start method.
	start: function () {
		var self = this;

		Log.log("Starting module: " + this.name);

		this.mvgData = "";

		this.sendSocketNotification("ADD_ITEMS", {
			identifier: this.identifier,
			url: this.config.url
		});

		setInterval(
			function(){
				self.sendSocketNotification("ADD_ITEMS", {
					identifier: this.identifier,
					url: self.config.url
			});}
			,this.config.reload * 1000);
	},

	// Override socket notification handler.
	socketNotificationReceived: function (notification, payload) {
		if (notification === "ITEMS_ADDED" && payload.identifier === this.identifier) {
			this.mvgData = payload.data
		} else {
			Log.log(this.name + " received an unknown socket notification: " + notification);
		}

		this.updateDom(1000);
	},

	header: function() {
        var header = document.createElement("header");
		header.className = "align-left";
        header.innerHTML = unescape((this.config.url.split('haltestelle=')[1]||'').split('&')[0]);
        return header;
    },

	connectionTable: function(connections) {

		var parsedData = [{
			line: "",
			station: "",
			inMin: "",
		},];

		var parser = new DOMParser();
		var doc = parser.parseFromString(this.mvgData, "text/html");

		var rows = doc.getElementsByTagName('tr');
		for(var cnt = 1; cnt < rows.length; cnt++) {
			var cells = rows[cnt].getElementsByTagName('td');
			var row = [];

			var parsedDataObject = {
					line: "",
					station: "",
					inMin: "",
			};
			for (var count = 0; count < cells.length; count++) {
				if(cells[count].className == "lineColumn"){
					parsedDataObject['line'] = cells[count].innerText.trim();
				}
				if(cells[count].className == "stationColumn"){
					parsedDataObject['station'] = cells[count].innerText.trim();
				}
				if(cells[count].className == "inMinColumn"){
					parsedDataObject['inMin'] = cells[count].innerText.trim();
				}
			}
			parsedData.push(parsedDataObject);
		}

		//remove empty lines
		var i;
		for (i = parsedData.length - 1; i >= 0; i -= 1) {
			if (parsedData[i]['line'] === "" || parsedData[i]['station'] === "" || parsedData[i]['inMin'] === "") {
				parsedData.splice(i, 1);
			}
		}

		//sort by time
		parsedData.sort(
			function(a, b){
				return a['inMin'] - b['inMin']
			}
		);

        var table = document.createElement("table");
        table.classList.add("small", "table");
        table.border = '0';

        if (parsedData.length > 0) {
			for (i = 0; (i < parsedData.length) && (i < this.config.maxConn) && (i < 10); i++) { 
				var connectionRow = document.createElement("tr");
				connectionRow.className = "connectionRow";

				var line = document.createElement("td");
				line.innerHTML = parsedData[i]['line'];
				connectionRow.appendChild(line);

				var destination = document.createElement("td");
				destination.className = "light";
				destination.innerHTML = parsedData[i]['station'];
				connectionRow.appendChild(destination);

				var departure = document.createElement("td");
				departure.innerHTML = parsedData[i]['inMin'];
				connectionRow.appendChild(departure);

				table.appendChild(connectionRow);
			}
        } else {
            table.appendChild(this.connectionTableNoConnectionRow());
        }
        return table;
    },

	connectionTableNoConnectionRow: function() {
        var noConnectionRow = document.createElement("tr");
        var noConnection = document.createElement("td");
        noConnection.setAttribute("colSpan", "3");
        noConnection.innerHTML = "Keine Daten vorhanden";
        noConnectionRow.appendChild(noConnection);

        return noConnectionRow;
    },

	loader: function() {
        var loader = document.createElement("div");
        loader.innerHTML = "LOADING";
        loader.className = "small dimmed";
        return loader;
    },


	// Override dom generator.
    getDom: function() {
		var wrapper = document.createElement("div");
        wrapper.appendChild(this.header());
        if (this.mvgData) {
            wrapper.appendChild(this.connectionTable(this.mvgData));
        } else {
            wrapper.appendChild(this.loader());
        }
        return wrapper;
    },
});