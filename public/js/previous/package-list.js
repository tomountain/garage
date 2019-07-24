/**
 * 
 */
IoTSP.PackageList = (function() {
	'use strict';
	
	var init_package_list = function () {
		IoTSP.Data.getPackageList(function(data) {
			$("#package-table > tbody").empty();
			
			$.each(data, function(key,obj) {
				var updateBtn = "<button class=\"btn btn-danger\" data-toggle=\"modal\" data-target=\"#updateModal\""
					+ " onClick=\""
					+ "$('#categoryUpdate').val('" + obj.category + "');"
					+ "$('#packageNameUpdate').val('" + obj.packageName + "');"
					+ "$('#osUpdate').val('" + obj.os + "');"
					+ "$('#typeUpdate').val('" + obj.type + "');" 
					+ "$('#commandUpdate').val('" + obj.command + "');"
					+ "$('#updateUUID').text('" + obj.uuid + "');\""
					+ ">Update</button>";
				
				var deleteBtn = "<button class=\"btn btn-danger\""
					+ " onClick=\"IoTSP.PackageList.delete_package('"+ obj.uuid + "');\""
					+ ">Delete</button>";
				   
				var trContent = "<tr>" 
					+ "<td>" + obj.category + "</td>" 
					+ "<td>" + obj.packageName + "</td>" 
					+ "<td>" + obj.os + "</td>" 
					+ "<td>" + obj.type + "</td>" 
					+ "<td>" + obj.command + "</td>" 
					+ "<td>" + updateBtn + "</td>" 
					+ "<td>" + deleteBtn + "</td>" 
					+ "</tr>";
				          
				$("#package-table > tbody").append(trContent);
			});
		}, function(jqXHR, textStatus, errorThrown) {
		});
	
		$("#addBtn").click(function() {
	       
			var payloadJson  = new Object();
			payloadJson['category']   = $("#category").val();
			payloadJson['packageName']   = $("#packageName").val();
			payloadJson['os']   = $("#os").val();
			payloadJson['type']   = $("#type").val();
			payloadJson['command']   = $("#command").val();
			        
			IoTSP.Data.addPackage(JSON.stringify(payloadJson), function(data) {
				init_package_list();
			}, function(jqXHR, textStatus, errorThrown) {
			})
		});      
	     
		$("#updateBtn").click(function() {
			var payloadJson  = new Object();
			payloadJson['category']   = $("#categoryUpdate").val();
			payloadJson['packageName']   = $("#packageNameUpdate").val();
			payloadJson['os']   = $("#osUpdate").val();
			payloadJson['type']   = $("#typeUpdate").val();
			payloadJson['command']   = $("#commandUpdate").val();
			            
			var uuid = $("#updateUUID").text();
			var updateUrl = packagesInfoUrl + "/" + uuid;  
	     
			IoTSP.Data.updatePackage(uuid, JSON.stringify(payloadJson), function(data) {
				$('#updateModal').modal('hide');
				init_package_list();
			}, function(jqXHR, textStatus, errorThrown) {
			})
		});
	     
		IoTSP.i18nManagement.loadTextInPackageList();
	}

	var delete_package = function (uuid) {
		IoTSP.Data.deletePackage(uuid, function(data) {
			init_package_list();
		}, function(jqXHR, textStatus, errorThrown) {
		})		
	};
	
	return {
		init_package_list: init_package_list,
		delete_package: delete_package
	}
}) ();