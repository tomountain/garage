
client = new Paho.MQTT.Client('123.141.37.37', Number(65403), "clientId111");
client.onConnectionLost = onConnectionLost;
client.onMessageArrived = onMessageArrived;
client.connect({onSuccess:onConnect});

function onConnect() {
  // Once a connection has been made, make a subscription and send a message.
  console.log("onConnect");
  client.subscribe("/oneM2M/req/+/S0.2.481.1.20160426030113637/#");
};

function onConnectionLost(responseObject) {
  if (responseObject.errorCode !== 0)
    console.log("onConnectionLost:"+responseObject.errorMessage);
};

function onMessageArrived(message) {
  console.log("onMessageArrived:"+message.payloadString);
};	