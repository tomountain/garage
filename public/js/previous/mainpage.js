IoTSP.MainPage = (function() {
	var gotDevice = false, gotDeviceSpec = false;
	var eventRegistered = false;
	var platformObject = IoTSP.PlatformObject;

	var updateOrganizationList = function (callback) {
		$("#orgList").html('<br/><div><img src="/lib/ibm/images/ajax-loader.gif" style=" display: block; margin-left: auto; margin-right: auto; "/></div>');

		IoTSP.Data.getOrganizationList(function(data) {

			var orgListHtml = "";

			if (data && data.length > 0) {
				$.each(data, function(index, obj) {
					if(obj.type != 'oneM2M'){

						orgListHtml += "<a class='org-id' href='#' onclick='IoTSP.MainPage.changeCurrentOrgWithType(\"" + obj.id + "\", \"IoTF\")'><li>"
						orgListHtml += 'IoTF' + " - " + obj.name;
						orgListHtml += "</li></a>";

					}else if(obj.type == 'oneM2M'){

						orgListHtml += "<a class='org-id' href='#' onclick='IoTSP.MainPage.changeCurrentOrgWithType(\"" + obj.name + "\", \""+ obj.type +"\")'><li>"
						orgListHtml += obj.type + " - " + obj.name;
						orgListHtml += "</li></a>";

					}
				});

				$("#orgList").html("<br/>" + orgListHtml);
			}
			else{
			}
			if (callback) {
				callback(data);
			}
		});
	};

	var initOrgMenu = function() {
		updateOrganizationList( function(data)  {
			console.log(data);
			if (data && data.length > 0) {

				var name = sessionStorage.getItem("CurrentOrgId");
				var type = sessionStorage.getItem("CurrentType");

				var orgId;

				if(name === null || type === null){
					orgId = data[0].id;
					if(data[0].type === 'Bluemix Free'){
						sessionStorage.setItem("CurrentType", 'IoTF');
					}else if(data[0].type === 'oneM2M'){
						sessionStorage.setItem("CurrentType", 'oneM2M');
					}
				}
				else
					orgId = name;
								
				sessionStorage.setItem("CurrentOrgId", orgId);

				$("#curOrgId").text(orgId);

				IoTSP.DeviceDashboard.update_dashboard();

				queryDeviceList(orgId);
				queryDeviceSpecList();

			}
			else{
			}
		});
	};

	var queryDeviceList = function (org) {
		var orgId = org;
		var type = sessionStorage.getItem("CurrentType");
		
		if (!orgId) {
			orgId = sessionStorage.getItem("CurrentOrgId")
		}

		IoTSP.Data.getDeviceTypeList(orgId, type, buildDeviceTypeList, buildAddDeviceMenu);
		
	};

	function queryDeviceSpecList() {
		IoTSP.Data.getDeviceSpecByCategory('', buildDeviceSpecList);
	};

	var buildAddDeviceMenu = function(data) {
		var addDeviceMenu = document.createElement('li');

		addDeviceMenu.setAttribute('id', 'addDeviceMenuLi');
		addDeviceMenu.innerHTML = '<a href="#">' +
			'<i class="fa fa-edit"></i> ' +
			'<span class="menu-item-parent">Add new gateway</span>' +
			'</a>';

		addDeviceMenu.onclick = function() {
			changeContents('/idm/device-add-step1.html');
		};

		$('#addDeviceMenuUi').append(addDeviceMenu);

		gotDevice = true;

		if (gotDevice && gotDeviceSpec) {
			initMenu();
		}
	}
	
	var buildDeviceTypeList = function (data) {
		$("#addDeviceMenuUi").empty();
		
		data.forEach(function (deviceType) {
			var deviceTypeKey = "deviceType_" + deviceType.id;
			var deviceTypeData = document.createElement('li');
			deviceTypeData.setAttribute("id",deviceTypeKey);
			deviceTypeData.innerHTML =
				'<a href="#">' +
				'<span class="pull-right badge">' +  deviceType.count + '</span>' +
				'<i class="fa fa-bars"></i>' +
				'<span class="menu-item-parent">' + deviceType.id + '</span>' +
				'</a>';
	
			deviceTypeData.onclick = function() {
				IoTSP.DeviceList.load_device_list(deviceType.id);
			};
	
			$("#addDeviceMenuUi").append(deviceTypeData);
		});	
		
//		var type = sessionStorage.getItem("CurrentType");
//		
//		if(type === 'IoTF'){
//			data.forEach(function (deviceType) {
//				var deviceTypeKey = "deviceType_" + deviceType.deviceType;
//				var deviceTypeData = document.createElement('li');
//				deviceTypeData.setAttribute("id",deviceTypeKey);
//				deviceTypeData.innerHTML =
//					'<a href="#">' +
//					'<span class="pull-right badge">' +  deviceType.count + '</span>' +
//					'<i class="fa fa-bars"></i>' +
//					'<span class="menu-item-parent">' + deviceType.deviceType + '</span>' +
//					'</a>';
//
//				deviceTypeData.onclick = function() {
//					IoTSP.DeviceList.load_device_list(deviceType.deviceType);
//				};
//
//				$("#addDeviceMenuUi").append(deviceTypeData);
//			});			
//		}else if(type === 'oneM2M'){
//			console.log(data);
//			var result = data['m2m:aggregatedResponse'];
//			result = result['m2m:remoteCSE'];
//			
//			for(var i=0; i<result.length; i++){
//				var deviceTypeKey = "deviceType_" + result[i].resourceName;
//				var deviceTypeData = document.createElement('li');
//				deviceTypeData.setAttribute("id",deviceTypeKey);
//				deviceTypeData.innerHTML =
//					'<a href="#">' +
////					'<span class="pull-right badge">' +  deviceType.count + '</span>' +
//					'<i class="fa fa-bars"></i>' +
//					'<span class="menu-item-parent">' + result[i].resourceName + '</span>' +
//					'</a>';
//
//				deviceTypeData.onclick = function() {
//					//IoTSP.DeviceList.load_device_list(deviceType.deviceType);
//				};
//
//				$("#addDeviceMenuUi").append(deviceTypeData);				
//			}
//			
//		}
		
		var addDeviceMenu = document.createElement('li');

		addDeviceMenu.setAttribute('id', 'addDeviceMenuLi');
		addDeviceMenu.innerHTML = '<a href="#">' +
			'<i class="fa fa-edit"></i> ' +
			'<span class="menu-item-parent">Add new gateway</span>' +
			'</a>';

		addDeviceMenu.onclick = function() {
			changeContents('/idm/device-add-step1.html');
		};

		$('#addDeviceMenuUi').append(addDeviceMenu);

		gotDevice = true;

		if (gotDevice && gotDeviceSpec) {
			initMenu();
		}
		
		
	};

	var buildDeviceSpecList = function (data) {
		var deviceSpecListByType = {};
		$("#addDeviceSpecMenuUi").empty();

		$.each(data, function(key, value) {
			var deviceSpecType = value.category;
			var deviceSpecTypeKey = "deviceSpecType_" + deviceSpecType.replace(/\s/g, '');
			var deviceSpecId = value.uuid;
			var deviceSpecName = value.name;

			if (!deviceSpecListByType[deviceSpecType]) {
				deviceSpecListByType[deviceSpecType] = {count:1};

				var deviceSpecTypeData = document.createElement('li');
				deviceSpecTypeData.setAttribute("id",deviceSpecTypeKey);

				deviceSpecTypeData.innerHTML  =
					'<a href="#">' +
					'<span class="pull-right badge">' + deviceSpecListByType[deviceSpecType].count + '</span>' +
					'<i class="fa fa-bars"></i>' +
					'<span class="menu-item-parent">' + deviceSpecType + '</span>' +
					'</a>';
				$("#addDeviceSpecMenuUi").append(deviceSpecTypeData);

				deviceSpecTypeData.onclick = function() {
					IoTSP.DeviceSpecList.load_devicespec_list(deviceSpecType);
				};
			}
			else {
				deviceSpecListByType[deviceSpecType].count++;
				$("#" + deviceSpecTypeKey + " .badge").html(deviceSpecListByType[deviceSpecType].count);
			}
		});

		var addDeviceSpecMenu = document.createElement('li');

		addDeviceSpecMenu.setAttribute('id', 'addDeviceSpecMenuLi');

		addDeviceSpecMenu.innerHTML = '<a href="#">' +
			'<i class="fa fa-edit"></i> ' +
			'<span class="menu-item-parent">Add new Device Spec</span>' +
			'</a>';

		addDeviceSpecMenu.onclick = function() {
			changeContents('/idm/devicespec-add.html');
		};

		$('#addDeviceSpecMenuUi').append(addDeviceSpecMenu);

		gotDeviceSpec = true;

		if (gotDevice && gotDeviceSpec) {
			initMenu();
		}
	};

	var iotfMainPageLoad = function() {
		console.log("iotfMainPageLoad enter");
		$("#menuPackage").show();

        $("#menuDevice").click(function() {
            $("#menuDevice").attr( "class", "on" );
            $("#menuService").attr( "class", "off" );
            $("#menuPackage").attr( "class", "off" );
            $("#menuDeviceSpec").attr( "class", "off" );
        });

        $("#menuService").click(function() {
            $("#menuService").attr( "class", "on" );
            $("#menuDevice").attr( "class", "off" );
            $("#menuPackage").attr( "class", "off" );
            $("#menuDeviceSpec").attr( "class", "off" );
        });

        $("#menuPackage").click(function() {
            $("#menuPackage").attr( "class", "on" );
            $("#menuService").attr( "class", "off" );
            $("#menuDevice").attr( "class", "off" );
            $("#menuDeviceSpec").attr( "class", "off" );
        });

        $("#menuDeviceSpec").click(function() {
            $("#menuPackage").attr( "class", "off" );
            $("#menuService").attr( "class", "off" );
            $("#menuDevice").attr( "class", "off" );
            $("#menuDeviceSpec").attr( "class", "on" );
        });


		$( "#orgChangeDialog" ).dialog({
			modal: true,
			autoOpen: false,
			width: 400,
			open: function() {
				updateOrganizationList();
			    $('.ui-dialog-titlebar-close').addClass('ui-button ui-widget ui-state-default ui-corner-all ui-button-icon-only');
			    $('.ui-dialog-titlebar-close').append('<span class="ui-button-icon-primary ui-icon ui-icon-closethick"></span><span class="ui-button-text">close</span>');
			},
			buttons: {
				Close: function() {
					$( this ).dialog( "close" );
				}
			},
			show: {
				effect: "blind",
				duration: 200
			}
		});

		$("#orgChangeDiv").click(function() {
			$( "#orgChangeDialog" ).dialog( "open" );
		});

		$("#maintitle").click(function() {
			changeContents('/idm/device-dashboard.html');
			IoTSP.DeviceDashboard.update_dashboard();
		});

		$("#apiKeyMgmtDiv").click(function() {
			changeContents('/idm/iotf-key-mgmt.html');
		});

		$("#menuDevice").click(function() {
			changeContents('/idm/device-dashboard.html');
			IoTSP.DeviceDashboard.update_dashboard();
		});

		$("#menuService").click(function() {
			changeContents('/idm/service-dashboard.html');
		});

		$("#menuPackage").click(function() {
			changeContents('/idm/package-list.html');
		});

		$("#myPackageMenuLi").click(function() {
			changeContents('/idm/package-list.html');
		});

		$("#menuDeviceSpec").click(function() {
			IoTSP.DeviceSpecList.load_devicespec_list('');
		});

		$('#subscribeServerMenuLi').click(function() {
			changeContents('/idm/service-list.html');
		});

		$('#myServerMenuLi').click(function() {
			changeContents('/idm/service-dashboard.html');
		});

		// initial device-dash-dashboard page must not call update_dashboard()
		// because update_dashboard() is called after setting current organization
		changeContents('/idm/device-dashboard.html');

		IoTSP.i18nManagement.loadTextInMenu();
	};

	var onem2mMainPageLoad = function() {
		console.log("onem2mMainPageLoad enter");

		$("#menuPackage").hide();

        $("#menuDevice").click(function() {
            $("#menuDevice").attr( "class", "on" );
            $("#menuService").attr( "class", "off" );
            $("#menuDeviceSpec").attr( "class", "off" );
        });

        $("#menuService").click(function() {
            $("#menuService").attr( "class", "on" );
            $("#menuDevice").attr( "class", "off" );
            $("#menuDeviceSpec").attr( "class", "off" );
        });

        $("#menuDeviceSpec").click(function() {
            $("#menuService").attr( "class", "off" );
            $("#menuDevice").attr( "class", "off" );
            $("#menuDeviceSpec").attr( "class", "on" );
        });


		$( "#orgChangeDialog" ).dialog({
			modal: true,
			autoOpen: false,
			width: 400,
			open: function() {
				updateOrganizationList();
			    $('.ui-dialog-titlebar-close').addClass('ui-button ui-widget ui-state-default ui-corner-all ui-button-icon-only');
			    $('.ui-dialog-titlebar-close').append('<span class="ui-button-icon-primary ui-icon ui-icon-closethick"></span><span class="ui-button-text">close</span>');
			},
			buttons: {
				Close: function() {
					$( this ).dialog( "close" );
				}
			},
			show: {
				effect: "blind",
				duration: 200
			}
		});

		$("#orgChangeDiv").click(function() {
			$( "#orgChangeDialog" ).dialog( "open" );
		});

		$("#maintitle").click(function() {
			changeContents('/idm/device-dashboard.html');
			IoTSP.DeviceDashboard.update_dashboard();
		});

		$("#apiKeyMgmtDiv").click(function() {
			changeContents('/idm/iotf-key-mgmt.html');
		}); 

		$("#menuDevice").click(function() {
			changeContents('/idm/device-dashboard.html');
			IoTSP.DeviceDashboard.update_dashboard();
		});

		$("#menuService").click(function() {
			changeContents('/idm/service-dashboard.html');
		});
//
//		$("#menuPackage").click(function() {
//			changeContents('/idm/package-list.html');
//		});
//
//		$("#myPackageMenuLi").click(function() {
//			changeContents('/idm/package-list.html');
//		});
//
		$("#menuDeviceSpec").click(function() {
			IoTSP.DeviceSpecList.load_devicespec_list('');
		});
//
		$('#subscribeServerMenuLi').click(function() {
			changeContents('/idm/service-list.html');
		});

		$('#myServerMenuLi').click(function() {
			changeContents('/idm/service-dashboard.html');
		});

		// initial device-dash-dashboard page must not call update_dashboard()
		// because update_dashboard() is called after setting current organization
		changeContents('/idm/device-dashboard.html');
		
		IoTSP.i18nManagement.loadTextInMenu();
	};
	
	var initMainPage = function() {
		console.log("initMainPage enter");
		document.getElementById("currentUser").appendChild( document.createTextNode( sessionStorage.getItem("LoginId") ) ) ;
		initOrgMenu();

		// Need type checking (IoTF or oneM2M)
		var type = sessionStorage.getItem("CurrentType");

		if(type === "oneM2M"){
			onem2mMainPageLoad();
//			var options = {
//					  orgId: "test",
//					  deviceType: "test",
//					  deviceId: "test",
//					  apiKey: "test",
//					  authToken: "test",
//					  onMessageArrived: onMessageArrived
//					};
//
//					var onMessageArrived = function (msg) {
//						var topic = msg.destinationName;
//						
//						console.log(msg);
//						var payload = JSON.parse(msg.payloadString);
//						
//					};
//
//					oneM2MMqttData.subscribeData(options);

		}
		else
			iotfMainPageLoad();

	};
	
	var changeCurrentOrg = function (orgId) {
    	sessionStorage.setItem("CurrentOrgId", orgId);
    	$("#curOrgId").text(sessionStorage.getItem("CurrentOrgId"));
		$( "#orgChangeDialog" ).dialog("close");
		location.reload(true);
	};

	var changeCurrentOrgWithType = function (orgId, type) {
		console.log(orgId + " " + type);
		if(type == 'oneM2M'){
			sessionStorage.setItem("CurrentOrgId", orgId);
			sessionStorage.setItem("CurrentType", type);
			$("#curOrgId").text(sessionStorage.getItem("CurrentOrgId"));
			$( "#orgChangeDialog" ).dialog("close");
			location.reload(true);

		}else if(type === 'IoTF'){
			sessionStorage.setItem("CurrentOrgId", orgId);
			sessionStorage.setItem("CurrentType", type);
	    	$("#curOrgId").text(sessionStorage.getItem("CurrentOrgId"));
			$( "#orgChangeDialog" ).dialog("close");
			location.reload(true);
		}
	};

	var initMenu = function() {
		$( "body" ).tooltip({
			track: true
		});
	};

	var initFunction = function(filename) {
		if (filename.indexOf('device-dashboard') >= 0) {
			IoTSP.DeviceDashboard.init_dashboard();
		}
		else if (filename.indexOf('device-add-step1') >= 0) {
			IoTSP.DeviceAdd.init_add_step1();
		}
		else if (filename.indexOf('device-add-step2') >= 0) {
			IoTSP.DeviceAdd.init_add_step2();
		}
		else if (filename.indexOf('device-add-step3') >= 0) {
			IoTSP.DeviceAdd.init_add_step3();
		}
		else if (filename.indexOf('devicespec-add') >= 0) {
			IoTSP.DeviceSpecAdd.init_devicespec_add();
		}
		else if (filename.indexOf('package-list') >= 0) {
			IoTSP.PackageList.init_package_list();
		}
		else if (filename.indexOf('service-dashboard') >= 0) {
			IoTSP.ServiceDashboard.init_service_dashboard();
		}
		else if (filename.indexOf('service-list') >= 0) {
			IoTSP.ServiceList.init_service_list();
		}
	};

	var changeContents = function (filename, callback) {
		$('#content').load(filename, function (response, status, xhr) {
			if ( status == "error" ) {
				var ss = xhr.status;
				var st = xhr.statusText;
			}
			 else {
				$('#content').trigger('create');

				initFunction(filename);

				if (callback) {
					callback();
				}
			}
		});
	};

	var init = function() {
		$.ajax({
			url : getUserProfileUrl,
			success: function (userProfile) {
				console.log("userProfile : " + JSON.stringify(userProfile));
				sessionStorage.setItem("LoginId", userProfile.userId);
				initMainPage();
			},
			error: function(jqXHR, textStatus, errorThrown){
			},
			async: false,
		});
	};

	init();

	return {
		changeContents: changeContents,
		changeCurrentOrg: changeCurrentOrg,
		changeCurrentOrgWithType: changeCurrentOrgWithType,
		queryDeviceList: queryDeviceList,
		queryDeviceSpecList: queryDeviceSpecList
	}
})();
