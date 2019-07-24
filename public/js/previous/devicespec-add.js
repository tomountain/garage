IoTSP.DeviceSpecAdd = (function() {
	'use strict';
	
	var propertyIndex = 0;
	var resourceIndex = 0;
	var serviceIndex = 0;
	
	var init_devicespec_add = function () {
		propertyIndex = 0;
		resourceIndex = 0;
		serviceIndex = 0;
		
		$('#deviceSpecOpen').bootstrapSwitch();
		
		$("#cancelSpecBtn").click(function(e) { 
			IoTSP.MainPage.changeContents('/idm/device-dashboard.html');
			IoTSP.DeviceDashboard.update_dashboard();
		});
		
		$("#saveSpecBtn").click(function(e) {
			addDeviceSpec();
		});
		
		IoTSP.CommonData.getDeviceCategories(function(categories) {
			IoTSP.DeviceSpecCommon.displayDeviceSpecCategory(categories);
		});
		
		$("#deviceSpecAddProperty").click(function() {
			$('#msg_empty_properties').hide();
			$('#deviceSpecPropertiesWrapper').show();
			var newElement = IoTSP.DeviceSpecCommon.newPropertyElement('String', propertyIndex, '', '');			
			$('#deviceSpecProperties').append(newElement);
			$('#deviceSpecPropertiesType' + propertyIndex).change(function() {
				IoTSP.DeviceSpecCommon.changeDeviceSpecPropertyType(this);				
			});
			
			propertyIndex++;
		});
		
		$('#deviceSpecAddResource').click(function() {
			$('#msg_empty_resources').hide();
			$('#deviceSpecResourcesWrapper').show();
			var newElement = IoTSP.DeviceSpecCommon.newResourceElement(resourceIndex, '', '');			
			$('#deviceSpecResources').append(newElement);
			
			IoTSP.DeviceSpecCommon.displayResourceDeviceCategory(resourceIndex, '', '');
			
			resourceIndex++;
		});
		
		$('#deviceSpecAddService').click(function() {
			$('#msg_empty_services').hide();
			$('#deviceSpecServicesWrapper').show();
			var newElement = IoTSP.DeviceSpecCommon.newServiceElement(serviceIndex, '');			
			$('#deviceSpecServices').append(newElement);
			
			serviceIndex++;
		});		
		
		IoTSP.i18nManagement.loadTextInDeviceSpecAdd();
	};
	
	var addDeviceSpec = function (){
		var deviceSpec = {};
		
		deviceSpec.name = $('#deviceSpecName').val();
		deviceSpec.category = $('#deviceSpecCategory').val();
		deviceSpec.type = $('#deviceSpecType').val();
		deviceSpec.manufacturer = $('#deviceSpecManufacturer').val();
		deviceSpec.model = $('#deviceSpecModelName').val();
		deviceSpec.unit = $('#deviceSpecUnit').val();
		var props = [];
		var resources = [];
		var services = [];

		if (!deviceSpec.name) {
			alert('Please Input Name!!');
			return;
		}
		
		if (!deviceSpec.category) {
			alert('Please Input Category!!');
			return;
		}
		
		$('select.deviceSpecPropertiesType').each(function() {
			var prop = {};
			var idx = $(this).attr('idx');
			var type = $(this).val();
						
			prop.id = $('#deviceSpecPropertiesKey'+idx).val();
			
			if (type === 'Number') {
				prop.min = parseInt($('#deviceSpecPropertiesMin'+idx).val());
				prop.max = parseInt($('#deviceSpecPropertiesMax'+idx).val());
			} else if (type === 'Option'){
				prop.type = $('#deviceSpecPropertiesOption'+idx).val();
			} else if (type === 'Port'){
				prop.input = $('#deviceSpecPropertiesInput'+idx).val();
				prop.output = $('#deviceSpecPropertiesOutput'+idx).val();
			} else {
				prop.values = $('#deviceSpecPropertiesValue'+idx).val();
			}
			
			props.push(prop);
		});
		
		deviceSpec.properties = JSON.stringify(props);
		deviceSpec.description = $('#deviceSpecDescription').val();
		deviceSpec.nodeType = $('#deviceSpecNodeType').val();
		deviceSpec.open = $("#deviceSpecOpen").bootstrapSwitch('state') === true ? 'Y' : 'N';
		
		$('select.deviceSpecResourceType').each(function() {
			var resource = {};
			var idx = $(this).attr('idx');
						
			resource.resourcecategory = $(this).val();
			resource.resourceid = $('#deviceSpecResourceID'+idx).val();
			resource.resourcename = $('#deviceSpecResourceName'+idx).val();
			resource.resourcespec = $('#deviceSpecResourceSpec'+idx).val();
			
			resources.push(resource);
		});
		
		deviceSpec.resources = resources;

		$('select.deviceSpecServiceSelect').each(function() {
			var service = $(this).val();
			if (service) {
				services.push(service);
			}
		});
		
		deviceSpec.services = services;
		
		IoTSP.Data.addDeviceSpec(JSON.stringify(deviceSpec), function(data) {
			console.info("data : " + data);
			console.info("jsonData : " + JSON.stringify(data));
			IoTSP.MainPage.queryDeviceSpecList();
			IoTSP.DeviceSpecList.load_devicespec_list('');
			IoTSP.CommonData.setDeviceSpecDirty(deviceSpec.category);
		}, function(jqXHR, textStatus, errorThrown){
			console.info("errorThrown :" + errorThrown);
			console.info("textStatus : " + textStatus);
			console.info("jqXHR : " + JSON.stringify(jqXHR));
		});
	}
		
	return {
		init_devicespec_add: init_devicespec_add
	};
}) ();