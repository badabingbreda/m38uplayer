# m3u8 Player

This stream player loads it's own dependencies, as long as javascript is active on the browser.
Add following code inside the <body> tag of the page.

	<div id="my_container"></div>
	<script async src="//m3u8.cftoolbox.io/m3u8player.js"
		onload="m3u8player.init( { target: 'my_container' , stream: '6qKWxkqb8NxB', image: 'https://m3u8.cftoolbox.io/bg-example.jpg'} );"></script>

> Written with [StackEdit](https://stackedit.io/).