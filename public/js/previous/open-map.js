/**
 * 
 */

IoTSP.DeviceMap = (function() {
	'use strict';
	
    var markers;
	var map, mapview, controls, vectorLayer, epsg4326, projectTo;
	
    var size = new OpenLayers.Size(32,48);
    var offset = new OpenLayers.Pixel(-(size.w/2), -size.h);
	var elevator = new google.maps.ElevationService();
	var featuremap = {};
	
	var createPopupForm	= function (feature){ 
//		var data = feature.attributes.description.split('$');
		
		var orgId = feature.attributes.orgId;
		var deviceType = feature.attributes.deviceType;
		var deviceId = feature.attributes.deviceId;
		var sensors = feature.attributes.sensors;
		var actuators = feature.attributes.actuators;
		var tags = feature.attributes.tags;
		var email = sessionStorage.getItem("LoginId");
		var orgType = sessionStorage.getItem("CurrentType");

		// URI : http://localhost?host= 192.168.1.1 &port= 1880 &email= sksim@kr.ibm.com

		var resourceHTML ='<table class="table"><thead><tr><th>Resources</th><th>name</th></tr></thead>';

		if(sensors && sensors.length > 0) {
			$.each(sensors, function(key, value) {
				var sr = value.name;
				resourceHTML += '<tr><td>Sensor</td><td>' + sr + '</td></tr>';
			});
		}
        

		if(actuators && actuators.length > 0) {
			$.each(actuators, function(key, value) {
				var sr = value.name;
				resourceHTML += '<tr><td>Actuator</td><td>' + sr + '</td></tr>';
			});
		}

		if(tags && tags.length > 0) {
			$.each(tags, function(key, value) {
				var sr = value.name;
				resourceHTML += '<tr><td>Tag</td><td>' + sr + '</td></tr>';
			});
		}

		resourceHTML += '</tbody></table>';

		var hrefUrl = nrPlatformUrl.replace("{email}", email).replace("{orgType}", orgType).replace("{deviceId}", deviceId);
		var theHTML = ''; 
		theHTML += '<div class="panel panel-primary"><div class="panel-heading" style="color:white"><h4>Gateway Name : '+ deviceId +'</h4><br>';
		theHTML += '<a href="' + hrefUrl + '" target="_blank" style="color:white">';
		theHTML += '<span class="glyphicon glyphicon-chevron-right"></span> Connect to Service Editor</a></div>';
		theHTML += resourceHTML;
		theHTML += '</div>';
		return theHTML; 
	};
	
	var createPopup = function (feature) {
		feature.popup = new OpenLayers.Popup.FramedCloud("pop", 
				feature.geometry.getBounds().getCenterLonLat(),
				null,
				createPopupForm(feature),
				null,
				true,
				function() { controls['selector'].unselectAll(); }
		);
		mapview.addPopup(feature.popup);
	};

	var destroyPopup = function (feature) {
		feature.popup.destroy();
		feature.popup = null;
	};
	
	var addDevice = function (lon, lat, orgId, deviceType, deviceId, sensors, actuators, tags) {
        var lonlat = new OpenLayers.LonLat(lon, lat)
        .transform(
            new OpenLayers.Projection("EPSG:4326"), // transform from WGS 1984
            mapview.getProjectionObject() // to Spherical Mercator Projection
        );
        
        var feature = new OpenLayers.Feature.Vector(
                new OpenLayers.Geometry.Point(lon,lat).transform(epsg4326, projectTo),
                    {orgId:orgId, deviceType: deviceType, deviceId: deviceId, sensors: sensors, actuators: actuators, tags: tags},
                    {externalGraphic: '/lib/ibm/images/icon.png', graphicHeight: 48, graphicWidth: 32, graphicXOffset:offset.x, graphicYOffset:offset.y  }
                );    

        vectorLayer.addFeatures(feature);
        
        featuremap[deviceId] = feature;
   	};
	
	var initDeviceMapView = function () {
	    mapview = new OpenLayers.Map("mapView");
	    mapview.addLayer(new OpenLayers.Layer.OSM("OpenStreetMap",
	    	[
			 	'//a.tile.openstreetmap.org/${z}/${x}/${y}.png',
			 	'//b.tile.openstreetmap.org/${z}/${x}/${y}.png',
			 	'//c.tile.openstreetmap.org/${z}/${x}/${y}.png'
			], 
			null)
		);
		epsg4326 =  new OpenLayers.Projection("EPSG:4326"); //WGS 1984 projection
	    projectTo = mapview.getProjectionObject(); //The map projection (Spherical Mercator)
	    
	    vectorLayer = new OpenLayers.Layer.Vector("Overlay");
	    mapview.setCenter(new OpenLayers.LonLat(127.051906, 37.257647).transform('EPSG:4326', 'EPSG:3857'), 7);
	    mapview.addLayers([vectorLayer]);
	    
	    //Add a selector control to the vectorLayer with popup functions
	    controls = {
	      selector: new OpenLayers.Control.SelectFeature(vectorLayer, { onSelect: createPopup, onUnselect: destroyPopup })
	    };

	    mapview.addControl(controls['selector']);
	    controls['selector'].activate();
	};
	
	var addBtnMarker = function (latitude, longitude) {  //type : view or add
		console.log("addBtnMarker latitude : " + latitude);
		console.log("addBtnMarker longitude : " + longitude);

		markers.clearMarkers();
		
		var lonlat = new OpenLayers.LonLat(longitude, latitude)
			.transform(
				new OpenLayers.Projection("EPSG:4326"), // transform from WGS 1984
				map.getProjectionObject() // to Spherical Mercator Projection
			);

		map.setCenter(lonlat);

		var icon = new OpenLayers.Icon('/lib/ibm/images/icon.png', size, offset);
	    markers.addMarker(new OpenLayers.Marker(lonlat, icon));

		// Altitude Cals (https://developers.google.com/maps/documentation/javascript/elevation)
		var locations = [];
		locations.push( new google.maps.LatLng(latitude, longitude));
		var positionalRequest = {'locations': locations };
 
		elevator.getElevationForLocations(positionalRequest, function(results, status) {
			console.log("positionalRequeset : " + JSON.stringify(positionalRequest));
			console.info("results : " + results[0].elevation);
	        $("#alt").val(results[0].elevation);
	  	});
		
	   	$("#lat").val(latitude);
		$("#lon").val(longitude);
	};
	
	var addClickMarker = function (e){
		var projWGS84 = new OpenLayers.Projection("EPSG:4326");
		var projGoogle = new OpenLayers.Projection("EPSG:900913");	

	    var lonlat = map.getLonLatFromPixel(new OpenLayers.Pixel(e.xy.x, e.xy.y));
		var lonlatWGS84 = lonlat.transform(projGoogle, projWGS84);
			
		var lat = lonlatWGS84.lat;
		var lon = lonlatWGS84.lon;

		addBtnMarker(lat, lon);
	}
	
	var initDeviceLocationMap = function() {
		map = new OpenLayers.Map({
			div: 'map',
			projection: 'EPSG:3857',
			theme: null,
			units: 'm',
			numZoomLevels: 20,
			zoomDuration: 1,
			layers: [
		        new OpenLayers.Layer.OSM("OpenStreetMap",
		    	    [
		 			 	'//a.tile.openstreetmap.org/${z}/${x}/${y}.png',
		 			 	'//b.tile.openstreetmap.org/${z}/${x}/${y}.png',
		 			 	'//c.tile.openstreetmap.org/${z}/${x}/${y}.png'
		 			], 
		 			null)
			],
			controls: [
				new OpenLayers.Control.Navigation(),
		        new OpenLayers.Control.PanZoomBar(),
		        new OpenLayers.Control.LayerSwitcher({'ascending':false}),
		        new OpenLayers.Control.ScaleLine(),
		        new OpenLayers.Control.KeyboardDefaults()
			]
		});

		map.setCenter(new OpenLayers.LonLat(127.051906, 37.257647).transform('EPSG:4326', 'EPSG:3857'), 10);
		markers = new OpenLayers.Layer.Markers("Markers");
		map.addLayers([markers]);
		map.events.register('click', map, addClickMarker);
	};
	
	var updateDevice = function(lon, lat, orgId, deviceType, deviceId, sensors, actuators, tags) {
		if (featuremap[deviceId]) {
			vectorLayer.removeFeatures(featuremap[deviceId]);
			addDevice(lon, lat, orgId, deviceType, deviceId, sensors, actuators, tags);
			mapview.setCenter(new OpenLayers.LonLat(lon, lat).transform('EPSG:4326', 'EPSG:3857'), 10);
		}
		else {
			addDevice(lon, lat, orgId, deviceType, deviceId, sensors, actuators, tags);
		}
	};
	
	return {
		initDeviceMapView: initDeviceMapView,
		addDevice: addDevice,
		updateDevice: updateDevice,
		addBtnMarker: addBtnMarker,
		initDeviceLocationMap: initDeviceLocationMap,
	};
}) ();