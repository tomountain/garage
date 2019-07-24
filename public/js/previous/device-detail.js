IoTSP.DeviceDetail = (function() {
	'use strict';
	
	var gatewayInfo = {};
	var resIndex = 0;
	
	var set_device_detail = function(data) {
		gatewayInfo = {};

		gatewayInfo.gatewayId = data.deviceId;
		gatewayInfo.gatewayType = data.typeId;
		
		gatewayInfo.gatewayName = '';
		gatewayInfo.gatewayDesc = '';
		
		if (data.metadata) {
			gatewayInfo.gatewayName = data.metadata.devicename;
			gatewayInfo.gatewayDesc = data.metadata.description;
			gatewayInfo.gatewaySpec = data.metadata.gatewayspec;
			gatewayInfo.privacy = data.metadata.privacy;
			gatewayInfo.locations = data.metadata.locations;
			gatewayInfo.devicelist = data.metadata.devicelist;			
		}
	};
	
	var display_device_detail = function() {
		var orgId = sessionStorage.getItem("CurrentOrgId");
		var deviceList = gatewayInfo.devicelist;
		var sensors = [];
		var acts = [];
		var tags = [];
		var metaLat = 0.0, metaLon = 0.0;
		var gatewayId = gatewayInfo.gatewayId;
		var gatewayType = gatewayInfo.gatewayType;
		
		resIndex = 0;
		
		$("#gatewayId").val(gatewayId);
		$("#gatewayName").val(gatewayInfo.gatewayName);				
		$("#gatewayDesc").val(gatewayInfo.gatewayDesc);
		
		var specOptions = '<option value="">Select a gatway specification</option>';
		IoTSP.CommonData.getDeviceSpecListByCategory('Gateway', function (specList) {
			for (var i = 0; i < specList.length; i++) {
				specOptions += '<option value="' + specList[i].uuid + '">' + specList[i].name + '</option>';
			}
			$('#gatewaySpecSelect').html(specOptions);
			if (gatewayInfo.gatewaySpec) {
				$("#gatewaySpecSelect").val(gatewayInfo.gatewaySpec);
			}
			$('#gatewaySpecSelect').select2();
		});

		if(gatewayInfo.locations){
			$("#alt").val(gatewayInfo.locations.alt);
			$("#lon").val(gatewayInfo.locations.lon);
			$("#lat").val(gatewayInfo.locations.lat);
			
			metaLat = gatewayInfo.locations.lat;
			metaLon = gatewayInfo.locations.lon;
		}
		
		$("#alt").addClass("noborder");
		$("#lon").addClass("noborder");
		$("#lat").addClass("noborder");

		$('#resourceList').empty();
		
		if (deviceList) {
			if (Object.keys(deviceList).length !== 0) {
				$('#msg_empty_resources').hide();
				$('#deviceSpecResourcesWrapper').show();
			}

			if (deviceList.Sensor) {
				sensors = deviceList.Sensor;
			}
			if (deviceList.Actuator) {
				acts = deviceList.Actuator;
			}
			if (deviceList.Tag) {
				tags = deviceList.Tag;
			}
			if (deviceList.Appliance) {
				tags = deviceList.Appliance;
			}
			
			var flowIdList = [];

			$.each(deviceList, function(key, value) {
				var deviceArray = [];
				
				for (var i = 0; i < value.length; i++) {
					var deviceObj = {}; 
					deviceObj["id"] = value[i].id;
					deviceObj["name"] = value[i].name;
					deviceObj["devicespec"] = value[i].devicespec;
					deviceArray.push(deviceObj);
					showResource(resIndex, value[i].id, value[i].name, value[i].devicespec.category, value[i].devicespec.uuid);
					resIndex++;
					
					if (value[i].devicespec.services && value[i].devicespec.services.length !== 0) {
						for (var j = 0; j < value[i].devicespec.services.length; j++) {
							if (value[i].devicespec.services[j].type === 'flow' && value[i].devicespec.services[j].metadata) {
								try {
									var serviceMeata = JSON.parse(value[i].devicespec.services[j].metadata);
									flowIdList.push(serviceMeata.flowid);
								} catch (e) {
								}
							}
						}
					}
				}
			});
			
			IoTSP.DeviceMap.updateDevice(metaLon, metaLat, orgId, gatewayType, gatewayId, sensors, acts, tags);
			IoTSP.DeviceMap.addBtnMarker(metaLat, metaLon);
			
			$("#map").hide();
			$("#mapView").show();
			
			if (flowIdList.length !== 0) {
				$("#deployServicesBtn").prop('disabled', false);
				$("#deployServicesBtn").on('click', function() {
					deployServices(flowIdList);
				});
			}
			else {
				$("#deployServicesBtn").prop('disabled', true);
			}
		} else {
			$('#msg_empty_resources').show();
			$('#deviceSpecResourcesWrapper').hide();
		}
	};
	
	var init_device_detail = function (gatewayType, gatewayId, currentType) {
		// id
		var cloned;
		
		IoTSP.DeviceMap.initDeviceMapView();
		IoTSP.DeviceMap.initDeviceLocationMap();

				
		IoTSP.Data.getDevice(gatewayType, gatewayId, currentType,
			function(data) {
				console.log(data);
				set_device_detail(data);
				display_device_detail();
				disableComponents();
			}, function(jqXHR, textStatus, errorThrown) {
			}
		);
		
		$("#device_Mbtn").click( function() {

			var check = $("#device_Mbtn > span").hasClass('glyphicon-pencil');
			
			if(check){    
				$("#gatewaySpecSelect").prop('disabled', false);
				$("#gatewayDesc").prop('disabled', false);
				
				$("#lat").prop('disabled', false);
				$("#lon").prop('disabled', false);
				$("#alt").prop('disabled', false);

				$("#addResourceBtn").prop('disabled', false);
				$("#saveBtn").prop('disabled', false);
				$('.deviceSpecResourceType').prop('disabled', false);
				$('.deviceSpecResourceID').prop('disabled', false);
				$('.deviceSpecResourceName').prop('disabled', false);
				$('.deviceSpecRemoveResource').prop('disabled', false);
				$('.deviceSpecResourceSpec').prop('disabled', false);


				$("#alt").removeClass("noborder");
				$("#lon").removeClass("noborder");
				$("#lat").removeClass("noborder");
				
				$("#device_Sbtn").click(device_SbtnClickEvent);
				
				$("#device_Mbtn > span").removeClass('glyphicon glyphicon-pencil').addClass('glyphicon glyphicon-remove');
				
				$("#map").show();
				$("#mapView").hide();
			} else {
				display_device_detail();
				disableComponents();
			}
		});
		
		$("#cancelBtn").click(function(e) { 
			IoTSP.MainPage.changeContents('/idm/device-dashboard.html');
			IoTSP.DeviceDashboard.update_dashboard();
		});
		
		$("#addResourceBtn").on('click', function() {
			$('#msg_empty_resources').hide();
			$('#deviceSpecResourcesWrapper').show();
			
			var newElement = IoTSP.DeviceSpecCommon.newResourceElement(resIndex, '', '');			
			$('#resourceList').append(newElement);
			
			IoTSP.DeviceSpecCommon.displayResourceDeviceCategory(resIndex, '', '');
			
			resIndex++;
		});  
				
		$("#saveBtn").on("click", device_SbtnClickEvent);
		
		$("#deleteDeviceBtn").on("click", function(){
			deleteGateway(gatewayType, gatewayId, sessionStorage.getItem("CurrentType"));
		});
		
		// display marker when the enter key pressed in lat, lon input field.
		$("#lat, #lon").on('keypress', function(e) {
			var lat = $("#lat").val();
			var lon = $("#lon").val();
		    if (e.which == 13) {/* 13 == enter key@ascii */
		        IoTSP.DeviceMap.addBtnMarker(lat, lon);
		    }
		});
		
		IoTSP.i18nManagement.loadTextInDeviceDetail();
	};
	
	var deployServices = function(specList) {
		IoTSP.Data.deployServices(gatewayInfo.gatewayId, {flowIds:specList}, function() {
			alert("Success to deploy");
		});
	};
		
	var showDeviceSpecList = function (specElement, category, callback) {
		var specOptions = '<option value="" data-desc="">Select a device specification</option>';
		if (category && category.length != 0) {
			IoTSP.CommonData.getDeviceSpecListByCategory(category, function (specList) {
				for (var i = 0; i < specList.length; i++) {
					specOptions += '<option value="' + specList[i].uuid + '" data-desc="UOM:' + specList[i].unit + ', Type = ' + specList[i].type + '">' + specList[i].name + '</option>';
				}
				specElement.html(specOptions);
				specElement.select2();
				if (callback) {
					callback();
				}
			});
		}
	};
		
	var showResource = function (resIndex, sId, sName, sCategory, sDeviceSpec) {
		$('#resourceList').append(IoTSP.DeviceSpecCommon.newResourceElement(resIndex, sId, sName));
		IoTSP.DeviceSpecCommon.displayResourceDeviceCategory(resIndex, sCategory, sDeviceSpec);
	};
		
	var device_SbtnClickEvent = function(e) {
		var check = $("#gatewayDesc").prop("disabled");
		if(check) {
			alert("There is no change.");
			return false;
		} else {
			alert("Would you like to change?");
			
			var deviceList = {};
			
			$('select.deviceSpecResourceType').each(function() {
				var resource = {};
				var idx = $(this).attr('idx');
							
				var category = $(this).val();
				resource.id = $('#deviceSpecResourceID'+idx).val();
				resource.name = $('#deviceSpecResourceName'+idx).val();
				resource.devicespec = $('#deviceSpecResourceSpec'+idx).val();
				
				if (!deviceList[category]) {
					deviceList[category] = [];
				}
				
				deviceList[category].push(resource);
			});
			
			updateGateway(deviceList);
			e.preventDefault();
		}			
	};

	var deleteGateway = function (gatewayType, gatewayId, currentType) {
		IoTSP.Data.deleteDevice(gatewayType, gatewayId , currentType, function() {
    		$('#deleteDeviceModal').on('hidden.bs.modal', function () {
    			IoTSP.MainPage.queryDeviceList();
    			IoTSP.MainPage.changeContents('/idm/device-dashboard.html');
    			IoTSP.DeviceDashboard.update_dashboard();
    		})
			$('#deleteDeviceModal').modal('hide');
		}, function(jqXHR, textStatus, errorThrown) {
		});
	};
	
	var updateGateway = function (deviceList){
		// JSON start
		var makeLocations = new Object();
		makeLocations['lat'] = $("#lat").val();
		makeLocations['lon'] = $("#lon").val();
		makeLocations['alt'] = $("#alt").val();

		var makeMetadata 	= new Object();
		makeMetadata['locations'] 	= makeLocations;
		makeMetadata['devicename']	= $("#gatewayName").val();
		makeMetadata['description']	= $("#gatewayDesc").val();
		makeMetadata['gatewayspec']	= $("#gatewaySpecSelect").val();
		makeMetadata['privacy']	= gatewayInfo.privacy;
		makeMetadata['devicelist'] = deviceList;

		var gatewayType =  gatewayInfo.gatewayType;
		var gatewayId = gatewayInfo.gatewayId;

		var makeMetadataOnly = new Object();
		makeMetadataOnly['metadata'] = makeMetadata;
	
		var ajaxData	= JSON.stringify(makeMetadataOnly)
		var platformType = sessionStorage.getItem("CurrentType");
		IoTSP.Data.updateDevice(gatewayType, gatewayId, platformType, ajaxData, 
			function(data) {
				console.info("data : " + data);
				console.info("jsonData : " + JSON.stringify(data));
				
				set_device_detail(data);
				display_device_detail();
				disableComponents();
			},
			function(jqXHR, textStatus, errorThrown){
				console.info("errorThrown :" + errorThrown);
				console.info("textStatus : " + textStatus);
				console.info("jqXHR : " + JSON.stringify(jqXHR));
			}
		);
	};
	
	var disableComponents = function () {
		$("#gatewayName").prop('disabled', true);
		$("#gatewaySpecSelect").prop('disabled', true);
		$("#gatewayDesc").prop('disabled', true);
				
		$("#lat").prop('disabled', true);
		$("#lon").prop('disabled', true);
		$("#alt").prop('disabled', true);
		
		$("#addResourceBtn").prop('disabled', true);
		$("#saveBtn").prop('disabled', true);
		$('.deviceSpecResourceType').prop('disabled', true);
		$('.deviceSpecResourceID').prop('disabled', true);
		$('.deviceSpecResourceName').prop('disabled', true);
		$('.deviceSpecRemoveResource').prop('disabled', true);
		$('.deviceSpecResourceSpec').prop('disabled', true);

		$("#alt").addClass("noborder");
		$("#lon").addClass("noborder");
		$("#lat").addClass("noborder");
		
		$("#device_Sbtn").click(function(e) {});
		
		$("#device_Mbtn > span").removeClass('glyphicon glyphicon-remove').addClass('glyphicon glyphicon-pencil');
		
		$("#map").hide();
		$("#mapView").show();
	};
	
	var load_device_detail = function (gatewayType, gatewayId, currentType) {
		IoTSP.MainPage.changeContents('/idm/device-detail.html', function() {
			init_device_detail(gatewayType, gatewayId, currentType);
		});
	};
	
	return {
		load_device_detail: load_device_detail
	};
}) ();