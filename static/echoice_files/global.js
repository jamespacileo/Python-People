/** GLOBAL VARIABLES **/
var isIE = (navigator.userAgent.indexOf('MSIE') != -1);
var OBJ_TO_BLOCK = "obj_to_block";

var EMPLOYMENT_STATUS_EMPLOYED = "NWA_1";
var EMPLOYMENT_STATUS_SELF_EMPLOYED = "NWA_2";
var EMPLOYMENT_STATUS_RETIRED = "NWA_3";
var EMPLOYMENT_STATUS_UNEMPLOYED = "NWA_4";
var EMPLOYMENT_STATUS_IN_EDUCATION = "NWA_5";

var OCCUPATION_RETIRED = 'R09';
var OCCUPATION_UNEMPLOYED = 'U03';

var DATE_YEAR_DEFAULT_VALUE = '0';
var DATE_MONTH_DEFAULT_VALUE = '';
// Stores the page element focused
var ELEMENT_ON_FOCUS;
// Stores the last row focused
var ROW_FOCUS = false;
// Stores the class of the row highlighted
var ROW_HIGHLIGHT_CLASS = 'highlight';
// Stores the class of the row on error state
var ROW_ERROR_CLASS = 'error';
// Stores the class of the row on error state
var ROW_OK_CLASS = 'ok';
// Stores the class of the row on error state
var HELP_ON_CLASS = 'helpOn';
// Stores the form list class
var FORM_CLASS = 'formInputs';
// Stores an object containing the form rows
var FORM_ROWS = false;
// The <select> tag empty value
var EMPTY_STRING = '';
// The class for the container of the page's content
var CONTENT_WRAPPER = 'wrapperInner';
// The class for the container of a section of a form
var FORM_SECTION = 'formSection';
// the add another button container
var ADD_ANOTHER_CONTAINER_CLASS = 'button-add-another-container';

var NON_BREAKING_SPACE = "";

// Details Capture Maximum Adds
var MAX_MOD = 10;
var MAX_CLAIMS = 10;
var MAX_CONVICTIONS = 10;
var MAX_ADD_DRIVERS = 4;

// Stores the prompt object when loaded
var PROMPT = false;

// Fields required to pre-validate a form + maximum to check
var REQUIRED_FOR_PREVALIDATE = 3;
var MAX_TO_CHECK_FOR_PREVALIDATION = 10;

// Help Icon Classes
var HELP_ICON_CLASS = 'helpIcon';
var ERROR_HELP_CLASS = 'errorHelp';

// Texts and strings
var TXT_HELP = 'Help';
var TXT_HELP_OPEN = 'Hide Help';
var TXT_SHOW_HELP = 'Show additional help';
var TXT_CLOSE_HELP = 'Close additional help';
var TXT_SHOW_HELP_TITLE = 'Show help';
var TXT_CLOSE_HELP_TITLE = 'Close help';
var TXT_SHOW_DETAILS = 'Show details';
var TXT_HIDE_DETAILS = 'Hide details';
var VEHICLE_SELECT_DEFAULT = 'Please specify';

var MIN_PASSWORD_LENGTH = 8;
var MAX_PASSWORD_LENGTH = 15;
var MIN_DATE_COVER_START = 0;
var MAX_DATE_COVER_START = 45;

var CLAIM_AND_CONVICTION_PAST_YEARS = 5;

//This is the default string, but should be updated on each page using it with the WCM value
var AUTOCOMPLETE_MESSAGE = 'Start typing & choose from list';

//This is the default string for inputs DOB
var DOB_MESSAGE = 'dd/mm/yyyy';

var PROMPT = false;

var FIRST_SUBMIT = true;

var VALIDATION_GROUPS = [];

// Fixed sized popup windows
var POPUP_WINDOW_WIDTH_FIXEDSIZEPOPUP = 566;
var POPUP_WINDOW_HEIGHT_FIXEDSIZEPOPUP = 500;

// Print sized popup windows
var POPUP_WINDOW_WIDTH_PRINTSIZEPOPUP = 838;
var POPUP_WINDOW_HEIGHT_PRINTSIZEPOPUP = 500;

// BT Stuff
// we can't really have the shadow in IE, so I removed from all browsers :(
var POPUP_LAYOUT = {overlay:true, fill: '#FFF', trigger: 'click', width: 480, height: 220, cornerRadius: 10, strokeWidth: 0,	shadow: false, shadowOverlap: false, noShadowOpts: {strokeStyle: '#999', strokeWidth: 2}, spikeLength: 40, strokeStyle: '#5A2D7F', centerPointX: .5, strokeWidth: 3, spikeGirth: 50, positions: ['top']};
var BT_TITLE = [];
var BT_CONTENTS = [];

var POPUP_HELP_LAYOUT = {fill: '#b40084', trigger: 'mouseover', width: 200, height: 120, cornerRadius: 5, strokeWidth: 0,	shadow: false, shadowOverlap: false, noShadowOpts: {strokeStyle: '#999', strokeWidth: 0}, spikeLength:0, strokeStyle: '#b40084', centerPointX: .1, strokeWidth: 0, spikeGirth: 0, positions: ['bottom'], preShow: function() {$(jQuery.bt.docClick).btOff();}};
var TOP_HELP_TEXT = [];

var POPUP_NAVIGATION = {fill: '#FFF', trigger: 'mouseenter', width: 300, height: 100, cornerRadius: 10, strokeWidth: 0,	shadow: false, shadowOverlap: false, noShadowOpts: {strokeStyle: '#999', strokeWidth: 2}, spikeLength: 15, strokeStyle: '#5A2D7F', centerPointX: .8, strokeWidth: 3, spikeGirth: 20, positions: ['top'], postShow: function(){$('.bt-wrapper').css('top', parseInt($('.bt-wrapper').css('top'))+15)}};
var TOP_NAV_TEXT = [];

$(document).ready(function() {
	// for JS DHTML functions we could need to apply special CSS to singular browsers, so lets add the browser name as body tag class
	for(var v in jQuery.browser)
		if(v != 'version')
			$('body').addClass(v);

	// Hide and disable the submit buttons that are used for dependent questions when JS is disabled
	$('span.updateDep').hide().find('input,select,textarea').attr('disabled','disabled');

	highlight('input[type=submit]', 'focus');
	highlight('a', 'focus');

	s_fr();

	s_hm();

	s_el();

	hnjsi();


	s_hr();
	$('body').mousedown(s_gf);
	$('body').keydown(s_gf);

	$(document).find('form').submit(function(event) {
		s_fr();
		if(!FIRST_SUBMIT || $(ELEMENT_ON_FOCUS).hasClass('alwaysSubmit') 
				|| $(event.target).hasClass('alwaysSubmit')) 
			return true;
// See comment below
//		s_ev(event);
		var numberOfErrors = 0;
		for(var i=0; i<FORM_ROWS.length; i++) {
			var didRowValidate = vtc($(FORM_ROWS[i]));
			if(!didRowValidate && typeof didRowValidate != "undefined")
				numberOfErrors++;
		};

		if(numberOfErrors > 0){
			
			
			var first = $('div.formSection')[0];
			var checkContainer = $('div.numberOfErrors');
			var message = '<div class="formSectionA"><\/div><div class="error_wrapper"><p>There ' + ((numberOfErrors>1) ? 'are' : 'is') + ' <strong>' + numberOfErrors + ' problem' + ((numberOfErrors>1) ? 's' : '') + '<\/strong> with the information you have provided.<\/p><\/div>';
			if(checkContainer.length>0){
				$(first).html(message);
			}else{
				$(first).before('<div class="formSection numberOfErrors">' + message + '<\/div>');
			}
			window.location.hash = 'block2';

			return false;
		} else if ((window.f_av) && (f_av(this) == false)) {
			return false;
		} else {
			FIRST_SUBMIT = false;
			return true;
// By doing this, it allows the submit button to be included in the POST array
// - An additional amend was also made to the 's_ev' function (above) - commented-out to stop the 'preventDefault' call
//			$(this).submit();
		}
	
	});

	s_fsp();

	// Pre-validate the page (only showing ticks, not errors, where appropriate)
	// 3 scenarios: Address lookup (page refresh), Server-side validation, 'Back' button
	if(searchForCompletedForm()) {
		for(var i=0; i<FORM_ROWS.length; i++) {
			vtc($(FORM_ROWS[i]), true);
		};
	}
	
	// add the top help links
	s_thl();
	// add the topNav bubbles
	s_tnb();
});

//Used in defaultError.jsp
function closeAjaxErrorDialog(button) {
   	var id = $(button).parents('.dijitDialog').attr('id');
	dijit.byId(id).hide();
	return false;
};
