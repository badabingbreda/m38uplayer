/**
 * [m3u8player description]
 * @type {Object}
 */
var m3u8player = {

	target : false ,
	stream : false ,
	url : false,
	image : false ,


	// main init
	init: function( settings ) {

		var parent = this;

		// if jQuery is already loaded on this page, continue
		if ( typeof jQuery !== 'undefined' ) {
			parent.jquery_loaded( settings );
			return;
		}

		// create script element and load jQuery library
		var script = document.createElement( 'script' );

		script.onload = function() {
			parent.jquery_loaded( settings );
		}
		script.src = 'https://cdn.jsdelivr.net/npm/jquery/dist/jquery.min.js';
		document.head.appendChild(script);
	},

	/**
	 * Continue with jQuery
	 * load Hls library for the player
	 *
	 * @param  {[type]} settings [description]
	 * @return {[type]}          [description]
	 */
	jquery_loaded : function( settings ) {
		parent = this;
		if ( typeof Hls == 'undefined' ) this.loadScript( 'https://cdn.jsdelivr.net/npm/hls.js@latest' , function() {
			parent.test_init( settings );
		} );
	},

	loadScript : function( url , callback ) {
		jQuery.ajax( {
			url: url,
			dataType: 'script',
			success: callback,
			async: true,
		});
	},

	test_init : function( settings ) {
		var parent = this;
		parent.target = settings.target;
		parent.stream = parent.stream_to_url( settings.target );

		parent.url = ( typeof settings.url !== 'undefined' ) ? settings.url : '';

		parent.image = settings.image ? 'style="background-image: url('+ decodeURIComponent(settings.image)+');"' : '';

		console.log( 'succes! Doing ' + parent.stream );
		jQuery( '#' + parent.target ).replaceWith( '<div id="'+ parent.target+'_container" class="m3u8_container"><video id="'+ parent.target +'" style="width:100%;" controls="controls"></video><div class="overlay"'+ parent.image+'><a href="#" class="play" data-target="'+parent.target+'" data-stream="'+ settings.stream+'" data-url="'+ parent.url+'"></a></div></div>' );
		//if (!document.getElementById) document.write('<link rel="stylesheet" type="text/css" href="//m3u8.cftoolbox.io/m3u8.css">');
		if(document.createStyleSheet) {
		  document.createStyleSheet('https://m3u8.cftoolbox.io/m3u8.css');
		}
		else {
		  var styles = "@import url('https://m3u8.cftoolbox.io/m3u8.css');";
		  var newSS=document.createElement('link');
		  newSS.rel='stylesheet';
		  newSS.href='data:text/css,'+escape(styles);
		  document.getElementsByTagName("head")[0].appendChild(newSS);
		}

		//parent.playM3u8( parent.stream );
		// add a resize event handler
		jQuery( window ).resize( function() {
			parent.resize_16_9( parent.target );
		} );
		// start the player when user clicks the play button/link
		jQuery( '.m3u8_container .play' ).on( 'click' , function() {
			$this = jQuery( this );
			jQuery( '#' + $this.data( 'target' ) + '_container .overlay' ).fadeOut();
			m3u8player.playM3u8( $this.data( 'target' ) , $this.data( 'url' ) ? $this.data( 'url' ): m3u8player.stream_to_url( $this.data( 'stream' ) ) );
		} )

		// make sure this loads in the correct ratio
		parent.resize_16_9( parent.target );

		window.addEventListener('message', recieveMessage, false)

			function recieveMessage(e) {

  				if( e.data.error == 'networkError' ) parent.message( e.data.error );

			}


	},

	stream_to_url : function( stream ) {

		return typeof stream == 'string' ? 'https://live02-rtd.minoto-video.com/livestream/' + stream + '.sdp/playlist.m3u8' : '' ;
	},



	resize_16_9 : function( target ) {

		let width = jQuery( '#' + target ).outerWidth();
		jQuery( '#' + target ).css( 'height' , ( width * 9/16 ) + 'px' );

	},

	replace_error_message: function( target ) {

	},

	message:  function( type ) {
		var parent = this;
		if ( type == 'networkError' ) {
			//jQuery( '#' + parent.target ).replaceWith( '<div id="'+parent.target+'">networkError bij het proberen de stream te starten. Probeer het later nog eens.</div>' );
			console.log( 'Network Error' );
		}
	},

	playM3u8: function( target , url){
		var video = document.getElementById( target );
	  if(Hls.isSupported()) {
	      parent.target.volume = 0.3;
	      var hls = new Hls();
	      var m3u8Url = decodeURIComponent(url)
	      hls.loadSource(m3u8Url);
	      hls.attachMedia(video);
	      console.log( hls.startLevel  = 0 );
	      hls.on(Hls.Events.MANIFEST_PARSED,function() {
	         video.play();
			video.volume = 0.3;

	      });
	      hls.on(Hls.Events.ERROR, function( event, data ) {

	        if ( data.type == 'networkError' ) {
	           //video.remove();

	          // send a response back to the page that included the iframe
	          window.top.postMessage( { error : data.type } , '*');
	        }
	      });

	      document.title = url
	    }
		else if ( parent.target.canPlayType('application/vnd.apple.mpegurl')) {
			 video.src = url;
			 video.addEventListener('canplay',function() {
			   video.play();
			});
			 video.volume = 0.3;
			document.title = url;
	  	}
	},

	playPause : function() {
	     parent.target.paused? parent.target.play(): parent.target.pause();
	},

	volumeUp : function() {
	    if( parent.target.volume <= 0.9)  parent.target.volume+=0.1;
	},

	volumeDown: function() {
	    if( parent.target.volume >= 0.1)  parent.target.volume-=0.1;
	},

	seekRight : function () {
	     parent.target.currentTime+=5;
	},

	seekLeft : function () {
	     parent.target.currentTime-=5;
	},

	vidFullscreen : function () {
	    if ( parent.target.requestFullscreen) {
	       parent.target.requestFullscreen();
	  } else if ( parent.target.mozRequestFullScreen) {
	       parent.target.mozRequestFullScreen();
	  } else if ( parent.target.webkitRequestFullscreen) {
	       parent.target.webkitRequestFullscreen();
	    }
	},

};