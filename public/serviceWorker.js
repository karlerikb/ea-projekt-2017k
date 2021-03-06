// service worker
var CACHE_NAME = 'matrix';
var urlsToCache = [
/*
	"/~mattbleh/2.%20Semester/ea-projekt-2017k/public/projekt.js",
	"/~mattbleh/2.%20Semester/ea-projekt-2017k/public/index.html",
	"/~mattbleh/2.%20Semester/ea-projekt-2017k/public/game.html",
	"/~mattbleh/2.%20Semester/ea-projekt-2017k/public/calculator.html",
	"/~mattbleh/2.%20Semester/ea-projekt-2017k/public/index.css",
	"/~mattbleh/2.%20Semester/ea-projekt-2017k/public/projekt.css",
	"/~mattbleh/2.%20Semester/ea-projekt-2017k/public/",
	"http://cdnjs.cloudflare.com/ajax/libs/mathjs/3.13.2/math.min.js",
	"https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js"
	*/
];

self.addEventListener('install', function(event) {
    // Perform install steps

    event.waitUntil(
        caches.open(CACHE_NAME)
        .then(function(cache) {
            console.log('Opened cache');
            return cache.addAll(urlsToCache);
        })
    );
});

self.addEventListener("fetch", function(event) {
    //console.log('WORKER: fetch event in progress.');

    if (event.request.method !== 'GET') { return; }
    event.respondWith(
        caches
        .match(event.request)
        .then(function(cached) {
            var networked = fetch(event.request)
            .then(fetchedFromNetwork, unableToResolve)
            .catch(unableToResolve);
            //console.log('WORKER: fetch event', cached ? '(cached)' : '(network)', event.request.url);
            return cached || networked;

            function fetchedFromNetwork(response) {
                var cacheCopy = response.clone();
                //console.log('WORKER: fetch response from network.', event.request.url);
                caches
                .open(version + 'pages')
                .then(function add(cache) {
                    cache.put(event.request, cacheCopy);
                })
                .then(function() {
                    console.log('WORKER: fetch response stored in cache.', event.request.url);
                });

                return response;
            }

            function unableToResolve () {
                //console.log('WORKER: fetch request failed in both cache and network.', event.request.url);
                return new Response('<h1>Service Unavailable</h1>', {
                    status: 503,
                    statusText: 'Service Unavailable',
                    headers: new Headers({
                        'Content-Type': 'text/html'
                    })
                });
            }
        })
    );
});