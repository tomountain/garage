IoTSP.DeviceSpecCommon = (function() {
	var currentCategory = '';
	var currentType = '';
	var currentUnit = '';
	
	var getDeviceTypes = function(category) {
		IoTSP.CommonData.getDeviceTypes(category, function(types) {
			if (types.length === 0) {
				$('#deviceSpecTypeForm').hide();
				$('#deviceSpecUnitForm').hide();
			}
			else {
				$('#deviceSpecTypeForm').show();
				$('#deviceSpecType').empty();
				
				var typeList = '<option value="">Select a resource type</option>';
				
				for (var i = 0; i < types.length; i++) {
					typeList += '<option value="' + types[i].value + '" data-unit="' + types[i].description.unit + '" data-url="' + types[i].description.uri + '">' + types[i].value + '</option>';
				}
				
				$('#deviceSpecType').html(typeList);
				$("#deviceSpecType").select2();
				
				$('#deviceSpecType').change(function(){
				    var selectedType = $('#deviceSpecType option:selected') ;
				    
				    if(selectedType.length > 0) {
						var qName = selectedType[0].value;
						if (qName) {
							var url = selectedType[0].getAttribute('data-url');
							var unit = selectedType[0].getAttribute('data-unit');
							var hrefString = "javascript:window.open('" + url + "','" + qName + "','width=500,height=500')";
							$('#deviceSpecTypeDesc').html("<h5><a href=\"" + hrefString + "\">" + url + "</a></h5>");
							if (unit && unit.length !== 0) {
								getDeviceUnits(unit);
							}
							else {
								$('#deviceSpecUnit').val('');
								$('#deviceSpecUnitForm').hide();
							}
						}
						else {
							$('#deviceSpecTypeDesc').html("<h5>Select a type.</h5>");
						}
					} else {
						$('#deviceSpecTypeDesc').html("<h5>Select a type.</h5>");
					}
				});
				
				$('#deviceSpecType').val(currentType).change();
			}
		});
	};
	
	var getDeviceUnits = function(category) {
		IoTSP.CommonData.getDeviceUnits(category, function(units) {
			if (units.length === 0) {
				$('#deviceSpecUnit').val('');
				$('#deviceSpecUnitForm').hide();
			}
			else {
				$('#deviceSpecUnitForm').show();
				$('#deviceSpecUnit').empty();
				
				var typeList = '<option value="">Select a resource unit</option>';
				
				for (var i = 0; i < units.length; i++) {
					typeList += '<option value="' + units[i].value + '" data-desc="' + units[i].description.name + '" ' + ' data-url="' + units[i].description.uri + '">' + units[i].value + '</option>';
				}
				
				$('#deviceSpecUnit').html(typeList);
				$("#deviceSpecUnit").select2();
				
				$('#deviceSpecUnit').change(function(){
				    var selectedType = $('#deviceSpecUnit option:selected') ;
				    
				    if(selectedType.length > 0) {
						var qName = selectedType[0].getAttribute('data-desc');
						if (qName) {
							var url = selectedType[0].getAttribute('data-url');
							var hrefString = "javascript:window.open('" + url + "','" + qName + "','width=500,height=500')";
							$('#deviceSpecUnitDesc').html("<h4><a href=\"" + hrefString + "\">" + url + "</a></h4>");
						}
						else {
							$('#deviceSpecUnitDesc').html("<h4>Select a unit.</h4>");
						}
					} else {
						$('#deviceSpecUnitDesc').html("<h4>Select a unit.</h4>");
					}
				});	
				
				$('#deviceSpecUnit').val(currentUnit).change();
			}
		});	
	};
	
	var addPropertyValueElement = function (valueWrapper, keyInputElement, type, index, value1, value2) {
		if (type === 'Number') {
			$('<label>', {
				'for': 'deviceSpecPropertiesMin' + index,
				class: 'col-sm-1 control-label',
				style: 'text-align:left;'
			}).html('min').appendTo(valueWrapper);
			
			var minElement = $('<div>', {
			    class: 'col-sm-5'
			}).appendTo(valueWrapper);

			$('<input>', {
			    id: 'deviceSpecPropertiesMin' + index,
			    placeholder: "Min",
			    type: "text",
			    value: value1,
			    class: 'form-control deviceSpecPropertiesValue'
			}).appendTo(minElement);
			
			$('<label>', {
				'for': 'deviceSpecPropertiesMax' + index,
				class: 'col-sm-1 control-label',
				style: 'text-align:left;'
			}).html('max').appendTo(valueWrapper);

			var maxElement = $('<div>', {
			    class: 'col-sm-5'
			}).appendTo(valueWrapper);
			
			$('<input>', {
			    id: 'deviceSpecPropertiesMax' + index,
			    placeholder: "Max",
			    type: "text",
			    value: value2,
			    class: 'form-control deviceSpecPropertiesValue'
			}).appendTo(maxElement);
						
		} else if (type === 'Option') {
			var valueElement = $('<div>', {
			    class: 'col-sm-12'
			}).appendTo(valueWrapper);
			
			$('<input>', {
			    id: 'deviceSpecPropertiesOption' + index,
			    placeholder: "Type",
			    type: "text",
			    value: value1,
			    class: 'form-control deviceSpecPropertiesValue'
			}).appendTo(valueElement);

			
//			var optionValueElement = $('<select>', {
//			    id: 'deviceSpecPropertiesOption' + index,
//			    placeholder: "Type",
//			    class: 'form-control deviceSpecPropertiesValue'
//			}).appendTo(valueElement);
//			
//			optionValueElement.append('<option value="arduino-port" selected>arduino-port</option>')
//			optionValueElement.append('<option value="window-port" selected>window-port</option>')
//			optionValueElement.append('<option value="purifier-port" selected>purifier-port</option>')
//			optionValueElement.select2();
		} else if (type === 'Port') {
			keyInputElement.val('Port').prop('disabled', true);

			$('<label>', {
				'for': 'deviceSpecPropertiesInput' + index,
				class: 'col-sm-1 control-label',
				style: 'text-align:left;'
			}).html('input').appendTo(valueWrapper);

			var inputPortElement = $('<div>', {
			    class: 'col-sm-5'
			}).appendTo(valueWrapper);

			var inputPortOption = $('<select>', {
			    id: 'deviceSpecPropertiesInput' + index,
			    placeholder: "Input",
			    class: 'form-control deviceSpecPropertiesValue'
			}).appendTo(inputPortElement);	
			
			inputPortOption.append('<option value="0">0</option>');
			inputPortOption.append('<option value="1">1</option>');
			if (value1 !== '') {
				inputPortOption.val(value1);
			}
			inputPortOption.select2();

			$('<label>', {
				'for': 'deviceSpecPropertiesOutput' + index,
				class: 'col-sm-1 control-label',
				style: 'text-align:left;'
			}).html('output').appendTo(valueWrapper);

			var outputPortElement = $('<div>', {
			    class: 'col-sm-5'
			}).appendTo(valueWrapper);

			var outputPortOption = $('<select>', {
			    id: 'deviceSpecPropertiesOutput' + index,
			    placeholder: "Output",
			    class: 'form-control deviceSpecPropertiesValue'
			}).appendTo(outputPortElement);

			outputPortOption.append('<option value="0">0</option>');
			outputPortOption.append('<option value="1">1</option>');
			outputPortOption.append('<option value="2">2</option>');
			if (value2 !== '') {
				outputPortOption.val(value2);
			}
			
			outputPortOption.select2();
		} else {
			var valueElement = $('<div>', {
			    class: 'col-sm-12'
			}).appendTo(valueWrapper);
			
			$('<input>', {
			    id: 'deviceSpecPropertiesValue' + index,
			    placeholder: "Value",
			    type: 'text',
			    value: value1,
			    class: 'form-control deviceSpecPropertiesValue'
			}).appendTo(valueElement);
		}
	};
	
	var newPropertyElement = function(type, index, key, value1, value2) {
		var property = $('<div>', {
			id : 'deviceSpecProperties' + index
		});
		
		var typeElement = $('<div>', {
		    class: 'col-sm-2'
		});
		
		var selectElement = $('<select>', {
		    id: 'deviceSpecPropertiesType' + index,
		    placeholder: 'Type',
		    class: 'form-control deviceSpecPropertiesType',
		    idx: index
		});
		
		if (type === 'Number') {
			selectElement.append('<option value="String">String</option><option value="Number" selected>Number</option><option value="Option">Option</option><option value="Port">Port</option>')
		} else if (type === 'Option') {
			selectElement.append('<option value="String">String</option><option value="Number">Number</option><option value="Option" selected>Option</option><option value="Port">Port</option>');
		} else if (type === 'Port') {
			selectElement.append('<option value="String">String</option><option value="Number">Number</option><option value="Option">Option</option><option value="Port" selected>Port</option>');
		} else {
			selectElement.append('<option value="String" selected>String</option><option value="Number">Number</option><option value="Option">Option</option><option value="Port">Port</option>');
		}
		
		selectElement.appendTo(typeElement);
		selectElement.select2();
		
		var keyElement = $('<div>', {
		    class: 'col-sm-2'
		});

		var keyInputElement = $('<input>', {
		    id: 'deviceSpecPropertiesKey' + index,
		    placeholder: 'Key',
		    type: 'text',
		    value: key,
		    class: 'form-control deviceSpecPropertiesKey'
		}).appendTo(keyElement);

		var valueWrapper = Element = $('<div>', {
			id : 'deviceSpecPropertiesValueWrapper' + index,
		    class: 'col-sm-7'
		});

		addPropertyValueElement(valueWrapper, keyInputElement, type, index, value1, value2);
		
		var removeBtn = $('<button>', {
			id: 'deviceSpecRemoveProperty' + index,
			class: 'btn btn-default deviceSpecRemoveProperty',
			type: 'button',
		    'aria-label': 'Add Property',
		    idx: index
		}).append('<span class="glyphicon glyphicon-minus" aria-hidden="true"></span>');
		
		removeBtn.click(function() {
			var idx = $(this).attr('idx');
			deviceSpecRemoveProperty(idx);
		});

		var removeBtnWarpper = $('<div>', {
		    class: 'col-sm-1'			
		}).append(removeBtn);
		
		property.append(typeElement);
		property.append(keyElement);
		property.append(valueWrapper);
		property.append(removeBtnWarpper);
		
		return property;
	};
	
	var newResourceElement = function(index, specId, specName) {
		var resource = $('<div>', {
			id : 'deviceSpecResource' + index,
			class: 'row',
			style: 'padding: 10px 20px;'
		});
		
		var panelBody = $('<div>', {
		    class: 'panel-body nopadding bg-f8f8f8'
		}).appendTo(resource);
		
		var formElement = $('<form>', {
		    class: 'form-horizontal form-bordered',
		}).appendTo(panelBody);
		
		var headerFormGroup = $('<div>', {
		    class: 'form-group bb-dot'
		}).appendTo(formElement);

		var selectResourceType = $('<select>', {
		    id: 'deviceSpecResourceType' + index, 
		    class: 'col-sm-3 deviceSpecResourceType',
		    idx: index
		}).appendTo(headerFormGroup);
		
		headerFormGroup.append('<label class="col-sm-1 control-label">' + IoTSP.i18nManagement.loadTextByName('msg_id') + '</label>');
		
		var idWrapper = $('<div>', {
			class: 'col-sm-3'
		}).appendTo(headerFormGroup);
		
		var idInput = $('<input>', {
			id: 'deviceSpecResourceID' + index,
			type: 'text',
			placeholder: 'Input ID for this device',
			class: 'form-control deviceSpecResourceID',
			value: specId
		}).appendTo(idWrapper);

		headerFormGroup.append('<label class="col-sm-1 control-label">' + IoTSP.i18nManagement.loadTextByName('msg_name') + '</label>');
		
		var nameWrapper = $('<div>', {
			class: 'col-sm-3'
		}).appendTo(headerFormGroup);
		
		var nameInput = $('<input>', {
			id: 'deviceSpecResourceName' + index,
			type: 'text',
			placeholder: 'Input name of this device',
			class: 'form-control deviceSpecResourceName',
			value: specName
		}).appendTo(nameWrapper);
		
		var deleteBtnWrapper = $('<div>', {
			class: 'col-sm-1',
		    style: 'text-align: right;'
		}).appendTo(headerFormGroup);
		
		var deleteBtnGroup = $('<div>', {
		    class: 'btn-group',
		    style: 'margin: 3px 0 0 0;'
		}).appendTo(deleteBtnWrapper);

		var deleteBtn = $('<button>', {
			id: 'deviceSpecRemoveResource' + index,
		    class: 'btn btn-white btn-sm deviceSpecRemoveResource',
		    idx: index
		}).append('<span class="glyphicon glyphicon-trash"></span>').appendTo(deleteBtnGroup);
		
		deleteBtn.click(function() {
			var idx = $(this).attr('idx');
			deviceSpecRemoveResource(idx);
		});
		
		var bodyFormGroup = $('<div>', {
		    class: 'form-group'
		}).appendTo(formElement);
		
		bodyFormGroup.append('<label class="col-sm-2 control-label">' + IoTSP.i18nManagement.loadTextByName('msg_device_specification') + '</label>');
		
		var specWrapper = $('<div>', {
			class: 'col-sm-5'
		}).appendTo(bodyFormGroup);
		
		var specInput = $('<select>', {
			id: 'deviceSpecResourceSpec' + index,
			type: 'text',
			placeholder: 'Input spec for this device',
			class: 'form-control m-b deviceSpecResourceSpec',
			idx: index
		}).appendTo(specWrapper);

		var spanWrapper = $('<div>', {
			class: 'col-sm-5'
		}).appendTo(bodyFormGroup);
		
		var spanInput = $('<span>', {
			id: 'deviceSpecResourceSpan' + index,
			class: 'fspandevicespec',
		}).appendTo(spanWrapper);
				
		return resource;
	};
	
	var newServiceElement = function(index, specId) {
		var service = $('<div>', {
		    id: 'deviceSpecService' + index,
		    idx: index
		});
		
		var serviceElement = $('<div>', {
		    class: 'col-sm-11'
		});
		
		var selectElement = $('<select>', {
		    placeholder: 'Type',
		    id: 'deviceSpecServiceSelect' + index,
		    class: 'form-control deviceSpecServiceSelect',
		}).appendTo(serviceElement);
		
		IoTSP.Data.getServiceList(function(services) {
			var serviceList = '';
			$.each(services, function(key,obj) {
				serviceList += '<option value="' + obj.uuid + '">' + obj.serviceName + '</option>';
			});
			selectElement.html(serviceList);
			selectElement.val(specId);
			selectElement.select2();
		});
		
		var removeBtn = $('<button>', {
			id: 'deviceSpecRemoveService' + index,
			class: 'btn btn-default deviceSpecRemoveService',
			type: 'button',
		    'aria-label': 'Add Property',
		    idx: index
		}).append('<span class="glyphicon glyphicon-minus" aria-hidden="true"></span>');
		
		removeBtn.click(function() {
			var idx = $(this).attr('idx');
			deviceSpecRemoveService(idx);
		});

		var removeBtnWarpper = $('<div>', {
		    class: 'col-sm-1'
		}).append(removeBtn);
		
		service.append(serviceElement);
		service.append(removeBtnWarpper);
		return service;
	};
	
	var changeDeviceSpecPropertyType = function(element) {
		var idx = $(element).attr('idx');
		var type = $(element).val();
		
		$('#deviceSpecPropertiesValueWrapper'+idx).remove();
		
		var valueWrapper = $('<div>', {
			id : 'deviceSpecPropertiesValueWrapper' + idx,
		    class: 'col-sm-7',
		});
		
		var keyInputElement = $('#deviceSpecPropertiesKey' + idx);
		
		addPropertyValueElement(valueWrapper, keyInputElement, type, idx, '', '');

		$('#deviceSpecRemoveProperty' + idx).parent().before(valueWrapper);
	};
	
	var displayDeviceSpecCategory = function (categories, category, type, unit) {
		currentCategory = category;
		currentType = type;
		currentUnit = unit;
		
		$('#deviceSpecCategory').empty();
		
		var typeList = '<option value="">Select a category</option>';
		
		for (var i = 0; i < categories.length; i++) {
			typeList += '<option value="' + categories[i].value + '"';
			if (categories[i].description.addResource) {
				typeList += ' data-addresource="' + categories[i].description.addResource + '"' 
			}
			typeList += '>' + categories[i].value + '</option>';
		}
		
		$('#deviceSpecCategory').html(typeList);
		$("#deviceSpecCategory").select2();
		
		$('#deviceSpecCategory').change(function () {
		    var selectedCategory = $('#deviceSpecCategory option:selected') ;
		    
		    if(selectedCategory.length > 0) {
				var qName = selectedCategory[0].value;
				if (qName) {
					getDeviceTypes(qName);
				}
				var addresource = $(selectedCategory[0]).attr('data-addresource');
				if ('true' === addresource) {
					$("#deviceSpecResourcesForm").show();
				} 
				else {
					$("#deviceSpecResourcesForm").hide();
				}
				
		    }
		});
		
		$('#deviceSpecCategory').val(currentCategory).change();
	};
	
	function displayReourceDeviceSpecList(index, category, defaultSpec) {
		var specElement = $('#deviceSpecResourceSpec' + index);
		specElement.change(function() {
			var idx = $(this).attr('idx');
			
			var selectedSpec = $('#deviceSpecResourceSpec' + idx + ' option:selected');
			var qName = selectedSpec.attr('data-desc');
			
			var deviceSpecResourceSpan = $('#deviceSpecResourceSpan' + idx);
			
			if (qName && qName.length !== 0) {
				deviceSpecResourceSpan.html('<h4>' + qName + '</h4>');
			}
			else {
				deviceSpecResourceSpan.html('<h4>' + IoTSP.i18nManagement.loadTextByName(msg_select_a_device_specification) + '</h4>');
			}
		});
		
		var specOptions = '<option value="" data-desc="">' + IoTSP.i18nManagement.loadTextByName(msg_select_a_device_specification) +  '</option>';
		if (category && category.length != 0) {
			IoTSP.CommonData.getDeviceSpecListByCategory(category, function (specList) {
				for (var i = 0; i < specList.length; i++) {
					if (category === 'Appliance') {
						specOptions += '<option value="' + specList[i].uuid + '" data-desc=" ">' + specList[i].name + '</option>';
					} else {
						specOptions += '<option value="' + specList[i].uuid + '" data-desc="UOM:' + specList[i].unit + ', Type = ' + specList[i].type + '">' + specList[i].name + '</option>';						
					}
				}
				specElement.html(specOptions);
				specElement.val(defaultSpec);
				specElement.select2();
			});
		}
	}
	
	var displayResourceDeviceCategory = function(index, category, spec) {
		var categoryElement = $('#deviceSpecResourceType' + index);
		
		categoryElement.change(function() {
			var idx = $(this).attr('idx');
			displayReourceDeviceSpecList(idx, this.value, '');
		});

		IoTSP.CommonData.getDeviceCategories(function(categories) { 		
			categoryElement.empty();
			
			if (!category || category.length === 0) {
				category = categories[0].value;
			}
			
			var categoryList = '';
			
			for (var i = 0; i < categories.length; i++) {
				if (categories[i].value !== 'Gateway') {
					categoryList += '<option value="' + categories[i].value + '">' + categories[i].value + '</option>';
				}
			}
			categoryElement.html(categoryList);
			categoryElement.val(category);
			categoryElement.select2();
			displayReourceDeviceSpecList(index, category, spec);
		});
	};
	
	var deviceSpecRemoveProperty = function(idx) {
		$('#deviceSpecProperties' + idx).remove();
		var properties = $('.deviceSpecPropertiesType');
		if (!properties || properties.length === 0) {
			$('#msg_empty_properties').show();
			$('#deviceSpecPropertiesWrapper').hide();
		}
	};

	var deviceSpecRemoveResource = function(idx) {
		$('#deviceSpecResource' + idx).remove();
		var resources = $('.deviceSpecResourceType');
		if (!resources || resources.length === 0) {
			$('#msg_empty_resources').show();
			$('#deviceSpecResourcesWrapper').hide();
		}
	};
	
	var deviceSpecRemoveService = function(idx) {
		$('#deviceSpecService' + idx).remove();
		var services = $('.deviceSpecServiceSelect');
		if (!services || services.length === 0) {
			$('#msg_empty_services').show();
			$('#deviceSpecServicesWrapper').hide();
		}
	};
		
	return {
		getDeviceUnits: getDeviceUnits,
		newPropertyElement: newPropertyElement,
		newResourceElement: newResourceElement,
		newServiceElement: newServiceElement,
		changeDeviceSpecPropertyType: changeDeviceSpecPropertyType,
		displayDeviceSpecCategory: displayDeviceSpecCategory,
		displayResourceDeviceCategory: displayResourceDeviceCategory
	};
}) ();