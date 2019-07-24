var InnerGraph = function (orgId, deviceType, deviceId, mqttApiKey, mqttAuthToken) {
    'use strict';
	var _palette = new Rickshaw.Color.Palette({scheme: [
        "#7f1c7d",
        "#00b2ef",
        "#00649d",
        "#00a6a0",
        "#ee3e96"
    ]});
	
	var firstMessage = true;
	
	var that = this;
	
	var onMessageArrived = function (msg) {
		var topic = msg.destinationName;
		
		var payload = JSON.parse(msg.payloadString);
		if(sessionStorage.getItem('CurrentType') === 'oneM2M')
			payload = JSON.parse(payload["m2m:rqp"]["pc"]["sgn"]["nev"]["rep"]["cin"]["con"]); 
		//First message, instantiate the graph  
	    if (firstMessage) {
            $('#' + deviceId + '-chart').empty();
            firstMessage = false;
            that.displayChart(null, payload);
	    } else {
	    	that.graphData(payload);
	    }
	};
	
	this.showGraph = function () {
		var options = {
			orgId: orgId,
			deviceType: deviceType, 
			deviceId: deviceId, 
			apiKey: mqttApiKey, 
			authToken: mqttAuthToken, 
			onMessageArrived: onMessageArrived
		};
		
		MqttData.subscribeData(options);
	};
	
	this.hideGraph = function () {
		var options = {
			orgId: orgId,
			deviceType: deviceType, 
			deviceId: deviceId, 
			apiKey: mqttApiKey, 
			authToken: mqttAuthToken, 
			onMessageArrived: onMessageArrived
		};
		
		MqttData.unsubscribeData(options);
	}

    // function to invoke Rickshaw and plot the graph
    this.drawGraph = function (seriesData) {
        console.log('draw graph');
        // instantiate our graph!
        this.palette = _palette;

        this.graph = new Rickshaw.Graph({
            element: document.getElementById(deviceId + '-chart'),
            width: $('#' + deviceId + '-chart').width(),
            height: 500,
            renderer: 'line',
            stroke: true,
            preserve: true,
            series: seriesData
        });

        this.graph.render();

        this.hoverDetail = new Rickshaw.Graph.HoverDetail({
            graph: this.graph,
            xFormatter: function(x) {
                return new Date(x * 1000).toString();
            }
        });

        this.annotator = new Rickshaw.Graph.Annotate({
            graph: this.graph,
            element: document.getElementById(deviceId + '-timeline')
        });

        this.legend = new Rickshaw.Graph.Legend({
            graph: this.graph,
            element: document.getElementById(deviceId + '-legend')
        });

        this.shelving = new Rickshaw.Graph.Behavior.Series.Toggle({
            graph: this.graph,
            legend: this.legend
        });

        this.order = new Rickshaw.Graph.Behavior.Series.Order({
            graph: this.graph,
            legend: this.legend
        });

        this.highlighter = new Rickshaw.Graph.Behavior.Series.Highlight({
            graph: this.graph,
            legend: this.legend
        });

        this.smoother = new Rickshaw.Graph.Smoother({
            graph: this.graph,
            element: document.querySelector('#smoother')
        });

        this.ticksTreatment = 'glow';

        this.xAxis = new Rickshaw.Graph.Axis.Time({
            graph: this.graph,
            ticksTreatment: this.ticksTreatment,
            timeFixture: new Rickshaw.Fixtures.Time.Local()
        });

        this.xAxis.render();

        this.yAxis = new Rickshaw.Graph.Axis.Y({
            graph: this.graph,
            tickFormat: Rickshaw.Fixtures.Number.formatKMBT,
            ticksTreatment: this.ticksTreatment
        });

        this.yAxis.render();

        this.controls = new RenderControls({
            element: document.querySelector('form'),
            graph: this.graph
        });
    };
    
    this.graphData = function (data) {
        var key = 0;
        var seriesData = [];
        var timestamp = Date.now() / 1000;
        var maxPoints = 25;
        for (var j in data.d) {
 			if (typeof data.d[j] !== 'string') {
 			this.graph.series[key].data.push({x:timestamp,y:data.d[j]});
 			if (this.graph.series[key].data.length > maxPoints)
 			{
 				this.graph.series[key].data.splice(0,1);//only display up to maxPoints
 			}
 			key++;
 		}
 		}
 		this.graph.render();	
 	}

 	this.displayChart = function(device,data) {

 		var key = 0;
 		var seriesData = [];
 		var timestamp = Date.now()/1000;
 		for (var j in data.d)
 		{
 			if (typeof data.d[j] !== 'string') {
 			seriesData[key]={};
 			seriesData[key].name=j;
 			seriesData[key].color = _palette.color();
 			seriesData[key].data=[];

 			seriesData[key].data[0]={};
 			seriesData[key].data[0].x = timestamp;
 			seriesData[key].data[0].y = data.d[j];
 			key++;
 		}
 		}

 		this.drawGraph(seriesData);
 	}
};