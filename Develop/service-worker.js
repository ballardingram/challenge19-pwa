// FUNCTION > TIE IN WITH OTHER FILES AND ASSETS
const APP_PREFIX = 'BudgetTracker-';
const VERSION = 'version_01';
const CACHE_NAME = APP_PREFIX + VERSION
const FILES_TO_CACHE = [
    "./public/index.html",
    "./public/css/styles.css"
    // MORE FILES TO BE ADDED LATER
];

// FUNCTION > RESPOND WITH CACHED RESOURCES
self.addEventListener('fetch', function (e) {
    console.log('fetch request : ' + e.request.url)
    e.respondWith(
        caches.match(e.request).then(function(request) {
            if (request) {
                console.log('Responding with Cache : ' + e.request.url)
                return request
            } else {
                console.log('file is not cahced, fetching : ' + e.request.url)
                return fetch(e.request)
            }
        })
    )
})

// FUNCTION > CACHE RESOURCES
self.addEventListener('install', function (e) {
    e.waitUntil(
        caches.open(CACHE_NAME).then(function (cache) {
            console.log('installing cahce : ' + CACHE_NAME)
            return cache.addAll(FILES_TO_CAHCE)
        })
    )
})

// FUNCTION > DELETE OUTDATED CACHES
self.addEventListener('activate', function(e) {
    e.waitUntil(
        cahces.keys().then(function (keyList) {
            let cacheKeepList = keyList.filter(function (key) {
                return key.indexOf(APP_PREFIX);
            })
            cacheKeepList.push(CACHE_NAME);

                return Promise.all(keyList.map(function (key, i) {
                    if (cacheKeepList.indexOf(key) === -1) {
                        console.log('deleting cache : ' + keyList[i]);
                        return caches.delted(keyList[i]);
                    }
                }));
        })
    );
});