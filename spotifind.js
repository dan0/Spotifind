/**
 * Ugly hack
 */

function spotifind () {

	// we're only looking for tracks here
	var baseUrl = 'http://ws.spotify.com/search/1/track.json?q=';
	var foundSongs = 0;

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

	/**
	 * Select element when clicked
	 * @param  {object} $el jQuery object
	 */
	function chooseElement($el) {
		var selector = getElementCSSPath($el[0]);
		var foundMessage = '<p>Search for songs?</p>';

		$('#SP-findelement').html(foundMessage);
		$('<button>Find Songs</button>').click(function() {
			startSearch(selector);
			return false;
		}).appendTo('#SP-findelement');

		$('.spf-selected').removeClass('spf-selected').css({
			'outline': 'none'
		});

		$el.addClass('spf-selected').css({
			'outline' : '2px solid red'
		});
	}

	/**
	 * Perform search, handle results
	 * @param  {string} selector Css selector for searching
	 */
	function startSearch(selector) {
		var resultsHolder = $('#SP-findelement');
		var results = $('<textarea id="SP-results"></textarea>');
		var explain = $('<br><small>Copy and paste the above links into a new playlist in Spotify, and you\'re done!</small>');
		results.appendTo(resultsHolder);
		explain.appendTo(resultsHolder);

		$(selector).each(function() {
			// Trim and url-encode the text within our selected element
			var searchData = encodeURIComponent($(this).text().replace(/^\s+|\s+$/g, ''));
			var searchURL = baseUrl + searchData;
			var foundTrack = false;
			var el = $(this);

			$.getJSON(searchURL, function(data) {
				// quote naive, just grab the top result
				// Without thinking about country availability - TODO: take this into account
				if (data.tracks.length > 0) {
					foundTrack = data.tracks[0];
					$('<a>play</a>')
						.css({
							'color' : 'green',
							'font-size' : '10px',
							'padding-left' : '10px'
						})
						.attr('href', foundTrack.href)
						.appendTo(el);
					results.append(foundTrack.href + ' ');
					console.log(foundTrack);
				}
				else {
					alert('Sorry, no tracks found!'); //TODO: replace alert
				}
			});
		});
	}

	function cleanUP() {

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

	$('*:not(html,body,#SP-findelement)').hover(function(event) {

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