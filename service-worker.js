/* =========================================================
   SERVICE WORKER GLOWÉ

   fungsi:
   - menyimpan file website ke cache
   - membantu website dibuka secara offline
   - membuat website dapat digunakan sebagai PWA
========================================================= */


/* nama cache aplikasi */
const CACHE_NAME = "glowe-cache-v1";


/* =========================================================
   FILE YANG AKAN DISIMPAN KE CACHE
========================================================= */

const FILES_TO_CACHE = [

    "./",

    "./index.html",

    "./style.css",

    "./script.js",

    "./manifest.json",

    "./icon.svg"

];


/* =========================================================
   INSTALL
   dijalankan ketika service worker pertama kali dibuat
========================================================= */

self.addEventListener(
    "install",
    function (event) {

        event.waitUntil(

            caches.open(
                CACHE_NAME
            ).then(
                function (cache) {

                    return cache.addAll(
                        FILES_TO_CACHE
                    );

                }
            )

        );


        /* langsung menggunakan service worker baru */
        self.skipWaiting();

    }
);


/* =========================================================
   ACTIVATE
   menghapus cache versi lama
========================================================= */

self.addEventListener(
    "activate",
    function (event) {

        event.waitUntil(

            caches.keys().then(
                function (cacheNames) {

                    return Promise.all(

                        cacheNames
                            .filter(
                                function (cacheName) {

                                    return (
                                        cacheName !==
                                        CACHE_NAME
                                    );

                                }
                            )
                            .map(
                                function (cacheName) {

                                    return caches.delete(
                                        cacheName
                                    );

                                }
                            )

                    );

                }
            )

        );


        /* mengambil kontrol halaman */
        self.clients.claim();

    }
);


/* =========================================================
   FETCH
   mencoba mengambil file dari cache terlebih dahulu
========================================================= */

self.addEventListener(
    "fetch",
    function (event) {

        event.respondWith(

            caches.match(
                event.request
            ).then(
                function (cachedResponse) {

                    /* jika ada cache, gunakan cache */
                    if (cachedResponse) {

                        return cachedResponse;

                    }


                    /* jika tidak ada cache,
                       ambil dari internet */

                    return fetch(
                        event.request
                    );

                }
            )

        );

    }
);