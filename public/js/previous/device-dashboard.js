/**
 * 
 */

IoTSP.DeviceDashboard = (function() {
	'use strict';
	
	var mqttApiKey, mqttAuthToken;
	
	$( "#needAPIKeyDialog" ).dialog({
		modal: true,
		autoOpen: false,
		width: 400,
		open: function(event, ui) {
			  $(this).closest('.ui-dialog').find('.ui-dialog-titlebar-close').hide();
		},
		buttons: {
			Close: function() {
				$( this ).dialog( "close" );
			}
		},
	});

	var trimUndefined = function(string) {
		if(typeof string == "string") {
			return (string != "undefined" ? string : "");
		}
		if(typeof string == "undefined") {
			return "";
		}
	};
	
	var buildDeviceList = function(data) {
		$("#device-table > tbody").empty()
		$.each(data, function(key,value) {

			var deviceId = value.deviceId;
			var deviceType = value.typeId;
			
			var deviceName = '';
			var modelName = '';
			var description = '';
			var deviceList;
			
			if (value.metadata) {
				deviceName = value.metadata.devicename;
				modelName = value.metadata.modelname;
				description = value.metadata.description;
				deviceList = value.metadata.devicelist;
			}
			
			var dateString = value.registration.date;
			var orgId = value.clientId.split(":")[1];
			
			var sensors = [];
			var acts = [];
			var tags = [];
			
			if (deviceList) {
				if (deviceList.Sensor) {
					sensors = deviceList.Sensor;
				}
				if (deviceList.Actuator) {
					acts = deviceList.Actuator;
				}
				if (deviceList.Tag) {
					tags = deviceList.Tag;
				}
			}
			      
			var dateAdded = new Date(dateString).toISOString();
	    
			sensors = sensors.length;
			acts = acts.length;
			tags = tags.length;
	      
			var waitingTd = "<div id=\"" + deviceId + "-status\">"
					+ "<div style=\"color: gray;\"><span class=\"glyphicon glyphicon-minus-sign\"></span>"
					+ " Waiting" 
					+ "</div>" 
				+ "</div>"; 
	          
			var graphDetailUrl = "/graph/graph.html?devicetype=" + deviceType + "&deviceid=" + deviceId + "&platformtype=" + sessionStorage.getItem("CurrentType");
	      
			var trContent = "<tr id='" + deviceId + "-ongraph'>" 
				+ "<td>" + waitingTd + "</td>"
				+ "<td>" + deviceId + "</td>"
				+ "<td>" + deviceType + "</td>"
				+ "<td>" + trimUndefined(deviceName) + "</td>"
				+ "<td>" + trimUndefined(modelName)+ "</td>"
				+ "<td>" + trimUndefined(description) + "</td>"
				+ "<td>" + sensors + "</td>"
				+ "<td>" + acts + "</td>" 
				+ "<td>" + tags + "</td>"
				+ "<td>" + dateAdded + "</td>"
				+ "</tr>"; 
			
			trContent += "<tr id='" + deviceId + "-graph-row' class='device-graph-hidden'>" +
				"<td colspan='10' align='center'>" + 
					"<div>" + 
						"<div class='chart-info'>" + 
						"<section><div class='legent-text'>Sensors</div></section>" + 
						"<section><div id='" + deviceId + "-legend' class='device-legend'></div>" + 
						"</div></section>" + 
				 		"<div class='chart-container'>" +
							"<a href='" + graphDetailUrl + "' target='_blank'>" + 
								"<div id='" + deviceId + "-chart' class='device-chart'>" +
								"<img src='/graph/images/quickstartChart.svg' alt='Chart' align='middle' height=200px />" +
								"</div>" + 
								"<div id='" + deviceId + "-timeline'></div>" + 
							"</a>" + 
						"</div>" + 
					"</div>" + 
				"</td>" + 
			"</tr>";
	
			$("#device-table > tbody").append(trContent);
	
			var graphList = [];
			$("#" + deviceId + "-ongraph").click(function() {
				if ($("#" + deviceId + "-graph-row").hasClass("device-graph-hidden")) {
					$("#" + deviceId + "-graph-row").removeClass("device-graph-hidden").addClass("device-graph-show");
					if (graphList[deviceId]) {
						graphList[deviceId].showGraph();
					}
					else {
						graphList[deviceId] = new InnerGraph(orgId, deviceType, deviceId, mqttApiKey, mqttAuthToken);
						graphList[deviceId].showGraph();
					}
				}
				else {
					$("#" + deviceId + "-graph-row").removeClass("device-graph-show").addClass("device-graph-hidden");
					if (graphList[deviceId]) {
						graphList[deviceId].hideGraph();
					}
				}
			});

			if(sessionStorage.getItem('CurrentType') === 'IoTF'){
				var mqttInfo = new MqttInfo(orgId, deviceType, deviceId, mqttApiKey, mqttAuthToken);
				mqttInfo.checkConnection();
			}else if(sessionStorage.getItem('CurrentType') === 'oneM2M'){
//				var mqttInfo = new MqttInfo(orgId, deviceType, deviceId, mqttApiKey, mqttAuthToken);
//				mqttInfo.checkConnection();
			}
		});
	};

	var showDevices = function(orgId) {
		
		var type = sessionStorage.getItem("CurrentType");
		
		IoTSP.Data.getDeviceList(orgId, "", type, function(data) {
			var openCount = 0;
			$("#totalDevice").text(data.length);
	        
	        $.each(data, function(key,value) {    
	            if(value && value.metadata && value.metadata.locations) {
	                var deviceId = value.deviceId;
	                var deviceType = value.typeId;
	                var orgId = value.clientId.split(":")[1];
	                var privacy = value.metadata.privacy;
	                
	                if(privacy == "public"){
	                    ++openCount;
	                    $("#openDevice").text(openCount);
	                }
	
	                var lon = value.metadata.locations.lon;
	                var lat = value.metadata.locations.lat;
	
	                //var endpoint = value.metadata.endpointip.split(':');
//	                var endpointIp = value.metadata.endpointIp;
//	                var endpointPort = value.metadata.endpointPort;
	
	                var deviceList = value.metadata.devicelist;
	                var sensors = [];
	                var acts = [];
	                var tags = []; 
	                if (deviceList) {
	                	if (deviceList.Sensor) {
	                		sensors = deviceList.Sensor;
	                	}
	                	if (deviceList.Actuator) {
	                		acts = deviceList.Actuator;
	                	}
	                	if (deviceList.Tag) {
		                	tags = deviceList.Tag;
	                	}
	                }
	
	                IoTSP.DeviceMap.addDevice(lon, lat, orgId, deviceType, deviceId, sensors, acts, tags);
	            }
	
	        });
	        
	        buildDeviceList(data);	
		});
	};
	
	var update_dashboard = function() {
		
		var orgId = sessionStorage.getItem("CurrentOrgId");
		var type = sessionStorage.getItem("CurrentType");
		console.log('Enter update_dashboard(), ' + type + " " + orgId);
		
		
		if(type === 'oneM2M'){
			showDevices(orgId);
		}else{
			IoTSP.Data.getApiKeysByOrgId(orgId, type, function (data) {
				if(data && data.length > 0) {
					mqttApiKey = data[0].key; 
					mqttAuthToken = data[0].authToken;
					showDevices(orgId);
				} else {
					$( "#needAPIKeyDialog" ).dialog("open");
				}
			}, function() {
				$( "#needAPIKeyDialog" ).dialog("open");
			});	
		}
		
	};
	
	var getApiKey = function() {
		return {key: mqttApiKey, token: mqttAuthToken};
	};
	
	var init_dashboard = function() {
		IoTSP.DeviceMap.initDeviceMapView();
		IoTSP.i18nManagement.loadTextInDeviceDashboard();
	}; 
	
	return {
		init_dashboard: init_dashboard,
		update_dashboard: update_dashboard,
		getApiKey: getApiKey
	};
})();
