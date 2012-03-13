
/* function getCardType >> assumes that a form with a required credit card field also has a dropdown list with card types. Returns the value of the select.
*	@param element (DOM element)
*/
// getCardType >> g_ct
var g_ct = function(element) {
	// TODO - put the corect name in the Css Selector below
	return element.parents('form').find('select[name=]').val();
}

/* function validName >> returns true if string looks like a name, otherwise false
*	@param string (String)
*/
// validName >> vn
var v_n = function(string) {
	return /^([a-zA-Z. '\-])+$/.test(string);
}
// testOwnedPerdiod >> t_op
var t_op = function(yearofManufacture, string) {
	var owned = 0;
	var now = new Date();
	switch (string) {
		case 'Not yet bought or less than 6 months':
			owned = 0;
			break;
		case '7-12 months':
			owned = 0.5;
			break;
		case '1 year':
			owned = 1;
			break;
		case '2 years':
			owned = 2;
			break;
		case '3 years':
			owned = 3;
			break;
		case '4 years':
			owned = 4;
			break;
		case '5 years or more':
			owned = 5;
			break;
	}
	// TEMP - To allow successful validation
	return true;
	return yearofManufacture <= (now.getFullYear() - owned);
 }

// validPostcodeArray >> v_pca
var v_pca = function() {
  // Array holds the regular expressions for the valid postcodes
	var pcexp = new Array();
  // Permitted letters depend upon their position in the postcode
	var alpha1 = '[abcdefghijklmnoprstuwyz]';  // Character 1
	var alpha2 = '[abcdefghklmnopqrstuvwxy]';  // Character 2
	var alpha3 = '[abcdefghjkstuw]';           // Character 3
	var alpha4 = '[abehmnprvwxy]';             // Character 4
	var alpha5 = '[abdefghjlnpqrstuwxyz]';     // Character 5
  // Expression for postcodes: AN NAA, ANN NAA, AAN NAA, and AANN NAA
	pcexp.push(new RegExp("^(" + alpha1 + "{1}" + alpha2 + "?[0-9]{1,2})(\\s*)([0-9]{1}" + alpha5 + "{2})$","i"));
  // Expression for postcodes: ANA NAA
	pcexp.push(new RegExp("^(" + alpha1 + "{1}[0-9]{1}" + alpha3 + "{1})(\\s*)([0-9]{1}" + alpha5 + "{2})$","i"));
  // Expression for postcodes: AANA  NAA
	pcexp.push(new RegExp("^(" + alpha1 + "{1}" + alpha2 + "?[0-9]{1}" + alpha4 +"{1})(\\s*)([0-9]{1}" + alpha5 + "{2})$","i"));
  // Exception for the special postcode GIR 0AA
	pcexp.push(/^(GIR)(\s*)(0AA)$/i);
  // Standard BFPO numbers
	pcexp.push(/^(bfpo)(\s*)([0-9]{1,4})$/i);
  // c/o BFPO numbers
	pcexp.push(/^(bfpo)(\s*)(c\/o\s*[0-9]{1,3})$/i);
  // Return the array
	return pcexp;
}

/* function v_pc >> returns true if string looks like a postcode, otherwise false
*	@param string (String)
	@param optional (*)
*/
// v_pc >> v_pc
var v_pc = function(string, optional) {
  // Is the input empty?
  	if(string == '')
		return optional;

  // Array holds the regular expressions for the valid postcodes
	var pcexp = v_pca();
  // Check the string against the types of post codes
	for(var i=0; i<pcexp.length; i++) {
		if(!pcexp[i].test(string)) {
			continue;
		}
	   // The post code is valid
		return true;
	}
  // Fall-back to an error
	return false;
}
// 
var f_pc = function(string, skipvalidation) {
	if( (skipvalidation)  ||  v_pc(string, false) ) {
	  // Array holds the regular expressions for the valid postcodes
		var pcexp = v_pca();
	  // Check the string against the types of post codes
		for(var i=0; i<pcexp.length; i++) {
			if(!pcexp[i].test(string)) {
				continue;
			}
		   // Split the post code into component parts
			pcexp[i].exec(string);
		  // Copy it back into the original string, converting it to uppercase and inserting a space between the inward and outward codes
			string = RegExp.$1.toUpperCase() + " " + RegExp.$3.toUpperCase();
		  // If it is a BFPO c/o type postcode, tidy up the "c/o" part
			string = string.replace(/C\/O\s*/, "c/o ");
		  // Load new postcode back into the form element
			return string;
		}
	}

  // A valid postcode was not supplied
	return val;
}

/* function v_dtDropdowns >> returns true if values of dropdown dates represent a valid date, otherwise false
*	@param element (DOM element)
*/
// v_dtDropdowns >> v_dd
var v_dd = function(element, className, operation, valueToCompare, required) {
	if(required == 'undefined') required = true;

	var selects = element.parents('li:first').find('select');
	if (selects.length == 3) {
		// For full dates
		var dd = parseInt($(selects[0]).val(),10);
		var mm = parseInt($(selects[1]).val(),10);
		var yyyy = parseInt($(selects[2]).val(),10);
	} else if(selects.length == 2 && className == 'dateCoverStart') {
		var dd = parseInt($(selects[0]).val(),10);
		var mm = parseInt($(selects[1]).val(),10);
		var yyyy = (new Date()).getFullYear();
		if(dd + mm == 0) yyyy = 0;
	} else if (selects.length == 2) {
		// For Valid From / Expiry Dates
		var dd = 1;
		var mm = parseInt($(selects[0]).val(),10);
		var yyyy = parseInt($(selects[1]).val(),10);
		if(mm + yyyy == 0) dd = 0;
	} else {
		// validate input
		var inputs = element.parents('li:first').find('input[type=text]');
		
		if (inputs.length == 1)
			return v_dti(inputs[0], className, operation, valueToCompare, required);
		return false;
	}
	if(dd+mm+yyyy == 0 && !required) return 1;
	return v_dt(dd,mm,yyyy, className, operation, valueToCompare);
}

/* function validDate >> returns true if date is valid, otherwise false
*	@param dd (Int)
*	@param mm (Int)
*	@param yyyy (Int)
*/
// validTelephone >> v_tpn
var v_tpn = function(string) {
	// valid date
	var clean_string = string.replace(/ /g, "");
	return (
		/^(\+|00)?([0-9]{2})?([(]{1}[0-9]{1}[)]{1})?([0-9]+)$/i .test(clean_string) && clean_string.length <= 10
	);
}
// validDateInput >> v_dti
var v_dti = function(input, className, operator, valueToCompare, required) {
	// valid date
	var val = $(input).val().replace(/[-.\/]/g, '');

	if(val.replace(/[^0-9]/, '').length == 0 && !required) return 1;

	if(val.length != 8 || val != val.replace(/[^0-9]/, '')){
		return 0;
	}else{
		// so we have 8 numbers...
		var dd = val.substring(0,2);
		var mm = val.substring(2,4);
		var yyyy = val.substring(4);
		$(input).val(dd+'/'+mm+'/'+yyyy);
		return v_dt(dd, mm, yyyy, className, operator, valueToCompare);
	}
}

/* function validDate >> returns true if date is valid, otherwise false
*	@param dd (Int)
*	@param mm (Int)
*	@param yyyy (Int)
*/
// validDate >> v_dt
var v_dt = function(dd, mm, yyyy, className, operator, valueToCompare) {
	validates = 1;
	// valid date
	if (isNaN(dd) || isNaN(mm) || isNaN(yyyy)) { validates = 0; }
	if ((dd < 1 || dd > 31) || (mm < 1 || mm > 12)) { validates = 0; }
	if (dd > 30 && $.inArray(parseInt(mm, 10), [2,4,6,9,11]) >= 0) { validates = 0; }
	if (dd >= 30 && mm == 2) { validates = 0; }
	if (dd >= 29 && mm == 2) {
		if (new Date(yyyy,1,parseInt(dd, 10)).getDate() != 29) { validates = 0; } // Leap year check
	}

	// fix for bug 546
	if (className == "dateCoverStart"){
		if (
				( isNaN(dd) && !isNaN(mm) && !isNaN(yyyy)) ||
				(!isNaN(dd) &&  isNaN(mm) && !isNaN(yyyy)) ||
				(!isNaN(dd) && !isNaN(mm) &&  isNaN(yyyy)) ||
				( isNaN(dd) &&  isNaN(mm) && !isNaN(yyyy)) ||
				( isNaN(dd) && !isNaN(mm) &&  isNaN(yyyy)) ||
				(!isNaN(dd) &&  isNaN(mm) &&  isNaN(yyyy)) 
		) { validates = 2; }
	}

	
	if(validates == 1){

		var mToYr = 31557600000;
		var mToDy = 86400000;

		switch(className) {
			case "dateOfBirth":
				var now = new Date();
				var d = new Date(yyyy, (mm - 1), dd);
				var diff = (now.getTime() / mToYr) - (d.getTime() / mToYr);

				if (Math.floor(diff) < MIN_AGE || Math.floor(diff) > (MAX_AGE - 1))
					validates = -1;

				break;
			case "dateCoverStart":
			case "datefuture":
			case "datepast":
				// calculate difference
				var now = new Date();
				var d = new Date(yyyy, (mm - 1), dd);
				var diff = parseInt((d.getTime() / mToDy) - Math.floor(now.getTime() / mToDy));
				// if difference signal valueToCompare
				if (! eval(diff + ' ' + operator + ' + parseInt(' + valueToCompare + ');')) {
					validates = -1;
				}
				break;
			case "dateToday":
				// calculate difference
				var now = new Date();
				var d = new Date(yyyy, (mm - 1), dd);
				var diff = (d.getTime() / mToDy) - Math.floor(now.getTime() / mToDy);
				// if difference signal valueToCompare
				if (diff <= -1) {
					validates = -1;
				}
				break;
			case 'dateclaimconviction':
				if (typeof coverStartDate !== 'undefined') {
					// test the date when the user 
					if (yyyy < coverStartDate.year) {
						validates = -3;
					} else if (yyyy == coverStartDate.year) {
						if (mm < coverStartDate.month) {
							validates = -3;
						} else if (mm == coverStartDate.month) {
							if (dd < coverStartDate.day) {
								validates = -3;
							}
						}
					}
					
				} else {
					var d = new Date(yyyy, (mm - 1), dd);
					var now = new Date();
					var yearDiff = (now.getFullYear() - d.getFullYear());
					if(yearDiff > CLAIM_AND_CONVICTION_PAST_YEARS) {
						validates = -2;
					} else if(yearDiff == CLAIM_AND_CONVICTION_PAST_YEARS) {
						var monthDiff = (now.getMonth() - d.getMonth());
						if(monthDiff > 0) {
							validates = -2;
						} else if(monthDiff == 0) {
							var dayDiff = (now.getDate() - d.getDate());
							if(dayDiff > 0) {
								validates = -2;
							}
						}
					}
				}
				// No BREAK here because we also want the validation below to trigger
			case 'datepast':
				var now = new Date();
				var d = new Date(yyyy, (mm - 1), dd);
				var diff = (d.getTime() / mToDy) - Math.floor(now.getTime() / mToDy);

				if (diff > 0)
					validates = -1;
				break;
		}
	}
	return validates;
}

/* function validEmail >> returns true if string follows a valid email structure, otherwise false
*	@param string (String)
*/
// validEmail >> v_em
var v_em = function(string) {
	return /^(([\w-\s(\+)*]+(\+)*)|([\w-(\+)*]+(\+)*(?:\.[\w-(\+)*]+)*(\+)*)|([\w-\s(\+)*]+(\+)*)([\w-(\+)*]+(\+)*(?:\.[\w-(\+)*]+(\+)*)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i .test(string);
}
/* function validConfirm >> returns true if input's value matches an immediately previous field (matched on the cssSelector), otherwise false
*	@param string (String)
*	@param cssSelector (String)
*	@param caseSensitive (Boolean)
*/
// validConfirm >> v_cf
var v_cf = function(element, cssSelector, caseSensitive) {
	var originalElement = element.parents('li:first').prev('li.' + cssSelector);
	if (originalElement) {
		if (! caseSensitive && originalElement.find('.rightCol input').val().toLowerCase() == element.val().toLowerCase()) {
			return true;
		} else if (originalElement.find('.rightCol input').val() == element.val()) {
			return true;
		}
	}
	return false;
}

/* function validNumberPlate >> returns true if string represents a valid number plate, otherwise false
*	@param string (String)
*/
// validNumberPlate >> v_np
var v_np = function(string) {
	return /^([0-9 A-Za-z])+$/.test(string) && trim(string) != "";
}
/* function v_pw >> returns true if string represents a valid number password, otherwise false
*	@param string (String)
*/
// v_pw >> v_pw
var v_pw = function(string) {
	return (/^([0-9A-Za-z])+$/.test(string) && string.length >= MIN_PASSWORD_LENGTH && string.length <= MAX_PASSWORD_LENGTH);
}


/* function validNumber >> returns true if string represents a valid number, otherwise false
*	@param string (String)
*/
// validNumber >> v_nb
var v_nb = function(string) {
	return /^([0-9.-])+$/.test(string);
}

/* function validDecimal >> returns true if string represents a valid decimal, otherwise false
*	@param string (String)
*/
// validDecimal >> v_decimal
var v_decimal = function(string) {
	return /^[\d]+\.?\d{0,2}$/.test(string);
}

/**
 * no negative numbers
 * @param string
 * @return
 */
var v_nb_nn = function(string) {
	return /^([0-9])+$/.test(string);
}

/* function validCard >> returns true if string represents a valid card number, otherwise false
*	@param no (String)
*	@param type (String)
*/
function validCard(no, type) {
  var isValid = false;
  var ccCheckRegExp = /[^\d ]/;
  isValid = !ccCheckRegExp.test(no);

  if (isValid) {
	var cardNumbersOnly = no.replace(/ /g,"");
	var cardNumberLength = cardNumbersOnly.length;
	var lengthIsValid = false, prefixIsValid = false, prefixRegExp;

	switch(type) {
		case _MASTERCARD:
		lengthIsValid = (cardNumberLength == 16);
		prefixRegExp = /^5[1-5]/;
		break;
	case _VISA:
		lengthIsValid = (cardNumberLength == 16 || cardNumberLength == 13);
		prefixRegExp = /^4/;
		break;
	case _MAESTRO:
		lengthIsValid = (cardNumberLength >= 15 && cardNumberLength <= 19);
		prefixRegExp = /^(50(18|20|38))|(6304)|(67(59|61|63))/;
		break;
	default:
		prefixRegExp = /^$/;
		// Error
	}
	prefixIsValid = prefixRegExp.test(cardNumbersOnly);
	isValid = prefixIsValid && lengthIsValid;
	}
	if (isValid) {
		var numberProduct;
		var numberProductDigitIndex;
		var checkSumTotal = 0;

		for (digitCounter = cardNumberLength - 1; digitCounter >= 0; digitCounter--) {
			checkSumTotal += parseInt (cardNumbersOnly.charAt(digitCounter));
			digitCounter--;
			numberProduct = String((cardNumbersOnly.charAt(digitCounter) * 2));
			for (var productDigitCounter = 0; productDigitCounter < numberProduct.length; productDigitCounter++) {
				checkSumTotal += parseInt(numberProduct.charAt(productDigitCounter));
			}
		}
		isValid = (checkSumTotal % 10 == 0);
	}
	return isValid;
}

function updateBirthdayErrorMessage(errorMsg){
	if (MIN_AGE != null && MIN_AGE > 0 && MAX_AGE != null && MAX_AGE > 0){
		errorMsg = errorMsg.replace(MIN_AGE_REPLACE, MIN_AGE);
		errorMsg = errorMsg.replace(MAX_AGE_REPLACE, MAX_AGE-1);	
	}
	return errorMsg;	
}