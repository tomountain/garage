IoTSP.DeviceSpecDetail = (function() {
	'use strict';
	
	var savedValue = {};
	var propertyIndex = 0;
	var resourceIndex = 0;
	var serviceIndex = 0;
	
	var set_devicespec_detail = function(deviceSpec) {
		savedValue = {}
		
		savedValue.name = deviceSpec.name;
		savedValue.category = deviceSpec.category;
		savedValue.type = deviceSpec.type;
		savedValue.manufacturer = deviceSpec.manufacturer;
		savedValue.model = deviceSpec.model;
		savedValue.unit = deviceSpec.unit;
		if (deviceSpec.properties && deviceSpec.properties.lenght !== 0) {
			try {
				savedValue.properties = JSON.parse(deviceSpec.properties);
			} catch (e) {
			}
		}
		savedValue.description = deviceSpec.description;
		savedValue.nodetype = deviceSpec.nodeType;
		savedValue.creator = deviceSpec.creator;
		if (deviceSpec.open === 'Y') {
			savedValue.open = true;
		}
		else {
			savedValue.open = false;
		}
		savedValue.resources = deviceSpec.resources;
		savedValue.services = deviceSpec.services;
	};
		
	var display_devicespec_detail = function() {
		var i = 0;
		
		$('#deviceSpecName').val(savedValue.name);
		$('#deviceSpecManufacturer').val(savedValue.manufacturer);
		$('#deviceSpecModelName').val(savedValue.model);
		
		$('#deviceSpecProperties').empty();
		if (savedValue.properties && savedValue.properties.length !== 0) {
			$('#msg_empty_properties').hide();
			$('#deviceSpecPropertiesWrapper').show();
			for (var key in savedValue.properties) {
				if (savedValue.properties[key].min || savedValue.properties[key].max){
					$('#deviceSpecProperties').append(IoTSP.DeviceSpecCommon.newPropertyElement('Number', i, savedValue.properties[key].id, savedValue.properties[key].min, savedValue.properties[key].max));
				} else if (savedValue.properties[key].type) {
					$('#deviceSpecProperties').append(IoTSP.DeviceSpecCommon.newPropertyElement('Option', i, savedValue.properties[key].id, savedValue.properties[key].type));
				} else if (savedValue.properties[key].input) {
					$('#deviceSpecProperties').append(IoTSP.DeviceSpecCommon.newPropertyElement('Port', i, savedValue.properties[key].id, savedValue.properties[key].input, savedValue.properties[key].output));
				} else if (savedValue.properties[key].values) {
					$('#deviceSpecProperties').append(IoTSP.DeviceSpecCommon.newPropertyElement('String', i, savedValue.properties[key].id, savedValue.properties[key].values));
				}
				i++;
			}
		}
		else {
			$('#msg_empty_properties').show();
			$('#deviceSpecPropertiesWrapper').hide();
		}
		
		propertyIndex = i;
	
		i = 0;
		$('#deviceSpecResources').empty();
		if (savedValue.resources && savedValue.resources.length !== 0) {
			$('#msg_empty_resources').hide();
			$('#deviceSpecResourcesWrapper').show();
			for (var key in savedValue.resources) {
				$('#deviceSpecResources').append(IoTSP.DeviceSpecCommon.newResourceElement(i, savedValue.resources[key].resourceId, savedValue.resources[key].resourceName));
			
				IoTSP.DeviceSpecCommon.displayResourceDeviceCategory(i, savedValue.resources[key].resourceCategory, savedValue.resources[key].resourceSpec);
			
				i++;
			}
		}
		else {
			$('#msg_empty_resources').show();
			$('#deviceSpecResourcesWrapper').hide();
		}
		
		resourceIndex = i;
		
		i = 0;
		$('#deviceSpecServices').empty();
		if (savedValue.services && savedValue.services.length !== 0) {
			
			$('#msg_empty_services').hide();
			$('#deviceSpecServicesWrapper').show();

			for (var key in savedValue.services) {
				$('#deviceSpecServices').append(IoTSP.DeviceSpecCommon.newServiceElement(i, savedValue.services[key].serviceId));			
				i++;
			}
		}
		else {
			$('#msg_empty_services').show();
			$('#deviceSpecServicesWrapper').hide();
		}
		
		serviceIndex = i;
		
		$('#deviceSpecDescription').val(savedValue.description);
		$('#deviceSpecNodeType').val(savedValue.nodetype);
		var disabledOpen = $("#deviceSpecOpen").bootstrapSwitch('disabled');
		if (disabledOpen) {
			$("#deviceSpecOpen").bootstrapSwitch('disabled', false);
		}
		$("#deviceSpecOpen").bootstrapSwitch('state', savedValue.open);
		if (disabledOpen) {
			$("#deviceSpecOpen").bootstrapSwitch('disabled', disabledOpen);
		}
	};
	
	var init_devicespec_detail = function (deviceSpecId) {
		propertyIndex = 0;
		
		$("#deviceSpecId").val(deviceSpecId);
		
		IoTSP.Data.getDeviceSpec(deviceSpecId, function(data) {
			if (data) {
				set_devicespec_detail(data);
				display_devicespec_detail();
				disableComponents();
				
				var userId = sessionStorage.getItem("LoginId");

				if (data.creator === userId) {
					$('#deviceSpec_Mbtn').prop('disabled', false);
					$('#deleteSpecBtn').prop('disabled', false);
				}
				
				IoTSP.CommonData.getDeviceCategories(function(categories) { 
					IoTSP.DeviceSpecCommon.displayDeviceSpecCategory(categories, savedValue.category, savedValue.type, savedValue.unit);
				});
			}
			else {
				alert('Error get device spec!!');
			}
		}, function(jqXHR, textStatus, errorThrown) {
			
		});

		var cancelChangeDeviceSpec = function () {
			display_devicespec_detail();
			disableComponents();
		};
		
		$("#deviceSpec_Mbtn").click( function() {
			var check = $("#deviceSpec_Mbtn > span").hasClass('glyphicon-pencil');
					
			var userId = sessionStorage.getItem("LoginId");
			if (savedValue.creator !== userId) {
				return ;
			}
			
			if (check) {    
				$("#deviceSpecName").prop('disabled', false).focus();
				$("#deviceSpecCategory").prop('disabled', false);
				$("#deviceSpecType").prop('disabled', false);
				$("#deviceSpecManufacturer").prop('disabled', false);
				$("#deviceSpecModelName").prop('disabled', false);
				$("#deviceSpecUnit").prop('disabled', false);
				$("#deviceSpecDescription").prop('disabled', false);
				$("#deviceSpecNodeType").prop('disabled', false);
				$("#deviceSpecOpen").bootstrapSwitch('disabled', false);

				$("#saveSpecBtn").prop('disabled', false);

				$("#deviceSpecAddProperty").prop('disabled', false);
				$(".deviceSpecPropertiesType").prop('disabled', false);
				$(".deviceSpecPropertiesKey").prop('disabled', false);
				$(".deviceSpecPropertiesValue").prop('disabled', false);
				$(".deviceSpecRemoveProperty").prop('disabled', false);
				
				$('#deviceSpecAddResource').prop('disabled', false);
				$('.deviceSpecResourceType').prop('disabled', false);
				$('.deviceSpecResourceID').prop('disabled', false);
				$('.deviceSpecResourceName').prop('disabled', false);
				$('.deviceSpecRemoveResource').prop('disabled', false);
				$('.deviceSpecResourceSpec').prop('disabled', false);

				$('#deviceSpecAddService').prop('disabled', false);
				$('.deviceSpecServiceSelect').prop('disabled', false);
				$('.deviceSpecRemoveService').prop('disabled', false);
				
				$("#deviceSpec_Mbtn > span").removeClass('glyphicon-pencil').addClass('glyphicon-remove');
				
				$('.deviceSpecPropertiesType').change(function() {
					IoTSP.DeviceSpecCommon.changeDeviceSpecPropertyType(this);
				});	
			} else {	
				cancelChangeDeviceSpec();
			}
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
		
		$("#saveSpecBtn").click(function(e) {
			updateDeviceSpec();
		});

		$("#deleteSpecConfirmBtn").on("click", function(){
			deleteDeviceSpec(deviceSpecId);
		});
		
		IoTSP.i18nManagement.loadTextInDeviceSpecDetail();
	};
	
	var deleteDeviceSpec = function (deviceSpecId) {
		IoTSP.Data.deleteDeviceSpec(deviceSpecId, function(data) {
    		$('#deleteSpecModal').on('hidden.bs.modal', function () {
    			IoTSP.MainPage.queryDeviceSpecList();
    			IoTSP.DeviceSpecList.load_devicespec_list('');
				IoTSP.CommonData.setDeviceSpecDirty(savedValue.category);
    		})
			$('#deleteSpecModal').modal('hide');
		}, function(jqXHR, textStatus, errorThrown) {
		});
	};
	
	var updateDeviceSpec = function (){
		var deviceSpec = {};
		
		var deviceSpecId = $('#deviceSpecId').val();
		deviceSpec.name = $('#deviceSpecName').val();
		deviceSpec.category = $('#deviceSpecCategory').val();
		deviceSpec.type = $('#deviceSpecType').val();
		deviceSpec.manufacturer = $('#deviceSpecManufacturer').val();
		deviceSpec.model = $('#deviceSpecModelName').val();
		deviceSpec.unit = $('#deviceSpecUnit').val();
		deviceSpec.properties = $('#deviceSpecProperties').val();
		
		var props = [];
		
		$('select.deviceSpecPropertiesType').each(function() {
			var prop = {};
			var idx = $(this).attr('idx');
			var type = $(this).val();
						
			prop.id = $('#deviceSpecPropertiesKey'+idx).val();
			
			if (type === 'Number') {
				prop.min = parseInt($('#deviceSpecPropertiesMin'+idx).val());
				prop.max = parseInt($('#deviceSpecPropertiesMax'+idx).val());
			} else if (type === 'Option') {
				prop.type = $('#deviceSpecPropertiesOption'+idx).val();
			} else if (type === 'Port') {
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
		
		var resources = [];
		
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
		
		var services = [];

		$('select.deviceSpecServiceSelect').each(function() {
			var service = $(this).val();
			if (service) {
				services.push(service);
			}
		});
		
		deviceSpec.services = services;
		
		IoTSP.Data.updateDeviceSpec(deviceSpecId, JSON.stringify(deviceSpec), function(data) {
			if (data) {
				IoTSP.CommonData.setDeviceSpecDirty(savedValue.category);
				IoTSP.CommonData.setDeviceSpecDirty(data.category);
				set_devicespec_detail(data);
				display_devicespec_detail();
				disableComponents();
			}
			else {
				alert("update error");
			}
		}, function(jqXHR, textStatus, errorThrown){
			console.info("errorThrown :" + errorThrown);
			console.info("textStatus : " + textStatus);
			console.info("jqXHR : " + JSON.stringify(jqXHR));
		});
	}
	
	var load_devicespec_detail = function (deviceSpecId) {
		IoTSP.MainPage.changeContents('/idm/devicespec-detail.html', function() {
			init_devicespec_detail(deviceSpecId);
		});
	};
	
	var disableComponents = function () {
		$('#deviceSpecName').prop('disabled', true).focus();
		$('#deviceSpecCategory').prop('disabled', true);
		$('#deviceSpecType').prop('disabled', true);
		$('#deviceSpecManufacturer').prop('disabled', true);
		$('#deviceSpecModelName').prop('disabled', true);
		$('#deviceSpecUnit').prop('disabled', true);
		
		$('#deviceSpecDescription').prop('disabled', true);
		$('#deviceSpecNodeType').prop('disabled', true);
		
		$('#deviceSpecOpen').bootstrapSwitch('disabled', true);
		$('#saveSpecBtn').prop('disabled', true);
		$('#deleteSpecBtn').prop('disabled', true);
		$('#deviceSpec_Mbtn > span').removeClass('glyphicon glyphicon-remove').addClass('glyphicon glyphicon-pencil');		

		$('#deviceSpecAddProperty').prop('disabled', true);
		$('.deviceSpecPropertiesType').prop('disabled', true);
		$('.deviceSpecPropertiesKey').prop('disabled', true);
		$('.deviceSpecPropertiesValue').prop('disabled', true);
		$('.deviceSpecPropertiesMin').prop('disabled', true);
		$('.deviceSpecPropertiesMax').prop('disabled', true);
		$('.deviceSpecRemoveProperty').prop('disabled', true);

		$('#deviceSpecAddResource').prop('disabled', true);
		$('.deviceSpecResourceType').prop('disabled', true);
		$('.deviceSpecResourceID').prop('disabled', true);
		$('.deviceSpecResourceName').prop('disabled', true);
		$('.deviceSpecRemoveResource').prop('disabled', true);
		$('.deviceSpecResourceSpec').prop('disabled', true);
		
		$('#deviceSpecAddService').prop('disabled', true);
		$('.deviceSpecServiceSelect').prop('disabled', true);
		$('.deviceSpecRemoveService').prop('disabled', true);
	};
	
	return {
		load_devicespec_detail: load_devicespec_detail
	}
}) ();