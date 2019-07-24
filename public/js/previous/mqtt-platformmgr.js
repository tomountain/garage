/**
 * 
 */
var MqttPlatformManger = (function() {
	var mqBroker = {};

	var platformSelector = function (options, callback){	
		var broker = {};
		var type = sessionStorage.getItem("CurrentType");
		if(type === null || type === 'IoTF'){
			broker.url = 'options.orgId + ".messaging.internetofthings.ibmcloud.com";';
			broker.port = '1883';
			broker.topic = 'iot-2/type/' + options.deviceType + '/id/' + options.deviceId + '/mon';
			broker.clientId = '';
			
			return callback(options, broker);
		}else if(type === 'oneM2M'){
//			broker.url = '123.141.37.37';
//			broker.port = '65425';
			broker.url = 'iot.eclipse.org';
			broker.port = '443';
			broker.clientId = '';
			$.ajax({
				url : iotfApiKeyOrgUrl.replace("{orgId}", sessionStorage.getItem('CurrentOrgId')),
				type : "get",
				beforeSend : function(jqXHR) {
					jqXHR.setRequestHeader("content-Type", "application/json; charset=utf-8");
					jqXHR.setRequestHeader("type", type);
					jqXHR.setRequestHeader("deviceId", options.deviceId);
					jqXHR.setRequestHeader("deviceType", options.deviceType);
				},
				success:function(data){
					data = data["m2m:aggregatedResponse"]["m2m:subscription"];
					if(data.length > 0){
						console.log(JSON.stringify(data));
						data = data[0]["notificationURI"].replace(/"/gi,'').replace("[","").replace("]","").split('/');
						console.log(data[data.length-1]);
						options.topic = '/oneM2M/req/+/' + data[data.length-1] + '/#';
						broker.topic = '/oneM2M/req/+/' + data[data.length-1] + '/#';
						
						return callback(options, broker);
					}else {
						$.ajax({
							url : addSubscription.replace("{orgId}", sessionStorage.getItem('CurrentOrgId')),
							type : "post",
							beforeSend : function(jqXHR) {
								jqXHR.setRequestHeader("content-Type", "application/json; charset=utf-8");
								jqXHR.setRequestHeader("type", type);
								jqXHR.setRequestHeader("deviceId", options.deviceId);
								jqXHR.setRequestHeader("deviceType", options.deviceType);
							},
							success:function(data){
								data = data["m2m:sub"]["nu"][0].replace(/"/gi,'').replace("[","").replace("]","").split('/')
								
								console.log(data[data.length-1]);
								options.topic = '/oneM2M/req/+/' + data[data.length-1] + '/#';
								broker.topic = '/oneM2M/req/+/' + data[data.length-1] + '/#';
								
								return callback(options, broker);
							}
						});
					}
				}
			});
		}
	}
	
	return {
		platformSelector : platformSelector
	}
	
})();
