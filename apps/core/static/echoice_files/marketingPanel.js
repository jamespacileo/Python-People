
var brandPanel = [
	'<p>RSA echoice may be new, but the company is one of the oldest and most respected insurers in the world.<\/p>',
	"<p>RSA has been providing insurance cover for 300 years, and now RSA echoice puts you in the driving seat.<\/p>",
	"<p>You’re in safe hands - RSA looks after over 20 million customers worldwide!<\/p>",
	"<p>RSA echoice is underwritten by Royal &amp; Sun Alliance Insurance plc (RSA) – the second largest insurer in the UK.<\/p>",
	"<p>RSA has customers in 130 countries worldwide, and has roots dating back to 1710.<\/p>"
	];
	
var current = 0;
var autoRotate;

var marketingPanelCarousel = function() {
	var footer = $('.brandPanelDynamic .brandFooter');
	
	var content = $('.brandContent .bc1:first')
	
	content.hover(function(){
		clearTimeout(autoRotate);
	},function(){
		autoRotatePanelCarousel(false);
	});
	
	footer.append(
		$('<a class="button prev" rel="prev">prev<\/a>').click(function(){
			if(current == 0){
				current = (brandPanel.length - 1)
			} else {
				current--;
			}
			footer.find('a[rel=' + current + ']').triggerHandler('click');
		}).mousedown(function(){
			autoRotatePanelCarousel(true);
		})
	);
	
	var ul = $('<ul><\/ul>');
	footer.append(ul);

	for(var i = 0; i < brandPanel.length; i++){
		ul.append(
			$('<li><\/li>').append(
				$('<a rel="' + i + '"' + (i == 0 ? ' class="on"' : '') + '>' + (i + 1) + '<\/a>').click(function(){
					if(! $(this).hasClass('on')) {
						ul.find('a.on').removeClass('on');
						$(this).addClass('on');
						
						var nextContentIndex = $(this).attr('rel');
							
						content.animate({'opacity':0}, 500, function(){
							content.html( brandPanel[nextContentIndex] );
							content.animate({'opacity':1})
							
							current = nextContentIndex;
						});
					}
				}).mousedown(function(){
					autoRotatePanelCarousel(true);
				})
			)
		)
	};
	
	footer.append(
		$('<a class="button next" rel="next">next<\/a>').click(function(){
			if(current == (brandPanel.length - 1)){
				current = 0;
			} else {
				current++;
			}
			footer.find('a[rel=' + current + ']').triggerHandler('click');
		}).mousedown(function(){
			autoRotatePanelCarousel(true);
		})
	);
}
var autoRotatePanelCarousel = function(userInteraction){

	clearTimeout(autoRotate);
	
	var time = 5000; // 5 seconds.
	if(userInteraction === true)
		time = 30000; // 30 seconds.

	autoRotate = setTimeout(function(){
		$('.brandPanelDynamic .brandFooter .next').triggerHandler('click');		
		autoRotatePanelCarousel();
	}, time);
}


$(document).ready(function(){
	marketingPanelCarousel();
	autoRotatePanelCarousel(false);
	
});

