IoTSP.DeviceAdd = (function() {
	'use strict';

	var gatewayInfo = {};

	var uiChangeByType = function(type) {

	}

	var init_add_step1 = function () {
		gatewayInfo = {};
		gatewayInfo.test = 'test';
		var type = sessionStorage.getItem("CurrentType");
		var orgId = sessionStorage.getItem("CurrentOrgId")

		uiChangeByType(type);

		$( "#duplicateGatewayIDDialog" ).dialog({
			modal: true,
			autoOpen: false,
			width: 400,
			open: function(event, ui) {
				  $(this).closest('.ui-dialog').find('.ui-dialog-titlebar-close').hide();
			},
			buttons: {
				Close: function() {
					$( this ).dialog( "close" );
					$("#gatewayId").focus();
				}
			},
		});

		$( "#needIDDialog" ).dialog({
			modal: true,
			autoOpen: false,
			width: 400,
			open: function(event, ui) {
				  $(this).closest('.ui-dialog').find('.ui-dialog-titlebar-close').hide();
			},
			buttons: {
				Close: function() {
					$( this ).dialog( "close" );
					$("#gatewayId").focus();
				}
			},
		});

//		IoTSP.Data.getRecipeDeviceTypes(type ,function(data) {
//			$.each(data, function(key, value) {
//				var selectHtml = '<option value="' + data[key].id + '" name="' + data[key].id + '">' + data[key].name +  '</option>';
//				$("#optGatewayGroup").append(selectHtml);
//			});
//
//			$("select option:eq(0)").attr("selected", "selected");
//			$("#gatewayTypeSelect").change();
//			$("#gatewayTypeInputForm").hide();
//		});
//
//		IoTSP.Data.getCustomDeviceTypes(type, function(data) {
//			$.each(data, function(key, value) {
//				var selectHtml = '<option value="' + data[key].id + '">' + data[key].name +  '</option>';
//				$("#optGatewayMyGroup").append(selectHtml);
//			});
//		});

		IoTSP.Data.getDeviceTypeList(orgId, type, function(data) {
			//$("#gatewayTypeSelect").html("Loading...");
			$.each(data, function(key, value) {
				var selectHtml = '<option value="' + data[key].id + '">' + data[key].id +  '</option>';
				$("#optGatewayMyGroup").append(selectHtml);
				$("select option:eq(0)").attr("selected", "selected");
				$("#gatewayTypeSelect").change();
			});
		});

		var specOptions = '<option value="">Select a gateway specification</option>';
		IoTSP.CommonData.getDeviceSpecListByCategory('Gateway', function (specList) {
			//$('#gatewaySpecSelect').html("Loading...");
			for (var i = 0; i < specList.length; i++) {
				specOptions += '<option value="' + specList[i].uuid + '">' + specList[i].name + '</option>';
			}
			$('#gatewaySpecSelect').html(specOptions);
			$('#gatewaySpecSelect').select2();
		});

		$("#gatewayTypeSelect option:selected").each(function(){
			if($(this).attr("value") == "other") {
				$("#gatewayTypeInputForm").show();
				if(sessionStorage.getItem('CurrentType') === 'oneM2M')
					$('#oneM2MCustomType').show();
				else
					$('#oneM2MCustomType').hide();
				$("#gatewayTypeName").val("");
			} else {
				$("#gatewayTypeInputForm").hide();
				//if(sessionStorage.getItem('CurrentType') === 'oneM2M')
				$('#oneM2MCustomType').hide();
				var gatewayTypeName = $("#gateayTypeSelect option:selected").text();
			}
		});

		$('#gatewayTypeSelect').select2({placeholder: "Loading"}).change(function(){
			$("#gatewayTypeSelect option:selected").each(function(){
				if($(this).attr("value") == "other") {
					$("#gatewayTypeInputForm").show();
					if(sessionStorage.getItem('CurrentType') === 'oneM2M')
						$('#oneM2MCustomType').show();
					else
						$('#oneM2MCustomType').hide();
					$("#gatewayTypeName").val("");
				} else {
					$("#gatewayTypeInputForm").hide();
					//if(sessionStorage.getItem('CurrentType') === 'oneM2M')
					$('#oneM2MCustomType').hide();
					var gatewayTypeName = $("#gateayTypeSelect option:selected").text();
				}
			});
		});


		$("#addGatewayBtn").click(function(e){
			e.preventDefault();

			//HTML5 Session Storage
			var recipeTypeName	= $("#gatewayTypeSelect").val();	// Gateway Type Name
			var gatewayTypeName	= $("#gatewayTypeName").val();	// Gateway Type Name
			var gatewayTypeDesc	= $("textarea#gatewayTypeDesc").val();	// Gateway Type Description
			var gatewayId		= $("#gatewayId").val();
			var gatewaySpec		= $("#gatewaySpecSelect").val();		// gateway spec
			var gatewayName		= $("#gatewayName").val();		// Gateway Name
			var gatewayDesc		= $("textarea#gatewayDesc").val();	// Gateway Name Description
			var checkGateway	= $(':radio[name="optionsRadios"]:checked').val();
			var latitude		= $("#lat").val();		// Gateway Name
			var longitude		= $("#lon").val();		// Gateway Name
			var altitude		= $("#alt").val();		// Gateway Name
			var createDeviceType = 'false';

			var oneM2MType      = $('#oneM2MTypeSelect option:selected').text();

			if($("#gatewayTypeName").is(':visible')){
				recipeTypeName = gatewayTypeName;
				createDeviceType = 'true';
			}else{
				gatewayTypeName = recipeTypeName;
			}

			if (gatewayId && gatewayId.length !== 0) {
				// check duplicate id
				IoTSP.Data.getDeviceInfo(gatewayId, type, function(data) {
					if (data && data.deviceId === gatewayId) {
						$("#duplicateGatewayIDDialog").dialog("open");
					} else {

						gatewayInfo.recipeTypeName = recipeTypeName;
						gatewayInfo.gatewayTypeName = gatewayTypeName;
						gatewayInfo.gatewayTypeDesc = gatewayTypeDesc;
						gatewayInfo.gatewayId = gatewayId;
						gatewayInfo.gatewaySpec = gatewaySpec;
						gatewayInfo.gatewayName = gatewayName;
						gatewayInfo.gatewayDesc = gatewayDesc;
						gatewayInfo.checkGateway = checkGateway;
						gatewayInfo.latitude = latitude;
						gatewayInfo.longitude = longitude;
						gatewayInfo.altitude = altitude;
						gatewayInfo.oneM2MType = oneM2MType;
						gatewayInfo.createDeviceType = createDeviceType;

						IoTSP.MainPage.changeContents('/idm/device-add-step2.html');
					}
				}, function() {
				});
			} else {
				$("#needIDDialog").dialog("open");
			}
		});

		$("#cancelAddGatewayBtn").click(function(e) {
	        IoTSP.MainPage.changeContents('/idm/device-dashboard.html');
	        IoTSP.DeviceDashboard.update_dashboard();
		});

		IoTSP.DeviceMap.initDeviceLocationMap();

		// display marker when the enter key pressed in lat, lon input field.
		$("#lat, #lon").on('keypress', function(e) {
			var lat = $("#lat").val();
			var lon = $("#lon").val();
		    if (e.which == 13) {/* 13 == enter key@ascii */
		        IoTSP.DeviceMap.addBtnMarker(lat, lon);
		    }
		});

		IoTSP.i18nManagement.loadTextInDeviceAdd1();
	};

	var init_add_step2 = function () {
		var resIndex = 0;

		// Functions
		function showDeviceSpecList(specElement, category) {
			var specOptions = '<option value="" data-desc="">Select a device specification</option>';
			if (category && category.length != 0) {
				IoTSP.CommonData.getDeviceSpecListByCategory(category, function (specList) {
					for (var i = 0; i < specList.length; i++) {
						specOptions += '<option value="' + specList[i].uuid + '" data-desc="UOM:' + specList[i].unit + ', Type = ' + specList[i].type + '">' + specList[i].name + '</option>';
					}
					specElement.html(specOptions);

					specElement.select2();
				});
			}
		}


		$("#functionAddBtn").on('click', function(){

			$('#msg_empty_resources').hide();
			$('#deviceSpecResourcesWrapper').show();

			var newElement = IoTSP.DeviceSpecCommon.newResourceElement(resIndex, '', '');
			$('#resourceList').append(newElement);

			IoTSP.DeviceSpecCommon.displayResourceDeviceCategory(resIndex, '', '');

			resIndex++;
		});

		$("#addGatewayBtn").click(function(e){

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

			addGateway(deviceList);
		});
		$("#cancelAddGatewayBtn").click(function(e) {
	        IoTSP.MainPage.changeContents('/idm/device-dashboard.html');
	        IoTSP.DeviceDashboard.update_dashboard();
		})

		IoTSP.i18nManagement.loadTextInDeviceAdd2();
		window.scrollTo(0, 0);
	};

	var init_add_step3 = function () {

		var clientId = gatewayInfo.clientId;
	    var gwInfo = clientId.split(":");
	    var gatewayAuthToken = gatewayInfo.gatewayAuthToken;
	    var orgId = gwInfo[1];
	    var gatewayType = gwInfo[2];
	    var gatewayId = gwInfo[3];

	    $("#gatewayId").text(gatewayId);

	    var gatewayAuthInfo = "org=" + orgId + "\r\n" + "type=" + gatewayType + "\r\n" + "id=" + gatewayId + "\r\n" + "auth-method=token" + "\r\n" + "auth-token=" + gatewayAuthToken;

	    console.log(gatewayAuthInfo);
	    $("#gatewayAuthInfo").val(gatewayAuthInfo);

	    gatewayInfo = {};

	    console.log(deviceTypesUrl.replace("{orgId}", orgId));

   		IoTSP.MainPage.queryDeviceList();

	    $("#confirmAddGatewayBtn").on("click", function(){
	        IoTSP.MainPage.changeContents('/idm/device-dashboard.html');
	        IoTSP.DeviceDashboard.update_dashboard();
	    });

	    IoTSP.i18nManagement.loadTextInDeviceAdd3();
	};


	function addGateway(deviceList){
		// JSON start
		var makeLocations = new Object();
		makeLocations['lat'] = gatewayInfo.latitude;
		makeLocations['lon'] = gatewayInfo.longitude;
		makeLocations['alt'] = gatewayInfo.altitude;

		var makeMetadata 	= new Object();
		makeMetadata['locations'] 	= makeLocations;
		makeMetadata['devicename']	= gatewayInfo.gatewayName;
		makeMetadata['description']	= gatewayInfo.gatewayDesc;
		makeMetadata['gatewayspec']	= gatewayInfo.gatewaySpec;
		makeMetadata['privacy']		= gatewayInfo.checkGateway;
		makeMetadata['devicelist']		= deviceList;

		var makeJsonHead = new Object();
		if(sessionStorage.getItem("CurrentType") === 'oneM2M'){
			makeMetadata['onem2mtype']		= gatewayInfo.oneM2MType;

			// Temporal
			makeJsonHead['uuid']      = "d:" + sessionStorage.getItem("CurrentOrgId") + ":" + gatewayInfo.recipeTypeName + ":" + gatewayInfo.gatewayId;
		}

		var gatewayType = gatewayInfo.recipeTypeName;

		if(gatewayInfo.gatewayTypeName && gatewayInfo.gatewayTypeName.length !== 0) {
			gatewayType	= gatewayInfo.gatewayTypeName;
		}

		makeJsonHead['deviceId']	= gatewayInfo.gatewayId;
		makeJsonHead['createDeviceType'] = gatewayInfo.createDeviceType;
		makeJsonHead['metadata']	= makeMetadata;

		var makeMetadataOnly = new Object();
		makeMetadataOnly['metadata']	= makeMetadata;
		// END

		var ajaxData = JSON.stringify(makeJsonHead);

		IoTSP.Data.addDevice(gatewayType, ajaxData, sessionStorage.getItem("CurrentType"),
			function(data) {
				deviceList = {};

				console.info("data : " + data);
				console.info("jsonData : " + JSON.stringify(data));

				var deviceJson = JSON.stringify(data);
				// Delete Function
				gatewayInfo.clientId = data.clientId;
				gatewayInfo.gatewayAuthToken = data.autoToken;

				IoTSP.MainPage.changeContents('/idm/device-add-step3.html');
			},
			function(jqXHR, textStatus, errorThrown){
				console.info("errorThrown :" + errorThrown);
				console.info("textStatus : " + textStatus);
				console.info("jqXHR : " + JSON.stringify(jqXHR));
			}
		);
	};

	return {
		init_add_step1: init_add_step1,
		init_add_step2: init_add_step2,
		init_add_step3: init_add_step3
	};
}) ();
