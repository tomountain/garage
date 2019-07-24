IoTSP.ServiceDashboard = (function() {
	var init_service_dashboard = function () {
		IoTSP.Data.getUserServiceList(
			function(data){
				var count = 0;
				$("#subscribingServices").text(count);    
				$("#user-service-table > tbody").empty();
				var userId = sessionStorage.getItem("LoginId");
				var i = 0;
				$.each(data, function(key,obj) {
					count++;
					$("#subscribingServices").text(count);

					var trContent = $('<tr>');
					if ((i % 2) !== 0) {
						trContent.css('background-color', 'aliceblue');
					}
					
					var unsubscribeBtn = $('<button>', {
						class: 'btn btn-danger btn-wide',
						'data-toggle': 'modal',
						'data-target': '#myServiceModal'
					}).html('Unsub');
					
					unsubscribeBtn.click(function() {
						IoTSP.ServiceDashboard.prepareUnsubscribe(obj.uuid);
					});
					
					var winOpen = obj.serviceUrl + "&email=" + userId;
					
					$('<td>').html(obj.serviceType).appendTo(trContent);
					$('<td>').html(obj.serviceName).appendTo(trContent);
					$('<td>').html(obj.version).appendTo(trContent);
					$('<td>').html(obj.description).appendTo(trContent);
					$('<td>').html(obj.creator).appendTo(trContent);
					$('<td>').html(new Date(obj.created).toISOString()).appendTo(trContent);
					$('<td>').html('<a href="' + winOpen + '" target="_blank"><b>Click to open</b></a>').appendTo(trContent);
					$('<td>').append(unsubscribeBtn).appendTo(trContent);

					$("#user-service-table > tbody").append(trContent);
					
					i++;
				});  		
			},
			function(jqXHR, textStatus, errorThrown){
			}
		);
	    
	    $("#unsubscribeBtn").click(function() {
	    	var serviceId = $("#uuidUnsubscribe").val();
	    	
	    	if (serviceId && serviceId.length > 0) {
		    	IoTSP.Data.unsubscribeService(serviceId, function() {
		    		$('#myServiceModal').modal('hide');
		    		init_service_dashboard();
		    	}, function(jqXHR, textStatus, errorThrown) {
		    	});
	    	}
	    });      
	      
	    IoTSP.Data.getServiceCount(function(data){
		    	$("#registeredServices").text(data.countAll);
				$("#openServices").text(data.countOpen);  
			},
			function(jqXHR, textStatus, errorThrown){
			}
		)
		
		IoTSP.i18nManagement.loadTextInServiceDashboard();
	};

	var prepareUnsubscribe = function (uuid) {
	    $("#uuidUnsubscribe").val(uuid);
	}

	return {
		init_service_dashboard: init_service_dashboard,
		prepareUnsubscribe: prepareUnsubscribe
	}
}) ();

