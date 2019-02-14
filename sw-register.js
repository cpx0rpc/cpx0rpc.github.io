if('serviceWorker' in navigator){
	window.addEventListener('load', function(){
		navigator.serviceWorker.register('sw.js').then(function(registration){
			console.log('Register SW successful: ', registration.scope);
		}, function(err){
			console.log('Register SW failed: ', err);
		});
	});
}
