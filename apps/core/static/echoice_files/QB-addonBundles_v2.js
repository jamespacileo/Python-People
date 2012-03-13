/*
INSTRUCTIONS FOR THE HTML BUILDER
	1) Add ID #addOnBundles to the container DIV class .grey-panel of the UL #packages


*/

var _VOLUNTARY_EXCESS, _NCD_PROTECTION_YES, _NCD_PROTECTION_NO, _PACKAGES, _CUSTOMISE_ELEMENTS;
var objToHndl = [];

var setCustomiseView = function(element, eventName) {

	// Trigger CSS change / highlight
	$(element).parents('li:first').find('.packageC input').trigger('click');
	// Trigger Ajax call
	$(element).parents('li:first').find('.packageC input').trigger('change');


	// close section
	if($('body').hasClass('msie')){
		var opts = {"height": "toggle"};
		$('#packages').css('visibility', 'hidden');
	}else{
		var opts = {"height": "toggle", "opacity": "toggle"};
	}
	$('#addOnBundlesOuter').animate(opts, 800, function (){
		// do ajax call to grab the customise table


		// MM Ajax call - we would recommend using this format instead of hard-coded IDs
		//
		ajaxSubmit("quoteSummaryForm", $(this).attr('id'), "customiseBundle_a", $(this).attr('id'), "customiseBundle_a", null, getCoverOptions());

		// Endava Ajax call
		//ajaxSubmit("quoteSummaryForm", eventName, "customiseBundle,topPremiumPrices,quoteSummaryPrice,excessesSummary,addonBundle,brandPanel,yourQuoteWelcomeNote", "customizeBundle", "customiseBundle", null, getCoverOptions());

	});
	$('#buttonEditCoverOptions').hide();
};

var initAOB = function(){
	_PACKAGES = $('#packages');
	_CUSTOMISE_ELEMENTS = [];

	
		
	var largest = 250;

	$.each($('#packages .packageA'), function(el){
		var h = $(this).height();
		largest = (largest < h ? h : largest);
	});
	$('ul#packages li .packageA').css({"height": (largest)});
	
	// Make sure the 'View / Print' page opens in a new window
	$('#yourQuoteViewNPrintDetailsButton').click(function(e) {
		return printNW("quoteSummaryForm", e);
	});

	$('#paymentViewNPrintDetails').click(function(e) {
		return printNW("quoteSummarySidePanel", e);
	});

	$('#quoteSummaryForm').find('li.updatePriceBundle.on .packageC label span.span1').text($('#quoteSummaryForm').find('li.updatePriceBundle.on .packageC label span.span1').text().replace('Choose','Choosen'));

	$('#quoteSummaryForm').find('li.updatePriceBundle .packageC input').change(function() {
		ajaxSubmit("quoteSummaryForm", "getTotalPrice", "quoteSummaryPrice_v2,excessesSummary", this.id, null);
		// We need to return 'true' in order for the RADIO to be checked in IE when the label is clicked
		$('#quoteSummaryForm').find('li.updatePriceBundle.on .packageC label span.span1').text($('#quoteSummaryForm').find('li.updatePriceBundle.on .packageC label span.span1').text().replace('Choose','Choosen'));
		return true;
	});

	/* we had to add the label click here because IE6 was not triggering the input change above...  */
	$('#quoteSummaryForm').find('#packages .package h4, li.updatePriceBundle .packageC label').click(function() {
		$('ul#packages li .packageA').css({"height": (largest)});
		// Trigger CSS change / highlight
		$(this).parents('li:first').find('.packageC input').trigger('click');
		// Trigger Ajax call
		$(this).parents('li:first').find('.packageC input').trigger('change');
	});


	// Only toggle the customise panel if it's being shown (but empty)
	// - This preps it for the animation if the user decides to 'customise'
	if($('#customiseBundleOuter').css('display') == 'block') {
		$('#customiseBundleOuter').animate({"height": "toggle", "opacity": "toggle"});
	}
	// Make sure all customise buttons are included here
	$('#quoteSummaryForm').find('li.updatePriceBundle .packageD input, [id^=yourQuoteCustomisePackageButton], #buttonEditCoverOptions').click(function(){
				setCustomiseView(this,"customizeBundle");
				return false;
			});
	$('#quoteSummaryForm').find('#yourQuoteCustomiseViewButton').click(function(){
				setCustomiseView(this,"customizeView");
				return false;
			});

			
			
	$('#packages .packageC input.radio').click(function() {
		// me and others
			var allLIs = $(this).parents('ul#packages').find('li.package');
			var myParentLI = $(this).parents('li.package:first')[0];
			$.each(allLIs, function(index, li) {
				if(myParentLI == li){
					// me only
					$(li).addClass('on');
					$(li).find('.packageA').animate({"height": largest + 10}, 500, function(){});
					$(li).find('span.span1').html('Chosen for:');
				}else{
					// all others
					$(li).removeClass('on');
					$(li).find('.packageA').animate({"height": largest}, 500, function(){});
					$(li).find('span.span1').html('Choose for:');
				}
			});
		});
	$('ul#packages li.on .packageA').css({"height": largest + 10});

	// Hide the radio options within the add-on bundles
	$('.packageC input').hide();

	// attach the BT where needed	
	s_bt();

	s_bt_loading('yourQuoteProtectNCD-y');
	s_bt_loading('yourQuoteProtectNCD-n');
};

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

var SELECTED_EMPTY_LI;
var UNSELECTED_EMPTY_LI;

var SELECTED_LINK = 'Remove';
var SELECTED_LINK_MULTIPLE = 'Remove / change';
var UNSELECTED_LINK = 'Select';
var ALREADY_IN_POLICY = '(Already in current policy)';

(function($) {
	$.fn._getCoverOptions = function() {
		
			var cover_options = scrapeCustomiseTable();
			UNSELECTED_EMPTY_LI = $('<li><\/li>').append($('<div><\/div>').attr('class', 'option_container').html('You have nothing else to add...'));
			SELECTED_EMPTY_LI = $('<li><\/li>').append($('<div><\/div>').attr('class', 'option_container').html('Please click on an option to...'));
			var unselected_ul = $('<ul><\/ul>').append(UNSELECTED_EMPTY_LI);
			var selected_ul = $('<ul><\/ul>').append(SELECTED_EMPTY_LI);
			var unselected = $('<div><\/div>').attr('id','unselected_options').html('<h2>Available options<\/h2>').append(unselected_ul);
			var selected = $('<div><\/div>').attr('id','selected_options').html('<h2>Added options<\/h2>').append(selected_ul);
			if($('body').hasClass('msie')){
				unselected.css('visibility', 'hidden');
				selected.css('visibility', 'hidden');
			}

			// Make sure the 'Cancel' button appears correctly
			$('#customise-inner').css('clear', 'right');
			var cancelButton = $('#customise-inner span.cancelCustomise');
			
			
			cancelButton.css('float', 'right').css('margin-right', '19px');

			// Add click listener to Cancel button
			cancelButton.click(function(){
				// close section
				if($('body').hasClass('msie')){
					var opts = {"height": "toggle"};
					$('#selected_options, #unselected_options').css('visibility', 'hidden');
				}else{
					var opts = {"height": "toggle", "opacity": "toggle"};
				}
				$('#customiseBundle_a').animate(opts, 800, function (){
					// do ajax call to grab the customise table



					// MM Ajax call - we would recommend using this format instead of hard-coded IDs
					//
					ajaxSubmit("quoteSummaryForm", $(this).attr('id'), "addOnBundles", $(this).attr('id'), "addOnBundles", null, getAddOnOptions());

					// Endava Ajax call 
					//ajaxSubmit("quoteSummaryForm", "backinToBundles", "addonBundle,topPremiumPrices,quoteSummaryPrice_v2,brandPanel,excessesSummary,yourQuoteWelcomeNote", $(this).attr('id'), "addOnBundles", null, getAddOnOptions());

				});
				return false;

				// Return true (instead of false) as a fall-back so the form is submitted and reverted back to bundles
				return true;
			});

			$('#customise').prepend( unselected ).prepend( selected );
			$('#customiseBundle').addClass("layout_annual");
			$.each(cover_options, function() {

				var div = $('<div><\/div>').attr('class', 'option_container');
				var li = $('<li><\/li>').attr('class','main_option').attr('id','li_' + this.rel).append(div);

				if (this.selected && typeof this.month_price != 'undefined' && typeof this.annual_price != 'undefined') {
					M_TOTAL = parseFloat((M_TOTAL + parseFloat((M_VALUES[this.rel]).toFixed(2))).toFixed(2));
					Y_TOTAL = parseFloat((Y_TOTAL + parseFloat((Y_VALUES[this.rel]).toFixed(2))).toFixed(2));
				}

				// Endava ids
				var uniqueCoverPriceId = this.uId+'-'+M_Y + '-price';
				var uniqueCoverButtonId = this.uId+'-button';
				var uniqueCoverAddonId = 'addon-' + this.uId;
				
				if(M_Y == 'NWA_A') {
					var first_price = (typeof this.annual_price != 'undefined' ? ('&pound;' + this.annual_price.toFixed(2) + ' <span class="period">per year<\/span>') : '');
				} else {
					var first_price = (typeof this.month_price != 'undefined' ? ('&pound;' + this.month_price.toFixed(2) + ' <span class="period">per month<\/span>') : '');
				}
				
				div
					.append($('<div><\/div>').attr('class', 'minheight').html('&nbsp;'))
					.append($('<div><\/div>').attr('class', 'layoutHelper').html('&nbsp;'))
					.append($('<div id=' + uniqueCoverAddonId + '><\/div>').attr('class', 'option').html(this.a))
					.append($('<div id=' + uniqueCoverPriceId + '><\/div>').attr('class', 'price').html(first_price));

				var self = this;


				if(self.sub_options.length > 0) {
					var sub_options_ul = $('<ul><\/ul>');

					div.append( $('<div><\/div>').attr('class', 'clearFloat').html('&nbsp;') );
					div.append(sub_options_ul);
					div.append( $('<div><\/div>').attr('class', 'clearFloat').html('&nbsp;') );

					var options = self.sub_options.find('option');

					
					$.each(options, function(i, op) {

						var a = false;
						if (self.selected && $(op).attr('selected')) {
							M_TOTAL = parseFloat((M_TOTAL + parseFloat((M_VALUES[self.rel + (i + 1)]).toFixed(2))).toFixed(2));
							Y_TOTAL = parseFloat((Y_TOTAL + parseFloat((Y_VALUES[self.rel + (i + 1)]).toFixed(2))).toFixed(2));
						}

						li.addClass('multiple');
						// Only add if this is the selected cover option OR if this is unselected (i.e. add all)
						
						if (i <  options.length) {



							a = (self.nonremove ?
								self.aRemove
							:
								$('<a><\/a>')
									.attr({'href':'#','id': uniqueCoverButtonId + (i + 1)})
									.html( (self.selected ? SELECTED_LINK_MULTIPLE : UNSELECTED_LINK) )
									.click(function(){
										addOrRemoveOption(li, self.rel, self.sub_options, op, $($(this).parents('li')[0]), $(options[i]).attr('value'));
										return false;
									})
							)

							if(M_Y == 'NWA_A') {
								var first_price2 = '&pound;' + Y_VALUES[self.rel + (i + 1)].toFixed(2) + ' <span class="period">per year<\/span>';
							} else {
								var first_price2 = '&pound;' + M_VALUES[self.rel + (i + 1)].toFixed(2) + ' <span class="period">per month<\/span>';
							}

							sub_options_ul.append(
								$('<li><\/li>')
									.append($('<div><\/div>').attr('class', 'option_container')
										.append($('<div><\/div>').attr('class', 'minheight').html('&nbsp;'))
										.append($('<div><\/div>').attr('class', 'layoutHelper').html('&nbsp;'))
										.append( $('<div id=' + uniqueCoverAddonId + '><\/div>').attr('class', 'option').html( $(options[i]).attr('text') ) )
										.append( $('<div id=' + uniqueCoverPriceId + (i + 1) + '><\/div>').attr('class', 'price').html(first_price2) )
										.append( $('<div><\/div>').attr('class', 'button').append(a)
											)
										.append( $('<div><\/div>').attr('class', 'clearFloat').html('&nbsp;') ) )
										.attr('class',
											($(op).attr('selected') ? 'selected' : '')
										)
							);
						}
						if(self.included && a) {
							if (! self.nonremove){
								var m = a;
								var btlink = createOverlayTag($(this), m);
								a.before(btlink);
								a.addClass('hasBTtwin');
								btlink.css('hasBT');
							}
							a.after($('<span><\/span>').attr('class','included').html( ALREADY_IN_POLICY ));
						}
					});
				} else {

					a = (self.nonremove ?
						self.aRemove
						:
						$('<a><\/a>')
							.attr({'href':'#', 'id':uniqueCoverButtonId})
							.html( (this.selected ? SELECTED_LINK : UNSELECTED_LINK) )
							.click(function() {
								addOrRemoveOption(li, self.rel, null, null, $($(this).parents('li')[0], ''));
								return false;
							})
					)

					div.append( $('<div><\/div>').attr('class', 'button').append(a));

					if (self.included && a) {
						if (! self.nonremove){
							var m = a;
							var btlink = createOverlayTag($(this), m);
							a.before(btlink);
							a.addClass('hasBTtwin');
							btlink.css('hasBT');
						}
						a.after($('<span><\/span>').attr('class','included').html( ALREADY_IN_POLICY ));
					}
					div.append( $('<div><\/div>').attr('class', 'clearFloat').html('&nbsp;') );
				}

				// Append li to the correct list
				if(self.selected) {
					SELECTED_EMPTY_LI.hide();
					selected_ul.append(li);
				} else {
					UNSELECTED_EMPTY_LI.hide()
					unselected_ul.append(li);
				}

			});

			selected.append($('<div id="total_selected_panel"><\/div>').attr('class', 'options_bottom'));
			unselected.append($('<div><\/div>').attr('class', 'options_bottom'));

			// Move the cancel and return button into the right column.
			selected.append(cancelButton);
			
			// Match the background of the design.
			cancelButton.css({
				'background':'none repeat scroll 0 0 #f9f9f9',
				'display':'block',
				'float':'right',
				'margin-right':'0',
				'text-align':'right',
				'width':'100%'});

			updatePrices();
		addOns_bt();
		return(this);
	}
})(jQuery);



var getCoverOptions_COUNT = 0;
function getCoverOptions() {
	// How many times have we delayed the builder?
	if(getCoverOptions_COUNT >= 150) {
		// This is taking far too long - default to basic operation and refresh the page
		top.location.href = top.location.href;
	}
	// This needs to be long enough otherwise the new JS-based HTML does not get built!
	window.setTimeout("showCoverOptionsDelay()", 250);
	getCoverOptions_COUNT++;
}
var getAddOnOptions_COUNT = 0;
var getAddOnOptions = function () {
	// How many times have we delayed the builder?
	if(getAddOnOptions_COUNT >= 150) {
		// This is taking far too long - default to basic operation and refresh the page
		top.location.href = top.location.href;
	}
	// This needs to be long enough otherwise the new JS-based HTML does not get built!
	window.setTimeout("showAddOnOptionsDelay()", 250);
	getAddOnOptions_COUNT++;
}

function createOverlayTag(el, m) {
	var rel = m.parents('li[id]:first').attr('id');
	var a = $('<a><\/a>')
		.attr({
			'rel':rel,
			'class':'bt',
			'href':'#'
		})
		.html(m.html())
		.bt(
			'<div class="btInnerContent">'
                + '<h2 class="btHeader">'
                + (typeof BT_TITLE[rel] != 'undefined' ? BT_TITLE[rel] : $(el).html())
                + '<\/h2>'
                + '<a class="btClose" href="javascript:void($(jQuery.bt.docClick).btOff());"><span>Close<\/span><\/a>'
                + '<div class="btScroll">' + (typeof BT_CONTENTS[rel] != 'undefined' ? BT_CONTENTS[rel] : 'BT content not set' + (rel != '' ? ': set BT_CONTENTS[' + rel + ']' : ': set A tag rel and BT_CONTENTS[A tag rel]')) + '<\/div><\/div>'
                , POPUP_LAYOUT
		)
		.click(function(e){
			s_ev(e);
			return false;
		});

	return a;
}

var showCoverOptionsDelay = function () {
	// Before we show the customise options, make sure the bundles are removed from the source code
	$('#addOnBundles').html('');
	// Check to make sure the new HTML / DOM is ready
	var trs = returnCustomiseDOM();
	if(trs.length == 0) {
		// Wait before trying again
		getCoverOptions();
		return false;
	}
	/*
	// Make sure the DIV is still hidden - Spring/Ajax will lose the "display:none"
	if($('#customiseBundleOuter').css('display') == 'block') {
		$('#customiseBundleOuter').animate({"height": "toggle", "opacity": "toggle"});
	}
	*/
	getCoverOptions_COUNT = 0;
	$('#customiseBundleOuter')._getCoverOptions().animate({"height": "toggle", "opacity": "toggle"}, 800, function(){
		if($('body').hasClass('msie')){
			$('#selected_options, #unselected_options').css('visibility', 'visible');
			$('#unselected_options').find('.layoutHelper, .button').css('zoom', 1);
		}
	});
}
var showAddOnOptionsDelay = function () {
	// Before we show the customise options, make sure the bundles are removed from the source code
	$('#customiseBundle_a').html('');
	// Check to make sure the new HTML / DOM is ready
	var trs = returnAddOnDOM();
	if(trs.length == 0) {
		// Wait before trying again
		getAddOnOptions();
		return false;
	}
	// open section
	if($('body').hasClass('msie')){
		var opts = {"height": "toggle"};
		$('#packages').css('visibility', 'hidden');
	}else{
		var opts = {"height": "toggle", "opacity": "toggle"};
	}
	/*
	// Make sure the DIV is still hidden - Spring/Ajax will lose the "display:none"
	if($('#addOnBundlesOuter').css('display') == 'block') {
		$('#addOnBundlesOuter').animate({"height": "toggle", "opacity": "toggle"});
	}
	*/
	getAddOnOptions_COUNT = 0;
	$('#addOnBundlesOuter').animate(opts, 800, function(){$('#packages').css('visibility', 'visible');});
}


var addOrRemoveOption = function (li_main, inputID, select, option, sub_option, sub_option_id) {

	var option_id = inputID;

	if (sub_option_id != '')
		option_id += "-" + sub_option_id;

	if(li_main.parents('#selected_options').length > 0) {
		$('#' + inputID).attr('checked', false);

		if (typeof sub_option != 'undefined')
			sub_option.removeClass('selected');

		// this IF / ELSE will be removed when the Ajax come in place
		if (select != null && option != null) {
			select.val(0).attr('disabled',true);
			M_TOTAL -= M_VALUES[inputID + ($(option)[0].index+1)];
			Y_TOTAL -= Y_VALUES[inputID + ($(option)[0].index+1)];
		} else {
			M_TOTAL = parseFloat((M_TOTAL - parseFloat((M_VALUES[inputID]).toFixed(2))).toFixed(2));
			Y_TOTAL = parseFloat((Y_TOTAL - parseFloat((Y_VALUES[inputID]).toFixed(2))).toFixed(2));
		}
		removeOption(li_main);

		ajaxSubmit("quoteSummaryForm", "updateSelectedCovers_" + option_id, "excessesSummary,brandPanel,yourQuoteWelcomeNote", "updateSelectedCovers_" + option_id, "customiseBundle_a", null, '');


		
	} else if(li_main.parents('#unselected_options').length > 0) {
		$('#' + inputID).attr('checked', true);

		// the calculation in this IF / ELSE will be removed when the Ajax come in place
		// the removeClass must stay
		if (select != null && option != null) {
			li_main.find('li').removeClass('selected');
			select.val($(option).val()).attr('disabled',false);
			M_TOTAL = parseFloat((M_TOTAL + parseFloat((M_VALUES[inputID + ($(option)[0].index+1)]).toFixed(2))).toFixed(2));
			Y_TOTAL = parseFloat((Y_TOTAL + parseFloat((Y_VALUES[inputID + ($(option)[0].index+1)]).toFixed(2))).toFixed(2));
		} else {
			M_TOTAL = parseFloat((M_TOTAL + parseFloat((M_VALUES[inputID]).toFixed(2))).toFixed(2));
			Y_TOTAL = parseFloat((Y_TOTAL + parseFloat((Y_VALUES[inputID]).toFixed(2))).toFixed(2));
			
		}

		if (typeof sub_option != 'undefined')
			sub_option.addClass('selected');

		addOption(li_main);

		ajaxSubmit("quoteSummaryForm", "updateSelectedCovers_" + option_id, "excessesSummary,brandPanel,yourQuoteWelcomeNote", "updateSelectedCovers_" + option_id, "customiseBundle_a", null, '');
	}
	updatePrices();
}

// the Ajax will come in this function replacing all its content.
var updatePrices = function () {
	var string = [];
	string[0] = 'Total: &pound;';
	string[1] = '&pound;';
	string[2] = '&pound;';
	string[3] = '&pound;';

	if(M_Y == 'NWA_A') {
		string[0] += '<span id="added-opts-total-integer">' + Y_TOTAL.toFixed(2).replace('.', '</span><span class="decimals">.') + '<\/span> <span>per year<\/span>';

		string[1] += Y_TOTAL.toFixed(2).replace('.', '<span class="decimals">.') + '<\/span>';
		string[2] += (Y_TOTAL + Y_BASE_PRICE).toFixed(2).replace('.', '<span class="decimals">.') + '<\/span>';
		string[3] += (Y_BASE_PRICE).toFixed(2).replace('.', '<span class="decimals">.') + '<\/span>';
	} else {
		string[0] += '<span id="added-opts-total-integer">' + (M_TOTAL).toFixed(2).replace('.', '</span><span id="added-opts-total-decimals" class="decimals">.') + '<\/span> <span id="added-opts-total-per">per month<\/span>';

		string[1] += M_TOTAL.toFixed(2).replace('.', '<span class="decimals">.') + '<\/span>';
		string[2] += (M_TOTAL + M_BASE_PRICE).toFixed(2).replace('.', '<span class="decimals">.') + '<\/span>';
		string[3] += (M_BASE_PRICE).toFixed(2).replace('.', '<span class="decimals">.') + '<\/span>';
	}
	$('.options_bottom', '#selected_options').html( string[0] );
	$('.quote_values .equals').html( string[1] );
	$('.quote_values .value').html( string[2] );
	$('.quote_values .plus').html( string[3] );

	$('#aPremium span.priceContainer').html( '<span class="int">' + Y_BASE_PRICE.toFixed(2).replace('.', '<\/span><span class="decimals">.') + '<\/span>' );
	$('#mPremium span.priceContainer').html( '<span class="int">' + M_BASE_PRICE.toFixed(2).replace('.', '<\/span><span class="decimals">.') + '<\/span>' );
	$('#customise-out').find('.layoutHelper, .button').css('display', 'block');
}

var hide_empty_li = function () {
	if ($('li:visible', '#selected_options').length == 0) {
		//SELECTED_EMPTY_LI.animate({'height':100, 'opacity':1},500);
		SELECTED_EMPTY_LI.show();
	} else {
		//SELECTED_EMPTY_LI.animate({'height':0, 'opacity':0},500);
		SELECTED_EMPTY_LI.hide();
	}
	if ($('li:visible', '#unselected_options').length == 0) {
		//UNSELECTED_EMPTY_LI.animate({'height':100, 'opacity':1},500);
		UNSELECTED_EMPTY_LI.show();
	} else {
		//UNSELECTED_EMPTY_LI.animate({'height':0, 'opacity':0},500);
		UNSELECTED_EMPTY_LI.hide();
	}
}

var show_all_suboptions = function (li_main) {
	li_main.find('li').removeClass('selected');
	return li_main.height();
}

var addOption = function (li_main) {

	var h = li_main.height();

	$(li_main).animate({'opacity':0}, 300);
	$(li_main.find('div.option_container')[0]).animate({'margin-top': (h * -1)}, 500, function() {
		$( $('ul', '#selected_options')[0] ).prepend(li_main);

		li_main.find('div.button a').html(
			($('li:visible', li_main).length > 0 ? SELECTED_LINK_MULTIPLE : SELECTED_LINK)
		);

		hide_empty_li();

		$(li_main).animate({'opacity':1}, 1000);
		$(li_main.find('div.option_container')[0]).animate(
			{'margin-top':0}, 800, function (){if($('body').hasClass('msie')) $(li_main).find('.layoutHelper').css('zoom', 1);}
		);
	});
}


var removeOption = function (li_main) {

	var h = show_all_suboptions(li_main);

	$(li_main).animate({'opacity':0}, 300);
	$(li_main.find('div.option_container')[0]).animate({'margin-top': (h * -1)}, 500, function() {
		$( $('ul', '#unselected_options')[0] ).prepend(li_main);

		li_main.find('div.button a').html(UNSELECTED_LINK);

		hide_empty_li();
		show_all_suboptions(li_main);
		$(li_main).animate({'opacity':1}, 1000);
		$(li_main.find('div.option_container')[0]).animate(
			{'margin-top':0}, 800, function (){
				if($('body').hasClass('msie')) setTimeout('fixIEUnselectedLayout();', 50);
			}
		);
	});
}

var fixIEUnselectedLayout = function (){
	$('#unselected_options').find('.layoutHelper, .button').css('display', 'block').css('zoom', 1);
}

var returnCustomiseDOM = function () {
	return $('table tr', '#customise');
}
var returnAddOnDOM = function () {
	return $('#packages li');
}

var scrapeCustomiseTable = function () {
	var trs = returnCustomiseDOM();
	var array = [];

	for (var i=0; i<trs.length; i++) {
		var a = $(trs[i]).find('td.option a');

		var nonremove = false;

		if($(trs[i]).hasClass('callCentre')) {
			nonremove = true;
			var checkbox = $(trs[i]).find('td input[type=hidden]');
		} else {
			var checkbox = $(trs[i]).find('td input[type=checkbox]');
		}


		if (a.length > 0) {
			array.push({
				'a' : a,
				//'month_price' : (M_Y == 'NWA_A' ? Y_VALUES[checkbox.attr('id')] : M_VALUES[checkbox.attr('id')]),
				'month_price' : M_VALUES[checkbox.attr('id')],
				'annual_price' : Y_VALUES[checkbox.attr('id')],
				'selected' : (checkbox.attr('checked') || nonremove),
				'included' : $(trs[i]).hasClass('included'),
				'sub_options': $(trs[i]).find('td.price select'),
				'rel': checkbox.attr('id'),
				'nonremove' : nonremove,
				'aRemove' : $(trs[i]).find('a.remove:first'),
				'uId'     : checkbox.attr('id')
			});
		}
	}
	return array;
}
