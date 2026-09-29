/* =====================================================
   GLOWÉ INVENTARIS
   JAVASCRIPT UTAMA

   fungsi:
   - navigasi halaman
   - CRUD produk
   - localStorage
   - pencarian
   - filter
   - statistik
   - modal
   - splash screen
   - menu mobile
   - PWA
===================================================== */


/* =====================================================
   KEY LOCALSTORAGE

   semua data produk disimpan dengan nama ini
===================================================== */

const STORAGE_KEY = "gloweProduk";


/* =====================================================
   AMBIL DATA DARI LOCALSTORAGE

   kalau belum ada data maka menggunakan array kosong
===================================================== */

let products = JSON.parse(
    localStorage.getItem(STORAGE_KEY)
) || [];


/* =====================================================
   VARIABEL EDIT

   null = sedang tambah produk
   ada id = sedang edit produk
===================================================== */

let editingId = null;


/* =====================================================
   AMBIL ELEMENT HTML
===================================================== */

const splashScreen =
    document.getElementById("splashScreen");

const sidebar =
    document.getElementById("sidebar");

const sidebarOverlay =
    document.getElementById("sidebarOverlay");

const mobileMenu =
    document.getElementById("mobileMenu");

const navItems =
    document.querySelectorAll(".nav-item");

const pages =
    document.querySelectorAll(".page");

const headerTitle =
    document.getElementById("headerTitle");

const headerSmallTitle =
    document.getElementById("headerSmallTitle");

const currentDate =
    document.getElementById("currentDate");


/* =====================================================
   ELEMENT STATISTIK
===================================================== */

const statTotalProduk =
    document.getElementById("statTotalProduk");

const statTotalKategori =
    document.getElementById("statTotalKategori");

const statTotalStok =
    document.getElementById("statTotalStok");

const statStokMenipis =
    document.getElementById("statStokMenipis");


/* =====================================================
   ELEMENT PRODUK
===================================================== */

const productTable =
    document.getElementById("productTable");

const emptyState =
    document.getElementById("emptyState");

const searchProduct =
    document.getElementById("searchProduct");

const filterKategori =
    document.getElementById("filterKategori");

const addProductButton =
    document.getElementById("addProductButton");

const emptyAddButton =
    document.getElementById("emptyAddButton");


/* =====================================================
   MODAL
===================================================== */

const productModal =
    document.getElementById("productModal");

const productForm =
    document.getElementById("productForm");

const modalTitle =
    document.getElementById("modalTitle");

const closeModal =
    document.getElementById("closeModal");

const cancelModal =
    document.getElementById("cancelModal");


/* =====================================================
   INPUT FORM
===================================================== */

const kodeProduk =
    document.getElementById("kodeProduk");

const namaProduk =
    document.getElementById("namaProduk");

const kategoriProduk =
    document.getElementById("kategoriProduk");

const hargaProduk =
    document.getElementById("hargaProduk");

const stokProduk =
    document.getElementById("stokProduk");


/* =====================================================
   SPLASH SCREEN

   setelah 1,8 detik splash disembunyikan
===================================================== */

window.addEventListener("load", () => {

    setTimeout(() => {

        splashScreen.classList.add("hide");

    }, 1800);

});


/* =====================================================
   TANGGAL HARI INI
===================================================== */

function updateDate() {

    const now = new Date();

    const options = {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric"
    };

    currentDate.textContent =
        now.toLocaleDateString(
            "id-ID",
            options
        );

}

updateDate();


/* =====================================================
   NAVIGASI HALAMAN

   tombol sidebar akan berpindah halaman
===================================================== */

function openPage(pageName) {

    /* sembunyikan semua halaman */
    pages.forEach(page => {

        page.classList.remove("active");

    });


    /* hapus active dari semua menu */
    navItems.forEach(item => {

        item.classList.remove("active");

    });


    /* tampilkan halaman tujuan */
    const targetPage =
        document.querySelector(
            `[data-page="${pageName}"]`
        );

    if (targetPage) {

        targetPage.classList.add("active");

    }


    /* aktifkan menu yang sesuai */
    const activeNav =
        document.querySelector(
            `[data-page-target="${pageName}"]`
        );

    if (activeNav) {

        activeNav.classList.add("active");

    }


    /* ubah judul header */
    const titles = {

        dashboard: "dashboard",

        produk: "data produk",

        anggota: "anggota kelompok",

        tentang: "tentang",

        kontak: "kontak",

        pengaturan: "pengaturan"

    };


    headerTitle.textContent =
        titles[pageName] || "dashboard";


    headerSmallTitle.textContent =
        pageName === "dashboard"
            ? "aplikasi inventaris"
            : "glowé • inventaris";


    /* tutup sidebar di hp */
    sidebar.classList.remove("open");

    sidebarOverlay.classList.remove("show");


    /* scroll ke atas */
    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

}


/* =====================================================
   EVENT NAVIGASI
===================================================== */

document.addEventListener("click", (event) => {

    const button =
        event.target.closest("[data-page-target]");

    if (!button) return;


    const page =
        button.dataset.pageTarget;

    openPage(page);

});


/* =====================================================
   MENU MOBILE
===================================================== */

mobileMenu.addEventListener("click", () => {

    sidebar.classList.toggle("open");

    sidebarOverlay.classList.toggle("show");

});


/* klik overlay = tutup menu */

sidebarOverlay.addEventListener("click", () => {

    sidebar.classList.remove("open");

    sidebarOverlay.classList.remove("show");

});


/* =====================================================
   SIMPAN DATA KE LOCALSTORAGE
===================================================== */

function saveProducts() {

    localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(products)
    );

}


/* =====================================================
   FORMAT HARGA RUPIAH
===================================================== */

function formatRupiah(value) {

    return new Intl.NumberFormat(
        "id-ID",
        {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0
        }
    ).format(value);

}


/* =====================================================
   RENDER PRODUK

   menampilkan data produk ke tabel
===================================================== */

function renderProducts() {

    const keyword =
        searchProduct.value
            .toLowerCase()
            .trim();

    const category =
        filterKategori.value;


    /* filter data */
    const filteredProducts =
        products.filter(product => {

            const cocokSearch =

                product.kode
                    .toLowerCase()
                    .includes(keyword)

                ||

                product.nama
                    .toLowerCase()
                    .includes(keyword)

                ||

                product.kategori
                    .toLowerCase()
                    .includes(keyword);


            const cocokKategori =
                category === "semua"
                ||
                product.kategori === category;


            return cocokSearch && cocokKategori;

        });


    /* kosongkan tabel */
    productTable.innerHTML = "";


    /* kalau tidak ada data */
    if (filteredProducts.length === 0) {

        emptyState.classList.remove("hidden");

    } else {

        emptyState.classList.add("hidden");

    }


    /* tampilkan produk */
    filteredProducts.forEach(product => {

        const row =
            document.createElement("tr");


        /* status stok */
        const stockClass =
            Number(product.stok) <= 5
                ? "stock-low"
                : "stock-good";


        row.innerHTML = `

            <td>
                <strong>
                    ${escapeHTML(product.kode)}
                </strong>
            </td>

            <td class="product-name">
                ${escapeHTML(product.nama)}
            </td>

            <td>
                <span class="category-badge">
                    ${escapeHTML(product.kategori)}
                </span>
            </td>

            <td>
                ${formatRupiah(product.harga)}
            </td>

            <td>
                <span class="${stockClass}">
                    ${product.stok}
                </span>
            </td>

            <td>

                <div class="table-actions">

                    <!-- tombol edit -->
                    <button
                        class="action-button edit-button"
                        data-action="edit"
                        data-id="${product.id}"
                        title="edit produk"
                    >
                        <i class="fa-solid fa-pen"></i>
                    </button>


                    <!-- tombol hapus -->
                    <button
                        class="action-button delete-button"
                        data-action="delete"
                        data-id="${product.id}"
                        title="hapus produk"
                    >
                        <i class="fa-solid fa-trash"></i>
                    </button>

                </div>

            </td>

        `;


        productTable.appendChild(row);

    });


    updateStatistics();

}


/* =====================================================
   ESCAPE HTML

   supaya input user tidak merusak struktur HTML
===================================================== */

function escapeHTML(value) {

    return String(value)

        .replace(/&/g, "&amp;")

        .replace(/</g, "&lt;")

        .replace(/>/g, "&gt;")

        .replace(/"/g, "&quot;")

        .replace(/'/g, "&#039;");

}


/* =====================================================
   STATISTIK DASHBOARD
===================================================== */

function updateStatistics() {

    /* jumlah produk */
    statTotalProduk.textContent =
        products.length;


    /* kategori unik */
    const categories =
        new Set(
            products.map(
                product => product.kategori
            )
        );


    statTotalKategori.textContent =
        categories.size;


    /* total stok */
    const totalStock =
        products.reduce(
            (total, product) =>
                total + Number(product.stok),
            0
        );


    statTotalStok.textContent =
        totalStock;


    /* produk dengan stok <= 5 */
    const lowStock =
        products.filter(
            product =>
                Number(product.stok) <= 5
        ).length;


    statStokMenipis.textContent =
        lowStock;

}


/* =====================================================
   BUKA MODAL TAMBAH
===================================================== */

function openAddModal() {

    editingId = null;

    modalTitle.textContent =
        "tambah produk";

    productForm.reset();

    productModal.classList.add("show");

    kodeProduk.focus();

}


/* =====================================================
   BUKA MODAL EDIT
===================================================== */

function openEditModal(id) {

    const product =
        products.find(
            item => item.id === id
        );


    if (!product) return;


    editingId = id;


    modalTitle.textContent =
        "edit produk";


    kodeProduk.value =
        product.kode;

    namaProduk.value =
        product.nama;

    kategoriProduk.value =
        product.kategori;

    hargaProduk.value =
        product.harga;

    stokProduk.value =
        product.stok;


    productModal.classList.add("show");

}


/* =====================================================
   TUTUP MODAL
===================================================== */

function closeProductModal() {

    productModal.classList.remove("show");

    productForm.reset();

    editingId = null;

}


/* =====================================================
   EVENT TOMBOL TAMBAH
===================================================== */

addProductButton.addEventListener(
    "click",
    openAddModal
);


emptyAddButton.addEventListener(
    "click",
    openAddModal
);


/* =====================================================
   EVENT TUTUP MODAL
===================================================== */

closeModal.addEventListener(
    "click",
    closeProductModal
);


cancelModal.addEventListener(
    "click",
    closeProductModal
);


/* klik luar modal untuk menutup */

productModal.addEventListener(
    "click",
    event => {

        if (
            event.target === productModal
        ) {

            closeProductModal();

        }

    }
);


/* =====================================================
   TAMBAH / EDIT PRODUK
===================================================== */

productForm.addEventListener(
    "submit",
    event => {

        event.preventDefault();


        /* ambil nilai form */
        const kode =
            kodeProduk.value.trim();

        const nama =
            namaProduk.value.trim();

        const kategori =
            kategoriProduk.value;

        const harga =
            Number(hargaProduk.value);

        const stok =
            Number(stokProduk.value);


        /* validasi */
        if (
            !kode ||
            !nama ||
            !kategori ||
            harga < 0 ||
            stok < 0
        ) {

            alert(
                "silakan isi semua data dengan benar."
            );

            return;

        }


        /* =================================================
           MODE EDIT
        ================================================== */

        if (editingId) {

            const index =
                products.findIndex(
                    product =>
                        product.id === editingId
                );


            if (index !== -1) {

                products[index] = {

                    ...products[index],

                    kode,

                    nama,

                    kategori,

                    harga,

                    stok

                };

            }

        }


        /* =================================================
           MODE TAMBAH
        ================================================== */

        else {

            const newProduct = {

                id:
                    Date.now().toString(),

                kode,

                nama,

                kategori,

                harga,

                stok

            };


            products.push(newProduct);

        }


        /* simpan */
        saveProducts();


        /* tampilkan */
        renderProducts();


        /* tutup */
        closeProductModal();


        /* notifikasi */
        alert(
            editingId
                ? "produk berhasil diubah."
                : "produk berhasil ditambahkan."
        );

    }
);


/* =====================================================
   EVENT EDIT DAN HAPUS

   menggunakan event delegation agar tombol
   tetap bekerja walaupun tabel dibuat ulang
===================================================== */

productTable.addEventListener(
    "click",
    event => {

        const button =
            event.target.closest(
                "[data-action]"
            );


        if (!button) return;


        const id =
            button.dataset.id;

        const action =
            button.dataset.action;


        /* edit */
        if (action === "edit") {

            openEditModal(id);

        }


        /* hapus */
        if (action === "delete") {

            deleteProduct(id);

        }

    }
);


/* =====================================================
   HAPUS PRODUK
===================================================== */

function deleteProduct(id) {

    const product =
        products.find(
            item => item.id === id
        );


    if (!product) return;


    const confirmDelete =
        confirm(
            `hapus produk "${product.nama}"?`
        );


    if (!confirmDelete) return;


    products =
        products.filter(
            item => item.id !== id
        );


    saveProducts();

    renderProducts();

}


/* =====================================================
   SEARCH
===================================================== */

searchProduct.addEventListener(
    "input",
    renderProducts
);


/* =====================================================
   FILTER KATEGORI
===================================================== */

filterKategori.addEventListener(
    "change",
    renderProducts
);


/* =====================================================
   HAPUS SEMUA DATA
===================================================== */

const deleteAllButton =
    document.getElementById(
        "deleteAllButton"
    );


deleteAllButton.addEventListener(
    "click",
    () => {

        if (products.length === 0) {

            alert(
                "belum ada data yang bisa dihapus."
            );

            return;

        }


        const confirmation =
            confirm(
                "yakin ingin menghapus semua data produk?"
            );


        if (!confirmation) return;


        products = [];


        saveProducts();

        renderProducts();


        alert(
            "semua data produk berhasil dihapus."
        );

    }
);


/* =====================================================
   SWITCH LOCALSTORAGE

   localStorage memang wajib digunakan,
   jadi kalau dimatikan akan dikembalikan aktif.
===================================================== */

const storageToggle =
    document.getElementById(
        "storageToggle"
    );


storageToggle.addEventListener(
    "change",
    () => {

        if (!storageToggle.checked) {

            alert(
                "localStorage diperlukan agar data inventaris dapat disimpan."
            );

            storageToggle.checked = true;

        }

    }
);


/* =====================================================
   SWITCH PWA
===================================================== */

const pwaToggle =
    document.getElementById(
        "pwaToggle"
    );


pwaToggle.addEventListener(
    "change",
    () => {

        if (!pwaToggle.checked) {

            alert(
                "fitur PWA menggunakan manifest dan service worker."
            );

            pwaToggle.checked = true;

        }

    }
);


/* =====================================================
   SERVICE WORKER PWA
===================================================== */

if (
    "serviceWorker" in navigator
) {

    window.addEventListener(
        "load",
        () => {

            navigator.serviceWorker
                .register("sw.js")
                .then(() => {

                    console.log(
                        "service worker aktif."
                    );

                })
                .catch(error => {

                    console.log(
                        "service worker gagal:",
                        error
                    );

                });

        }
    );

}


/* =====================================================
   RENDER PERTAMA
===================================================== */

renderProducts();