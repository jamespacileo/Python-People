var LOADING_LAYOUT = {
	fill : '#FAFAF7',
	width : 420,
	height : 300,
	cornerRadius : 10,
	strokeWidth : 3,
	trigger : 'none', // we want to close it programmatically
	strokeStyle : '#B40084', // change it according to the product colour
	overlay : true,
	shadow : false,
	shadowOverlap : false,
	noShadowOpts : {
		strokeStyle : '#B40084',
		strokeWidth : 0
	},
	spikeLength : 0,
	centerPointX : .1,
	spikeGirth : 0,
	positions : [ 'center' ]
};
var LOADING_HEADER = "We're processing your quote";
var LOADING_IMAGE = "<img src='/MAP/resources/images/redesign/loading.gif' \/>";
var LOADING_CONTENT = "Please don't navigate away from this page while you're waiting, we won't be long.";

// function set bt to ajax loading events
var s_bt_loading = function(id) {
	$('#' + id).change(function() {
		$('body').btOn();
	});
}

//function set bt to ajax loading events
var r_bt_loading = function(id) {
	$('#' + id).click(function() {
		$('body').btOn();
	});
}


// function close bt loading
// call it after completing your ajax
var close_bt_loading = function() {
	$('body').btOff();
}

$(document).ready(
		function() {
			$('body').bt(
					'<div class="btLoadingContent"><div class="btInnerContent">'
							+ '<h2 class="loadingHeader">' + LOADING_HEADER
							+ '<\/h2>' + '<div class="loadingContent">'
							+ '<div class="waitingoverlay">' + LOADING_IMAGE
							+ '</div><p>' + LOADING_CONTENT + '<\/p><\/div>'
							+ '<\/div><\/div>', LOADING_LAYOUT);
		});