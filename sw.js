/* =====================================================
   GLOWÉ INVENTARIS
   SERVICE WORKER PWA

   fungsi:
   - membuat aplikasi bisa digunakan seperti PWA
   - menyimpan file utama di cache
===================================================== */


/* nama cache aplikasi */
const CACHE_NAME = "glowe-inventaris-v1";


/* file yang akan disimpan ke cache */
const APP_FILES = [

    "./",

    "./index.html",

    "./style.css",

    "./script.js",

    "./manifest.json",

    "./icon.svg"

];


/* =====================================================
   INSTALL

   ketika service worker pertama dibuat,
   file aplikasi dimasukkan ke cache
===================================================== */

self.addEventListener(
    "install",
    event => {

        event.waitUntil(

            caches.open(CACHE_NAME)

                .then(cache => {

                    return cache.addAll(
                        APP_FILES
                    );

                })

        );


        /* langsung aktif */
        self.skipWaiting();

    }
);


/* =====================================================
   ACTIVATE

   menghapus cache versi lama
===================================================== */

self.addEventListener(
    "activate",
    event => {

        event.waitUntil(

            caches.keys()
                .then(cacheNames => {

                    return Promise.all(

                        cacheNames

                            .filter(
                                name =>
                                    name !== CACHE_NAME
                            )

                            .map(
                                name =>
                                    caches.delete(name)
                            )

                    );

                })

        );


        self.clients.claim();

    }
);


/* =====================================================
   FETCH

   mengambil file dari cache terlebih dahulu.
   jika tidak ada, ambil dari internet.
===================================================== */

self.addEventListener(
    "fetch",
    event => {

        event.respondWith(

            caches.match(
                event.request
            )

            .then(cachedResponse => {

                if (cachedResponse) {

                    return cachedResponse;

                }


                return fetch(
                    event.request
                );

            })

        );

    }
);