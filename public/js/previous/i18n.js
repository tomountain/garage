/**
 * 
 */
IoTSP.i18nManagement = (function ($) {
	'use strict';
	
	var i18nfile;
	
	var loadBundles = function(lang) {	
		jQuery.i18n.properties({
	    	name:'Messages', 
	    	path:'/i18n/', 
	    	mode:'both',
	    	language:lang, 
	    	callback: function() {
	    		i18nfile = $.i18n;
	    		console.log(i18nfile);
	    	}
		});
	};
	
	var loadTextInLogin = function () {
		$("#msg_title").text(i18nfile.prop('msg_title'));
		$("#msg_login").text(i18nfile.prop('msg_login'));
		$("#msg_welcome").text(i18nfile.prop('msg_welcome'));
	};

	var loadTextInMenu = function () {
		$("#msg_org").text(i18nfile.prop('msg_org'));
		$("#msg_gateway").text(i18nfile.prop('msg_gateway'));
		$("#msg_logout1").text(i18nfile.prop('msg_logout'));
		$("#msg_logout2").text(i18nfile.prop('msg_logout'));
		$("#msg_service").text(i18nfile.prop('msg_service'));
		$("#msg_subscribe_a_service").text(i18nfile.prop('msg_subscribe_a_service'));
		$("#msg_my_service").text(i18nfile.prop('msg_my_service'));
		$("#msg_package").text(i18nfile.prop('msg_package'));
		$("#msg_my_package").text(i18nfile.prop('msg_my_package'));
		$("#msg_device_spec").text(i18nfile.prop('msg_device_spec'));
		$("#msg_select_one_to_change_current_organization").text(i18nfile.prop('msg_select_one_to_change_current_organization'));
		$("#msg_duplicate_gateway_id").text(i18nfile.prop('msg_duplicate_gateway_id'));
		$("#msg_need_gateway_id").text(i18nfile.prop('msg_need_gateway_id'));		
		$("#msg_need_to_add_api_key").text(i18nfile.prop('msg_need_to_add_api_key'));
	};
	
	var loadTextInDeviceDashboard = function () {
		$("#msg_organization").text(i18nfile.prop('msg_organization'));
		$("#msg_active_gateways").text(i18nfile.prop('msg_active_gateways'));
		$("#msg_number_of_gateways_reporting_data").text(i18nfile.prop('msg_number_of_gateways_reporting_data'));
		$("#msg_inactive_gateways").text(i18nfile.prop('msg_inactive_gateways'));
		$("#msg_number_of_gateways_disconnected").text(i18nfile.prop('msg_number_of_gateways_disconnected'));
		$("#msg_public_gateways").text(i18nfile.prop('msg_public_gateways'));
		$("#msg_number_of_gateways_open_to_other_users").text(i18nfile.prop('msg_number_of_gateways_open_to_other_users'));
		$("#msg_registered_gateways").text(i18nfile.prop('msg_registered_gateways'));
		$("#msg_number_of_gateways_registered").text(i18nfile.prop('msg_number_of_gateways_registered'));
		$("#msg_location").text(i18nfile.prop('msg_location'));
		$("#msg_connection_status").text(i18nfile.prop('msg_connection_status'));
		$("#msg_status").text(i18nfile.prop('msg_status'));
		$("#msg_gateway_id").text(i18nfile.prop('msg_gateway_id'));
		$("#msg_gateway_type").text(i18nfile.prop('msg_gateway_type'));
		$("#msg_gateway_name").text(i18nfile.prop('msg_gateway_name'));
		$("#msg_model_name").text(i18nfile.prop('msg_model_name'));
		$("#msg_description").text(i18nfile.prop('msg_description'));
		$("#msg_number_of_sensors").text(i18nfile.prop('msg_number_of_sensors'));
		$("#msg_number_of_actuators").text(i18nfile.prop('msg_number_of_actuators'));
		$("#msg_number_of_tags").text(i18nfile.prop('msg_number_of_tags'));
		$("#msg_date_added").text(i18nfile.prop('msg_date_added'));		
	};
	
	var loadTextInDeviceList = function () {
		$("#msg_device_list").text(i18nfile.prop('msg_device_list'));
		$("#msg_add").text(i18nfile.prop('msg_add'));
		$("#msg_status").text(i18nfile.prop('msg_status'));
		$("#msg_gateway_id").text(i18nfile.prop('msg_gateway_id'));
		$("#msg_gateway_type").text(i18nfile.prop('msg_gateway_type'));
		$("#msg_gateway_name").text(i18nfile.prop('msg_gateway_name'));
		$("#msg_model_name").text(i18nfile.prop('msg_model_name'));
		$("#msg_description").text(i18nfile.prop('msg_description'));
		$("#msg_number_of_sensors").text(i18nfile.prop('msg_number_of_sensors'));
		$("#msg_number_of_actuators").text(i18nfile.prop('msg_number_of_actuators'));
		$("#msg_number_of_tags").text(i18nfile.prop('msg_number_of_tags'));
		$("#msg_date_added").text(i18nfile.prop('msg_date_added'));		
	};

	var loadTextInDeviceAdd1 = function () {
		$("#msg_add_new_gateway").text(i18nfile.prop('msg_add_new_gateway'));
		$("#msg_step1").text(i18nfile.prop('msg_step'));
		$("#msg_step2").text(i18nfile.prop('msg_step'));
		$("#msg_step3").text(i18nfile.prop('msg_step'));
		$("#msg_basic_info").text(i18nfile.prop('msg_basic_info'));
		$("#msg_resource_info").text(i18nfile.prop('msg_resource_info'));
		$("#msg_complete").text(i18nfile.prop('msg_complete'));
		$("#msg_gateway_basic_information").text(i18nfile.prop('msg_gateway_basic_information'));
		$("#msg_gateway_additional_information").text(i18nfile.prop('msg_gateway_additional_information'));
		$("#msg_gateway_type").text(i18nfile.prop('msg_gateway_type'));
		$("#msg_create_a_gateway_type").text(i18nfile.prop('msg_create_a_gateway_type'));
		$("#msg_gateway_type_name").text(i18nfile.prop('msg_gateway_type_name'));
		$("#msg_onem2m_gateway_type_description").text(i18nfile.prop('msg_onem2m_gateway_type_description'));
		$("#msg_gateway_type_description").text(i18nfile.prop('msg_gateway_type_description'));
		$("#msg_gateway_id").text(i18nfile.prop('msg_gateway_id'));
		$("#msg_gateway_spec").text(i18nfile.prop('msg_gateway_spec'));
		$("#msg_gateway_name").text(i18nfile.prop('msg_gateway_name'));
		$("#msg_gateway_description").text(i18nfile.prop('msg_gateway_description'));		
		$("#msg_privacy").text(i18nfile.prop('msg_privacy'));
		$("#msg_private_gateway").text(i18nfile.prop('msg_private_gateway'));
		$("#msg_public_gateway").text(i18nfile.prop('msg_public_gateway'));
		$("#msg_location").text(i18nfile.prop('msg_location'));
//		$("#msg_endpoint_ip").text(i18nfile.prop('msg_endpoint_ip'));
		$("#msg_latitude").text(i18nfile.prop('msg_latitude'));
		$("#msg_longitude").text(i18nfile.prop('msg_longitude'));
		$("#msg_altitude").text(i18nfile.prop('msg_altitude'));
		$("#msg_next").text(i18nfile.prop('msg_next'));
		$("#msg_cancel").text(i18nfile.prop('msg_cancel'));
	};
	
	var loadTextInDeviceAdd2 = function () {
		$("#msg_add_gateway").text(i18nfile.prop('msg_add_gateway'));
		$("#msg_step1").text(i18nfile.prop('msg_step'));
		$("#msg_step2").text(i18nfile.prop('msg_step'));
		$("#msg_step3").text(i18nfile.prop('msg_step'));
		$("#msg_basic_info").text(i18nfile.prop('msg_basic_info'));
		$("#msg_resource_info").text(i18nfile.prop('msg_resource_info'));
		$("#msg_complete").text(i18nfile.prop('msg_complete'));
		$("#msg_id2").text(i18nfile.prop('msg_id'));
		$("#msg_cancel").text(i18nfile.prop('msg_cancel'));
		$("#msg_add_resources").text(i18nfile.prop('msg_add_resources'));
		$("#msg_resources").text(i18nfile.prop('msg_resources'));
		$("#msg_you_can_add_sensors_actuator_and_tags").text(i18nfile.prop('msg_you_can_add_sensors_actuator_and_tags'));
		$("#msg_name").text(i18nfile.prop('msg_name'));
		$("#msg_device_specification").text(i18nfile.prop('msg_device_specification'));
		$("#msg_select_a_device_specification").text(i18nfile.prop('msg_select_a_device_specification'));
		$("#msg_measurement").text(i18nfile.prop('msg_measurement'));
		$("#msg_no_data").text(i18nfile.prop('msg_no_data'));
		$("#msg_add_a_gateway").text(i18nfile.prop('msg_add_a_gateway'));
	};
	
	var loadTextInDeviceAdd3 = function () {
		$("#msg_add_gateway").text(i18nfile.prop('msg_add_gateway'));
		$("#msg_step1").text(i18nfile.prop('msg_step'));
		$("#msg_step2").text(i18nfile.prop('msg_step'));
		$("#msg_step3").text(i18nfile.prop('msg_step'));
		$("#msg_basic_info").text(i18nfile.prop('msg_basic_info'));
		$("#msg_resource_info").text(i18nfile.prop('msg_resource_info'));
		$("#msg_complete").text(i18nfile.prop('msg_complete'));
		$("#msg_gateway_registration_has_been_completed").text(i18nfile.prop('msg_gateway_registration_has_been_completed'));
		$("#msg_default").text(i18nfile.prop('msg_default'));
		$("#msg_is_now_registered").text(i18nfile.prop('msg_is_now_registered'));
		$("#msg_take_note_of_or_copy_the_following_information_for_gateway_id").text(i18nfile.prop('msg_take_note_of_or_copy_the_following_information_for_gateway_id'));
		$("#msg_copy_the_unique_credentials_into_the_gateway_configuration_file_on_your_gateway").text(i18nfile.prop('msg_copy_the_unique_credentials_into_the_gateway_configuration_file_on_your_gateway'));
		$("#msg_find_out_how").text(i18nfile.prop('msg_find_out_how'));
		$("#msg_go_to_dashboard").text(i18nfile.prop('msg_go_to_dashboard'));
	};
	
	var loadTextInDeviceDetail = function () {
		$("#msg_gateway_information").text(i18nfile.prop('msg_gateway_information'));
		$("#msg_gateway_basic_information").text(i18nfile.prop('msg_gateway_basic_information'));
		$("#msg_gateway_description").text(i18nfile.prop('msg_gateway_description'));
		$("#msg_gateway_spec").text(i18nfile.prop('msg_gateway_spec'));
		$("#msg_gateway_name").text(i18nfile.prop('msg_gateway_name'));
		$("#msg_location").text(i18nfile.prop('msg_location'));
		$("#msg_gateway_id").text(i18nfile.prop('msg_gateway_id'));
		$("#msg_id2").text(i18nfile.prop('msg_id'));
		$("#msg_name").text(i18nfile.prop('msg_name'));
		$("#msg_device_specification").text(i18nfile.prop('msg_device_specification'));
//		$("#msg_endpoint_ip").text(i18nfile.prop('msg_endpoint_ip'));
		$("#msg_latitude").text(i18nfile.prop('msg_latitude'));
		$("#msg_longitude").text(i18nfile.prop('msg_longitude'));
		$("#msg_altitude").text(i18nfile.prop('msg_altitude'));
		$("#msg_add_resources").text(i18nfile.prop('msg_add_resources'));
		$("#msg_resources").text(i18nfile.prop('msg_resources'));
		$("#msg_you_can_add_sensors_actuator_and_tags").text(i18nfile.prop('msg_you_can_add_sensors_actuator_and_tags'));
		$("#msg_select_a_device_specification").text(i18nfile.prop('msg_select_a_device_specification'));
		$("#msg_measurement").text(i18nfile.prop('msg_measurement'));
		$("#msg_no_data").text(i18nfile.prop('msg_no_data'));
		$("#msg_cancel").text(i18nfile.prop('msg_cancel'));
		$("#msg_delete1").text(i18nfile.prop('msg_delete'));
		$("#msg_delete2").text(i18nfile.prop('msg_delete'));
		
		$("#msg_save").text(i18nfile.prop('msg_save'));
		$("#msg_confirm").text(i18nfile.prop('msg_confirm'));
		$("#msg_close").text(i18nfile.prop('msg_close'));
		$("#msg_are_you_sure_that_you_delete_this_gateway").text(i18nfile.prop('msg_are_you_sure_that_you_delete_this_gateway'));
	};
	
	var loadTextInDeviceSpecAdd = function () {
		$("#msg_device_specification").text(i18nfile.prop('msg_device_specification'));
		$("#msg_name").text(i18nfile.prop('msg_name'));
		$("#msg_manufacturer").text(i18nfile.prop('msg_manufacturer'));
		$("#msg_model_name").text(i18nfile.prop('msg_model_name'));
		$("#msg_category").text(i18nfile.prop('msg_category'));
		$("#msg_type").text(i18nfile.prop('msg_type'));
		$("#msg_description").text(i18nfile.prop('msg_description'));
		$("#msg_cancel").text(i18nfile.prop('msg_cancel'));
		$("#msg_save").text(i18nfile.prop('msg_save'));
		$("#msg_add_device_specification").text(i18nfile.prop('msg_add_device_specification'));
		$("#msg_select_a_resource_type").text(i18nfile.prop('msg_select_a_resource_type'));
		$("#msg_unit").text(i18nfile.prop('msg_unit'));
		$("#msg_select_a_unit").text(i18nfile.prop('msg_select_a_unit'));
		$("#msg_make_this_device_public").text(i18nfile.prop('msg_make_this_device_public'));
		$("#msg_nodetype").text(i18nfile.prop('msg_nodetype'));
		
		$("#msg_add_properties").text(i18nfile.prop('msg_add_properties'));
		$("#msg_add_resources").text(i18nfile.prop('msg_add_resources'));
		$("#msg_add_service").text(i18nfile.prop('msg_add_service'));

		$("#msg_device_specification_basic_info").text(i18nfile.prop('msg_device_specification_basic_info'));
		$("#msg_device_specification_properties").text(i18nfile.prop('msg_device_specification_properties'));
		$("#msg_device_specification_resources").text(i18nfile.prop('msg_device_specification_resources'));
		$("#msg_device_specification_services").text(i18nfile.prop('msg_device_specification_services'));

		$("#msg_you_can_add_properties").text(i18nfile.prop('msg_you_can_add_properties'));
		$("#msg_you_can_add_sensors_actuator_and_tags").text(i18nfile.prop('msg_you_can_add_sensors_actuator_and_tags'));
		$("#msg_you_can_add_service").text(i18nfile.prop('msg_you_can_add_service'));
		$("#msg_select_a_service").text(i18nfile.prop('msg_select_a_service'));
	};
	
	var loadTextInDeviceSpecDetail = function () {
		$("#msg_device_specification").text(i18nfile.prop('msg_device_specification'));
		
		$("#msg_add_properties").text(i18nfile.prop('msg_add_properties'));
		$("#msg_add_resources").text(i18nfile.prop('msg_add_resources'));
		$("#msg_add_service").text(i18nfile.prop('msg_add_service'));

		$("#msg_device_specification_basic_info").text(i18nfile.prop('msg_device_specification_basic_info'));
		$("#msg_device_specification_properties").text(i18nfile.prop('msg_device_specification_properties'));
		$("#msg_device_specification_resources").text(i18nfile.prop('msg_device_specification_resources'));
		$("#msg_device_specification_services").text(i18nfile.prop('msg_device_specification_services'));
		
		$("#msg_name").text(i18nfile.prop('msg_name'));
		$("#msg_manufacturer").text(i18nfile.prop('msg_manufacturer'));
		$("#msg_model_name").text(i18nfile.prop('msg_model_name'));
		$("#msg_category").text(i18nfile.prop('msg_category'));
		$("#msg_type").text(i18nfile.prop('msg_type'));
		$("#msg_description").text(i18nfile.prop('msg_description'));
		$("#msg_resources").text(i18nfile.prop('msg_resources'));
		$("#msg_confirm").text(i18nfile.prop('msg_confirm'));
		$("#msg_delete1").text(i18nfile.prop('msg_delete'));
		$("#msg_delete2").text(i18nfile.prop('msg_delete'));
		$("#msg_close").text(i18nfile.prop('msg_close'));
		$("#msg_save").text(i18nfile.prop('msg_save'));
		$("#msg_add_device_specification").text(i18nfile.prop('msg_add_device_specification'));
		$("#msg_select_a_resource_type").text(i18nfile.prop('msg_select_a_resource_type'));
		$("#msg_unit").text(i18nfile.prop('msg_unit'));
		$("#msg_select_a_unit").text(i18nfile.prop('msg_select_a_unit'));
		$("#msg_properties").text(i18nfile.prop('msg_properties'));
		$("#msg_make_this_device_public").text(i18nfile.prop('msg_make_this_device_public'));
		$("#msg_select_a_category").text(i18nfile.prop('msg_select_a_category'));
		$("#msg_are_you_sure_that_you_delete_this_devicespec").text(i18nfile.prop('msg_are_you_sure_that_you_delete_this_devicespec'));
		$("#msg_add_device_specification").text(i18nfile.prop('msg_add_device_specification'));
		$("#msg_nodetype").text(i18nfile.prop('msg_nodetype'));
		$("#msg_you_can_add_properties").text(i18nfile.prop('msg_you_can_add_properties'));
		$("#msg_you_can_add_sensors_actuator_and_tags").text(i18nfile.prop('msg_you_can_add_sensors_actuator_and_tags'));
		$("#msg_you_can_add_service").text(i18nfile.prop('msg_you_can_add_service'));
		$("#msg_select_a_service").text(i18nfile.prop('msg_select_a_service'));
	};
	
	var loadTextInDeviceSpecList = function () {
		$("#msg_device_specification_management").text(i18nfile.prop('msg_device_specification_management'));
		$("#msg_model").text(i18nfile.prop('msg_model'));
		$("#msg_add").text(i18nfile.prop('msg_add'));
		$("#msg_name").text(i18nfile.prop('msg_name'));
		$("#msg_category").text(i18nfile.prop('msg_category'));
		$("#msg_type").text(i18nfile.prop('msg_type'));
		$("#msg_unit").text(i18nfile.prop('msg_unit'));
		$("#msg_owner").text(i18nfile.prop('msg_owner'));
		$("#msg_description").text(i18nfile.prop('msg_description'));
		$("#msg_devicespec_search_properties").text(i18nfile.prop('msg_devicespec_search_properties'));

	};

	var loadTextInPackageList = function () {
		$("#msg_package_information_management").text(i18nfile.prop('msg_package_information_management'));
		$("#msg_add1").text(i18nfile.prop('msg_add'));
		$("#msg_add2").text(i18nfile.prop('msg_add'));
		$("#msg_category1").text(i18nfile.prop('msg_category'));
		$("#msg_category2").text(i18nfile.prop('msg_category'));
		$("#msg_category3").text(i18nfile.prop('msg_category'));
		$("#msg_package_name1").text(i18nfile.prop('msg_package_name'));
		$("#msg_package_name2").text(i18nfile.prop('msg_package_name'));
		$("#msg_package_name3").text(i18nfile.prop('msg_package_name'));
		$("#msg_os1").text(i18nfile.prop('msg_os'));
		$("#msg_os2").text(i18nfile.prop('msg_os'));
		$("#msg_os3").text(i18nfile.prop('msg_os'));
		$("#msg_type1").text(i18nfile.prop('msg_type'));
		$("#msg_type2").text(i18nfile.prop('msg_type'));
		$("#msg_type3").text(i18nfile.prop('msg_type'));
		$("#msg_command1").text(i18nfile.prop('msg_command'));
		$("#msg_command2").text(i18nfile.prop('msg_command'));
		$("#msg_command3").text(i18nfile.prop('msg_command'));
		$("#msg_delete").text(i18nfile.prop('msg_delete'));
		$("#msg_update1").text(i18nfile.prop('msg_update'));
		$("#msg_update2").text(i18nfile.prop('msg_update'));
		$("#msg_add_new_package_information").text(i18nfile.prop('msg_add_new_package_information'));
		$("#msg_update_the_package_information").text(i18nfile.prop('msg_update_the_package_information'));
		$("#msg_close1").text(i18nfile.prop('msg_close'));
		$("#msg_close2").text(i18nfile.prop('msg_close'));
	};
	
	var loadTextInServiceDashboard = function () {
		$("#msg_subscribed_services").text(i18nfile.prop('msg_subscribed_services'));
		$("#msg_number_of_services_subscribed_to_myself").text(i18nfile.prop('msg_number_of_services_subscribed_to_myself'));
		$("#msg_open_services").text(i18nfile.prop('msg_open_services'));
		$("#msg_number_of_published_services").text(i18nfile.prop('msg_number_of_published_services'));
		$("#msg_registered_services").text(i18nfile.prop('msg_registered_services'));
		$("#msg_number_of_registered_services").text(i18nfile.prop('msg_number_of_registered_services'));
		$("#msg_my_services").text(i18nfile.prop('msg_my_services'));
		$("#msg_service_type").text(i18nfile.prop('msg_service_type'));
		$("#msg_service_name").text(i18nfile.prop('msg_service_name'));
		$("#msg_version").text(i18nfile.prop('msg_version'));
		$("#msg_metadata").text(i18nfile.prop('msg_metadata'));
		$("#msg_open_this_service").text(i18nfile.prop('msg_open_this_service'));
		$("#msg_subscribed").text(i18nfile.prop('msg_subscribed'));
		$("#msg_unsubscribe").text(i18nfile.prop('msg_unsubscribe'));
		$("#msg_are_you_sure_that_you_unsubscribe_this_service").text(i18nfile.prop('msg_are_you_sure_that_you_unsubscribe_this_service'));
		$("#msg_description").text(i18nfile.prop('msg_description'));
		$("#msg_confirm").text(i18nfile.prop('msg_confirm'));
		$("#msg_close").text(i18nfile.prop('msg_close'));
		$("#msg_unsubscribe1").text(i18nfile.prop('msg_unsubscribe'));
		$("#msg_unsubscribe2").text(i18nfile.prop('msg_unsubscribe'));
		$("#msg_owner").text(i18nfile.prop('msg_owner'));
	};
	
	var loadTextInServiceList = function () {
		$("#msg_subscribe_a_service1").text(i18nfile.prop('msg_subscribe_a_service'));
		$("#msg_are_you_sure_that_you_subscribe_this_service").text(i18nfile.prop('msg_are_you_sure_that_you_subscribe_this_service'));
		$("#msg_service_type").text(i18nfile.prop('msg_service_type'));
		$("#msg_name").text(i18nfile.prop('msg_name'));
		$("#msg_version").text(i18nfile.prop('msg_version'));
		$("#msg_description").text(i18nfile.prop('msg_description'));
		$("#msg_metadata").text(i18nfile.prop('msg_metadata'));
		$("#msg_registered").text(i18nfile.prop('msg_registered'));
		$("#msg_subscribe1").text(i18nfile.prop('msg_subscribe'));
		$("#msg_subscribe2").text(i18nfile.prop('msg_subscribe'));
		$("#msg_confirm").text(i18nfile.prop('msg_confirm'));
		$("#msg_close").text(i18nfile.prop('msg_close'));
		$("#msg_are_you_sure_that_you_delete_this_service").text(i18nfile.prop('msg_are_you_sure_that_you_delete_this_service'));
		$("#msg_delete").text(i18nfile.prop('msg_delete'));
		$("#msg_delete_confirm").text(i18nfile.prop('msg_confirm'));
		$("#msg_delete_service_close").text(i18nfile.prop('msg_close'));
		$("#msg_delete_service").text(i18nfile.prop('msg_delete'));
		$("#msg_owner").text(i18nfile.prop('msg_owner'));
		$("#msg_service_search_properties").text(i18nfile.prop('msg_service_search_properties'));
	};
	
	var loadTextInIoTFKey= function () {
		$("#msg_iotf_apikey_management").text(i18nfile.prop('msg_iotf_apikey_management'));
		$("#msg_key").text(i18nfile.prop('msg_key'));
		$("#msg_authtoken").text(i18nfile.prop('msg_authtoken'));
		$("#msg_comment").text(i18nfile.prop('msg_comment'));
		$("#msg_remove").text(i18nfile.prop('msg_remove'));
		$("#msg_add_new_key").text(i18nfile.prop('msg_add_new_key'));
		$("#msg_add1").text(i18nfile.prop('msg_add'));
		$("#msg_add2").text(i18nfile.prop('msg_add'));
		$("#msg_organization1").text(i18nfile.prop('msg_organization'));
		$("#msg_close").text(i18nfile.prop('msg_close'));
	};
	
	var loadTextByName = function(name) {
		return i18nfile.prop(name);
	};
	
	return {
		loadBundles : loadBundles,
		loadTextInLogin : loadTextInLogin,
		loadTextInMenu : loadTextInMenu,
		loadTextInDeviceDashboard : loadTextInDeviceDashboard,
		loadTextInDeviceList : loadTextInDeviceList,
		loadTextInDeviceAdd1 : loadTextInDeviceAdd1,
		loadTextInDeviceAdd2 : loadTextInDeviceAdd2,
		loadTextInDeviceAdd3 : loadTextInDeviceAdd3,
		loadTextInDeviceDetail : loadTextInDeviceDetail,
		loadTextInDeviceSpecAdd : loadTextInDeviceSpecAdd,
		loadTextInDeviceSpecDetail : loadTextInDeviceSpecDetail,
		loadTextInDeviceSpecList : loadTextInDeviceSpecList,
		loadTextInPackageList : loadTextInPackageList,
		loadTextInServiceDashboard : loadTextInServiceDashboard,
		loadTextInServiceList : loadTextInServiceList,
		loadTextInIoTFKey : loadTextInIoTFKey,
		loadTextByName: loadTextByName
	};
	
}(jQuery));