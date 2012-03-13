var setEnableDropDown = function (checkbox, select) {
	if (checkbox.attr('checked')) {
			select.attr('disabled', false);
	} else {
		select.attr('disabled', 'disabled');
		select.siblings('span.subtotal').find('span').html('&pound;-.--');
	}

	checkbox.bind('change click', function(){
		if (this.checked) {
				select.attr('disabled', false);
		} else {
			select.attr('disabled', 'disabled');
			select.siblings('span.subtotal').find('span').html('&pound;-.--');
		}
	});
	return false;
}

var initQBCustomiseBundle = function () {
	_PACKAGES = [];
	_CUSTOMISE_ELEMENTS = $('input[type=checkbox], select', '#customise');
	
	// Make sure the 'View / Print' page opens in a new window
	$('#yourQuoteViewNPrintDetailsButton').click(function(e) {
		return printNW("quoteSummaryForm", e);
	});
	
	$('#paymentViewNPrintDetails').click(function(e) {
		return printNW("quoteSummarySidePanel", e);
	});
	
	$('select', '#customise').change(function() {
		return ajaxSubmit("quoteSummaryForm", "reRate", "customiseBundle_a,quoteSummaryPrice_v2,errorBlock", null, null);
	});
	
	$('input[type=checkbox]').change(function() {
		ajaxSubmit("quoteSummaryForm", "getTotalPrice", "customiseBundle_a,quoteSummaryPrice_v2,errorBlock", null, null);
		// We need to return true so that when the 'checkbox' is clicked the 'check' is immediately visible in IE
		return true;
	});
	
}

// BT stuff
var addOns_bt = function(){

	var popup = $('<div class="addOns_bt_popup"><\/div>').hide();

	$('body').append(popup);
	
	var heading = $('<div class="addOns_bt_popup_Heading"><\/div>');
		heading.append($('<a class="close">Close<\/a>').click(function(){	popup.hide(); }));
	var content = $('<div class="addOns_bt_popup_Content"><\/div>');
	
	popup.append(heading, content, $('<div class="addOns_bt_popup_Spike"><\/div>')).bgiframe();

	$.each($('.addOns_bt'), function(index, el) {

		$(el).hover(function(){
		
			popup.hide();
			
			// Change content
			heading.html("");
			heading.append( $('<h2>' + (typeof ADDONS_BT_HEADING[$(el).attr('rel')] != 'undefined' ? ADDONS_BT_HEADING[$(el).attr('rel')] : 'BT content not set' + ($(el).attr('rel') != '' ? ': set ADDONS_BT_HEADING[' + $(el).attr('rel') + ']' : ': set A tag rel and ADDONS_BT_HEADING[A tag rel]')) + '<\/h2>'), $('<a class="close">Close<\/a>').click(function(){	popup.hide(); }) );
			
			content.html( '<div class="addOns">' + (typeof ADDONS_BT_CONTENTS[$(el).attr('rel')] != 'undefined' ? ADDONS_BT_CONTENTS[$(el).attr('rel')] : 'BT content not set' + ($(el).attr('rel') != '' ? ': set ADDONS_BT_CONTENTS[' + $(el).attr('rel') + ']' : ': set A tag rel and ADDONS_BT_CONTENTS[A tag rel]')) + '<\/div>' );
		
			var offset = $(this).offset();
			var height = popup.height();
			var width = popup.width();
		
			popup.css({
				'top': (offset.top - height),
				'left':(offset.left - (width / 2))
			}).fadeIn( $('body').hasClass('msie') ? 0 : 500 );
			
		}, function(){
			popup.hide();
		});

	});

}

$(document).ready(function(){
	addOns_bt();

});
