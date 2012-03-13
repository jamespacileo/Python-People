/***********************************
***  VALIDATION FUNCTIONS  ***
***********************************/
/* function highlightError >> apply the associated styling to a form row in error state
*	@param element (DOM element)
*/
// highlightError >> h_er
var h_er = function(element) {
	element.removeClass(ROW_OK_CLASS);
	element.addClass(ROW_ERROR_CLASS);
	return false;
}
/* function highlightOK >> remove the associated styling to a form row in error state
*	@param element (DOM element)
*/
// highlightOK >> h_ok
var h_ok = function(element) {
	element.removeClass(ROW_ERROR_CLASS);
	element.addClass(ROW_OK_CLASS);
	return false;
}
// setErrorListeners >> s_el
var s_el = function(rows){
	if(!FORM_ROWS || FORM_ROWS.length == 0) return;
	
	if(typeof rows != 'object')
		rows = FORM_ROWS;
	for(var i=0; i < rows.length; i++) {
		
		//if($(rows[i]).hasClass('hasChildList'))
			//continue;
	
		var helpIcon = $(rows[i]).find('a.helpIcon');
		
		if ($(helpIcon).length > 1)
			continue;
		
		var OKIcon = $(rows[i]).find('.OKIcon');
		var inputs = $(rows[i]).find('input, select, textarea');
		if(helpIcon.length==0 || inputs.length==0 || ERROR_MESSAGES.length==0){
			if(OKIcon.length == 0) {
				var backup = $(rows[i]).find('.rightCol');
				$(backup[0]).after('<span class="errorIcon">&nbsp;<\/span>');
			} else {
				$(OKIcon[0]).after('<span class="errorIcon">&nbsp;<\/span>');
			}
			var errorIcon = $(rows[i]).find('.errorIcon');
		}else{
			$(helpIcon[0]).after('<span class="errorIcon">&nbsp;<\/span>');
			var errorIcon = $(rows[i]).find('.errorIcon');
		}
		var build_html = '<div class="errorMessage"><div class="errorTop"><div class="errorContent"><\/div>';
		if(helpIcon.length > 0) {
			build_html += '<a href="#" class="errorHelp">' + TXT_SHOW_HELP + '<\/a><div class="clearFloat">&nbsp;</div>';
		}
		build_html += '<\/div><\/div>';
		$(errorIcon[0]).after(build_html);
		var a = $(rows[i]).find('.errorHelp');
		var helpMessage = $(rows[i]).find('.helpMessage');
		acshh(a[0], helpMessage);
	};
	return false;
};
/* function validateAndToggleClass
* @param array[][LI container]
* @return boolean (valid)
*/
// vtc >> validateAndToggleClass
var vtc = function(htmlEl, doNotShowErrors, ignoreRelated){

	if(!htmlEl || htmlEl.length == 0 
	// we don't want to check LIs without inputs inside...
	|| htmlEl.find('input[type!=submit], textarea, select').length == 0
	// we don't want to validate LIs that have child LIs with inputs (not sure it makes sense to YOU, but it does fix the bug... ;)
	|| htmlEl.find('li').find('input[type!=submit], textarea, select').length != 0) return;
	
	
	if(arguments.length < 2) {
		doNotShowErrors = false;
	}
	if(arguments.length < 3) {
		ignoreRelated = false;
	}
	
	var els = false;
	var row = false;
	if(htmlEl[0].tagName.toLowerCase() == 'li'){
		els = $(htmlEl[0]).find('select, input[type!=submit]');
		row = $(htmlEl[0]);
	}else{
		els = $(htmlEl[0]).parent('div').find('select, input[type!=submit]');
		row = $(htmlEl[0]).parents('li:first');
	}
	var helpMessage = row.find('.helpMessage');
	var errorReturn = ve(row, els, ignoreRelated);

	if (errorReturn === true) {
		h_ok(row);
		if(doNotShowErrors) {
			return true;
		}
		if (!$('body').hasClass('msie')) {
			th($(row).find('a.' + HELP_ICON_CLASS)[0], $(row).find('.helpMessage')[0], false, true);

			if (row.parents('.accordionArea')) {
				row.parents('.accordionArea').show();
				row.parents('.formSection').find('a.showDetails').html(TXT_HIDE_DETAILS);
			}
		}

		return true;
	} else if(errorReturn == 'skip'  ||  doNotShowErrors) {
		return true;
	} else if (errorReturn != 'skip') {
		// F24206 bug 532, if is error open row
		var accordionAreaElem = row.closest('.accordionArea');
		if (accordionAreaElem.length > 0) {
			accordionAreaElem.show();
			row.parents('.formSection').find('a.showDetails').html(TXT_HIDE_DETAILS);
		} else {
			var spanElem = $(row.closest('li.ajaxInsert').find('span.hideShow').get(0));
			if ((spanElem.length > 0) && !spanElem.hasClass('shown')) {
				spanElem.find('input').trigger('click');
				row.parents('.formSection').find('a.showDetails').html(TXT_HIDE_DETAILS);
			}
		}

		var erM = $(row).find('.errorContent');
		erM.html("");
		for(var i=0; i<errorReturn.length; i++) {
			erM.append(errorReturn[i] + "");
		};
		erM.append(ERROR_MESSAGES[$(els[0]).attr('id')]);
		//
		h_er(row);
		return false;
	}
}
// validateError >> ve
var ve = function(row, els, ignoreRelated) {
	if(typeof ignoreRelated == 'undefined') ignoreRelated = false;
	if ( row.hasClass('skip') ) { return 'skip'; }
	var _or = row.hasClass('or');
	var validates = true;
	var override = false;

	var returnMessages = [];

	for(var i=0; i<els.length; i++) {
		var self = $(els[i]);

		if(
			(self.attr('type') == 'hidden'  &&  !row.hasClass('autocomplete'))
			||
			(self.attr('type') == 'text'  &&  row.hasClass('autocomplete'))
		) {
			// No need to validate a hidden form field (unless it is for the auto complete)
			// Auto complete needs the validation on the hidden field and NOT the text input
			continue;
		}
		if (row.hasClass('exor')) {
			var n = 0;
			for(var ii=0; ii<els.length; ii++) {
				if(trim($(els[ii]).val()) != '')
					n++;
			}
			validates = (n == 1);
			if(!validates){
				if(ERROR_MESSAGES[ $(els[0]).attr('id') + ':a']) {
					returnMessages.push( ERROR_MESSAGES[ $(els[0]).attr('id') + ':a'] );
				} else {
				returnMessages.push(g_es(self));
				}
				return returnMessages;
			}
			return true;
		}

		var isRequiredRow = row.hasClass('required');
		if (isRequiredRow) {
			if(self.parents('div').attr('id').indexOf('ComboDiv') != -1) {
				// Force positive validation for auto completes because it is not working correctly with the 'look ahead' functionality
				override = true;
			} else if (!row.hasClass('residency') && (self.attr('type') == 'radio' || self.attr('type') == 'checkbox')) {
				if (! self.attr('checked')) {
					validates = false;
					if (returnMessages.length == 0)
						returnMessages.push(g_es(self));
				} else if(_or) {
					override = true;
				}
			} else if(!row.hasClass('residency')) {  
				if ($.inArray(trim(self.val()), ['',EMPTY_STRING,VEHICLE_SELECT_DEFAULT,AUTOCOMPLETE_MESSAGE]) >= 0) {
					validates = false;
					if (returnMessages.length == 0)
						returnMessages.push(g_es(self));
				} else if(_or) {
					override = true;
				}
			}
		}
		
		if (row.hasClass('soleuser')) {
			if (! self.attr('checked')) {
				validates = false;
				if (returnMessages.length == 0)
					returnMessages.push( NOT_ALLOWED );
			} else if(_or) {
				override = true;
			}
		}

		if (row.hasClass('name')) {
			if(!isRequiredRow && self.val() != "" || isRequiredRow){
			if(v_n(self.val()) !== true && returnMessages.length == 0) {
				returnMessages.push( BAD_NAME );
				validates = false;
			}
		}		
		}

		if (row.hasClass('email')) {
		
		
			if(!isRequiredRow && self.val() != "" || isRequiredRow){
				if(v_em(self.val()) !== true && returnMessages.length == 0) {
					returnMessages.push( BAD_EMAIL );
					validates = false;
				}
			}
			if(isRequiredRow && self.val() == ""){
				if (ERROR_MESSAGES[ $(els[0]).attr('id')])
					returnMessages.pop();

			}
			
		}

		if (row.hasClass('confirmemail')) {
			if(v_cf(self, 'email', false) !== true && returnMessages.length == 0) {
				returnMessages.push( BAD_EMAIL_CONFIRM );
				validates = false;
			}
		}
		
		// ENDAVA code - f23581
		if (row.hasClass('mileage')) {
			// required field
			if (returnMessages.length == 0 && v_nb(self.val()) === true && v_nb(originalMileage) === true && parseInt(originalMileage, 10) > parseInt(self.val(), 10)) {
				returnMessages.push( BAD_MILEAGE_LOWER );
				validates = false;
			}
		}
		//

		// ENDAVA code - f23581
		if (row.hasClass('invalidPTO')) {
			returnMessages.push( INVALID_PTO );
			validates = false;
		}
		//

		if (row.hasClass('date')) {
			if((v_dd(self, 'date', '', '', isRequiredRow) > 0) !== true && returnMessages.length == 0) {
				returnMessages.push("<p>Bad date</p>");
				validates = false;
			}
		}
		if (row.hasClass('dateOfBirth')) {
			var v = v_dd(self, 'dateOfBirth', '', '', isRequiredRow);

			if (v === 0 && returnMessages.length == 0) { 				// v returns as 0 if the values are not a proper Date
				validates = false;
				if ($(els[0]).attr('value') != '' && $(els[0]).attr('value') != DOB_MESSAGE){
					returnMessages.push( ERROR_MESSAGES[ $(els[0]).attr('id') + ':a'] );	// push Generic Error for Date
				}else {
					returnMessages.push( g_es(self) );	// push Generic Error for Date
				}
			} else if (v < 0 && returnMessages.length == 0) { 			// v returns as -1 if the values do not pass additional class specific validation
				validates = false;
				returnMessages.push( ERROR_MESSAGES[ $(els[0]).attr('id') + ':b'] ); 	// push Specific Date of Birth Error
			} 
		}
		if (row.hasClass('ydob')) {
			if(typeof window.ydob == 'function') {
				var result = ydob(row);
				if (result !== true  && returnMessages.length == 0) {
					validates = false;
					returnMessages.push( BAD_YOUNGEST_DRIVER ); 	// push Specific Date of Birth Error
				}
			}
		}

		if (row.hasClass('datecoverstart')) {
			var v = v_dd(self, 'dateCoverStart', '>=', MIN_DATE_COVER_START, isRequiredRow);
			// v returns as 0 if the values are not a proper Date
			if (v === 0 && returnMessages.length == 0) {
				validates = false;
				returnMessages.push( ERROR_MESSAGES[ $(els[0]).attr('id') + ':a'] );	// push Generic Error for Date
			}else if (v === 2 && returnMessages.length == 1){
				// fix for bug 546
				// here we have an invalid date; replace generic error for field incompleted with invalid date 
				returnMessages = [ ]; 
				validates = false;
				returnMessages.push( ERROR_MESSAGES[ $(els[0]).attr('id') + ':a'] );	// push Generic Error for Date
			}else{
				// here we have a valid date
				if (v < 0 && returnMessages.length == 0) {
					// v returns as -1 if the cover start date is less than MIN_DATE_COVER_START
					validates = false;
					returnMessages.push( ERROR_MESSAGES[ $(els[0]).attr('id') + ':b'] );
				}else{
					// the date is valid so, lets test if the date is lower than the MAX_DATE_COVER_START
					v = v_dd(self, 'dateCoverStart', '<', MAX_DATE_COVER_START-1, isRequiredRow);
					if (v < 0 && returnMessages.length == 0){
						returnMessages.push( ERROR_MESSAGES[ $(els[0]).attr('id') + ':c'] );
						validates = false;
					}
				}
			}
		}

		if (row.hasClass('datefuture')) {
			var v = v_dd(self, 'datefuture', '>=', 0, isRequiredRow);
			// v returns as 0 if the values are not a proper Date
			if (v === 0 && returnMessages.length == 0 && row.hasClass('required')) {
				validates = false;
				returnMessages.push( ERROR_MESSAGES[ $(els[0]).attr('id') + ':a'] );	// push Generic Error for Date
			}else{
				// here we have a valid date
				if (v < 0 && returnMessages.length == 0) {
					// v returns as -1 if the date is less than today
					validates = false;
					returnMessages.push( ERROR_MESSAGES[ $(els[0]).attr('id') + ':b'] );
				}
			}
		}

		if (row.hasClass('datepast')) {
			var v = v_dd(self, 'datepast', '<=', 0, isRequiredRow);
			// v returns as 0 if the values are not a proper Date
			if (v === 0 && returnMessages.length == 0 && row.hasClass('required')) {
				validates = false;
				returnMessages.push( ERROR_MESSAGES[ $(els[0]).attr('id') + ':a'] );	// push Generic Error for Date
			}else{
				// here we have a valid date
				if (v < 0 && returnMessages.length == 0) {
					// v returns as -1 if the date is less than today
					validates = false;
					returnMessages.push( ERROR_MESSAGES[ $(els[0]).attr('id') + ':b'] );
				}
			}
		}

		if (row.hasClass('datetoday')) {
			var v = v_dd(self, 'dateToday', '', 0, isRequiredRow);
			// v returns as 0 if the values are not a proper Date
			if (v === 0 && returnMessages.length == 0 && row.hasClass('required')) {
				validates = false;
				returnMessages.push( ERROR_MESSAGES[ $(els[0]).attr('id') + ':a'] );	// push Generic Error for Date
			}else{
				// here we have a valid date
				if (v < 0 && returnMessages.length == 0) {
					// v returns as -1 if the date is less than today
					validates = false;
					returnMessages.push( ERROR_MESSAGES[ $(els[0]).attr('id') + ':b'] );
				}else{
					// the date is valid so, lets test if the date is lower than the MAX_DATE_COVER_START
					v = v_dd(self, 'dateCoverStart', '<', MAX_DATE_COVER_START, isRequiredRow);
					if (v < 0 && returnMessages.length == 0){
						returnMessages.push( ERROR_MESSAGES[ $(els[0]).attr('id') + ':c'] );
						validates = false;
					}
				}
			}
		}

		if (row.hasClass('residency')) {
			validates = true;
			var input = row.find('input[type=checkbox]');
			var selects = row.find('select');
			if (! input.attr('checked')) {
				override = false;

				var currentTime = new Date()
				var month = currentTime.getMonth() + 1;
				var year = currentTime.getFullYear();

				var mdd = $(selects[0]).val();
				var ydd = $(selects[1]).val();

				validates =
				(
					parseInt(ydd, 10) > 0 && parseInt(mdd, 10) > 0
					&&
					parseInt(ydd + '' + (parseInt(mdd, 10) < 10 ? '0' : '') + parseInt(mdd, 10), 10)
					<=
					parseInt(year + '' + (parseInt(month, 10) < 10 ? '0' : '') + parseInt(month, 10), 10)
				);
				if (!validates) {
					if (returnMessages.length == 0){
						if(!parseInt(ydd, 10) > 0 && !parseInt(mdd, 10) > 0)
							returnMessages.push( ERROR_MESSAGES[ $(els[0]).attr('id') + ':c'] );
						else if(!parseInt(mdd, 10) > 0)
							returnMessages.push( ERROR_MESSAGES[ $(els[0]).attr('id') + ':a'] );
						else if(!parseInt(ydd, 10) > 0)
							returnMessages.push( ERROR_MESSAGES[ $(els[0]).attr('id') + ':b'] );
						else returnMessages.push( ERROR_MESSAGES[ $(els[0]).attr('id') + ':d'] );
					}
				}
			}

		}

		if (row.hasClass('dateconviction')) {
			if (! row.prev('li').find('input[type=checkbox]').attr('checked')) {
				
				var selects = row.parents('li:first').find('select');
				
				if ($.trim($(selects[0]).val()) == '' &&
							$.trim($(selects[1]).val()) == '' &&
							$.trim($(selects[2]).val()) == '' &&
							returnMessages.length == 0) {
					
						validates = false;
						returnMessages.push( ERROR_MESSAGES[$(els[0]).attr('id') + ':e'] );					
			 	} else  if (returnMessages.length == 0){ 
					var v = v_dd(self, 'dateclaimconviction', '', 0, isRequiredRow);
					// Conviction must be in the past OR pending checked
					if (v === 0 && returnMessages.length == 0) {
						// Here the data was not a valid date
						validates = false;						
						if (ERROR_MESSAGES[ $(els[0]).attr('id') + ':a'])
						returnMessages.push( ERROR_MESSAGES[ $(els[0]).attr('id') + ':a'] );	// push Generic Error for Date
						else
							returnMessages.push( ERROR_MESSAGES['BAD_CONVICTION_DATE:a'] );	// push Generic Error for Date
					}else if (v < 0 && returnMessages.length == 0) {
						// v returns as -2 if the claim date is valid, but past 'x' years
						validates = false;						
						if(v == -2) {
							if (ERROR_MESSAGES[ $(els[0]).attr('id') + ':c'])
							returnMessages.push( ERROR_MESSAGES[ $(els[0]).attr('id') + ':c'] );
							else
								returnMessages.push( ERROR_MESSAGES['BAD_CONVICTION_DATE:c'] );
						} else if (v == -3) {
							// v == -3 -> date is before the policy inception date (cover start date)
							if (BAD_CONVICTION_DATE_BEFORE_START) {
								returnMessages.push(BAD_CONVICTION_DATE_BEFORE_START);
							} else {
								returnMessages.push(ERROR_MESSAGES['BAD_CONVICTION_DATE:a']);
							}
						} else {
							// v returns as -1 if the claim date is valid, but for today or some future date
							if (ERROR_MESSAGES[ $(els[0]).attr('id') + ':b'])
							returnMessages.push( ERROR_MESSAGES[ $(els[0]).attr('id') + ':b'] );
							else
								returnMessages.push( ERROR_MESSAGES['BAD_CONVICTION_DATE:b'] );
						}
					}
			 	}
			}
		}

		if (row.hasClass('dateclaim')) {
			var selects = row.parents('li:first').find('select');
			
			if ($.trim($(selects[0]).val()) == '' &&
					$.trim($(selects[1]).val()) == '' &&
					$.trim($(selects[2]).val()) == '' &&
					returnMessages.length == 0) {
				validates = false;
				returnMessages.push( ERROR_MESSAGES[$(els[0]).attr('id') + ':e'] );					
			} else {			
				var v = v_dd(self, 'dateclaimconviction', '', 0, isRequiredRow);
				if (v === 0 && returnMessages.length == 0) {
					// Here the data was not a valid date
					validates = false;
					if(ERROR_MESSAGES[ $(els[0]).attr('id') + ':a'])
					returnMessages.push( ERROR_MESSAGES[ $(els[0]).attr('id') + ':a'] );	// push Generic Error for Date
					else
						returnMessages.push( ERROR_MESSAGES['BAD_CLAIM_DATE:a'] );	// push Generic Error for Date
				}else if (v < 0 && returnMessages.length == 0) {
					validates = false;
					if(v == -2) {
						// v returns as -2 if the claim date is valid, but past 'x' years
						if(ERROR_MESSAGES[ $(els[0]).attr('id') + ':c'])
						returnMessages.push( ERROR_MESSAGES[ $(els[0]).attr('id') + ':c'] );
						else
							returnMessages.push( ERROR_MESSAGES['BAD_CLAIM_DATE:c'] );
					} else if (v == -3) {
						// v == -3 -> date is before the policy inception date (cover start date)
						if (BAD_CLAIM_DATE_BEFORE_START) {
							returnMessages.push(BAD_CLAIM_DATE_BEFORE_START);
						} else {
							returnMessages.push(ERROR_MESSAGES['BAD_CLAIM_DATE:a']);
						}
					} else {
						// v returns as -1 if the claim date is valid, but for today or some future date
						if(ERROR_MESSAGES[ $(els[0]).attr('id') + ':b'])
						returnMessages.push( ERROR_MESSAGES[ $(els[0]).attr('id') + ':b'] );
						else
							returnMessages.push( ERROR_MESSAGES['BAD_CLAIM_DATE:b'] );
					}
				}
			}
		}

		if (row.hasClass('postcode')) {
			if (self.attr('type') == 'text') {
				if(!isRequiredRow && self.val() != "" || isRequiredRow){
				if (v_pc(self.val(), false)) {
					self.val(f_pc(self.val(), true));
				} else if (returnMessages.length == 0) {
					returnMessages.push( BAD_POSTCODE );
					validates = false;
				}
			}
		}
		}

		if (row.hasClass('numeric')) {
			if(!isRequiredRow && self.val() != "" || isRequiredRow){
			if (! v_nb(self.val()) && returnMessages.length == 0) {
				returnMessages.push( g_es(self) );
				validates = false;
			}
		}
		}
		if (row.hasClass('numericNotNegative')) {
			if(!isRequiredRow && self.val() != "" || isRequiredRow){
			if (! v_nb_nn(self.val()) && returnMessages.length == 0) {
				returnMessages.push( ERROR_MESSAGES[ $(els[0]).attr('id') + ':a']);
				validates = false;
				}
			}
		}
		if (row.hasClass('telno')) {
			if(!isRequiredRow && self.val() != "" || isRequiredRow){
				if (! v_tpn(self.val()) && returnMessages.length == 0) {
					returnMessages.push( BAD_PHONE_NUMBER );
					validates = false;
				}
			}
		}

		if (row.hasClass('decimal')) {
			if (! v_decimal(self.val()) && returnMessages.length == 0) {
				returnMessages.push( g_es(self) );
				validates = false;
			}
		}
		
		if (row.hasClass('numberplate')) {
			if (self.attr('type') == 'text') {
				if(!isRequiredRow && self.val() != "" || isRequiredRow){
				if (! v_np(self.val()) && returnMessages.length == 0) {
					returnMessages.push( BAD_NUMBER_PLATE );
					validates = false;
				}
			}
		}
		}

		if (row.hasClass('owned')) {
			var yearOfManufacture = self.parents('ul:first').find('li.year select');
			if (yearOfManufacture && !yearOfManufacture.parents('li:first').hasClass('skip')) {
				var now = new Date();
				if (! t_op(yearOfManufacture.val(), self.val())) {
					validates = false;
					returnMessages.push( BAD_VEHICLE_OWNED_PERIOD );
				}
			}
		}

		if (row.hasClass('password')) {
			if(!isRequiredRow && self.val() != "" || isRequiredRow){
			if(v_pw(self.val()) !== true && returnMessages.length == 0) {
				returnMessages.push( BAD_PASSWORD );
				validates =  false;
			}
		}
		}

		if (row.hasClass('passwordconfirm')) {
			if(v_cf(self, 'password', true) !== true && returnMessages.length == 0) {
				returnMessages.push( BAD_PASSWORD_CONFIRM );
				validates = false;
			}
		}

		if (row.hasClass('sortcode')) {
			if(!isRequiredRow && self.val() != "" || isRequiredRow){
			if(! /^[0-9][0-9]$/.test(self.val())) {
				if (returnMessages.length == 0)
					returnMessages.push( g_es(self) );
				validates = false;
			}
		}
		}
		
		if (row.hasClass('cardtype') && isRequiredRow) {
			if (els[i].value == ''  || els[i].value == 'Select a card') {
				validates = false;
				returnMessages = [BAD_CARD_TYPE];
			}
		}
		if (row.hasClass('cc') && isRequiredRow) {
			var cardType = $('li.cardtype:first select');
			if (cardType.length > 0 && cardType.val() != ''  && cardType.val() != 'Select a card') {
				if (! validCard(els[i].value, cardType.val())) {
					validates = false;
					returnMessages = [BAD_CARD_NUMBER];
				}
			} else {
				returnMessages = [BAD_CARD_TYPE];
			}
		}
		if (row.hasClass('cvv') && isRequiredRow) {
			if (! /^([0-9])+$/.test(els[i].value) || els[i].value.length < 3) {
				validates = false;
				returnMessages = [BAD_SECURITY_NUMBER];
			}
		}

		if (!ignoreRelated && row.hasClass('orrelated')) {
			var relatedIDs = [];
			relatedIDs = fmr(relatedIDs, self.attr('id'));
			n = vrid(relatedIDs);
			validates = (n > 0);
			if(validates){
				h(h_ok, relatedIDs);
			}else{
				h2(relatedIDs);
			}
		}

	};

	if (override) validates = true;
	
	/*
	Use classes 
		afterValid:functionName
		afterInvalid:functionName		
	to run functions after validation.
	
	Put your page specific functions in the page specific JS file
	These functions can return a Boolean or the error message string.
	*/
	if (! ignoreRelated) {
	
	var rowClasses = $.trim(row.attr('class')).split(' ');
			
	if(validates)
		var regex = /afterValid:/;
	else
		var regex = /afterInvalid:/;
		
	for(var i = 0; i < rowClasses.length; i++){
		var theClass = rowClasses[i];
		var theFunction = theClass.replace(regex, '');
		if(theClass != theFunction) {
			var result;
			
			var fn = window[theFunction];
			if (typeof fn === 'function')
				result = fn();
			if (result === true)
				validates = true;
			else if (result === false)
				validates = false;
				else if (typeof result == "string") {
					if (regex == "/afterValid:/" && returnMessages.length == 0) {
				returnMessages.push(result);
					} else if(regex == "/afterInvalid:/") {
						returnMessages[0] = result;
					}
				validates = false;
			}
			}
		}
	}
	
	if(!validates)
		return returnMessages;
	return true;
}

/*
* h2 calls function vtc looping through the arrayIDs
*/
var h2 = function(arrayIDs){
	for(var key in arrayIDs){
		vtc($('#' + key).parents('li:first'), false, true);
	}
}

/*
* h calls function f looping through the arrayIDs
*/
var h = function(f, arrayIDs){
	for(var key in arrayIDs){
		f($('#' + key).parents('li:first'));
	}
}
// findMyRelated >> fmr
var fmr = function(relatedIDs, id){
	relatedIDs[id] = true;
	var next_id = VALIDATION_GROUPS[id];
	// we don't want to add ids already in the array.
	if(!relatedIDs[next_id])
		return fmr(relatedIDs, next_id);
	return relatedIDs;
}
// validRelatedIds >> vrid
var vrid = function(relatedIDs){
	for(var key in relatedIDs){
		if($("#" + key).val() != 'None' && $("#" + key).val() != '')
			return true;
	}
	return false;
}
// getErrorString >> g_es
var g_es = function(element) {
	var label = element.parents('.rightCol').siblings('.leftCol').find('label, p.label');
	return GENERIC_ERROR.replace('%s', label.html().replace(/([': *'|:])+$/,''));
}


$(window).ready(function(){
	$(".confirmemail input[type=text]").bind("paste", function(e){
		e.preventDefault();
	});

});