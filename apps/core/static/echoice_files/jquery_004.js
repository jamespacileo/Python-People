jQuery.fn.autocomplete = function(url, settings )
{
	return this.each( function()//do it for each matched element
	{
		//Ensure the suggest list is in the correct position
		var parentDiv = $(this).parents('div')[0];

		var isIE = (navigator.userAgent.indexOf('MSIE') != -1);
		if(!isIE) {
			// When an error appears in the first occupation field the second occupation input does not move down straight away
			// - However, by using 'relative' we can position the auto complete popup with more precision
			$(parentDiv).css({position: 'relative'});
		}
		
		//This is the filter text input field
		var textInput = $(this);
		//This is the hidden field
		var hiddenId = '#' + $(this).attr('id').replace('.filter', '').replace(/\./g, '\\.').replace(/\[/g,'\\[').replace(/\]/g,'\\]');
		var valueInput = $(hiddenId);
				
		//create the ul that will hold the text and values
		var autoCompleteID = $(this).attr('id').replace(/\./g, '') + 'AC';
		valueInput.after('<ul class="autocomplete" id="' + autoCompleteID + '"></ul>');
		var list = valueInput.next().css({width: (parseInt(textInput.width(), 10) + parseInt($(this).css('paddingRight').replace('.px', ''), 10))});
		var typingTimeout;
		var size = 0;
		var selected = -1;
		var cache = {};  //searchKey : itemsMap
		var inProgress = false;
		var text = '';
		var matches = 0;
		var lastSetOfDataKeys = new Array(), lastSetOfDataValues = new Array(), lastSetOfDataValuesLower = new Array();
		var delayedHideTimer = null;
		
		settings = jQuery.extend(//provide default settings
		{
			maxResults : 20,
			minChars : 1,
			timeout: 1,
			after : null,
			before : null,
			validSelection : true,
			parameters : {'inputName' : valueInput.attr('name'), 'inputId' : textInput.attr('id')},
			defaultString: ((typeof(window['AUTOCOMPLETE_MESSAGE'])!="undefined")?AUTOCOMPLETE_MESSAGE:'') // Set this global variable if you have separate JavaScript controlling a default message for the field
		} , settings);
				
		function getData(showAll)
		{
			if(arguments.length == 0  ||  showAll !== true) {
				// Make sure the variable is initialised if not provided
				showAll = false;
			}
			text = textInput.val();
			window.clearInterval(typingTimeout);
			if (settings.minChars != null && text.length >= settings.minChars)
			{
				clearAndHide();
				if (settings.before == "function") 
				{
					settings.before(textInput,text);
				}
				textInput.addClass('autocomplete-loading');
				settings.parameters.filterChars = text.substring(0, settings.minChars);
				
				var data = getDataFromCache(text);
				if (data != null && data.items.length > 0 && data.items[0] != '') {
					handleResponse(data, null, showAll);
				} else {
					if(!inProgress) {
						var ajaxValue = text;
						inProgress=true;
						$.getJSON(url,settings.parameters, function(data)
							{
								handleResponse(data, ajaxValue, showAll);
							});
					}
				}
			}
		}
		
		/**
		 * @param data - JSON object data
		 * @param ajaxValue - the search value which the ajax call was made with, 
		 * 					  ajaxValue should be populated when the handleResponse is called from the ajax callback
		 */
		function handleResponse(data, ajaxValue, showAll)
		{
			inProgress = false;
			matches = 0;
			var items = '';

			if(arguments.length < 3  ||  showAll !== true) {
				// Make sure the variable is initialised if not provided
				showAll = false;
			}

			//Check if the text has been changed while ajax was running
			if(ajaxValue != null && text.substr(0,3) != ajaxValue.substr(0,3)) {
				//if the text has been changed then trigger a new ajax call
				getData();
				return false;
			}
			
			lastSetOfDataKeys = new Array(), lastSetOfDataValues = new Array(), lastSetOfDataValuesLower = new Array();
			if (data)
			{
				size = data.items.length;
				for (i = 0; i < data.items.length; i++)//iterate over all options
				{
				  var item = data.items[i];
					  
				  if(item != null) {
					  if (item.decode.toLowerCase().indexOf(text.toLowerCase()) >= 0) { 
						  items += createItem(item, "");
						  lastSetOfDataKeys[i] = item.code;
						  lastSetOfDataValues[i] = item.decode;
						  lastSetOfDataValuesLower[i] = item.decode.toLowerCase();
						  matches++;
					  }
					  
					  if (matches >= settings.maxResults  &&  !showAll) {
						  break;
					  }
				  }
				}
				
				if (matches == 0) {
					list.html(createItem(null, "No results found"));
				} else {
					list.html(items);
					//on mouse hover over elements set selected class and on click set the selected value and close list
					list.children().
					  hover(
						  function() { 
							  $(this).addClass("selected").siblings().removeClass("selected");
						  }, 
						  function() { 
							  $(this).removeClass("selected");
						  } ).click(
								  function () {
									  textInput.val( $(this).text() ); 
									  valueInput.val( $(this).attr('code') );

									  // Trigger any validation associated with the input 
									  textInput.triggerHandler('blur');

									  clearAndHide(); 
								  });

					if (matches >= settings.maxResults  &&  !showAll) { 
						list.append(createItem(null, 'Showing ' + settings.maxResults + ' of ' + data.items.length + ' results...<br /><a href="#" id="getAllAC" title="Show all results">Show all</a>'));
						list.find('#getAllAC').click(function(e) {
							getData(true);
							e.preventDefault();
						});
					}
				}

				// There is a delayed 'hide' set-up, so make sure we do not hide the list after updating it
				clearTimeout(delayedHideTimer);

				list.show();

				if (ajaxValue != null) {
					pushIntoCache(ajaxValue, data);
				}
				
				if (settings.after == "function") 
				{
					settings.after(textInput,text);
				}
			}
			textInput.removeClass('autocomplete-loading');
		}

		function createItem(item, lastItem) {
			var itemHtml = '';
			if (lastItem == '') {
				itemHtml = '<li code="' + item.code + '">' + item.decode.replace(new RegExp("(" + text + ")","i"),"<strong>$1</strong>") + '</li>';
				// Reverse the bolding (rough mock-up)
				//items += '<li code="' + item.code + '">' + (item.decode.replace(new RegExp("(" + text + ")","i"),"</strong>$1<strong>") + '</strong>').replace('<strong></strong>', '') + '</li>';
			} else {
				itemHtml = '<li style="cursor: default" code=""><em>' + lastItem + '</em></li>';	
			}
			return itemHtml;
		}
		
		function pushIntoCache(text, data)
		{
			var key = text.substring(0,settings.minChars).toLowerCase();
			cache[key] = data;
		}
		
		function getDataFromCache(text)
		{
			var key = text.substring(0, settings.minChars).toLowerCase();			
			return cache[key];
		}
		
		function clear()
		{
			size = 0;
			selected = -1;
		}	
		
		function clearAndHide()
		{
			list.hide();
			clear();
		}	
		
		textInput.focus(function()
		{
			clearAndHide();
			if(isIE) {
				// IE6 cannot position layers on top of drop-downs so we show the popup to the right of the field
				list.css({top: textInput.offset().top + textInput.outerHeight(), left: textInput.offset().left});
			} else {
				list.css({left: 0, top: textInput.outerHeight()});
			}
			getData();
		}).blur(function()
		{
		    //set selected item and input values
			if (selected != -1)
			{
				textInput.val(list.find('.selected').text());
				valueInput.val(list.find('.selected').attr('code'));
				clearAndHide();
			} else {

				// This is the point where we need to see if the input contains a valid entry
				// - For example, such as if the user typed the entire phrase
				var itemSelected = list.find('.selected').attr('code');
				var textEntered = textInput.val();
				if(itemSelected != ''  &&  itemSelected != null) {
					valueInput.val(itemSelected);
				} else if(textEntered != ''  &&  textEntered != settings.defaultString) {
					// Check to see if the text entered actually exists in the last set of data we have available
					var idx = jQuery.inArray(textEntered.toLowerCase(), lastSetOfDataValuesLower);
					if(idx != -1) {
						textInput.val(lastSetOfDataValues[idx]);
						valueInput.val(lastSetOfDataKeys[idx]);
					} else {
						valueInput.val('');
					}
				} else {
					// Clear the hidden variable, which in turn should produce an error
					valueInput.val('');
				}

				// Trigger any validation associated with the input (we must use the hidden variable)
				valueInput.triggerHandler('blur');
				
				// We cannot use the 'clearAndHide()' function immediately because the user will not be able to select an item
				// We use the ID of the element and handle manual hide
				clear();
				delayedHideTimer = setTimeout("$('#" + autoCompleteID + "').hide();", 100);
			}
		});
		
		textInput.keydown(function(e){
			if(e.which == 13) {//enter
				e.preventDefault();
				e.stopImmediatePropagation();
				e.stopPropagation();
				return false;
			}
		});
		
		textInput.keyup(function(e) 
		{
			window.clearInterval(typingTimeout);
			if(e.which == 27)//escape
			{
				clearAndHide();
			} 
			else if (e.which == 46 || e.which == 8)//delete and backspace 
			{
				if (textInput.val().length < settings.minChars) {
					clearAndHide();
					//invalidate previous selection
					//if (settings.validSelection) valueInput.val('');
				} else {
					getData();
				}
			}
			else if(e.which == 13)//enter 
			{ 
				if ( list.css("display") == "none" && textInput.val().length >= settings.minChars ) //if the list is not visible then make a new request, otherwise hide the list
				{ 
					getData();
				} else if (list.css("display") != "none")
				{
					if (selected > -1) {
					    //set selected item and input values
					    textInput.val(list.find('.selected').text());	        
					    valueInput.val(list.find('.selected').attr('code'));
					}
					clearAndHide();
				}
				e.preventDefault();
				e.stopImmediatePropagation();
				e.stopPropagation();
				return false;
			}
			else if(e.which == 40 || e.which == 9 || e.which == 38)//move up, tab, down 
			{
				var upDownSize = matches > settings.maxResults ? settings.maxResults : matches;
				switch(e.which) 
				{
					case 40:
						selected = selected >= upDownSize - 1 ? 0 : selected + 1; break;
					case 9:
					  break;
					case 38:
						selected = selected <= 0 ? upDownSize - 1 : selected - 1; break;
					default: break;
				}
			  //set selected item and input values
			  if ( list.css("display") != "none")
			  {
				  textInput.val( list.children().removeClass('selected').eq(selected).addClass('selected').text() );
				  valueInput.val( list.children().eq(selected).attr('code') );
			  }
			} else 
			{ 
				//invalidate previous selection
				if (settings.validSelection) valueInput.val('');
				typingTimeout = window.setTimeout(function() { getData() },settings.timeout);
			}
		});
	});
};