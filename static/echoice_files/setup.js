/********************** DEBUG **********************/
// set DEBUG to true and use log(message) to log a message to the debug panel
var DEBUG = false;
var LOG_COUNT = 0;

if(DEBUG){
	document.write('<style>#DEBUG p{padding:1px;margin:1px;text-align:left;border-bottom:1px solid #5F1215;color:#5F1215;font-family:Verdana;}<\/style><div id="DEBUG" style="position:fixed;top:5px;left:1%;background:#dddddd;opacity:0.9;border:1px solid;width:97%;height:200px;overflow:auto;padding:2px;z-index:999999999"><\/div>');
	// we have to be sure that this is the last element, so after attaching it to the 
	// DOM to start logging messages, we have to move it to the bottom.
	$(document).ready(function() {
		$('#DEBUG').appendTo('body');
	});

}
function log(m){
	if(!DEBUG) return;
	LOG_COUNT++;
	$('#DEBUG')[0].innerHTML = '<p>' + LOG_COUNT + ": " + m + '</p>' + $('#DEBUG')[0].innerHTML;
}
/********************** DEBUG **********************/

/* function highlight >> fixes focus issue in IE by adding/removing a className to all cssReference elements
*	@param cssReference
*	@param className
*/
function highlight(cssReference, className){
	var els = $(cssReference);
	for(var i=0; i<els.length; i++) {
		$(els[i]).mouseenter(function() {$(this).addClass(className);}
			).keyup(function() {$(this).addClass(className);}
			).blur(function() {$(this).removeClass(className);}
			).mouseleave(function() {$(this).removeClass(className);});
	}
}

/* function getElementFromEvent >> returns the target tag from an event
*	@param e (event)
*/
// getElementFromEvent >> g_elev
var g_elev = function(e){
	var targ;
	if (!e) var e = window.event;
	if (e.target) targ = e.target;
	else if (e.srcElement) targ = e.srcElement;
	if (targ.nodeType == 3) // defeat Safari bug
		targ = targ.parentNode;
	return targ;
}
// setGlobalFocus >> s_gf
var s_gf = function(event){
	if(!FORM_ROWS || FORM_ROWS.length == 0) return;
	// this happens when we click out of the form UL
	if($(g_elev(event)).parents('ul.' + FORM_CLASS).length == 0){
		// we want to be sure that we are validating a valid input...
		var p_li = $(ELEMENT_ON_FOCUS).parents('li:first');
		if(p_li.parents('ul.' + FORM_CLASS + ':first').length > 0)
			vtc(p_li);
		for(var i=0; i<FORM_ROWS.length; i++) {
			$(FORM_ROWS[i]).removeClass(ROW_HIGHLIGHT_CLASS);
				var errorHelp = $(FORM_ROWS[i]).find('.' + ERROR_HELP_CLASS);
				var helpIcon = $(FORM_ROWS[i]).find('a.' + HELP_ICON_CLASS);
				var labelsText = g_tfl(FORM_ROWS[i]);
				errorHelp.attr('title', TXT_SHOW_HELP_TITLE + labelsText);
				helpIcon.attr('title', TXT_SHOW_HELP_TITLE + labelsText);
				helpIcon.html(TXT_HELP);
			if(! $(FORM_ROWS[i]).hasClass(HELP_ON_CLASS)) {
				var helpMessage = $(FORM_ROWS[i]).find('div.helpMessage');
				helpMessage.css('display', 'none');
			}
		};
	}
	ELEMENT_ON_FOCUS = g_elev(event);
	
	if(! $(ELEMENT_ON_FOCUS).hasClass('errorHelp') && !$(ELEMENT_ON_FOCUS).hasClass('helpIcon')) {
		$('li.' + HELP_ON_CLASS + ' a.errorHelp').trigger('mousedown');
	}
}

/* function s_ev >> stops and prevents event propagation
*	@param e (event)
*/
// stopEvent >> s_ev
var s_ev = function(e){
	if(!e) return;
	e.stopImmediatePropagation();
	e.stopPropagation();
	e.preventDefault();
}

/* function smr >> adds a class name to the row of an element
*	@param el (HTML element)
*	@param event
*	@param eventKey
*/
// selectMyRow >> smr
var smr = function(el, eventName, eventKey){


	// No need to run focus and validation code if the button is going to submit the form
	if($
		&&  $(el)
		&&  (($(el).hasClass('alwaysSubmit') || $(ELEMENT_ON_FOCUS).hasClass(ADD_ANOTHER_CONTAINER_CLASS))
			&& eventName != 'focus')
		) return;

	// There is nothing to loop through found
	if(!FORM_ROWS || FORM_ROWS.length == 0) return;
	
	var li = $(el).closest('li');
	var li_highlighted = (ROW_FOCUS ? ROW_FOCUS : $(ELEMENT_ON_FOCUS).closest('li'));
	
	// there is a confusion with the events here. When we blur the el on focus is NOT the one we blurred, but the one that received the focus
	// so just for the blur event we have to invert the variables. Everthing else should stay the same
	if(eventName == 'blur'){
	
		var inputs = $(li_highlighted[0]).find('input[type=text]');
		for(var i=0; i<inputs.length; i++){
			$(inputs[i]).val( $.trim($(inputs[i]).val()) );
		}
	
	
		if(li[0] != li_highlighted[0]){
			th($(li_highlighted).find('a.helpIcon')[0], $(li).find('.helpMessage')[0], false, true);
			$(li).removeClass(ROW_HIGHLIGHT_CLASS);
		}
			if (! $(li_highlighted).hasClass('noHighlight')){
				$(li_highlighted).addClass(ROW_HIGHLIGHT_CLASS);
			}
		var isHighlighted = $(li_highlighted).hasClass('highlight');
	}else{
		if(li[0] != li_highlighted[0]){
			th($(li).find('a.helpIcon')[0], $(li_highlighted).find('.helpMessage')[0], false, true);
			if (! $(li_highlighted).hasClass('noHighlight')){
			$(li_highlighted).removeClass(ROW_HIGHLIGHT_CLASS);
			}
		}
		var isHighlighted = $(li).hasClass('highlight');
		if (! $(li).hasClass('noHighlight'))
		$(li).addClass(ROW_HIGHLIGHT_CLASS);	
	}
	

	if(eventName == 'blur' && ELEMENT_ON_FOCUS){
		if(
			li[0] != $(ELEMENT_ON_FOCUS).closest('li')[0]
			||
			ELEMENT_ON_FOCUS.tagName.toLowerCase() == 'a'
			||
			(
				// This is used for the auto complete - the auto complete triggers a 'blur' when the mouse is used to click an item
				ELEMENT_ON_FOCUS.tagName.toLowerCase() == 'li' && $(ELEMENT_ON_FOCUS).attr('code') != ''
			)
		){
			ROW_FOCUS = $($(el).closest('li'));
		}
	}

	if((eventName == 'blur' || eventName == 'click') && $(el).hasClass('helpIcon')){
		ELEMENT_ON_FOCUS = el;
		if(li_highlighted[0] != li[0]){
		$(li).addClass(ROW_HIGHLIGHT_CLASS);
			th($(li_highlighted).find('a.helpIcon')[0], $(li_highlighted).find('.helpMessage')[0], false, true);
			$(li_highlighted).removeClass(ROW_HIGHLIGHT_CLASS);
		}
		return;
	}
	if(eventName == 'blur' && $(ELEMENT_ON_FOCUS).parents('ul.'+FORM_CLASS).length == 0){
		//th($(li).find('a.helpIcon')[0], $(li).find('.helpMessage')[0], false, true);
		//th($(li_highlighted).find('a.helpIcon')[0], $(li_highlighted).find('.helpMessage')[0], false, true);
		$(li_highlighted).removeClass(ROW_HIGHLIGHT_CLASS);
		return;
	}
	

	var tagName = el.tagName.toLowerCase();
	var type = (tagName == 'input') ? $(el).attr('type').toLowerCase() : '';
	var isDate = ($(li).hasClass('date') || $(li).hasClass('dateOfBirth') || $(li).hasClass('dateCoverStart') || $(li).hasClass('dateclaim') || $(li).hasClass('dateconviction') || $(li).hasClass('datefuture') || $(li).hasClass('datetoday'));
	var isEmail = ($(li).hasClass('email') || $(li).hasClass('confirmemail'));
	var isPostcode = $(li).hasClass('postcode');
	var isSortcode = $(li).hasClass('sortcode');
	var isEXOR = $(li).hasClass('exor');

	if(
		((li[0] != li_highlighted[0]) && (type != 'button')) // f24206 bug 498 added button check
		|| (tagName == 'select' && eventName=="change" && (li[0] != li_highlighted[0]))
		|| (tagName == 'input' && type != 'text' && type != 'password' && eventName=="click")
		|| (tagName == 'input' && !isDate && (type == 'text' || type == 'password') && (eventName=="keyup" || eventName=="blur")  && !isPostcode && !isEmail && !isSortcode)
		|| (eventName=="blur" && isPostcode)
		|| (eventName=="blur" && isEmail)
		|| (eventName=="blur" && isDate && (li[0] != li_highlighted[0]))
		|| (eventName=="change" && isDate && $(li).hasClass(ROW_ERROR_CLASS) && type != 'text')
	){
		if(isEXOR && isHighlighted) return;
		// We have to force onclick to validate the input clicked for RADIO AND CHECKBOX (all non text inputs)
		if(eventName == "click" && type != 'text' && type != 'password' && tagName != "select"){
			vtc($(el).closest('li'));
		}

		if(tagName == 'select' && parseInt(eventKey) != 9 && eventName != "click"){
			vtc($(el).closest('li'));
		}

		if(ROW_FOCUS){
			vtc(ROW_FOCUS);
		}else{
			// we don't want to validate on tab
			if(!(tagName == 'input' && parseInt(eventKey) == 9)){
				vtc($(el).closest('li'));
			}
		}
	}
	ROW_FOCUS = $($(el).closest('li'));
}

/* function s_hr >> adds a class name to the row of an element by triggering events
* 	@dependency function selectMyRow (smr)
*/
// setHighlightRow >> s_hr
var s_hr = function(container){
	if(!FORM_ROWS || FORM_ROWS.length == 0) return;
	
	if(typeof container != 'object')
		container = $('body');
	
	var els = container.find('ul.' + FORM_CLASS + ' input, ul.' + FORM_CLASS + ' select, ul.' + FORM_CLASS + ' textarea, ul.' + FORM_CLASS + ' a');
	
	$.each(els, function(index, value){
	
		if(this.tagName.toLowerCase() == 'a'){
			$(els[index]).change(function(event) {
				smr(this, "change", 0);
			});
		} else {
			$(this).click(function(event) {
			smr(this, "click", 0);
		}).keyup(function(event) {
			smr(this, "keyup", event.originalEvent.keyCode);
		}).blur(function(event) {
			smr(this, "blur", 0);
		});
			if(this.tagName.toLowerCase() == 'select'){
				$(els[index]).change(function(event) {
				smr(this, "change", 0);
			});
	};
		};

	
	})

}
// toggleHelp >> th
var th = function(anchor, container, event, forceClose){
	
	
	if(typeof anchor == 'undefined' || typeof container == 'undefined' || !anchor || !container) return;
	
	var otherClass = $(anchor).hasClass(HELP_ICON_CLASS)?'.' + ERROR_HELP_CLASS:'.' + HELP_ICON_CLASS;
	var li = $(anchor).closest('li');
	var otherAnchor = $(li).find(otherClass);
	var labelsText = g_tfl(li);
	if(typeof forceClose == 'undefined') forceClose = false;
	
	if(event)
		s_ev(event);
	if(!forceClose)
		$(container).toggle();
	else if(typeof container != 'undefined')
		$(container).hide();
		

	li = $(container).closest('li');
	
	var main_help = li.find('a.helpIcon');
	var sub_help = li.find('a.errorHelp');
	
	// reset
	$('a.errorHelp').not($(sub_help))
		.attr('title', TXT_SHOW_HELP_TITLE + labelsText)
		.closest('li')

	
	if(! $(container).is(':visible')) {
		sub_help
			.html(TXT_SHOW_HELP)
			.attr('title', TXT_SHOW_HELP_TITLE + labelsText)
			.closest('li')
				.removeClass(HELP_ON_CLASS);
				
		main_help
			.html(TXT_HELP)
	} else {
		sub_help
			.html(TXT_CLOSE_HELP)
			.attr('title', TXT_CLOSE_HELP_TITLE + labelsText)
			.closest('li')
				.addClass(HELP_ON_CLASS);
		main_help
			.html(TXT_HELP_OPEN)
		container.focus();
	}
		

	return false;
}
// attachClickShowHideHelp >> acshh
var acshh = function(anchor, container){

	$(anchor).click(function(event) {
		ELEMENT_ON_FOCUS = g_elev(event);
		s_ev(event);
	}).mousedown(function(event) {
		var formInput = $(this).closest('li').find('input:visible,select:visible,textarea:visible');
		ELEMENT_ON_FOCUS = g_elev(event);
	
		ROW_FOCUS = $(this).closest('li');
		th(anchor, container, event);
		// we can't tab through divs in FF :(
		if($('body').hasClass('mozilla'))
			formInput[0].focus();
	}).keydown(function(event) {
		if(
			event.originalEvent.keyCode == 9
			|| event.originalEvent.keyCode == 16
		){
			return true;
		}
		th(anchor, container, event);
	});
}
// getTextFromLabels >> g_tfl
var g_tfl = function(row){
	var t = "";
	var labels = $(row).find('.label, label');
	var hasFakeLabel = false;
	for(var i=0; i<labels.length; i++) {
		if(!hasFakeLabel && !$(labels[i]).hasClass('accessible')){
			if(t != "") t += " / ";
			t += unescape($(labels[i]).html()).replace(/<span(.*)<\/span>/i, '').replace(':', '').replace('*', '');
			t = t.replace(/\s{2,}/g, ' ');
			t = t.replace(/\/\s*Yes\s*\/\s*No\s*/g, '').replace(/&amp;/g,'&');
		}
		if($(labels[i]).hasClass('label')) hasFakeLabel = true;
	};
	return ' for: ' + t;
}
/* function setHelpMessage
*/
// setHelpMessage >> s_hm
var s_hm = function(rows){
	if(typeof rows != 'object')
		rows = FORM_ROWS;
		
	for(var i=0; i < rows.length; i++) {
		
		var el = rows[i];

		if($(el).hasClass('hasChildList'))
			continue;
	
		var labelsText = g_tfl(el);
		var helpMessage = $(rows[i]).find('.helpMessage');
		
		if (helpMessage.length > 1)
			continue;
		
		var rightCol = $(rows[i]).find('div.rightCol');

		var after = rightCol[0];
		if(helpMessage.length==0)
			$(after).after('<span class="helpIcon">&nbsp;<\/span>');
		else
		$(after).after('<a class="helpIcon" href="#">' + TXT_HELP + '<\/a>');

		var toggle = $(rows[i]).find('.helpIcon');
		
		if (toggle.length==0) continue;

		if(toggle[0].tagName.toLowerCase() == 'a'){
		$(toggle).mousedown(function(event){smr(this, "click", 0);});
		}

		$(toggle[0]).attr('title', TXT_SHOW_HELP_TITLE + labelsText);
		if (toggle[0].tagName.toLowerCase() == 'a')
		acshh(toggle[0], helpMessage);
		after = $(rows[i]).find('.' + HELP_ICON_CLASS);

		$(after).after('<span class="OKIcon">&nbsp;<\/span>');
	}
	return false;
}
// setFixedSizePopups >> s_fsp
var s_fsp = function() {
	$('a.fixedSizePopup, a.printSizePopup').click(function(event){
		s_ev(event);
		var newwindow = false;
		if($(this).hasClass('fixedSizePopup'))
			newwindow = window.open($(this).attr('href'), 'samewindowopening', 'toolbar=0,scrollbars=1,location=1,statusbar=0,menubar=1,resizable=0,width=' + POPUP_WINDOW_WIDTH_FIXEDSIZEPOPUP + ',height=' + POPUP_WINDOW_HEIGHT_FIXEDSIZEPOPUP + ',left = 390,top = 262');

		if($(this).hasClass('printSizePopup'))
			newwindow = window.open($(this).attr('href'), 'samewindowopening', 'toolbar=0,scrollbars=1,location=1,statusbar=0,menubar=1,resizable=0,width=' + POPUP_WINDOW_WIDTH_PRINTSIZEPOPUP + ',height=' + POPUP_WINDOW_HEIGHT_PRINTSIZEPOPUP + ',left = 390,top = 262');
		newwindow.focus();
	});
}
// hideNoJsInputs >> hnjsi
var hnjsi = function(container){
	if(typeof container != 'object')
		container = $('body');
		
	//Disable and Hide Form elements that are only for non-Javascript users.
	container.find('span.nojs input, span.nojs select, span.nojs textarea').attr('disabled','disabled');
	return false;
}

var trim = function(str, chars) {
	if(str == null) return "";
	return ltrim(rtrim(str, chars), chars);
}

var ltrim = function(str, chars) {
	chars = chars || "\\s";
	return str.replace(new RegExp("^[" + chars + "]+", "g"), "");
}

var rtrim = function(str, chars) {
	chars = chars || "\\s";
	return str.replace(new RegExp("[" + chars + "]+$", "g"), "");
}

var printNW = function(formID, e) {
	// Temporarily open a 'submit' in a new window
	$('#' + formID).attr('target', '_blank');
	if(arguments.length >= 2) {
		// This is required otherwise IE6 opens 2 windows
		e.stopImmediatePropagation();
	}
	// Make sure the form submits to itself once the pop-up window is open
	setTimeout("$('#" + formID + "').attr('target', '_self');", 1000);
	return true;
};

var searchForCompletedForm = function() {
	// We're only searching for text inputs because RADIOs often have defaults as do SELECTs
	var required_inputs = $('ul.' + FORM_CLASS + ' li.required input[type=text]');
	var validated_input = 0;
	for(var i=0; i<required_inputs.length; i++) {
		var inputType = $(required_inputs[i]).attr('type');
		if($(required_inputs[i]).parents('li:first').hasClass('autocomplete')) {
			// We cannot use auto complete fields because they contain a default value
			continue;
		}
		var errorReturn = ve($(required_inputs[i]).parents('li:first'), $(required_inputs[i]));
		if(errorReturn === true) {
			// This implies the field was valid, and not skipped
			validated_input++;
		}
		if(validated_input >= REQUIRED_FOR_PREVALIDATE) {
			return true;
		}
		if(validated_input >= MAX_TO_CHECK_FOR_PREVALIDATION) {
			return false;
		}
	}
	return false;
}

// Start BT (BeautyTips)
// http://www.lullabot.com/files/bt/bt-latest/DEMO/index.html
// setBT >> s_Bt
var s_bt = function(){
	$.each($('.bt'), function(index, el) {
		// we show the BT 
		$(el).bt(  '<div class="btInnerContent">'
				+ '<h2 class="btHeader">'
				+ (typeof BT_TITLE[$(el).attr('rel')] != 'undefined' ? BT_TITLE[$(el).attr('rel')] : $(el).html())
				+ '<\/h2>'
				+ '<a class="btClose" href="javascript:void($(jQuery.bt.docClick).btOff());"><span>Close<\/span><\/a>'
				+ '<div class="btScroll">' + (typeof BT_CONTENTS[$(el).attr('rel')] != 'undefined' ? BT_CONTENTS[$(el).attr('rel')] : 'BT content not set' + ($(el).attr('rel') != '' ? ': set BT_CONTENTS[' + $(el).attr('rel') + ']' : ': set A tag rel and BT_CONTENTS[A tag rel]')) + '<\/div><\/div>'
				, POPUP_LAYOUT).click(function(event){
				s_ev(event);
				return false;
			});
	});
}

// set top help links
var s_thl = function(){
	
	// Change A HREF tag below to the FAQs page
	var topHelp = $('<div>').attr('id', 'topHelpLinks').append($('<h2>').append($('<a href="http://www.google.co.uk" target="_blank">').append($('<span>').html('Need help?'))));
	topHelp.find('a').click(function(){
		window.open($(this).attr('href'), 'samewindowopening', 'toolbar=0,scrollbars=1,location=1,statusbar=0,menubar=1,resizable=0,width=' + POPUP_WINDOW_WIDTH_FIXEDSIZEPOPUP + ',height=' + POPUP_WINDOW_HEIGHT_FIXEDSIZEPOPUP + ',left = 390,top = 262');
		return false;
	});
	var topHelpList = $('<ul>');

	if(TOP_HELP_TEXT['help_mail'])
		topHelpList.append($('<li>').attr('id', 'help_mail').append($('<a>').attr('href', '#').append($('<span>').html('Email us')))); // For Live, update href '#' with Email Us brochure ware page location.
	if(TOP_HELP_TEXT['help_phone'])
		topHelpList.append($('<li>').attr('id', 'help_phone').append($('<a>').attr('href', '#').append($('<span>').html('Phone us')))); // For Live, update href '#' with Request Call-Back brochure ware page location.
	if(TOP_HELP_TEXT['help_chat'])
		topHelpList.append($('<li>').attr('id', 'help_chat').append($('<a>').attr('href', '#').append($('<span>').html('Chat with us'))));
	topHelp.append(topHelpList);
	topHelp.find('li:last').addClass('last')
	$('#main').append(topHelp);
	try{
		$.each($('#topHelpLinks li a'), function(index, el) {
			// we show the BT 
			if(typeof TOP_HELP_TEXT[$(el).parents('li:first').attr('id')] == 'string'){
				$(el).bt('<div class="btTopHelpContainer">'
						+ TOP_HELP_TEXT[$(el).parents('li:first').attr('id')]
						+ '<\/div>'
						, POPUP_HELP_LAYOUT).click(function(event){
					s_ev(event);
					return false;
				});
				$(el).parents('li:first').bind('mouseleave', function(){$(jQuery.bt.docClick).btOff(); $(this).removeClass('on')});
				$(el).parents('li:first').bind('mouseenter', function(){$(this).addClass('on')});
			}
		});
	}catch(e){
		$('#topHelpLinks').hide();
	}
	topHelp.css('left',($('#main').width() / 2) -  (topHelp.width() / 2));
}

// set top topNav bubbles
var s_tnb = function(){
	$.each($('#pageNavigation li input'), function(index, el) {
		var className = $(el).parents('li:first').attr('class');
		
		if(typeof TOP_NAV_TEXT[className] == 'string'){
			$(el).bt('<div class="btTopNavContainer">'
					+ TOP_NAV_TEXT[className]
					+ '<\/div>'
					, POPUP_NAVIGATION).click(function(event){
				s_ev(event);
				return false;
			});
		}
		
		$(el).parents('li:first').mouseleave(function(){$(jQuery.bt.docClick).btOff();});
	});
}

// set form rows
// this is now external because we have to have control over new elements added and nested lists
var s_fr = function(){
	_fr = $('ul.' + FORM_CLASS + ' li:not(.ajaxTile li)');
	if(_fr.length>0)
		FORM_ROWS = new Array();
	for(var i=0; i<_fr.length; i++){
		if($(_fr[i]).find('li select, li checkbox, li textarea, li input[type!=submit]').length == 0 && $(_fr[i]).find('select, checkbox, textarea, input[type!=submit]').length > 0){
			FORM_ROWS.push(_fr[i]);
		}
	}
}

// function button to link
// @param id: the button id.
// the idea is to replace inputs submit with
// anchors that will trigger the click
// the motivation is that buttons can't wrap the text
// or always be styled to look like an anchor
var b2l = function(id){
	// add class accessible to the input
	// get the text in it
	// create the anchor
	// attach the click event
	// add anchor after the input
	$('#'+id).addClass('accessible');
	var a = $('<a href="#">');
	a.html($('#'+id).val());
	a.click(function(event){
		$('#'+id).trigger('click');
		s_ev(event);
		return false;
	});
	$('#'+id).after(a);
}


/*
function blur_changed_value_checker
@param: id: the input id
@param: f: the function to be called if value is changed

Example onload:
	bcvc(false, 'yourDetailsVehicleRegistration', callBackFunction);
*/
var bcvc = function(event, id, f){

	if(typeof id != 'string') id = event.data.id;
	if(typeof f != 'function') f = event.data.f;

	if(typeof event == 'object' && $('#'+id).attr('previousValue') != $('#'+id).val()){
		// onblur with new value
		f(id);
	}else if(typeof $('#'+id).attr('previousValue') != 'string'){
		// set the onblur event
		$('#'+id).bind("blur", {'id': id, 'f': f}, bcvc);
	}
	// set previousValue
	$('#'+id).attr('previousValue', $('#'+id).val());
}