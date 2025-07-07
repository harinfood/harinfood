document.addEventListener('DOMContentLoaded', () => {
    // --- PENTING: BARIS INI UNTUK DEBUGGING SAJA. HAPUS SAAT SUDAH PRODUKSI! ---
    // Membersihkan Local Storage setiap kali halaman dimuat untuk memastikan tidak ada data sesi lama yang mengganggu.
    // Jika Anda mengalami masalah login setelah banyak perubahan, aktifkan baris ini, REFRESH HALAMAN BERKALI-KALI,
    // lalu komentari kembali baris ini dan REFRESH LAGI.
    try {
        localStorage.clear(); 
        console.log('Local Storage cleared for debugging.');
    } catch (e) {
        console.error('Could not clear Local Storage:', e);
    }
    // --- AKHIR DEBUGGING ---

    // --- REFERENSI DOM UTAMA ---
    const loginPopup = document.getElementById('login-popup');
    const btnPelanggan = document.getElementById('btn-pelanggan');
    const btnKasir = document.getElementById('btn-kasir');
    const formPelanggan = document.getElementById('form-pelanggan');
    const formKasir = document.getElementById('form-kasir');
    const namaPelangganLoginInput = document.getElementById('nama-pelanggan-login');
    const alamatPelangganLoginInput = document.getElementById('alamat-pelanggan-login');
    const namaKasirLoginInput = document.getElementById('nama-kasir-login');
    const passwordKasirLoginInput = document.getElementById('password-kasir-login');
    const appContainer = document.getElementById('app-container');
    const kasirFabs = document.getElementById('kasir-fabs'); // Container untuk FABs kasir
    const opsiMakanContainer = document.getElementById('opsi-makan-container');
    const pesanInfoLabel = document.getElementById('pesan-info-label');
    const paymentChoiceButtons = document.getElementById('payment-choice-buttons'); // Container opsi pembayaran (Tunai/QRIS)
    const pesanWhatsappBtn = document.getElementById('pesan-whatsapp'); // Tombol WhatsApp utama (untuk pelanggan)
    const cetakStrukButton = document.getElementById('cetak-struk-button'); // Tombol Cetak Struk baru (untuk kasir)
    const namaPemesanInput = document.getElementById('nama-pemesan');
    const alamatPemesanInput = document.getElementById('alamat-pemesan');
    const keteranganPesananInput = document.getElementById('keterangan-pesanan'); // Keterangan pesanan
    const nominalPembayaranInput = document.getElementById('nominal-pembayaran');
    const kembalianDisplay = document.getElementById('kembalian-display');
    const produkList = document.getElementById('produk-list');
    const keranjangItems = document.getElementById('keranjang-items');
    const keranjangTotal = document.getElementById('keranjang-total');
    const manualOrderModal = document.getElementById('manualOrderModal');
    const manualProductNameInput = document.getElementById('manualProductName');
    const manualProductPriceInput = document.getElementById('manualProductPrice');
    const manualProductQtyInput = document.getElementById('manualProductQty');
    const barcodeScannerModal = document.getElementById('barcodeScannerModal');
    const barcodeInput = document.getElementById('barcodeInput');
    const scanFeedback = document.getElementById('scan-feedback');
    const submitBarcodeButton = document.getElementById('submitBarcodeButton');
    const addManualOrderFab = document.getElementById('add-manual-order-fab');
    const clearCartFab = document.getElementById('clear-cart-fab');
    const btnBayarTunai = document.getElementById('btn-bayar-tunai');
    const btnBayarQris = document.getElementById('btn-bayar-qris');

    // NEW: Referensi ke pop-up pilihan cetak
    const printOptionsPopup = document.getElementById('print-options-popup');
    const btnPrintTunai = document.getElementById('btn-print-tunai');
    const btnPrintQris = document.getElementById('btn-print-qris');
    const closePrintPopupBtn = document.getElementById('close-print-popup');


    // --- DATA PRODUK ---
    const produkData = [
        { id: 1, nama: "Risol", harga: 3000, gambar: "risol.webp", barcode: "0674448829853" },
        { id: 2, nama: "Cibay", harga: 2500, gambar: "cibay.webp", barcode: "cibay" },
        { id: 3, nama: "Citung", harga: 2500, gambar: "citung.webp", barcode: "citung" },
        { id: 4, nama: "Topokki", harga: 5000, gambar: "toppoki.webp", barcode: "toppoki" },
        { id: 5, nama: "Tteokbokki Besar", harga: 10000, gambar: "toppoki.webp", barcode: "toppoki10" },
        { id: 6, nama: "Spaghetti", harga: 6000, gambar: "spaghetti.webp", barcode: "spaghetti" },
        { id: 7, nama: "Spaghetti Besar", harga: 10000, gambar: "spaghetti.webp", barcode: "spaghetti10" },
        { id: 8, nama: "Balungan", harga: 5000, gambar: "balungan.webp", barcode: "balungan" },
        { id: 9, nama: "Es Teh Jumbo", harga: 3000, gambar: "esteh.webp", barcode: "esteh" },
        { id: 10, nama: "Es Teh kecil", harga: 2000, gambar: "esteh.webp", barcode: "esteh2" }
    ];

    let keranjang = [];
    let nextManualItemId = 1000;
    let isNominalInputFocused = false;

    // --- SETTING STRUK/WHATSAPP ---
    const defaultShopName = "HARINFOOD";
    const displayPhoneNumber = "081235368643";
    const whatsappPhoneNumber = "6281235368643";
    const defaultAddress = "Jl Ender Rakit - Gedongan";
    const defaultFooterText = "Terima kasih sehat selalu ya";
    const qrisImagePath = "qris.webp";
    const qrisDownloadLink = "https://drive.google.com/file/d/1XAOms4tVa2jkkkCdXRwbNIGy0dvu7RIk/view?usp=drivesdk";


    // --- UTILITAS FORMAT RUPIAH ---
    const formatRupiah = (number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(number);
    };

    // --- LOGIKA LOGIN ---
    btnPelanggan.addEventListener('click', () => {
        formPelanggan.style.display = 'flex';
        formKasir.style.display = 'none';
        namaPelangganLoginInput.focus();
    });

    btnKasir.addEventListener('click', () => {
        formKasir.style.display = 'flex';
        formPelanggan.style.display = 'none';
        namaKasirLoginInput.focus();
    });

    formPelanggan.addEventListener('submit', (event) => {
        event.preventDefault();
        const nama = namaPelangganLoginInput.value.trim();
        const alamat = alamatPelangganLoginInput.value.trim();

        if (nama && alamat) {
            localStorage.setItem('userRole', 'pelanggan');
            localStorage.setItem('namaPelanggan', nama);
            localStorage.setItem('alamatPelanggan', alamat);
            localStorage.setItem('namaPemesan', nama); // Juga simpan di 'namaPemesan' untuk kompatibilitas
            loginPopup.style.display = 'none';
            appContainer.style.display = 'block';
            kasirFabs.style.display = 'none'; // Pelanggan tidak melihat FAB kasir
            hideOpsiMakanKasir(); // Sembunyikan opsi makan untuk semua
            alert(`Selamat datang, ${nama}! Anda masuk sebagai Pelanggan.`);
            initializeApp();
        } else {
            alert('Harap isi nama dan alamat Anda.');
        }
    });

    formKasir.addEventListener('submit', (event) => {
        event.preventDefault();
        const namaKasir = namaKasirLoginInput.value.trim();
        const passwordKasir = passwordKasirLoginInput.value.trim();

        if (namaKasir === 'Harry' && passwordKasir === '313121') {
            localStorage.setItem('userRole', 'kasir');
            loginPopup.style.display = 'none';
            appContainer.style.display = 'block';
            kasirFabs.style.display = 'block'; // Kasir melihat FAB kasir
            document.getElementById('namaPemesanModal').style.display = 'none';
            hideOpsiMakanKasir(); // Sembunyikan opsi makan untuk semua
            alert('Selamat datang, Harry! Anda masuk sebagai Kasir.');
            initializeApp();
        } else {
            alert('Nama kasir atau password salah.');
        }
    });

    // --- MODAL NAMA PEMESAN ---
    function getNamaPemesanFromStorage() {
        return localStorage.getItem('namaPemesan') || '';
    }

    function getAlamatPemesanFromStorage() {
        return localStorage.getItem('alamatPelanggan') || '';
    }

    function autofillNamaPemesanForm() {
        const nama = getNamaPemesanFromStorage();
        const alamat = getAlamatPemesanFromStorage();
        const namaPemesanInputInForm = document.getElementById('nama-pemesan');
        const alamatPemesanInputInForm = document.getElementById('alamat-pemesan');
        if (namaPemesanInputInForm) {
            namaPemesanInputInForm.value = nama;
        }
        if (alamatPemesanInputInForm) {
            alamatPemesanInputInForm.value = alamat;
        }
    }

    document.getElementById('btnSimpanNamaPemesan').onclick = function() {
        var nama = document.getElementById('inputNamaPemesan').value.trim();
        if (nama.length < 2) {
            alert('Nama pemesan wajib diisi!');
            return;
        }
        localStorage.setItem('namaPemesan', nama);
        localStorage.setItem('namaPelanggan', nama);
        namaPemesanModal.style.display = 'none';
        autofillNamaPemesanForm();
    };

    // --- FUNGSI INISIALISASI APLIKASI ---
    function initializeApp() {
        const currentUserRole = localStorage.getItem('userRole');

        if (currentUserRole === 'pelanggan' && !localStorage.getItem('namaPemesan')) {
            namaPemesanModal.style.display = 'flex';
            inputNamaPemesan.focus();
        } else if (currentUserRole === 'kasir') {
            namaPemesanModal.style.display = 'none';
        }

        autofillNamaPemesanForm();
        displayProduk();
        updateKeranjang();
        hitungKembalian();

        // Mengatur visibilitas FABs kasir
        if (currentUserRole === 'kasir') {
            kasirFabs.style.display = 'block'; // FAB lainnya (manual, clear, barcode) untuk kasir
        } else {
            kasirFabs.style.display = 'none';
        }
        hideOpsiMakanKasir(); // Selalu sembunyikan opsi makan

        // Atur visibilitas tombol Cetak Struk dan WhatsApp berdasarkan peran
        updateActionButtonVisibility(); 

        // Opsi pembayaran (Tunai/QRIS) akan selalu terlihat dari awal
        paymentChoiceButtons.style.display = 'flex'; 
    }

    // --- INISIALISASI AWAL PADA DOMContentLoaded ---
    const storedRole = localStorage.getItem('userRole');
    if (storedRole) { // Jika sudah ada role tersimpan (sudah pernah login)
        loginPopup.style.display = 'none';
        appContainer.style.display = 'block';
        // Set visibilitas awal FABs dan tombol cetak saat halaman dimuat jika sudah login
        if (storedRole === 'kasir') {
            kasirFabs.style.display = 'block';
            cetakStrukButton.style.display = 'block'; // Tombol cetak untuk kasir
        } else {
            kasirFabs.style.display = 'none';
            cetakStrukButton.style.display = 'none'; // Tombol cetak untuk pelanggan
        }
        hideOpsiMakanKasir(); // Pastikan opsi makan disembunyikan
        initializeApp(); // Lanjutkan inisialisasi aplikasi
    } else { // Belum login
        loginPopup.style.display = 'flex'; // Tampilkan pop-up login
        appContainer.style.display = 'none'; // Sembunyikan aplikasi utama
    }


    // --- RENDER PRODUK + KONTROL QTY ---
    function displayProduk() {
        produkList.innerHTML = '';
        produkData.forEach(produk => {
            let itemInCart = keranjang.find(item => item.id === produk.id && !item.isManual);
            let qty = itemInCart ? itemInCart.qty : 0;
            const produkDiv = document.createElement('div');
            produkDiv.classList.add('produk-item');
            produkDiv.innerHTML = `
                <img src="${produk.gambar}" alt="${produk.nama}">
                <h3>${produk.nama}</h3>
                <p>Harga: ${formatRupiah(produk.harga)}</p>
                <div class="produk-controls" id="controls-${produk.id}">
                    ${
                        qty < 1 ? `
                        <button class="add-to-cart-btn qty-btn" data-id="${produk.id}" title="Tambah ke keranjang"><i class="fas fa-plus"></i></button>
                        ` : `
                        <button class="qty-control-btn qty-btn minus-btn" data-id="${produk.id}" data-action="minus" title="Kurangi qty">-</button>
                        <span class="qty-value">${qty}</span>
                        <button class="qty-control-btn qty-btn plus-btn" data-id="${produk.id}" data-action="plus" title="Tambah qty">+</button>
                        `
                    }
                </div>
            `;
            produkList.appendChild(produkDiv);
        });
    }

    function updateProdukControls() {
        displayProduk();
    }

    // --- EVENT QTY CONTROL DI MENU (DELEGASI) ---
    produkList.addEventListener('click', function(e) {
        const btn = e.target.closest('button');
        if (!btn) return;
        const produkId = parseInt(btn.dataset.id);

        if (btn.classList.contains('add-to-cart-btn')) {
            const product = produkData.find(p => p.id === produkId);
            if (product) {
                tambahKeKeranjang(product);
            }
            return;
        }
        if (btn.classList.contains('plus-btn')) {
            const itemInCart = keranjang.find(item => item.id === produkId && !item.isManual);
            if (itemInCart) {
                itemInCart.qty++;
                updateKeranjang();
                updateProdukControls();
            }
            return;
        }
        if (btn.classList.contains('minus-btn')) {
            const itemInCart = keranjang.find(item => item.id === produkId && !item.isManual);
            if (itemInCart) {
                itemInCart.qty--;
                if (itemInCart.qty <= 0) {
                    keranjang = keranjang.filter(item => !(item.id === produkId && !item.isManual));
                }
                updateKeranjang();
                updateProdukControls();
            }
            return;
        }
    });

    // --- TAMBAH KE KERANJANG ---
    function tambahKeKeranjang(produkSumber) {
        let productToAdd;

        if (produkSumber.isManual) {
            productToAdd = { ...produkSumber };
        } else {
            const existingItem = keranjang.find(item => {
                if (!item.isManual && item.id === produkSumber.id) {
                    return true;
                }
                if (produkSumber.barcode && item.barcode && item.barcode === produkSumber.barcode) {
                    return true;
                }
                return false;
            });

            if (existingItem) {
                existingItem.qty += (produkSumber.qty || 1);
                updateKeranjang();
                updateProdukControls();
                return;
            } else {
                productToAdd = { ...produkSumber };
                productToAdd.qty = produkSumber.qty || 1;
            }
        }

        if (productToAdd.isManual && !productToAdd.hasOwnProperty('id')) {
            productToAdd.id = nextManualItemId++;
        } else if (!productToAdd.hasOwnProperty('id') && !productToAdd.barcode) {
             productToAdd.id = nextManualItemId++;
             productToAdd.isManual = true;
        }
        
        keranjang.push(productToAdd);
        updateKeranjang();
        updateProdukControls();
    }

    // --- RENDER KERANJANG BELANJA ---
    function updateKeranjang() {
        let total = 0;
        keranjangItems.innerHTML = '';
        if (keranjang.length === 0) {
            keranjangItems.innerHTML = '<tr><td colspan="4" class="empty-cart-message">Keranjang kosong.</td></tr>';
        } else {
            keranjang.forEach((item, index) => {
                const subtotal = item.harga * item.qty;
                total += subtotal;
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${item.nama}</td>
                    <td><input type="number" value="${item.qty}" min="1" onchange="updateCartItemQty(${index}, this.value)"></td>
                    <td>${formatRupiah(item.harga)}</td>
                    <td><button onclick="removeFromCart(${index})" class="btn-remove-item"><i class="fas fa-trash-alt"></i></button></td>
                `;
                keranjangItems.appendChild(row);
            });
        }
        keranjangTotal.textContent = formatRupiah(total);
        const totalBelanjaNumeric = total;
        if (!isNominalInputFocused) {
            const currentNominalValueNumeric = parseFloat(nominalPembayaranInput.value) || 0;
            const isCurrentlyEmptyOrZero = nominalPembayaranInput.value === '' || currentNominalValueNumeric === 0;
            if (isCurrentlyEmptyOrZero || nominalPembayaranInput.dataset.autofilled === 'true') {
                nominalPembayaranInput.value = totalBelanjaNumeric;
                if (totalBelanjaNumeric > 0) {
                    nominalPembayaranInput.dataset.autofilled = 'true';
                } else {
                    delete nominalPembayaranInput.dataset.autofilled;
                }
            }
        }
        hitungKembalian();
    }

    window.updateCartItemQty = function(index, newQty) {
        let quantity = parseInt(newQty);
        if (isNaN(quantity) || quantity < 1) {
            quantity = 0;
        }
        if (quantity === 0) {
            keranjang.splice(index, 1);
        } else {
            keranjang[index].qty = quantity;
        }
        updateKeranjang();
        updateProdukControls();
    };

    window.removeFromCart = function(index) {
        keranjang.splice(index, 1);
        updateKeranjang();
        updateProdukControls();
    };

    // --- FAB CLEAR KERANJANG (MERAH) ---
    clearCartFab.addEventListener('click', () => {
        keranjang = [];
        updateKeranjang();
        updateProdukControls();
        nominalPembayaranInput.value = 0;
        delete nominalPembayaranInput.dataset.autofilled;
        hitungKembalian();
        // Sembunyikan tombol WhatsApp dan Cetak Struk saat keranjang dibersihkan
        pesanWhatsappBtn.style.display = 'none';
        cetakStrukButton.style.display = 'none'; 
    });

    // --- HITUNG KEMBALIAN ---
    function hitungKembalian() {
        const totalBelanja = parseFloat(keranjangTotal.textContent.replace('Rp', '').replace(/\./g, '').replace(',', '.')) || 0;
        const nominalPembayaran = parseFloat(nominalPembayaranInput.value) || 0;
        const kembalian = nominalPembayaran - totalBelanja;
        kembalianDisplay.textContent = formatRupiah(kembalian);
        kembalianDisplay.style.color = kembalian < 0 ? 'var(--danger-color)' : 'var(--text-price-color)';
    }
    nominalPembayaranInput.addEventListener('input', hitungKembalian);

    nominalPembayaranInput.addEventListener('focus', () => {
        isNominalInputFocused = true;
        if (nominalPembayaranInput.dataset.autofilled === 'true' || parseFloat(nominalPembayaranInput.value) === 0) {
            nominalPembayaranInput.value = '';
            delete nominalPembayaranInput.dataset.autofilled;
        }
    });
    nominalPembayaranInput.addEventListener('blur', () => {
        isNominalInputFocused = false;
        const totalBelanjaNumeric = parseFloat(keranjangTotal.textContent.replace('Rp', '').replace(/\./g, '').replace(',', '.')) || 0;
        if (nominalPembayaranInput.value === '' && totalBelanjaNumeric > 0) {
            nominalPembayaranInput.value = totalBelanjaNumeric;
            nominalPembayaranInput.dataset.autofilled = 'true';
            hitungKembalian();
        } else if (nominalPembayaranInput.value === '' && totalBelanjaNumeric === 0) {
            nominalPembayaranInput.value = 0;
            delete nominalPembayaranInput.dataset.autofilled;
            hitungKembalian();
        }
    });

    // --- FUNGSI CETAK STRUK UTAMA (dipanggil oleh cetakStrukButton, Tunai, dan QRIS) ---
    function printStruk(paymentMethod) {
        const namaPemesan = namaPemesanInput.value.trim();
        const alamatPemesan = alamatPemesanInput.value.trim();
        const keteranganPesanan = keteranganPesananInput.value.trim();

        const totalBelanja = keranjang.reduce((sum, item) => sum + (item.harga * item.qty), 0);
        const nominalPembayaran = parseFloat(nominalPembayaranInput.value) || 0;
        const kembalian = nominalPembayaran - totalBelanja;

        if (keranjang.length === 0) {
            alert('Keranjang belanja masih kosong!');
            return false;
        }
        if (nominalPembayaran < totalBelanja && paymentMethod === 'Tunai') {
            alert('Nominal pembayaran kurang dari total belanja.');
            return false;
        }
        
        const opsiMakan = (document.querySelector('input[name="opsi-makan"]:checked'))
                         ? document.querySelector('input[name="opsi-makan"]:checked').value
                         : 'Tidak Dipilih';
        
        const tanggalWaktu = new Date();
        const formattedDate = tanggalWaktu.toLocaleDateString('id-ID', { day: '2-digit', month: '2-digit', year: 'numeric' });
        const formattedTime = tanggalWaktu.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' });

        let printContent = `
            <html>
            <head>
                <title>Struk Belanja</title>
                <link rel="stylesheet" href="style.css">
            </head>
            <body>
                <div id="print-area">
                    <div class="print-header">
                        <p class="shop-name-print">${defaultShopName}</p>
                        <p class="shop-address-print">${defaultAddress}</p>
                        <p class="shop-phone-print">${displayPhoneNumber}</p>
                    </div>
                    <div class="print-info">
                        <p>Pelanggan: ${namaPemesan || '-'}</p>
                        <p>Alamat: ${alamatPemesan || '-'}</p>
                        <p>Tanggal: ${formattedDate}</p>
                        <p>Jam: ${formattedTime}</p>
                        ${localStorage.getItem('userRole') === 'kasir' ? `<p>Opsi: ${opsiMakan}</p>` : ''}
                    </div>
        `;
        if (keteranganPesanan) { // Tambahkan keterangan pesanan jika ada
            printContent += `
                    <div class="print-notes">
                        <p>Catatan: ${keteranganPesanan}</p>
                    </div>
            `;
        }
        printContent += `
                    <hr>
                    <table><tbody>
        `;
        keranjang.forEach(item => {
            printContent += `<tr><td>${item.nama} (${item.qty}x)</td><td style="text-align:right;">${formatRupiah(item.harga)}</td></tr>`;
        });
        printContent += `
                    </tbody></table>
                    <hr>
                    <p class="total-row"><span>TOTAL:</span> ${formatRupiah(totalBelanja)}</p>
                    <p class="print-payment-info"><span>Metode:</span> ${paymentMethod}</p>
                    <p class="print-payment-info"><span>BAYAR:</span> ${formatRupiah(nominalPembayaran)}</p>
                    <p class="print-payment-info"><span>KEMBALIAN:</span> ${formatRupiah(kembalian)}</p>
        `;

        // Sertakan QRIS hanya jika metode pembayaran QRIS
        if (paymentMethod === 'QRIS') {
            printContent += `
                    <div style="text-align: center; margin-top: 10px; margin-bottom: 5px;">
                        <img src="${qrisImagePath}" alt="QRIS Code" style="width: 45mm; height: auto; display: block; margin: 0 auto; padding-bottom: 5px;">
                    </div>
            `;
            printContent += `<p class="thank-you">${defaultFooterText} - Scan QRIS Untuk Pembayaran</p>`;
        } else { // Jika Tunai, tidak ada gambar QRIS
            printContent += `<p class="thank-you">${defaultFooterText}</p>`;
        }

        printContent += `</div></body></html>`;

        const printWindow = window.open('', '_blank');
        printWindow.document.write(printContent);
        printWindow.document.close();

        printWindow.focus();
        
        setTimeout(() => {
            printWindow.print();
            // Setelah cetak, bersihkan keranjang dan reset form
            keranjang = [];
            updateKeranjang();
            namaPemesanInput.value = '';
            alamatPemesanInput.value = '';
            keteranganPesananInput.value = ''; // Reset keterangan
            nominalPembayaranInput.value = 0;
            // Opsi makan tidak lagi ditampilkan, jadi tidak perlu reset radio
            hitungKembalian();
            // Sembunyikan tombol pembayaran (Tunai/QRIS) dan tombol aksi (WA/Cetak)
            paymentChoiceButtons.style.display = 'none'; // Sembunyikan tombol Tunai/QRIS
            updateActionButtonVisibility(); // Tampilkan tombol WA / Cetak Struk
        }, 300);
        return true;
    }

    // --- FUNGSI KIRIM PESAN WHATSAPP ---
    function kirimWhatsappMessage(paymentMethod) {
        const namaPemesan = namaPemesanInput.value.trim();
        const alamatPemesan = alamatPemesanInput.value.trim();
        const keteranganPesanan = keteranganPesananInput.value.trim(); // Ambil nilai keterangan

        const totalBelanja = keranjang.reduce((sum, item) => sum + (item.harga * item.qty), 0);
        const nominalPembayaran = parseFloat(nominalPembayaranInput.value) || 0;
        const kembalian = nominalPembayaran - totalBelanja;

        if (keranjang.length === 0) {
            alert('Keranjang belanja masih kosong, tidak bisa pesan via WhatsApp!');
            return false;
        }
        if (nominalPembayaran < totalBelanja && paymentMethod === 'Tunai') {
            alert('Nominal pembayaran kurang dari total belanja.');
            return false;
        }

        const opsiMakan = (document.querySelector('input[name="opsi-makan"]:checked'))
                         ? document.querySelector('input[name="opsi-makan"]:checked').value
                         : 'Tidak Dipilih';
        
        const tanggalWaktu = new Date();
        const formattedDate = tanggalWaktu.toLocaleDateString('id-ID', { day: '2-digit', month: '2-digit', year: 'numeric' });
        const formattedTime = tanggalWaktu.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' });

        let whatsappMessage = `*${defaultShopName}*\n`;
        whatsappMessage += `Telp: ${displayPhoneNumber}\n`;
        whatsappMessage += "-----------------------------\n";
        whatsappMessage += `Pelanggan: ${namaPemesan || '-'}\n`;
        whatsappMessage += `Alamat: ${alamatPemesan || '-'}\n`;
        whatsappMessage += `Tanggal: ${formattedDate}\n`;
        whatsappMessage += `Jam: ${formattedTime}\n`;
        if (localStorage.getItem('userRole') === 'kasir') {
            whatsappMessage += `Opsi: ${opsiMakan}\n`;
        }
        whatsappMessage += "-----------------------------\n";
        whatsappMessage += "*Detail Pesanan:*\n";
        keranjang.forEach(item => {
            whatsappMessage += `- ${item.nama} (${item.qty}x) ${formatRupiah(item.harga)}\n`;
        });
        whatsappMessage += "-----------------------------\n";
        whatsappMessage += `*Total: ${formatRupiah(totalBelanja)}*\n`;
        
        if (paymentMethod === 'QRIS') {
            whatsappMessage += `*Metode Pembayaran: QRIS*\n`;
            whatsappMessage += `\nSilakan scan QRIS untuk pembayaran: ${qrisDownloadLink}\n`;
            whatsappMessage += `(Abaikan nominal bayar/kembalian jika Anda menggunakan QRIS)\n`;
        } else {
            whatsappMessage += `*Metode Pembayaran: Tunai*\n`;
            whatsappMessage += `*Bayar: ${formatRupiah(nominalPembayaran)}*\n`;
        }
        
        if (keteranganPesanan) { // Tambahkan keterangan pesanan jika ada
            whatsappMessage += `*Catatan:*\n${keteranganPesanan}\n\n`;
        }
        whatsappMessage += defaultFooterText;
        const encodedMessage = encodeURIComponent(whatsappMessage);
        const whatsappURL = `https://wa.me/${whatsappPhoneNumber}?text=${encodedMessage}`;
        window.open(whatsappURL, '_blank');
        alert('Pesan WhatsApp telah disiapkan. Silakan pilih kontak dan kirim!');
        // Tampilkan kembali tombol aksi (WhatsApp/Cetak) setelah transaksi selesai
        updateActionButtonVisibility();
        // Sembunyikan tombol pembayaran (Tunai/QRIS)
        paymentChoiceButtons.style.display = 'none';

        return true;
    }

    // --- Fungsi untuk mengupdate visibilitas tombol aksi (WhatsApp/Cetak) ---
    // Dipanggil setelah transaksi selesai atau inisialisasi
    function updateActionButtonVisibility() {
        const currentUserRole = localStorage.getItem('userRole');
        if (currentUserRole === 'pelanggan') {
            pesanWhatsappBtn.style.display = 'block'; // Pelanggan melihat tombol WhatsApp
            cetakStrukButton.style.display = 'none'; // Pelanggan tidak melihat tombol Cetak Struk
        } else { // Kasir
            pesanWhatsappBtn.style.display = 'none'; // Kasir tidak melihat tombol WA utama
            cetakStrukButton.style.display = 'block'; // Kasir melihat tombol Cetak Struk
        }
    }


    // --- Event Listeners untuk Tombol Pembayaran Tunai/QRIS ---
    btnBayarTunai.addEventListener('click', () => {
        // Validasi keranjang kosong
        if (keranjang.length === 0) {
            alert('Keranjang belanja kosong. Harap tambahkan produk.');
            return;
        }
        // Kirim WhatsApp dan cetak struk (parameter Tunai)
        kirimWhatsappMessage('Tunai'); // Kirim WhatsApp Tunai
        printStruk('Tunai'); // Cetak Struk Tunai
    });

    btnBayarQris.addEventListener('click', () => {
        // Validasi keranjang kosong
        if (keranjang.length === 0) {
            alert('Keranjang belanja kosong. Harap tambahkan produk.');
            return;
        }
        // Kirim WhatsApp dan cetak struk (parameter QRIS)
        kirimWhatsappMessage('QRIS'); // Kirim WhatsApp QRIS
        printStruk('QRIS'); // Cetak Struk QRIS
    });

    // --- Event Listener untuk Tombol CETAK STRUK (hanya untuk Kasir) ---
    // Ini adalah tombol yang akan memunculkan pop-up pilihan pembayaran cetak.
    cetakStrukButton.addEventListener('click', () => {
        if (keranjang.length === 0) {
            alert('Keranjang belanja kosong. Tidak ada yang bisa dicetak.');
            return;
        }
        // Tampilkan pop-up pilihan cetak
        printOptionsPopup.style.display = 'flex';
    });

    // --- Event Listener untuk pilihan di pop-up Cetak Struk ---
    // (Pilihan Tunai di Pop-up Cetak)
    btnPrintTunai.addEventListener('click', () => {
        // Tutup pop-up
        printOptionsPopup.style.display = 'none';
        // Cetak struk sebagai Tunai (tanpa QRIS)
        printStruk('Tunai');
    });

    // (Pilihan QRIS di Pop-up Cetak)
    btnPrintQris.addEventListener('click', () => {
        // Tutup pop-up
        printOptionsPopup.style.display = 'none';
        // Cetak struk sebagai QRIS (dengan QRIS)
        printStruk('QRIS');
    });

    // (Tombol Tutup Pop-up Cetak)
    closePrintPopupBtn.addEventListener('click', () => {
        printOptionsPopup.style.display = 'none';
    });


    // --- MODAL & PESANAN MANUAL ---
    addManualOrderFab.addEventListener('click', () => {
        manualOrderModal.style.display = 'flex';
        manualProductNameInput.value = '';
        manualProductPriceInput.value = '';
        manualProductQtyInput.value = '1';
        manualProductNameInput.focus();
    });
    window.closeManualOrderModal = function() {
        manualOrderModal.style.display = 'none';
    };
    window.addManualOrderItem = function() {
        const name = manualProductNameInput.value.trim();
        const price = parseFloat(manualProductPriceInput.value);
        const qty = parseInt(manualProductQtyInput.value);
        if (!name || isNaN(price) || price <= 0 || isNaN(qty) || qty <= 0) {
            alert('Mohon lengkapi semua bidang dengan nilai yang valid (harga & kuantitas harus positif).');
            return;
        }
        const manualProduct = {
            id: nextManualItemId++,
            nama: name,
            harga: price,
            qty: qty,
            isManual: true
        };
        tambahKeKeranjang(manualProduct);
        closeManualOrderModal();
    };

    // --- BARCODE SCANNER EKSTERNAL (dengan pop-up) ---
    scanBarcodeFab.addEventListener('click', () => {
        barcodeScannerModal.style.display = 'flex';
        barcodeInput.value = '';
        scanFeedback.textContent = 'Siap menerima barcode...';
        barcodeInput.focus();
    });

    window.closeBarcodeScannerModal = function() {
        barcodeScannerModal.style.display = 'none';
        barcodeInput.blur();
        barcodeInput.value = '';
    };

    submitBarcodeButton.addEventListener('click', () => {
        const scannedBarcode = barcodeInput.value.trim();
        if (scannedBarcode) {
            processScannedBarcode(scannedBarcode);
        } else {
            scanFeedback.textContent = 'Barcode tidak boleh kosong.';
        }
    });

    barcodeInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            const scannedBarcode = barcodeInput.value.trim();
            if (scannedBarcode) {
                processScannedBarcode(scannedBarcode);
            } else {
                scanFeedback.textContent = 'Barcode tidak boleh kosong.';
            }
        }
    });

    function processScannedBarcode(barcode) {
        console.log("Processing scanned barcode:", barcode);
        const foundProduct = produkData.find(p => p.barcode === barcode);

        if (foundProduct) {
            tambahKeKeranjang(foundProduct);
            scanFeedback.textContent = `Produk "${foundProduct.nama}" ditambahkan!`;
            barcodeInput.value = '';
            barcodeInput.focus();
        } else {
            scanFeedback.textContent = `Barcode ${barcode} tidak ditemukan di katalog. Coba lagi.`;
            barcodeInput.value = '';
            barcodeInput.focus();
        }
    }

    // --- FUNGSI HIDE/SHOW PILIHAN MAKAN ---
    function hideOpsiMakanKasir() {
        if (opsiMakanContainer) opsiMakanContainer.style.display = 'none';
        if (pesanInfoLabel) pesanInfoLabel.style.display = 'none';
    }

    function showOpsiMakanKasir() {
        hideOpsiMakanKasir(); // Memastikan selalu tersembunyi
    }
});
