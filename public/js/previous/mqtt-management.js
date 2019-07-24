var MqttConnection = [];

var MqttConnecionManager = (function() {
    
	var onMessageArrived = function (msg) {
		var clientId = this.clientId;
		var topic = msg.destinationName;
		
		try {
			if (MqttConnection[clientId]) {
				if (MqttConnection[clientId].subscribers[topic]) {
					for (var i = 0; i < (MqttConnection[clientId].subscribers[topic]).length; i++) {
						MqttConnection[clientId].subscribers[topic][i](msg);
					}
				}
			}
		} catch(err) {
			console.log(err);
		}
	};

	var getMqttConnectionCallback = function(options, data){
		
	}
	
    var getMqttConnection = function (options, callback) {
    	
//    	var mqBrokerUrl = 
//        var mqBrokerPort = ;
    	MqttPlatformManger.platformSelector(options, function(options, data){
    		var mqBroker = data;
    		var qos = 0;
        	var connectionOptions = {
    	    		useSSL : true,
    	    		cleanSession : true
    	    	};

        	var url = window.location.href;
    		if (url.indexOf("https") === 0) {
    			connectionOptions.useSSL = true;
    			mqBroker.port = 8883;
    		}
    		
    		mqBroker.clientId = "a:" + options.orgId + ':'  + 'iotsp_' + (Math.floor((1+Math.random()*100000))).toString(5);

            if (MqttConnection[mqBroker.clientId]) {
            	if (options.onConnect) {
            		options.onConnect();
            	}
    	    }
    	    else {
    	    	// Create a client instance
    	    	var client;
    	    	
    	    	client = new Paho.MQTT.Client(mqBroker.url, Number(mqBroker.port), mqBroker.clientId);

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
    	    	
    	    	connectionOptions.onFailure = function(invocationContext, errorCode, errorMessage) {
    	    		console.log('onFailure : ' + invocationContext + ', ' + errorCode);
    	    	}

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
    	    	
    	    	client.onMessageArrived = options.onMessageArrived;
//    	    	client.onMessageArrived = function(msg){
//    	    		console.log('msg');
//    	    	}
    	    	

    	    	// connect the client
    	    	client.connect(connectionOptions);
    	    		    
    	    	MqttConnection[mqBroker.clientId] = {};
    	    	MqttConnection[mqBroker.clientId].client = client;
    	    	MqttConnection[mqBroker.clientId].subscribers = [];
    	    }
        	return callback(MqttConnection[mqBroker.clientId]);	
    	});
    	
        
    };
        
    return {
    	getMqttConnection : getMqttConnection
    }
})();


var MqttData = (function() {    
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

    	//connection = MqttConnecionManager.getMqttConnection(options);
    	MqttConnecionManager.getMqttConnection(options, function(con){
    		connection = con;
    		monitorTopic = options.topic;
    		if (options.onMessageArrived) {
    	    	if (!connection.subscribers[monitorTopic]) {
    	    		connection.subscribers[monitorTopic] = [options.onMessageArrived];
    	    	} else {
    	    		connection.subscribers[monitorTopic].push(options.onMessageArrived);
    	    	}
    		}	
    	});
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
        //connection = MqttConnecionManager.getMqttConnection(options);
    	MqttConnecionManager.getMqttConnection(options, function(con){
    		connection = con;
    		monitorTopic = options.topic;
    		if (options.onMessageArrived) {
    	    	if (connection.subscribers[monitorTopic]) {
    	    		for (var i = 0; i < connection.subscribers[monitorTopic].length; i++) {
    	    			if (options.onMessageArrived === connection.subscribers[monitorTopic][i]) {
    	    				connection.subscribers[monitorTopic].splice(i, 1);
    	    			}
    	    		}
    	    	}
    		}
    	});
        

    };
    
    var subscribeData = function(options) {
        var eventTopic = "iot-2/type/" + options.deviceType + "/id/" + options.deviceId + "/evt/status/fmt/json";
        var connection = null;
        
        
       	// called when the client connects
    	options.onConnect = function() {
    		// Once a connection has been made, make a subscription and send a message.
			console.log("onConnect");
			if (connection != null) {
				var subscribeOptions = {
						qos : 0,
						onSuccess : function() {
							console.log("subscribed to " + eventTopic);
						},
						onFailure : function(){
							console.log("Failed to subscribe to " + eventTopic);
							console.log("As messages are not available, visualization is not possible");
						}
					};
				connection.client.subscribe(eventTopic, subscribeOptions);
								
			}
    	}
    	//connection = MqttConnecionManager.getMqttConnection(options);
    	MqttConnecionManager.getMqttConnection(options, function(con){
    		connection = con;
    		eventTopic = options.topic;
    		if (options.onMessageArrived) {
    	    	if (!connection.subscribers[eventTopic]) {
    	    		connection.subscribers[eventTopic] = [options.onMessageArrived];
    	    	} else {
    	    		connection.subscribers[eventTopic].push(options.onMessageArrived);
    	    	}
    		}
    	});
    	//connection = MqttConnecionManager.getMqttConnection(options);
 
		
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
    	//connection = MqttConnecionManager.getMqttConnection(options);
    	MqttConnecionManager.getMqttConnection(options, function(con){
    		connection = con;
    		eventTopic = options.topic;
        	if (options.onMessageArrived) {
    	    	if (connection.subscribers[eventTopic]) {
    	    		for (var i = 0; i < connection.subscribers[eventTopic].length; i++) {
    	    			if (options.onMessageArrived === connection.subscribers[eventTopic][i]) {
    	    				connection.subscribers[eventTopic].splice(i, 1);
    	    			}
    	    		}
    	    	}
    		}
    	});
    	
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
    	
    	//connection = MqttConnecionManager.getMqttConnection(options);
    	MqttConnecionManager.getMqttConnection(options, function(con){
    		connection = con;
    		commandTopic = options.topic;
        	if (options.onMessageArrived) {
    	    	if (!connection.subscribers[eventTopic]) {
    	    		connection.subscribers[eventTopic] = [options.onMessageArrived];
    	    	} else {
    	    		connection.subscribers[eventTopic].push(options.onMessageArrived);
    	    	}
    		}
    	});

    };    
    
	return {
		subscribeMonitor: subscribeMonitor,
		unsubscribeMonitor: unsubscribeMonitor,
		subscribeData: subscribeData,
		unsubscribeData: unsubscribeData,
		sendCommand: sendCommand
	}
}) ();


