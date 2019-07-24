/**
 * http://usejsdoc.org/
 */
var oneM2MMqttConnection = [];

var oneM2MMqttConnectionManager = (function() {
    
	var onMessageArrived = function (msg) {
		var clientId = this.clientId;
		var topic = msg.destinationName;
		
		try {
			if (oneM2MMqttConnection[clientId]) {
				if (oneM2MMqttConnection[clientId].subscribers[topic]) {
					for (var i = 0; i < (oneM2MMqttConnection[clientId].subscribers[topic]).length; i++) {
						oneM2MMqttConnection[clientId].subscribers[topic][i](msg);
					}
				}
			}
		} catch(err) {
			console.log(err);
		}
	};

    var getMqttConnection = function (options) {
//    	var mqBrokerUrl = "localhost";
//        var mqBrokerPort = 1883;
//        var mqBrokerUrl = "123.141.37.37";
//        var mqBrokerPort = 65403;
	      var mqBrokerUrl = "iot.eclipse.org";
	      var mqBrokerPort = 443;
    	
    	
        var qos = 0;
    	var connectionOptions = {
    			userSSL : true,
	    		cleanSession : true
	    	};

    	var url = window.location.href;
    	console.log("http : " + url);
		if (url.indexOf("https") === 0) {
			console.log("https : " + url);
			connectionOptions.useSSL = true;
			mqBrokerPort = 8883;
		}
		
        var clientId = "a:" + options.orgId + ':'  + options.apiKey + ":iotsp:" + (1+Math.random()*100000).toString(16);

        if (oneM2MMqttConnection[clientId]) {
        	if (options.onConnect) {
        		options.onConnect();
        	}
	    }
	    else {
	    	// Create a client instance
	    	var client;
	    	
	    	client = new Paho.MQTT.Client(mqBrokerUrl, Number(mqBrokerPort), clientId);

	    	// called when the client connects
	    	var onDefaultConnect = function() {
	    		// Once a connection has been made, make a subscription and send a message.
	    		console.log("onConnect");
	    	};
	    	
	    	var connectionSuccess = options.onConnect;
	    	
	    	if (!connectionSuccess) {
	    		connectionSuccess = onDefaultConnect;
	    	}
	    	
	    	connectionOptions.onSuccess = connectionSuccess;

	    	// called when the client loses its connection
	    	// set callback handlers
	    	if (options.onConnectionLost) {
	    		client.onConnectionLost = options.onConnectionLost;
	    	}
	    	else {
	    		client.onConnectionLost = function(responseObject) {
		    		if (responseObject.errorCode !== 0) {
		    			console.log("onConnectionLost:" + responseObject.errorMessage);
		    		}
		    		client.connect(connectionOptions);
		    	};;
	    	}
	    	
	    	client.onMessageArrived = onMessageArrived;

	    	// connect the client
	    	client.connect(connectionOptions);
	    	oneM2MMqttConnection[clientId] = {};
	    	oneM2MMqttConnection[clientId].client = client;
	    	oneM2MMqttConnection[clientId].subscribers = [];
	    }
    	return oneM2MMqttConnection[clientId];
    };
        
    return {
    	getMqttConnection : getMqttConnection
    }
})();


var oneM2MMqttData = (function() {    
    var subscribeMonitor = function(options) {
        var monitorTopic = "iot-2/type/" + options.deviceType + "/id/" + options.deviceId + "/mon";   
        var connection = null;
        
       	// called when the client connects
    	options.onConnect = function () {
    		// Once a connection has been made, make a subscription and send a message.
    		console.log("onConnect");
    		if (connection != null) {
    			connection.client.subscribe(monitorTopic);
    		}
    	}
    	
    	// called when a message arrives
    	var onMessageArrived = function (message) {
    		console.log("onMessageArrived:" + message);
    	}

    	connection = oneM2MMqttConnectionManager.getMqttConnection(options);
    	
		if (options.onMessageArrived) {
	    	if (!connection.subscribers[monitorTopic]) {
	    		connection.subscribers[monitorTopic] = [options.onMessageArrived];
	    	} else {
	    		connection.subscribers[monitorTopic].push(options.onMessageArrived);
	    	}
		}
    };
    
    var unsubscribeMonitor = function(options) {
        var monitorTopic = "iot-2/type/" + options.deviceType + "/id/" + options.deviceId + "/mon";
        var connection = null;
        
        options.onConnect = function() {
    		// Once a connection has been made, make a subscription and send a message.
    		console.log("onConnect");
    		if (connection != null) {
    			connection.client.unsubscribe(monitorTopic);
    		}
    	}
        connection = oneM2MMqttConnectionManager.getMqttConnection(options);
        
		if (options.onMessageArrived) {
	    	if (connection.subscribers[monitorTopic]) {
	    		for (var i = 0; i < connection.subscribers[monitorTopic].length; i++) {
	    			if (options.onMessageArrived === connection.subscribers[monitorTopic][i]) {
	    				connection.subscribers[monitorTopic].splice(i, 1);
	    			}
	    		}
	    	}
		}
    };
    
    var subscribeData = function(options) {
        //var eventTopic = "iot-2/type/" + options.deviceType + "/id/" + options.deviceId + "/evt/status/fmt/json";
        var eventTopic = "/oneM2M/req/+/S0.2.481.1.21160310105204806";
        var connection = null;
        
       	// called when the client connects
    	options.onConnect = function() {
    		// Once a connection has been made, make a subscription and send a message.
			console.log("onConnect");
			if (connection != null) {
				connection.client.subscribe(eventTopic);
			}
    	}
    	
    	connection = oneM2MMqttConnectionManager.getMqttConnection(options);
 
		if (options.onMessageArrived) {
	    	if (!connection.subscribers[eventTopic]) {
	    		connection.subscribers[eventTopic] = [options.onMessageArrived];
	    	} else {
	    		connection.subscribers[eventTopic].push(options.onMessageArrived);
	    	}
		}
    };
    
    var unsubscribeData = function(options) {
        var eventTopic = "iot-2/type/" + options.deviceType + "/id/" + options.deviceId + "/evt/status/fmt/json";
        var connection = null;
    	options.onConnect = function() {
    		// Once a connection has been made, make a subscription and send a message.
    		console.log("onConnect");
    		if (connection != null) {
    			connection.client.unsubscribe(eventTopic);
    		}
    	}
    	connection = oneM2MMqttConnectionManager.getMqttConnection(options);
    	
    	if (options.onMessageArrived) {
	    	if (connection.subscribers[eventTopic]) {
	    		for (var i = 0; i < connection.subscribers[eventTopic].length; i++) {
	    			if (options.onMessageArrived === connection.subscribers[eventTopic][i]) {
	    				connection.subscribers[eventTopic].splice(i, 1);
	    			}
	    		}
	    	}
		}
    };
    
    var sendCommand = function(options) {
    	
        var commandTopic = "iot-2/type/" + options.deviceType + "/id/" + options.deviceId + "/cmd/stop/fmt/json";
        var connection = null;

    	// called when the client connects
        options.onConnect = function () {
    		// Once a connection has been made, make a subscription and send a message.
    		console.log("onConnect");
    		
    		message = new Paho.MQTT.Message(options.commandJson);
    		message.destinationName = commandTopic;
    		if (connection != null) {
    			connection.client.send(message);
    		}
    	}

    	// called when a message arrives
    	var onDefaultMessageArrived = function (message) {
    		console.log("onMessageArrived:" + message);
    	}
    	
    	connection = oneM2MMqttConnectionManager.getMqttConnection(options);
        
    	if (options.onMessageArrived) {
	    	if (!connection.subscribers[eventTopic]) {
	    		connection.subscribers[eventTopic] = [options.onMessageArrived];
	    	} else {
	    		connection.subscribers[eventTopic].push(options.onMessageArrived);
	    	}
		}
    };    
    
	return {
		subscribeMonitor: subscribeMonitor,
		unsubscribeMonitor: unsubscribeMonitor,
		subscribeData: subscribeData,
		unsubscribeData: unsubscribeData,
		sendCommand: sendCommand
	}
}) ();


