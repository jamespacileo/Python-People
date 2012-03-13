/* Set globals to store DOM elements, prevents a need to call jQuery on each user change */
var _VOLUNTARY_EXCESS, _NCD_PROTECTION_YES, _NCD_PROTECTION_NO, _PACKAGES, _CUSTOMISE_ELEMENTS;

$(document).ready(function() {
	// Get the <SELECT> we want to transform into the slider
		var slider = $('#yourQuoteVoluntaryExcess');

		// Set the globals to the DOM elements
		_VOLUNTARY_EXCESS = slider[0];
		if ($('#yourQuoteProtectNCD-y, #yourQuoteProtectNCD-n').length != 2) {
			_NCD_PROTECTION_YES = $('#yourQuoteProtectNCD-y')[0];
			_NCD_PROTECTION_NO = $('#yourQuoteProtectNCD-n')[0];
		} else {
			_NCD_PROTECTION_YES = false;
			_NCD_PROTECTION_NO = false;
		}

		// setup quote update listener on the NCD fields
		var updatePrice = $('#quoteSummaryForm').find('li.updateprice input, li.updateprice select').change(function() {
			recalculatePrices();
			return true;
		});

		// Convert the excess <SELECT> to a slider and hide the original
		slider.selectToUISlider( {
			labels : 2,
			labelSrc : 'text',
			tooltip : true,
			sliderOptions : {
				animate : true,
				change : function(event) {
					if((typeof $('body').btOn) == 'function') {
						$('body').btOn();
					}
					recalculatePrices();
					return true;
				}
			}
		}).hide();

		// The slider needs additional space in order for the highlight to appear
		slider.parents('ul').addClass('extraSliderPadding');

		// Set the min and max labels to the first and last value of the excess dropdown
		$('span.excessMin').html(SLIDER_FIRST_TEXT);
		$('span.excessMax').html(SLIDER_LAST_TEXT);

		// Highlight row and tooltip when interacting with the slider
		$('.ui-slider').bind('click mousedown keyup', function(e) {
			smr(this, 'focus', '');
		});

		// Move the max excess span after the slider
		$('div.ui-slider').after($('span.excessMax'));


		highlight('.policies li:not(.on)', 'focus');
	});


function AJAX_displayOverlayUpsell(e) {
	// Lightbox overlay code for Upsell messages goes here.
	if (!$(ELEMENT_ON_FOCUS).hasClass('alwaysSubmit')) {
		s_ev(e);
	}
}

function recalculatePrices() {
	return ajaxSubmit("quoteSummaryForm", "reRate", "quoteSummaryPrice,errorBlock,excessesSummary,topPremiumPrices", "yourQuoteVoluntaryExcess", null);
}

function updatePremium(subtotal) {
	$('.premiumDetails span.premiumPrice')[0].innerHTML = '&pound;' + subtotal;
	$('table.quote_values td.plus')[0].innerHTML = '&pound;'
			+ subtotal.replace('.', '.<span class="decimals">') + "<\/span>";
}
function updatePackage(subtotal) {
	// update Package total
	$('span.totalOptions', '#customise').html('&pound;' + subtotal);
	$('table.quote_values td.equals')[0].innerHTML = '&pound;'
			+ subtotal.replace('.', '.<span class="decimals">') + "<\/span>";
}
function updateTotal(total) {
	// update Premium total
	$('table.quote_values td.total span.value')[0].innerHTML = '&pound;'
			+ total.replace('.', '.<span class="decimals">') + "<\/span>";
}
