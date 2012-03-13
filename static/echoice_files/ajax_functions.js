/*
 * Before this goes live, please make sure the 'mmAjaxSubmit' is no longer used and replaced with the correct Ajax call
 *
 */

var mmAjaxSubmit = function(formId, fragments, callbackId, paramIndex, paramIndex2, afterFinish, params, objectsToHandle) {
	// Load all params.fragments
	$.each(params.fragments.split(','), function(i, t){
		if(t != 'errorBlock'){
			var tile = t.replace(/[0-9]/g, '');
			
			if(location.href.indexOf('monitormedia.local') > 0 || location.href.indexOf('monitormedia.net') > 0){
				if(tile == 'policyHolderVehicleRegistration'){
					
					var x = "";
					
					if($('#yourDetailsVehicleMake').length > 0 && $('#yourDetailsVehicleMake').val() != "") {
						x = 1;
					}
					if($('#yourDetailsVehicleModel').length > 0 && $('#yourDetailsVehicleModel').val() != "") {
						x = 2;
					}
					if($('#yourDetailsVehicleYear').length > 0 && $('#yourDetailsVehicleYear').val() != "") {
						x = 3;
					}
					if($('#yourDetailsVehicleEngine').length > 0 && $('#yourDetailsVehicleEngine').val() != "") {
						x = 4;
					}
					if($('#yourDetailsVehicleTrim').length > 0 && $('#yourDetailsVehicleTrim').val() != "") {
						x = 5;
					}
					tile += x;
					
					if(callbackId == "registrationEntry"){
						tile = "policyHolderVehicleRegistration6";
					}
					
				}
				
			}
			
			$.get('/TILES-LAYOUTS-FLOWS/WEB-INF/jsp/' + formId.replace('Form', '') + '/' + $.trim(tile) + '.html', {'success':afterFinish}, function(data){
				/** PLEASE UPDATE THE ajaxSubmit FUNCTION ADDING THE FOLLOWING LINES */
				// Put the content into sourceId
				// A bit of logic to fix the code from their side to ours
				// IDs have changed and we have to check if the containers exist
				
				
				var use = callbackId;
				
				if(location.href.indexOf('MORE-THAN-VAN') > 0){
					if(tile == 'addedDriver'){
						use = use.replace('showOtherDrivers', 'showOtherVanDrivers');
					}
				}
				if($('#' + use).length == 0)
					use = 'ajax_' + use;
				if($('#' + use).length == 0)
					use = (t.indexOf('--') >= 0 ? t.substring( 0, t.indexOf('--') ) : t);
				if($('#' + use).length == 0)
					use = use.replace('Up', 'Container');

				if(t.indexOf("policyHolderVehicle") < 0) {
					sfeaa($.trim(use), data, paramIndex, paramIndex2);
				} else {
				
					var d = $(data);
					
					var last_id = "";
					for(var i = 0; i<d.length; i++){
						if($.trim($(d[i]).attr('id')) != ''){
							last_id = $.trim($(d[i]).attr('id'));
							sfeaa(last_id, $(d[i]).html(), paramIndex);
						}else if(d[i].tagName == "SCRIPT"){
							$('#'+last_id).append(
								'<script type="text/javascript">' + d[i].innerHTML + '<\/script>'
							)
						}
					}
				}
				
			});
		}
	});
	
	/** PLEASE UPDATE THE ajaxSubmit FUNCTION ADDING THE FOLLOWING LINES */
	// Now lets attach the focus class to the new arrived inputs and anchors
	highlight('input[type=submit]', 'focus');
	highlight('a', 'focus');
	
	// Hide the 'ajax running' icon
	
	handleSuccess(callbackId, objectsToHandle);
	//handleSuccess(callbackId);

	return false;
}

/*
* setFormElementsAfterAjax
*/
var sfeaa = function(t, data, paramIndex, paramIndex2){
	var container = $('#' + t);
	if(container.length>0){
		data = data.replace(/{{NUMBER}}/g, paramIndex+1);
		data = data.replace(/{{NUMBER_ZI}}/g, paramIndex);
		data = data.replace(/{{DRIVER}}/g, paramIndex2+1);
		data = data.replace(/{{DRIVER_ZI}}/g, paramIndex2);
		
		if(location.href.indexOf('monitormedia.local') > 0 || location.href.indexOf('monitormedia.net') > 0){
			
			if ($.inArray(t, ["policyHolderAddedClaim", "policyHolderAddedConviction", "addedDriver", "driverAddedClaim", "driverAddedConviction", "addedModification"]) >=0 ) {
			
				var replace = $(data).filter('div:first').attr('id');
				container = $('#' + replace)
				container.html("");
				container.append($(data));
				shavaa(replace)
				
				return;
			}
		}
		
		container.html("");
		container.append($(data));

		// Because we loaded the stuff via Ajax, we have to attach the event listeners, error and validation to the just arrived elements
		shavaa(t);
	}
}

/*
* setHighlightAndValidationAfterAjax
*/
var shavaa = function(t){
	var container = $('#' + t);
	
	if(container.length>0){
		// Because we loaded the stuff via Ajax, we have to attach the event listeners, error and validation to the just arrived elements
		var rows = container.find('.formInputs li');
		s_fr();
		s_hm(rows);			// setHelpMessage
		s_el(rows);			// setErrorListeners
		hnjsi(container);	// hideNoJsInputs
		s_hr(container);	// setHighlightRow
	}
}

var dojoConnection1, dojoConnection2;
var ajaxCallbackList = new Array();

var ajaxSubmit = function(formId, eventId, fragments, sourceId, callbackId, paramIndex, paramIndex2, afterFinish, objectsToHandle, loaderId, bodySpinner) {

	if(typeof afterFinish != 'function') afterFinish = null;
	
	if(typeof bodySpinner != "undefined" && bodySpinner)
		$('body').trigger('ajaxSend');
	
	var rC = $('#' + loaderId).closest('div.rightCol');
	
	if(rC.size() == 0){
		if($('#' + loaderId).parent('div').hasClass('button-remove')) {
			rC = $('#' + loaderId).parent('div');
		} else {
			rC = $('#'+loaderId).closest('div.button-add-another-container');
		}
	}

	var ajaxspan = $('<span class="ajax"><\/span>');
	rC.css('position','relative').append(ajaxspan);
	setTimeout(function(){ajaxspan.css('zoom',1)},100);
	
	
	// THIS NEEDS TO BE REPLACED WITH A 'Running' or 'onSuccess' CALL VIA THE SPRING FRAMEWORK
	// This will prevent multiple ajax submits if callbackId is provided
	if (callbackId != null) {
		if(ajaxHandleResponse(callbackId) === true) {
			return false;
		};
		ajaxHandleResponse(callbackId, true);
	};

	// We need to build up a list of parameters to pretend to be the 'old' Ajax call
	// - Need to tidy-up this function to merge the array when items are included
	if(paramIndex != null  &&  fragments != null) {
		var params = {
				_eventId: eventId,
				ajaxSource: sourceId,
				fragments: fragments,
				paramIndex: paramIndex
			};
	} else if(fragments != null) {
		var params = {
				_eventId: eventId,
				ajaxSource: sourceId,
				fragments: fragments
			};
	} else if(paramIndex != null) {
		var params = {
				_eventId: eventId,
				ajaxSource: sourceId,
				paramIndex: paramIndex
			};
	} else {
		var params = {
				_eventId: eventId,
				ajaxSource: sourceId
			};
	}
	
	if (objectsToHandle == null) {
		objectsToHandle = [];
	}
		 
	ajaxProcessing(true, objectsToHandle[OBJ_TO_BLOCK]);
	
	// comment the line below when the system goes live
	if (location.href.indexOf('.local') != -1 || location.href.indexOf('monitormedia.net') != -1)
		return mmAjaxSubmit(formId, fragments, callbackId, paramIndex, paramIndex2, afterFinish, params, objectsToHandle, loaderId);
	
	dojoConnection1 = dojo.connect(Spring.remoting, "handleResponse", function(){
		resetSpringRemotingHandles();
		handleSuccess(callbackId, objectsToHandle);
	});
	
	dojoConnection2 = dojo.connect(Spring.remoting, "handleError", function(){
		resetSpringRemotingHandles();
		handleError(callbackId, objectsToHandle);
	});
	Spring.remoting.submitForm(sourceId, formId, params);

	return false;
};

var resetSpringRemotingHandles = function() {
	dojo.disconnect(dojoConnection1);
	dojo.disconnect(dojoConnection2);
};

var ajaxHandleResponse = function(callbackId, val) {
	if(arguments.length < 2) {
		// Return the current value
		if(ajaxCallbackList[callbackId] == undefined  ||  ajaxCallbackList[callbackId] == null) {
			return false;
		}
		return ajaxCallbackList[callbackId];
	}
	// Set a new value
	ajaxCallbackList[callbackId] = val;
};

var handleError = function(callbackId, objectsToHandle) {
	
	handleResponse(callbackId, objectsToHandle[OBJ_TO_BLOCK]);
	// Do whatever we need to upon an error response

};
var handleSuccess = function(callbackId, objectsToHandle) {

	$('body').trigger('ajaxComplete');

	handleResponse(callbackId, objectsToHandle[OBJ_TO_BLOCK]);
	// Do whatever we need to upon a successful response
	
	if (objectsToHandle != null) {
		if (objectsToHandle instanceof Array) {
			
			for (var i=0; i < objectsToHandle.length; i++) {
				if(typeof objectsToHandle[i] != 'function') {
			
					shavaa( objectsToHandle[i]);
				} else if (objectsToHandle[i]){
			
					 objectsToHandle[i]();
				}
			}
		} else {
			
			shavaa(objectsToHandle);
		}
	}
};

// There are similarities to 'error' and 'success' so combine them here
var handleResponse = function(callbackId, objToBlock) {
	// Allow the Ajax to run again
	ajaxHandleResponse(callbackId, false);
	// Remove 'processing' message
	ajaxProcessing(false, objToBlock);
};

// Make sure the user is informed when Ajax is running
var ajaxProcessing = function(displayMessage, objToBlock) {
	if(arguments.length > 0  &&  displayMessage == true) {
		$('body').addClass('ajax');
		
		
		if (objToBlock != null && objToBlock instanceof Array) {
			for (var i=0; i < objToBlock.length; i++) {
				
				if (objToBlock[i].indexOf('#') == 0) {
					$(objToBlock[i]).closest('li').block({ message: null });
				} else {
					$.each($('li[id^=' + objToBlock[i] + ']'), function () {
						$(this).block({ message: null });
					});
					$.each($('li[id^=' + objToBlock[i].replace('ajx_','') + ']'), function () {
						$(this).block({ message: null });
					});
				}
				
			}
		}
			
	} else {
		$('body').removeClass('ajax');
		if (objToBlock != null && objToBlock instanceof Array) {
			for (var i=0; i < objToBlock.length; i++) {
				
				if (objToBlock[i].indexOf('#') == 0) {
					$(objToBlock[i]).closest('li').unblock();
				} else {
					$.each($('li[id^=' + objToBlock[i] + ']'), function () {
						$(this).unblock();
					});
					$.each($('li[id^=' + objToBlock[i].replace('ajx_','') + ']'), function () {
						$(this).unblock();
					});
				}
				
			}
		}
		if ((typeof close_bt_loading) == 'function') {
			close_bt_loading();
		}
	}
};

$(document).ready(function(){

	$("body").bind("ajaxSend", function(){
		$(this).addClass('ajax');
	}).bind("ajaxComplete", function(){
		$(this).removeClass('ajax');
		$('.rightCol:has(span.ajax)').css('position', 'static').find('span.ajax').remove();
		$('.button-add-another-container:has(span.ajax)').css('position', 'static').find('span.ajax').remove();
		$('.button-remove:has(span.ajax)').css('position', 'static').find('span.ajax').remove();
	});

});
