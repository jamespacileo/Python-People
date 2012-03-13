/* function resetText > removes any value from the array of JQuery DOM objects and reets their validation to unset
*  @param arr(array)
*/
function resetText(arr){
	for(var i=0; i<arr.length; i++) {
		var obj = $(arr[i]);
		var initValue = obj.attr('initValue');
		obj.val(typeof initValue == "undefined" ? '' : initValue);		
		obj.parents('li').removeClass('ok');
	};
}
/* function clearOptions > removes any <OPTION>s from the array of JQuery DOM objects and reets their validation to unset
*  @param arr(array)
*/
function clearOptions(arr){
	for(var i=0; i<arr.length; i++) {
		$(arr[i]).html('').attr('disabled','disabled');
		$(arr[i]).parents('li').removeClass('ok');
	};
}
/* function resetSelects > sets every <SELECT> in the array to its first value
*  @param arr(array)
*/
function resetSelects(arr) {
	for(var i=0; i<arr.length; i++) {
		var item = $(arr[i]);
		item.val($(item.find('option')[0]).val());
		item.parents('li').removeClass('ok');
	};
}

/* function addOptions > creates <OPTION>s for each item in the array and attaches them to the passed element, optionally adds a default 'Please select' state
*  @param element (DOM element)
*  @param arr (array)
*  @param pleaseSelect (string) use value '' to not add
*/
function addOptions(element, arr, pleaseSelect) {
	if (pleaseSelect != '')
		element.append($('<option>').html(pleaseSelect));
	
	for(var i=0; i<arr.length; i++) {
		element.append($('<option>').html(arr[i] + ""));
	};
}

/* function setDefaultValue > set save the initial value of the input which the page was loaded with
 */
function setDefaultValue() {
	$('input:text').each( function() {
		var obj = $(this)
		obj.attr('initValue', obj.val());
	})
}

function attatchPrintButtonEvents()
{
	// Make sure the 'View / Print' page opens in a new window
	$('input.printable').click(function(e) {
		return printNW($(this).closest('form').attr('id'), e);
	});
}
/* function doFindAddress >> set Listener on to Find my Address Buttons
* 	@dependency function findAddress
*/
var doFindAddress = function() {

	var findAddressButton = $('input.findAddress');
	var postcodeRow = findAddressButton.parents('li');
	var houseNumberRow = postcodeRow.prev('li');
	var houseNumberElements = houseNumberRow.find('input, a');

//	houseNumberElements.bind('blur', function(event) {
//		if ($(ELEMENT_ON_FOCUS).parents('li')[0] != houseNumberRow[0]) {
//			if (ve($(this).parents('li'), $(this).parents('li').find('input')) === true && postcodeRow.find('input[type=text]').val() != '') {
//				findAddressButton.trigger('click');
//			}
//		}
//	})
	
	$(findAddressButton).parents('li').prev('li').find('input[type=text]').bind('change', addLookupClass);
	$(findAddressButton).parents('span').prev('input[type=text]').bind('change', addLookupClass);	

	findAddressButton.click(function(event) {
		s_ev(event);
		var dd = $(this);
		dd.removeClass('doLookup');
		
		if ( vtc($(this).parents('li').prev('li')) && vtc($(this).parents('li')) ) { //validates
			var addresses = findAddress(
				$($(this).parents('li').prev('li').find('input[type=text]')[0]).val(), // House Number should always be the first text field in the previous row
				$($(this).parents('li').prev('li').find('input[type=text]')[1]).val(), // House Name should always be the second text field in the previous row
				$(this).parents('span').prev('input[type=text]').val() // The postcode field should always be the input preceeding the find address button
			)
			$(this).parents('li').next('li').show().removeClass('skip');
			$(this).parents('li').next('li').find('select').html("");

			// The address select row should immediately follow this button
			addOptions($(dd).parents('li').next('li').find('select'), addresses, (addresses.length > 1 ? 'Please specify' : ''));
		}
	});
}

var addLookupClass = function() {
	$('input.findAddress').addClass('doLookup');
}

var doAutoComplete = function() {
	var autocomplete = $('li.autocomplete');

	$.each(autocomplete, function() {
		var input = $(this).find('input[type=text]');
		if (input.val() == AUTOCOMPLETE_MESSAGE || input.val() == '') {
			$(this).addClass('autocomplete-style');
			input.val(AUTOCOMPLETE_MESSAGE);
		} else {
			$(this).removeClass('autocomplete-style');
		}
	})
	
	autocomplete.find('input[type=text]').focus(function() {
		if($(this).val() == AUTOCOMPLETE_MESSAGE) {
			$(this).parents('li:first').removeClass('autocomplete-style');
			$(this).val('');
		}
	}).blur(function() {
		if($(this).val() == '') {
			$(this).parents('li:first').addClass('autocomplete-style');
			$(this).val(AUTOCOMPLETE_MESSAGE);
		}
	}).keyup(function() {
		autoComplete($(this).val());
	});
}

var doDOBInput = function() {
	var dob = $('li.dateOfBirth');

	$.each(dob, function() {
		var input = $(this).find('input[type=text]');
		if (input.val() == DOB_MESSAGE || input.val() == '') {
			$(this).addClass('dob-style');
			input.val(DOB_MESSAGE);
		} else {
			$(this).removeClass('dob-style');
		}
	});
	
	dob.find('input[type=text]').focus(function() {
		if($(this).val() == DOB_MESSAGE) {
			$(this).parents('li:first').removeClass('dob-style');
			$(this).val('');
		}
	}).blur(function() {
		if($(this).val() == '') {
			$(this).parents('li:first').addClass('dob-style');
			$(this).val(DOB_MESSAGE);
		}
	});
}

function autoComplete(string) {
	// DO AJAX
}

var hideDependantQuestions = function() {
	$('li.dep').hide();
}

function attacheDisableEventForDependentSelect(srcSel, destSel, resetVal) {
	$(srcSel).bind('click keypress', (function() {
		if(resetVal == undefined) {
			resetVal = "";
		}	
		if ($(this).val() == resetVal) {
			$(destSel).attr("disabled", "disabled").find("option[value="+resetVal+"]").attr("selected", "selected");
		}
	}));
}

$(document).ready(function() {
	// Insert any functions to set up form event listeners
	doAutoComplete();
	doDOBInput();
	doFindAddress();
	hideDependantQuestions();
	attatchPrintButtonEvents();
});