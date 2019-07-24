IoTSP.IoTKeyMgmt = (function() {
	
	// Enum Key Type for each Platform
	// Set iot fundation key as default
	var KEY_TYPE = {"IoTF":"IoTF", "oneM2M":"oneM2M"};
	var keyState = KEY_TYPE.IoTF;
	
	
	var initIoTKeyMgmt = function() {
		IoTSP.i18nManagement.loadTextInIoTFKey();
	    
		/************************************
      	
      	# TODO
      	
      	Validate the inputs: key, auth token, comment
      	Validate the new api input : this input should be like below, and the Comment is optional 
      		Key:	a-huquwl-zj4td0qqjv
			Auth Token:	BUthDbBiUBE??oVB&3
			Comment:       Key for ibmiot101
      	Implement fillInText()
      	Beautify the UI : Add new key
      	
		************************************/
      
		IoTSP.Data.getApiKeys(true, 
			function(data){
				$("#iotf-api-key-table > tbody").empty();
				
				$.each(data, function(key, value) {
	    	  	
					var deleteBtn = "<button class=\"btn btn-danger\""
						+ " onClick=\"IoTSP.IoTKeyMgmt.deleteIotfApikey('"+ value.key + "');\""
						+ ">Delete</button>";
	          
					var trContent = "<tr>" + 
						"<td>" + value.orgId + "</td>" +
						"<td>" + value.key + "</td>" +
//						"<td>" + value.authToken + "</td>" +
						"<td>" + value.comment + "</td>" +
						"<td>" + deleteBtn + "</td>" +
						"</tr>";
	                 
					$("#iotf-api-key-table > tbody").append(trContent);
				});
			},
			function(jqXHR, textStatus, errorThrown){
	        }
		);
          
		$("#addBtn").click(function() {
			
			var payloadJson  = new Object();
			var key, authToken, comment, serverAddr;
			
			if(keyState == 'IoTF') { // IoTF
				
				key = $("#key").val();
				authToken = $("#authToken").val();
				comment = $("#comment").val();
				serverAddr = 'https://internetofthings.ibmcloud.com';
				
				
			} else if(keyState == 'oneM2M'){ // oneM2M
				
				key = $("#userM2M").val();
				authToken = "authToken";
				comment = $('#commentM2M').val();
				serverAddr =$('#serverM2M').val();
				
			}
			
			payloadJson['Key']   = key;
			payloadJson['Auth Token']   = authToken;
			payloadJson['Comment']   = comment;
			payloadJson['Type'] = keyState;
			payloadJson['ServerAddr'] = serverAddr;
			
			console.log(key + " " + authToken + " " + comment + " " + JSON.stringify(payloadJson));
			
			IoTSP.Data.addApiKey(JSON.stringify(payloadJson), 
				function(data) {
					$('#addModal').modal('hide');
					initIoTKeyMgmt();
				},
				function(jqXHR, textStatus, errorThrown){
				}
			);
		});
		
		$('#initText').click(fillInText);
		
		$('input[name="keyChangeRadio"]').change(function(){
			
			if($(this).val() == 'iotfKeyBtn'){
				
				$('#iotFoundationApiKeyForm').show();
				$('#oneM2MApiKeyForm').hide();
				keyState = KEY_TYPE.iotf;
				
			}else if($(this).val() == 'oneM2MKeyBtn'){
				
				$('#iotFoundationApiKeyForm').hide();
				$('#oneM2MApiKeyForm').show();			
				keyState = KEY_TYPE.oneM2M;
			}
		});
		
		$('#oneM2MApiKeyForm').hide();
		
		
	};

	var deleteIotfApikey = function (apikey) {
		IoTSP.Data.deleteApiKey(apikey, function() {
			initIoTKeyMgmt();
		});
	};
      
	var fillInText = function () {
      	var key, authToken; 

  		var contents = $("#newApiKeyContent").val().split("\n");
      	
      	if (contents) {
      		
      		contents.forEach(function(entry) {
      			if (entry.indexOf("Key:") >= 0 && entry.length > 5) {
      				key = entry.substr(4);
      				key = key.trim();
      			}
      			else if (entry.indexOf("Auth Token:") >= 0) {
      				authToken = entry.substr(11);
      				authToken = authToken.trim();
      			}
      		});
      		
      		if (key) {
    			$("#key").val(key);
      		}
      		if (authToken) {
      			$("#authToken").val(authToken);
      		}
      	}
	};
	
	return {
		initIoTKeyMgmt: initIoTKeyMgmt,
		deleteIotfApikey: deleteIotfApikey,
		fillInText: fillInText
	};
}) ();