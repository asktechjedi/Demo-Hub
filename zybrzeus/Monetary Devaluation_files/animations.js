function myTimer(cb, ms) {
	const begin = performance.now();
	const channel = myTimer.channel ??= new MessageChannel();
	const controller = new AbortController();
	channel.port1.addEventListener("message", (evt) => {
	  if(performance.now() - begin >= ms) {
		controller.abort();
		cb();
	  }
	  else if(evt.data === begin) channel.port2.postMessage(begin);
	}, { signal: controller.signal });
	channel.port1.start();
	channel.port2.postMessage(begin);
}

$(document).ready(function () {
	if ($('html').hasClass('no-js')) {
		$('html').toggleClass('no-js js');
	}

	// if ($(window).width() <= 568) {
	// 	$('.animate-in').removeClass('animate-in animating animate-out infinite').removeClass(effects.join(' '));
	// } else {
		$('.animate-in').each(function (i, elem) {
			var type = $(elem).attr('data-anim-type');
			var delay = $(elem).attr('data-anim-delay');
			$(elem).appear(function () {
				myTimer(function () {
					$(elem).addClass('animating').addClass(type).removeClass('animate-in');
				}, delay);
				$(elem).one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function () {
					$(elem).removeClass('animating').removeClass(effects.join(' '));
				});
			}, { accX: -1, accY: -10 });
		});
	// }
	console.log(effects.length + ' Animations');
});

$(window).resize(function () {
	if ($(window).width() <= 568)
		$('.animate-in').removeClass('animate-in animating animate-out infinite').removeClass(effects.join(' '));
});

function animate(elem, type, infinite) {
	if (effects.indexOf(type) != -1) {
		if (!infinite) {
			$(elem).removeClass('animate-in animate-out infinite').removeClass(effects.join(' ')).addClass('animating').addClass(type).one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function () {
				$(elem).removeClass('animating').removeClass(effects.join(' '));
			});
		} else {
			$(elem).removeClass('animate-in animate-out').removeClass(effects.join(' ')).addClass('animating infinite').addClass(type);
		}
	}
}

function animateOut(elem, type, remove) {
	if (effects.indexOf(type) != -1) {
		$(elem).removeClass('infinite').removeClass(effects.join(' ')).addClass('animating').addClass(type).one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function () {
			$(elem).addClass('animate-out').removeClass('animating').removeClass(effects.join(' '));
			if (remove) {
				$(elem).remove();
			}
		});
	}
}

function animateEnd(elem, remove) {
	$(elem).removeClass('animating infinite').removeClass(effects.join(' '));
	if (remove) {
		$(elem).remove();
	}
}

var effects = [
	'fade-in',
	'fade-in-up', 'fade-in-up-big', 'fade-in-up-large',
	'fade-in-down', 'fade-in-down-big', 'fade-in-down-large',
	'fade-in-left', 'fade-in-left-big', 'fade-in-left-large',
	'fade-in-right', 'fade-in-right-big', 'fade-in-right-large',

	'fade-in-up-left', 'fade-in-up-left-big', 'fade-in-up-left-large',
	'fade-in-up-right', 'fade-in-up-right-big', 'fade-in-up-right-large',
	'fade-in-down-left', 'fade-in-down-left-big', 'fade-in-down-left-large',
	'fade-in-down-right', 'fade-in-down-right-big', 'fade-in-down-right-large',

	'fade-out',
	'fade-out-up', 'fade-out-up-big', 'fade-out-up-large',
	'fade-out-down', 'fade-out-down-big', 'fade-out-down-large',
	'fade-out-left', 'fade-out-left-big', 'fade-out-left-large',
	'fade-out-right', 'fade-out-right-big', 'fade-out-right-large',

	'fade-out-up-left', 'fade-out-up-left-big', 'fade-out-up-left-large',
	'fade-out-up-right', 'fade-out-up-right-big', 'fade-out-up-right-large',
	'fade-out-down-left', 'fade-out-down-left-big', 'fade-out-down-left-large',
	'fade-out-down-right', 'fade-out-down-right-big', 'fade-out-down-right-large',

	'bounce-in', 'bounce-in-big', 'bounce-in-large',
	'bounce-in-up', 'bounce-in-up-big', 'bounce-in-up-large',
	'bounce-in-down', 'bounce-in-down-big', 'bounce-in-down-large',
	'bounce-in-left', 'bounce-in-left-big', 'bounce-in-left-large',
	'bounce-in-right', 'bounce-in-right-big', 'bounce-in-right-large',

	'bounce-in-up-left', 'bounce-in-up-left-big', 'bounce-in-up-left-large',
	'bounce-in-up-right', 'bounce-in-up-right-big', 'bounce-in-up-right-large',
	'bounce-in-down-left', 'bounce-in-down-left-big', 'bounce-in-down-left-large',
	'bounce-in-down-right', 'bounce-in-down-right-big', 'bounce-in-down-right-large',

	'bounce-out', 'bounce-out-big', 'bounce-out-large',
	'bounce-out-up', 'bounce-out-up-big', 'bounce-out-up-large',
	'bounce-out-down', 'bounce-out-down-big', 'bounce-out-down-large',
	'bounce-out-left', 'bounce-out-left-big', 'bounce-out-left-large',
	'bounce-out-right', 'bounce-out-right-big', 'bounce-out-right-large',

	'bounce-out-up-left', 'bounce-out-up-left-big', 'bounce-out-up-left-large',
	'bounce-out-up-right', 'bounce-out-up-right-big', 'bounce-out-up-right-large',
	'bounce-out-down-left', 'bounce-out-down-left-big', 'bounce-out-down-left-large',
	'bounce-out-down-right', 'bounce-out-down-right-big', 'bounce-out-down-right-large',

	'zoom-in',
	'zoom-in-up', 'zoom-in-up-big', 'zoom-in-up-large',
	'zoom-in-down', 'zoom-in-down-big', 'zoom-in-down-large',
	'zoom-in-left', 'zoom-in-left-big', 'zoom-in-left-large',
	'zoom-in-right', 'zoom-in-right-big', 'zoom-in-right-large',

	'zoom-in-up-left', 'zoom-in-up-left-big', 'zoom-in-up-left-large',
	'zoom-in-up-right', 'zoom-in-up-right-big', 'zoom-in-up-right-large',
	'zoom-in-down-left', 'zoom-in-down-left-big', 'zoom-in-down-left-large',
	'zoom-in-down-right', 'zoom-in-down-right-big', 'zoom-in-down-right-large',

	'zoom-out',
	'zoom-out-up', 'zoom-out-up-big', 'zoom-out-up-large',
	'zoom-out-down', 'zoom-out-down-big', 'zoom-out-down-large',
	'zoom-out-left', 'zoom-out-left-big', 'zoom-out-left-large',
	'zoom-out-right', 'zoom-out-right-big', 'zoom-out-right-large',

	'zoom-out-up-left', 'zoom-out-up-left-big', 'zoom-out-up-left-large',
	'zoom-out-up-right', 'zoom-out-up-right-big', 'zoom-out-up-right-large',
	'zoom-out-down-left', 'zoom-out-down-left-big', 'zoom-out-down-left-large',
	'zoom-out-down-right', 'zoom-out-down-right-big', 'zoom-out-down-right-large',

	'flip-in-x', 'flip-in-y',
	'flip-in-top-front', 'flip-in-top-back',
	'flip-in-bottom-front', 'flip-in-bottom-back',
	'flip-in-left-front', 'flip-in-left-back',
	'flip-in-right-front', 'flip-in-right-back',

	'flip-out-x', 'flip-out-y',
	'flip-out-top-front', 'flip-out-top-back',
	'flip-out-bottom-front', 'flip-out-bottom-back',
	'flip-out-left-front', 'flip-out-left-back',
	'flip-out-right-front', 'flip-out-right-back',

	'flash', 'strobe',
	'shake-x', 'shake-y',
	'bounce',
	'tada',
	'rubber-band',
	'swing',
	'spin', 'spin-reverse',
	'slingshot', 'slingshot-reverse',
	'wobble',
	'pulse', 'pulsate', 'heartbeat',
	'panic'
];