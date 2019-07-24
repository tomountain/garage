IoTSP.DeviceSpecList = (function() {
	'use strict';
	
	var currentPage = 1;
	var PAGE_SIZE = 15;
	
	var displayDeviceSpecList = function(data, category) {
		$("#devicespec-table > tbody").empty();
		
		var i = 0;
		var pageContent = $('#devicespec_page').empty();
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
				var word = $('#searchText4DeviceSpec').val();
				getDeviceSpecList(currentPage, category, word);
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
					var word = $('#searchText4DeviceSpec').val();
					getDeviceSpecList(currentPage, category, word);
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
				var word = $('#searchText4DeviceSpec').val();
				getDeviceSpecList(currentPage, category, word);
			} else {
				return false;
			}
		});

		$('<li>').append(pageLink).appendTo(pageContent);

		$.each(data.deviceSpecs, function(key,obj) {
			var trContent = document.createElement('tr');
			
			if ((i % 2) !== 0) {
				trContent.style.backgroundColor = "aliceblue";
			}

			trContent.innerHTML = 
				"<td>" + obj.name + "</td>" 
				+ "<td>" + obj.category + "</td>" 
				+ "<td>" + obj.type + "</td>" 
				+ "<td>" + obj.model + "</td>" 
				+ "<td>" + obj.unit + "</td>" 
				+ "<td>" + obj.creator + "</td>" 
				+ "<td>" + obj.description + "</td>";
			
			trContent.onclick = function() {
				IoTSP.DeviceSpecDetail.load_devicespec_detail(obj.uuid);
			};
			          
			$("#devicespec-table > tbody").append(trContent);

			i++;
		});	
	};
	
	var getDeviceSpecList = function(page, category, searchText) {
		if (searchText && searchText.length !== 0) {
			IoTSP.Data.searchDeviceSpecByCategoryWithPage(page, PAGE_SIZE, category, searchText, function(data) {
				displayDeviceSpecList(data, category);
			}, function(jqXHR, textStatus, errorThrown){
			});			
		}
		else {
			IoTSP.Data.getDeviceSpecByCategoryWithPage(page, PAGE_SIZE, category, function(data) {
				displayDeviceSpecList(data, category);
			}, function(jqXHR, textStatus, errorThrown){
			});				
		}
	};

	var init_devicespec_list = function (category) {
		currentPage = 1;
		getDeviceSpecList(currentPage, category)

		$('#deviceSpecAdd').click(function() {
			IoTSP.MainPage.changeContents('/idm/devicespec-add.html');
		});

		IoTSP.i18nManagement.loadTextInDeviceSpecList();

		$('#searchDeviceSpec').click(function(e) {
			currentPage = 1;
			var word = $('#searchText4DeviceSpec').val();
			getDeviceSpecList(currentPage, category, word);
		});
	};

	var load_devicespec_list = function (category) {
		IoTSP.MainPage.changeContents('/idm/devicespec-list.html', function() {
			init_devicespec_list(category);
		});
	};
	
	return {
		init_devicespec_list: init_devicespec_list,
		load_devicespec_list: load_devicespec_list
	}
}) ();