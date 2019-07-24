IoTSP.CommonData = (function () {
	var device_category = [];
	var device_types = {};
	var device_units = {};
	var device_specs_by_category = {};
	
	var getDeviceCategories = function (callback) {
		if (device_category.length !== 0) {
			if (callback) {
				callback(device_category);
			}
		}
		else {
			IoTSP.Data.getCodeData('DEVICE_CATEGORY', '', function(data) {
				for (var i = 0; i < data.length; i++) {
					try {
						data[i].description = JSON.parse(data[i].description);
					} catch (e) {
					}
				}
				device_category = data;
				if (callback) {
					callback(device_category);
				}
			});
		}	
	}
	
	var getDeviceTypes = function (category, callback) {
		if ((device_types[category]) && (device_types[category]).length !== 0) {
			if (callback) {
				callback(device_types[category]);
			}
		}
		else {
			IoTSP.Data.getCodeData('DEVICE_TYPE', category, function(data) {
				for (var i = 0; i < data.length; i++) {
					try {
						data[i].description = JSON.parse(data[i].description);
					} catch (e) {
					}
				}
				device_types[category] = data;
				if (callback) {
					callback(device_types[category]);
				}
			});
		}
	};
	
	var getDeviceUnits = function (category, callback) {
		if ((device_units[category]) && (device_units[category]).length !== 0) {
			if (callback) {
				callback(device_units[category]);
			}
		}
		else {
			IoTSP.Data.getCodeData('DEVICE_UNIT', category, function(data) {
				for (var i = 0; i < data.length; i++) {
					try {
						data[i].description = JSON.parse(data[i].description);
					} catch (e) {
					}
				}
				device_units[category] = data;
				if (callback) {
					callback(device_units[category]);
				}
			});
		}
	};
	
	var getDeviceSpecListByCategory = function (category, callback) {
		if (device_specs_by_category[category] && device_specs_by_category[category].length !== 0) {
			callback(device_specs_by_category[category]);
		}
		else {
			IoTSP.Data.getDeviceSpecByCategory(category, function(data) {
				device_specs_by_category[category] = data;
				callback(device_specs_by_category[category]);
			});
		}
	};
	
	var setDeviceSpecDirty = function(category) {
		if (category) {
			device_specs_by_category[category] = [];			
		} else {
			device_specs_by_category = {};
		}
	};
	
	return {
		getDeviceCategories: getDeviceCategories,
		getDeviceTypes: getDeviceTypes,
		getDeviceUnits: getDeviceUnits,
		getDeviceSpecListByCategory: getDeviceSpecListByCategory,
		setDeviceSpecDirty: setDeviceSpecDirty
	}
}) ();
