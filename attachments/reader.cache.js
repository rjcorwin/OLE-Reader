(function($) {

	function updateCacheStatus(message) {
		$(".status").text(message)
	}
	window.applicationCache.onprogress = function (e) {               
	    var message = 'Downloading offline resources.. ';

	    if (e.lengthComputable) {
	        updateCacheStatus(message + Math.round(e.loaded / e.total * 100) + '%');
	    } else {
	        updateCacheStatus(message);
	    };
	};
	window.applicationCache.onchecking = function (e) {
    	updateCacheStatus('Checking for a new version of the application.');
	};
	window.applicationCache.ondownloading = function (e) {
    	updateCacheStatus('Downloading a new offline version of the application');
	};
	window.applicationCache.oncached = function (e) {
	    updateCacheStatus('The application is available offline.');
	};
	window.applicationCache.onerror = function (e) {
	    updateCacheStatus('Something went wrong while updating the offline version of the application. It will not be available offline.');
	};
	window.applicationCache.onupdateready = function (e) {
	    //window.applicationCache.swapCache();
	    updateCacheStatus('The application was updated.');
	    // @todo Forward user to shelf
	};
	window.applicationCache.onnoupdate = function (e) {
	    updateCacheStatus('The application is also available offline.');
	};
	window.applicationCache.onobsolete = function (e) {
	    updateCacheStatus('The application can not be updated, no manifest file was found.');
	};

})(jQuery);
/*
var cacheStatusValues = [];
cacheStatusValues[0] = 'uncached';
cacheStatusValues[1] = 'idle';
cacheStatusValues[2] = 'checking';
cacheStatusValues[3] = 'downloading';
cacheStatusValues[4] = 'updateready';
cacheStatusValues[5] = 'obsolete';

var cache = window.applicationCache;
cache.addEventListener('cached', logEvent, false);
cache.addEventListener('checking', logEvent, false);
cache.addEventListener('downloading', logEvent, false);
cache.addEventListener('error', logEvent, false);
cache.addEventListener('noupdate', logEvent, false);
cache.addEventListener('obsolete', logEvent, false);
cache.addEventListener('progress', logEvent, false);
cache.addEventListener('updateready', logEvent, false);

function logEvent(e) {
    var online, status, type, message;
    online = (navigator.onLine) ? 'yes' : 'no';
    status = cacheStatusValues[cache.status];
    type = e.type;
    message = 'online: ' + online;
    message+= ', event: ' + type;
    message+= ', status: ' + status;
    if (type == 'error' && navigator.onLine) {
        message+= ' (prolly a syntax error in manifest)';
    }
    console.log(message);
}

window.applicationCache.addEventListener(
    'updateready', 
    function(){
        window.applicationCache.swapCache();
        console.log('swap cache has been called');
    }, 
    false
);
*/

//setInterval(function(){cache.update()}, 10000);
