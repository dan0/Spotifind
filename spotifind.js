/**
 * Ugly hack
 */

function spotifind () {

	function writeOut(msg) {
		$('#SP-findelement').html(msg);
	}

	/**
	 * Taken from FireBug source
	 * @param  {object} element
	 * @return {string}
	 */
	function getElementCSSPath(element) {
		var paths = [];

		for (; element && element.nodeType == 1; element = element.parentNode) {
			var selector = getElementCSSSelector(element);
			paths.splice(0, 0, selector);
		}

		return paths.length ? paths.join(" ") : null;
	}

	/**
	 * Taken from Firebug source
	 * @param  {object} element
	 * @return {string}
	 */
	function getElementCSSSelector(element) {
		if (!element || !element.localName) {
			return "null";
		}

		var label = element.localName.toLowerCase();
		if (element.id) {
			label += "#" + element.id;
		}

		if (element.classList && element.classList.length > 0) {
			label += "." + element.classList.item(0);
		}

		return label;
	}

	function chooseElement($el) {
		$('.spf-selected').removeClass('spf-selected').css({
			'outline': 'none'
		});

		var selector = getElementCSSPath($el[0]);
		writeOut(selector);

		$el.addClass('spf-selected').css({
			'outline' : '2px solid red'
		});

	}

	var outputDebug = '<div id="SP-findelement">' +
	'</div>';

	$(outputDebug).appendTo('body').css({
		'position' : 'fixed',
		'top' : '0px',
		'right' : '0px',
		'padding' : '10px',
		'width' : '200px',
		'background-color' : '#ccc'
	});

	$('*:not(html,body)').hover(function(event) {

		event.stopPropagation(); // only select hovered element
		if ($(this).hasClass('spf-selected')) {
			return;
		}
		$(this).css({
			'outline' : '2px solid green'
		}).bind('click', function() {
			chooseElement($(this));
		});

	}, function() {
		if ($(this).hasClass('spf-selected')) {
			return;
		}
		$(this).css({
			'outline' : 'none'
		}).unbind('click');

	});

}


// getScript()
// more or less stolen form jquery core and adapted by paul irish

function getScript(url,success){

	var head = document.getElementsByTagName("head")[0], done = false;
	var script = document.createElement("script");
	script.src = url;

	// Attach handlers for all browsers
	script.onload = script.onreadystatechange = function(){
		if ( !done && (!this.readyState ||
			this.readyState == "loaded" || this.readyState == "complete") ) {
				done = true;
				success();
		}
	};

	head.appendChild(script);
}

// usage:
getScript('http://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js',function(){
	spotifind();
});