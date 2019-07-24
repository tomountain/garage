/**
 * 
 */

IoTSP.DeviceList = (function() {
	'use strict';
	var viewType = 'list';
	
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
	
	var newDeviceComponent = function (deviceId, deviceType, deviceName) {
		var newDevice = document.createElement('div');
		newDevice.className = 'deviceComponent';
		
		newDevice.innerHTML = '<div class="device-icon icon-gateway" style="background-image: url(http://iotexplorer.mybluemix.net/icons/devices/default.png);"></div>'
			+ '<div class="widget-title">' + deviceName + '</div>';
		
		newDevice.onclick = function() {
			IoTSP.DeviceDetail.load_device_detail(deviceType, deviceId);
		};
		
		return newDevice;
	};
	
	var buildDeviceList = function(orgId, type) {
		var key = IoTSP.DeviceDashboard.getApiKey();
		var mqttApiKey = key.key;
		var mqttAuthToken = key.token;
		
		var i = 0;
		
		var platformType = sessionStorage.getItem("CurrentType");

		IoTSP.Data.getDeviceList(orgId, type, platformType, function(data) {			
			if (viewType === 'list') {
				$('#device-list').html('<table class="table" style="table-layout: fixed;word-wrap:break-word;" id ="device-table">'
												+ '<thead>'
												+ '<tr>'
												+ '<th class="col-md-1"><span id="msg_gateway_id">ID</span></th>'
												+ '<th class="col-md-1"><span id="msg_gateway_type">Type</span></th>'
												+ '<th class="col-md-2"><span id="msg_gateway_name">Gateway Name</span></th>'
												+ '<th class="col-md-1"><span id="msg_model_name">Model Name</span></th>'
												+ '<th class="col-md-2"><span id="msg_description">Description</span></th>'
												+ '<th class="col-md-1"><span id="msg_number_of_sensors"># of sensors</span></th>'
												+ '<th class="col-md-1"><span id="msg_number_of_actuators"># of actuators</span></th>'
												+ '<th class="col-md-1"><span id="msg_number_of_tags"># fo tags</span></th>'
												+ '<th class="col-md-2"><span id="msg_date_added">Date added</span></th>'
												+ '</tr>'
												+ '</thead>'
												+ '<tbody>'
												+ '</tbody>');
			}
			else {
				$("#device-list").empty()
			}

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
				//var orgId = value.uuid.split(":")[1];
	
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
				
				if (viewType === 'list') {
					var dateAdded = new Date(dateString).toISOString();
			    
					sensors = sensors.length;
					acts = acts.length;
					tags = tags.length;
					
					var trContent = document.createElement('tr');
					
					if ((i % 2) !== 0) {
						trContent.style.backgroundColor = "aliceblue";
					}
			          
					trContent.innerHTML =  
						"<td>" + deviceId + "</td>"
						+ "<td>" + deviceType + "</td>"
						+ "<td>" + trimUndefined(deviceName) + "</td>"
						+ "<td>" + trimUndefined(modelName)+ "</td>"
						+ "<td>" + trimUndefined(description) + "</td>"
						+ "<td>" + sensors + "</td>"
						+ "<td>" + acts + "</td>" 
						+ "<td>" + tags + "</td>"
						+ "<td>" + dateAdded + "</td>";
					
					trContent.onclick = function() {
						IoTSP.DeviceDetail.load_device_detail(deviceType, deviceId, sessionStorage.getItem("CurrentType"));
					};
	
			
					$("#device-table > tbody").append(trContent);
					
					i++;
				}
				else {
					var newDevice = newDeviceComponent(deviceId, deviceType, deviceName);
					$("#device-list").append(newDevice);
				}
			});
		});
		
	};
	
	var init_device_list = function(type) {
		viewType = 'list';

		var orgId = sessionStorage.getItem("CurrentOrgId");
		$('#deviceAdd').click(function() {
			IoTSP.MainPage.changeContents('/idm/device-add-step1.html');
		});
		buildDeviceList(orgId, type);
		IoTSP.i18nManagement.loadTextInDeviceList();
//		
//		$('#display_device_list').click(function() {
//			if (viewType === 'block') {
//				viewType = 'list';
//				buildDeviceList(orgId, type);
//			}
//		});
//		
		$('#display_device_list').on("click",function(){ 
			if (viewType === 'block') {
				viewType = 'list';
				buildDeviceList(orgId, type);
			}
		});
		$('#display_device_icon').click(function() {
			if (viewType === 'list') {
				viewType = 'block';
				buildDeviceList(orgId, type);
			}
		});
	}; 
	
	
	var load_device_list = function (type) {
		IoTSP.MainPage.changeContents('/idm/device-list.html', function() {
			init_device_list(type);
		});
	};
	
	return {
		init_device_list: init_device_list,
		load_device_list: load_device_list
	};
})();
