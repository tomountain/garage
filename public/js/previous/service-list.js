IoTSP.ServiceList = (function() {
	var PAGE_SIZE = 10;
	var currentPage = 1;
	
	var displayServiceList = function(data) {
		var i = 0;
		var userId = sessionStorage.getItem("LoginId");
		
		$("#service-table > tbody").empty();
	    
		var pageContent = $('#service_page').empty();
		var pageLink = $('<a>', {
			href:'#',
			'aria-label': 'Previous',
		}).html('<span aria-hidden="true">&laquo;</span>');
	    			    
		pageLink.click(function() {
			if (currentPage == 1) {
				return false;
			}
			else if (currentPage > 1) {
				currentPage--;
				var word = $('#searchText4Service').val();
				getServiceList(currentPage, word);
			}
		});
	    
		$('<li>').append(pageLink).appendTo(pageContent);
	    
		var pages = parseInt((data.totalCount - 1) / PAGE_SIZE) + 1;
		if (pages < 1) {
			pages = 1;
		}
		    
		for (var i = 1; i <= pages; i++) {
			pageLink = $('<a>', {
				href:'#'
			}).html(i);
		    
			pageLink.click(function(e) {
				var pageString = $(e.target).html();
				var pageNumber = parseInt(pageString);
				if (pageNumber == currentPage) {
					return false;
				}
				if (pageNumber >= 1) {
					currentPage = pageNumber;
					var word = $('#searchText4Service').val();
					getServiceList(currentPage, word);
				}
			});
		    
			if (i == currentPage) {
				$('<li>', {class:'active'}).append(pageLink).appendTo(pageContent);
			}
			else {				    	
				$('<li>').append(pageLink).appendTo(pageContent);
			}
		}

		var pageLink = $('<a>', {
			href:'#',
			'aria-label': 'Next',
		}).html('<span aria-hidden="true">&raquo;</span>');
	    
		pageLink.click(function() {
			if (currentPage < pages) {
				currentPage++;
				var word = $('#searchText4Service').val();
				getServiceList(currentPage, word);
			} else {
				return false;
			}
		});

		$('<li>').append(pageLink).appendTo(pageContent);

		$.each(data.services, function(key,obj) {
			var trContent = $('<tr>');
			if ((i % 2) !== 0) {
				trContent.css('background-color', 'aliceblue');
			}
			
			var subscribeBtn = $('<button>', {
				class: 'btn btn-danger',
				'data-toggle': 'modal',
				'data-target': '#serviceListModal'
			}).html('Subscribe');
			
			subscribeBtn.click(function() {
				IoTSP.ServiceList.prepareSubscription(obj.uuid, obj.description);
			});
			
			$('<td>').html(obj.serviceType).appendTo(trContent);
			$('<td>').html(obj.serviceName).appendTo(trContent);
			$('<td>').html(obj.version).appendTo(trContent);
			$('<td>').html(obj.description).appendTo(trContent);
			$('<td>').html(obj.creator).appendTo(trContent);
			$('<td>').html(new Date(obj.registered).toISOString()).appendTo(trContent);
			$('<td>').append(subscribeBtn).appendTo(trContent);
			
			if (userId === obj.creator) {
				var deleteBtn = $('<button>', {
					class: 'btn btn-danger',
					'data-toggle': 'modal',
					'data-target': '#deleteServiceModal'
				}).html('Delete');

				deleteBtn.click(function() {
					IoTSP.ServiceList.prepareDelete(obj.uuid);
				});
				
				$('<td>').append(deleteBtn).appendTo(trContent);
			}
			else {
				$('<td>').html('&nbsp;').appendTo(trContent);
			}
			
			$("#service-table > tbody").append(trContent);
			
			i++;
		});
	}
	
	var getServiceList = function(page, word) {
		if (word && word.length !== 0) {
			IoTSP.Data.searchServiceListWithPage(page, PAGE_SIZE, word, 
				function(data) {
					displayServiceList(data)     		
				},
				function(jqXHR, textStatus, errorThrown) {
				}
			);			
		}
		else {
			IoTSP.Data.getServiceListWithPage(page, PAGE_SIZE, 
				function(data) {
					displayServiceList(data)     		
				},
				function(jqXHR, textStatus, errorThrown) {
				}
			);		
		}
	};

	var init_service_list = function () {
		currentPage = 1;
		getServiceList(currentPage);

		$("#subscribeBtn").click(function() {
			var payloadJson  = new Object(); 
			payloadJson['subscribeUuid']   = $("#uuidSubscribe").val(); 
			payloadJson['description']   = $("#descriptionSubscribe").val();

			IoTSP.Data.subscribeService(JSON.stringify(payloadJson), function(data) {
				$('#serviceListModal').on('hidden.bs.modal', function () {
					IoTSP.MainPage.changeContents("/idm/service-dashboard.html");
				})
				$('#serviceListModal').modal('hide');
			}, function(jqXHR, textStatus, errorThrown) {
			})
		});
		
		$("#deleteServiceBtn").click(function() {
			var uuid =  $("#uuidDelete").val(); 
			IoTSP.Data.deleteService(uuid, function(data) {
				$('#deleteServiceModal').on('hidden.bs.modal', function () {
					init_service_list();
				})
				$('#deleteServiceModal').modal('hide');
			});
		});

		$('#searchService').click(function(e) {
			currentPage = 1;
			var word = $('#searchText4Service').val();
			getServiceList(currentPage, word);
		});

		IoTSP.i18nManagement.loadTextInServiceList();
	};

	var prepareSubscription = function (uuid, description) {      
		$('#uuidSubscribe').val(uuid);     
		$('#descriptionSubscribe').val(description);
	};

	var prepareDelete = function (uuid) {      
		$('#uuidDelete').val(uuid);     
	}

	return {
		init_service_list: init_service_list,
		prepareSubscription: prepareSubscription,
		prepareDelete: prepareDelete
	}
}) ();

