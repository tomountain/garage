
/**
 * 
 */

IoTSP.PlatformObject = (function(){
	var platformType = {"IoTF":"IoTF", "oneM2M":"oneM2M"};
	var currentType = "";
	var currentName = "";
	
	function getCurrentType() {
		return currentType;
	}
	
	function setCurrentType(type){
		currentType = type;
	}
	
	function getCurrentName(){
		return currentName;
	}
	
	function setCurrentName(name){
		currentName = name
	}
	
	
	return{
		getCurrentType : getCurrentType,
		setCurrentType : setCurrentType,
		getCurrentName : getCurrentName,
		setCurrentName : setCurrentName
	};
})();