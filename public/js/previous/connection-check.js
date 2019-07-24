'use strict';

var MqttInfo = function(orgId, deviceType, deviceId, apiKey, apiToken) {
    
	var mqBrokerUrl = orgId + ".messaging.internetofthings.ibmcloud.com";
    var mqBrokerPort = 1883;
    var qos = 0;
    
    var apiKey = apiKey; 
    var authToken = apiToken; 
        
    var monitorTopic = "iot-2/type/" + deviceType + "/id/" + deviceId + "/mon";    
    var monitorClientId = "a:" + orgId + ":" + deviceId + ":check";
    
    var eventTopic = "iot-2/type/" + deviceType + "/id/" + deviceId + "/evt/status/fmt/json";
    var eventClientId = "a:" + orgId + ":" + deviceId + ":read";
    
    var commandTopic = "iot-2/type/" + deviceType + "/id/" + deviceId + "/cmd/stop/fmt/json";
    var commandClientId = "a:" + orgId + ":" + deviceId + ":command";
    
    var connectMqtt = function(clientId, connectCallback, connectionLostCallback, messageArrivedCallback) {
    	var brokerPort = mqBrokerPort;
		var connectionOptions = {
			onSuccess : connectCallback,
			userName : apiKey,
			password : authToken,
			cleanSession : true
		};
		
		var url = window.location.href;
		
		// if use https, added useSSL to mqtt connection option
		if (url.indexOf("https") === 0) {
			connectionOptions.useSSL = true;
			brokerPort = 8883;
		}
		
    	var client = new Paho.MQTT.Client(mqBrokerUrl, Number(brokerPort), clientId);
    	
    	// set callback handlers
    	client.onConnectionLost = connectionLostCallback;
    	client.onMessageArrived = messageArrivedCallback;

		
    	// connect the client
    	client.connect(connectionOptions);
    	
    	return client;
    }
    
    this.checkConnection = function() {
    	// Create a client instance
    	console.log("MQTT checkConnection");
    	var client;
    	
    	var clientId = monitorClientId + ":show:" + deviceId;
    	
    	// called when the client connects
    	var onConnect = function()  {
    		// Once a connection has been made, make a subscription and send a message.
    		console.log("onConnect");
    		client.subscribe(monitorTopic);
    	}

    	// called when the client loses its connection
    	var onConnectionLost = function (responseObject) {
    		if (responseObject.errorCode !== 0) {
    			console.log("onConnectionLost:" + responseObject.errorMessage);
    		}
    	}

    	// called when a message arrives
    	function onMessageArrived(message) {
    		console.log("onMessageArrived:" + message.payloadString);

    		var msgJson = JSON.parse(message.payloadString);

    		if (msgJson.Action != null) {
    			if (msgJson.Action == "Connect") {
    				var statusDivId = deviceId + "-status";
				    var startTd = "<div id=\"" + deviceId + "-status\">" + 
				    	"<div style=\"color: green;\"><span class=\"glyphicon glyphicon-play\"></span>" +
			                " Connect" + 
			            "</div>" + 
			        "</div>";   
    			    
    				$("#" + statusDivId).html(startTd);
    				
    				var activeDevice = Number($("#activeDevice").text());
        	        $("#activeDevice").text(Number(activeDevice) + 1);
        	        
//        	        if(Number(curCount) > Number(totalCount) ) {
//	    				var inactiveCount = Number($("#inactiveDevice").text());
//	        	        $("#inactiveDevice").text(Number(inactiveCount) - 1);
//        	        }
//    				activeCount++;
        	        
    			} else if (msgJson.Action == "Disconnect") {
    				
    				var statusDivId = deviceId + "-status";
				    var stopTd = "<div id=\"" + deviceId + "-status\">" + 
			          "<div style=\"color: red;\"><span class=\"glyphicon glyphicon-stop\"></span>" +
			                " Disconnect" + 
			            "</div>" + 
			          "</div>";
				    
    				$("#" + statusDivId).html(stopTd);
    				
    				var inactiveCount = Number($("#inactiveDevice").text());
        	        $("#inactiveDevice").text(Number(inactiveCount) + 1);
//        	        if(Number(curCount) > Number(totalCount) ) {        	        
//	    				var activeDevice = Number($("#activeDevice").text());
//	        	        $("#activeDevice").text(Number(activeDevice) -1);
//        	        }
    			}			
    		}
    	}
    	
    	client = connectMqtt(clientId, onConnect, onConnectionLost, onMessageArrived); 
    };
    
    this.showConnection = function() {
    	var client;
    	
    	// called when the client connects
    	var onConnect = function () {
    		// Once a connection has been made, make a subscription and send a message.
    		console.log("onConnect");
    		client.subscribe(monitorTopic);
    	}

    	// called when the client loses its connection
    	var onConnectionLost = function (responseObject) {
    		if (responseObject.errorCode !== 0) {
    			console.log("onConnectionLost:" + responseObject.errorMessage);
    		}
    	}

    	// called when a message arrives
    	var onMessageArrived = function (message) {
    		console.log("onMessageArrived:" + message.payloadString);

    		var msgJson = JSON.parse(message.payloadString);
    		
    		if (msgJson.Action != null) {
    			if (msgJson.Action == "Connect") {
    				var htmlContent = "<span>Connected at " + msgJson.Time
    						+ "</span>";
    				$("#client_connected").html(htmlContent);
    				$("#client_connected").show();
    				$("#client_disconnected").hide();
    			} else if (msgJson.Action == "Disconnect") {
    				var htmlContent = "<span>Disconnected at " + msgJson.Time
    						+ ".</span><br/><span>" + msgJson.Reason + "</span>";
    				$("#client_disconnected").html(htmlContent);
    				$("#client_disconnected").show();
    				$("#client_connected").hide();
    			}
    			
    			
    		}
    	}
    	
    	client = connectMqtt(clientId, onConnect, onConnectionLost, onMessageArrived); 
    };    
    
    this.readData = function() {
    	var client;
    	
    	// called when the client connects
    	var onConnect = function () {
    		// Once a connection has been made, make a subscription and send a message.
    		console.log("onConnect");
    		client.subscribe(eventTopic);
    	}

    	// called when the client loses its connection
    	var onConnectionLost = function (responseObject) {
    		if (responseObject.errorCode !== 0) {
    			console.log("onConnectionLost:" + responseObject.errorMessage);
    		}
    	}

    	// called when a message arrives
    	var onMessageArrived = function (message) {
    		console.log("onMessageArrived:" + message.payloadString);

    		var msgJson = JSON.parse(message.payloadString);

    		if (msgJson.d != null) {
    			//{"d":{"temperature":5,"weather":3,"glaze":34}}
    			if (msgJson.d.temperature != null) {
    				g.refresh(msgJson.d.temperature);
    				$("#thermostatslider").val(msgJson.d.temperature).change();
    				$("#thermostatnumber").val(msgJson.d.temperature);
    			}
    			if (msgJson.d.weather != null) {
    				$("#weather")
    						.html(
    								"<i class=\"wi "
    										+ wiIcons[Number(msgJson.d.weather)]
    										+ "\" style=\"color:blue;font-size:130px;\"></i>");
    			}
    			if (msgJson.d.glaze != null) {
    				
    				var nowTime = new Date();
    				var rowCount = $("#historyTable > tbody").children().length;
    				
    				if(rowCount == 10) {
    					$("#historyTable > tbody:first").children().remove();
    				}
    				
    				$("#historyTable > tbody").append("<tr><td>"+ msgJson.d.glaze + "</td><td>" + new Date().toUTCString() + "</td></tr>");
    				
    				$("#updateValue").text(msgJson.d.glaze);
    			}
    		}
    	}
    	
    	client = connectMqtt(clientId, onConnect, onConnectionLost, onMessageArrived); 
    };
    
    
    this.sendCommand = function(commandJson) {
    	// Create a client instance
    	var client;
    	
    	// called when the client connects
    	var onConnect = function () {
    		// Once a connection has been made, make a subscription and send a message.
    		console.log("onConnect");
    		
    		message = new Paho.MQTT.Message(commandJson);
    		message.destinationName = commandTopic;
    		client.send(message);
    	}

    	// called when the client loses its connection
    	var onConnectionLost = function (responseObject) {
    		if (responseObject.errorCode !== 0) {
    			console.log("onConnectionLost:" + responseObject.errorMessage);
    		}
    	}

    	// called when a message arrives
    	var onMessageArrived = function (message) {
    		console.log("onMessageArrived:" + message.payloadString);

    	}
    	
    	client = connectMqtt(clientId, onConnect, onConnectionLost, onMessageArrived); 
    };    
    
    
    this._getMqBrokerUrl = function () { return mqBrokerUrl; };
    this._setMqBrokerUrl = function (newMqBrokerUrl) {
    	mqBrokerUrl = newMqBrokerUrl; 
    };
    
    this._getMqBrokerPort = function () { return mqBrokerPort; };
    this._setMqBrokerPort = function (newMqBrokerPort) {
    	mqBrokerPort = newMqBrokerPort;
    };
    
	this._getQos = function() { return qos; };
	this._setQos = function(newQos) { 
		if (newQos === 0 || newQos === 1 || newQos === 2 )
			qos = newQos;
		else 
			throw new Error("Invalid argument:"+newQos);
	};

	this._getApiKey = function() { return apiKey; };
	this._setApiKey = function(newApiKey) {
		apiKey = newApiKey;
	};

	this._getAuthToken = function() { return authToken; };
	this._setAuthToken = function(newAuthToken) {
		authToken = newAuthToken;
	};

	this._getMonitorTopic = function() { return monitorTopic; };
	this._setMonitorTopic = function(newMonitorTopic) {
		monitorTopic = newMonitorTopic;
	};

	this._getMonitorClientId = function() { return monitorClientId; };
	this._setMonitorClientId = function(newMonitorClientId) {
		monitorClientId = newMonitorClientId;
	};

	this._getEventTopic = function() { return eventTopic; };
	this._setEventTopic = function(newEventTopic) {
		eventTopic = newEventTopic;
	};

	this._getEventClientId = function() { return eventClientId; };
	this._setEventClientId = function(newEventClientId) {
		eventClientId = newEventClientId;
	};

	this._getCommandTopic = function() { return commandTopic; };
	this._setCommandTopic = function(newCommandTopic) {
		commandTopic = newCommandTopic;
	};

	this._getCommandClientId = function() { return commandClientId; };
	this._setCommandClientId = function(newCommandClientId) {
		commandClientId = newCommandClientId;
	}; 
};

//MqttInfo.prototype = {
//		
//	get mqBrokerUrl() { return this._getMqBrokerUrl(); },
//	set mqBrokerUrl(newMqBrokerUrl) { this._setMqBrokerUrl(); },
//
//	get mqBrokerPort() { return this._getMqBrokerPort(); },
//	set mqBrokerPort(newMqBrokerPort) { this._setMqBrokerPort(newMqBrokerPort); },
//
//	get qos() { return this._getQos(); },
//	set qos(newQos) { this._setQos(newQos); },
//	
//	get apiKey() { return this._getApiKey(); },
//	set apiKey(newApiKey) { this._setApiKey(newApiKey); },
//	
//	get AuthToken() { return this._getAuthToken(); },
//	set AuthToken(newAuthToken) { this._setAuthToken(newAuthToken); },
//	
//	get monitorTopic() { return this._getMonitorTopic(); },
//	set monitorTopic(newMonitorTopic) { this._setMonitorTopic(newMonitorTopic); },
//	
//	get monitorClientId() { return this._getMonitorClientId(); },
//	set monitorClientId(newMonitorClientId) { this._setMonitorClientId(newMonitorClientId); },
//	
//	get eventTopic() { return this._getEventTopic(); },
//	set eventTopic(newEventTopic) { this._setEventTopic(newEventTopic); },
//	
//	get eventClientId() { return this._getEventClientId(); },
//	set eventClientId(newEventClientId) { this._setEventClientId(newEventClientId); },
//	
//	get commandTopic() { return this._getCommandTopic(); },
//	set commandTopic(newCommandTopic) { this._setCommandTopic(newCommandTopic); },
//	
//	get commandClientId() { return this._getCommandClientId(); },
//	set commandClientId(newCommandClientId) { this._setCommandClientId(newCommandClientId); }
//};

var wiIcons = [ "wi-day-cloudy-gusts", "wi-day-cloudy-windy", "wi-day-cloudy",
		"wi-day-fog", "wi-day-hail", "wi-day-lightning", "wi-day-rain-mix",
		"wi-day-rain-wind", "wi-day-rain", "wi-day-showers", "wi-day-snow",
		"wi-day-sprinkle", "wi-day-sunny-overcast", "wi-day-sunny",
		"wi-day-storm-showers", "wi-day-thunderstorm", "wi-cloudy-gusts",
		"wi-cloudy-windy", "wi-cloudy", "wi-fog", "wi-hail", "wi-lightning",
		"wi-rain-mix", "wi-rain-wind", "wi-rain", "wi-showers", "wi-snow",
		"wi-sprinkle", "wi-storm-showers", "wi-thunderstorm",
		"wi-night-alt-cloudy-gusts", "wi-night-alt-cloudy-windy",
		"wi-night-alt-hail", "wi-night-alt-lightning", "wi-night-alt-rain-mix",
		"wi-night-alt-rain-wind", "wi-night-alt-rain", "wi-night-alt-showers",
		"wi-night-alt-snow", "wi-night-alt-sprinkle",
		"wi-night-alt-storm-showers", "wi-night-alt-thunderstorm",
		"wi-night-clear", "wi-night-cloudy-gusts", "wi-night-cloudy-windy",
		"wi-night-cloudy", "wi-night-hail", "wi-night-lightning",
		"wi-night-rain-mix", "wi-night-rain-wind", "wi-night-rain",
		"wi-night-showers", "wi-night-snow", "wi-night-sprinkle",
		"wi-night-storm-showers", "wi-night-thunderstorm", "wi-celcius",
		"wi-cloud-down", "wi-cloud-refresh", "wi-cloud-up", "wi-cloud",
		"wi-degrees", "wi-down-left", "wi-down", "wi-fahrenheit",
		"wi-horizon-alt", "wi-horizon", "wi-left", "wi-lightning",
		"wi-night-fog", "wi-refresh-alt", "wi-refresh", "wi-right",
		"wi-sprinkles", "wi-strong-wind", "wi-sunrise", "wi-sunset",
		"wi-thermometer-exterior", "wi-thermometer-internal", "wi-thermometer",
		"wi-tornado", "wi-up-right", "wi-up", "wi-wind-east",
		"wi-wind-north-east", "wi-wind-north-west", "wi-wind-north",
		"wi-wind-south-east", "wi-wind-south-west", "wi-wind-south",
		"wi-wind-west", "wi-windy" ];
