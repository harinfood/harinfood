document.addEventListener('DOMContentLoaded', () => {
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
    const kasirFabs = document.getElementById('kasir-fabs');
    const pesanInfoLabel = document.getElementById('pesan-info-label');
    const paymentChoiceButtons = document.getElementById('payment-choice-buttons');
    const pesanWhatsappPelangganBtn = document.getElementById('pesan-whatsapp-pelanggan');
    const cetakStrukButton = document.getElementById('cetak-struk-button');
    const namaPemesanInput = document.getElementById('nama-pemesan');
    const alamatPemesanInput = document.getElementById('alamat-pemesan');
    const keteranganPesananInput = document.getElementById('keterangan-pesanan');
    const nominalPembayaranInput = document.getElementById('nominal-pembayaran');
    const kembalianDisplay = document.getElementById('kembalian-display');
    const produkList = document.getElementById('produk-list');
    const keranjangItems = document.getElementById('keranjang-items');
    const keranjangTotal = document.getElementById('keranjang-total');
    const manualOrderModal = document.getElementById('manualOrderModal');
    const manualProductNameInput = document.getElementById('manualProductName');
    const manualProductPriceInput = document.getElementById('manualProductPrice');
    const manualProductQtyInput = document.getElementById('manualProductQty');
    const addManualOrderFab = document.getElementById('add-manual-order-fab');
    const clearCartFab = document.getElementById('clear-cart-fab');
    const btnBayarQris = document.getElementById('btn-bayar-qris');
    const shareOrderFab = document.getElementById('share-order-fab');
    const printFab = document.getElementById('print-fab');
    const printOptionsPopup = document.getElementById('print-options-popup');
    const btnPrintTunai = document.getElementById('btn-print-tunai');
    const btnPrintQris = document.getElementById('btn-print-qris');
    const closePrintPopupBtn = document.getElementById('close-print-popup');
    const productSearchBarcodeInput = document.getElementById('product-search-barcode');
    const searchBarcodeFeedback = document.getElementById('search-barcode-feedback');
    const namaPemesanModal = document.getElementById('namaPemesanModal');
    const inputNamaPemesan = document.getElementById('inputNamaPemesan');
    // Diskon hanya untuk kasir
    const diskonSection = document.getElementById('diskon-section');
    const namaDiskonInput = document.getElementById('nama-diskon');
    const nilaiDiskonInput = document.getElementById('nilai-diskon');

    // Data Produk
    const produkData = [
        { id: 1, nama: "Risol", harga: 3000, gambar: "risol.webp", barcode: "0674448829853" },
        { id: 2, nama: "Cibay", harga: 2500, gambar: "cibay.webp", barcode: "cibay" },
        { id: 3, nama: "Citung", harga: 2500, gambar: "citung.webp", barcode: "citung" },
        { id: 11, nama: "Balungan", harga: 2500, gambar: "balungan.webp", barcode: "balungan" },
        { id: 4, nama: "Topokki", harga: 5000, gambar: "toppoki.webp", barcode: "toppoki" },
        { id: 5, nama: "Tteokbokki Besar", harga: 10000, gambar: "toppoki.webp", barcode: "toppoki10" },
        { id: 9, nama: "Es Teh Jumbo", harga: 3000, gambar: "esteh.webp", barcode: "esteh" },
        { id: 10, nama: "Es Teh kecil", harga: 2000, gambar: "esteh.webp", barcode: "esteh2" }
    ];
    const produkDefaultHarga = produkData.map(p => ({ id: p.id, harga: p.harga }));

    let keranjang = [];
    let nextManualItemId = 1000;
    let isNominalInputFocused = false;

    // RESET HARGA PRODUK KE DEFAULT
    function resetHargaProdukKeDefault() {
        produkDefaultHarga.forEach(def => {
            const produk = produkData.find(p => p.id === def.id);
            if (produk) produk.harga = def.harga;
        });
        localStorage.removeItem('produkHarga');
    }

    // LOGIN LOGIC
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
            localStorage.setItem('namaPemesan', nama);
            loginPopup.style.display = 'none';
            appContainer.style.display = 'block';
            kasirFabs.style.display = 'none';
            pesanInfoLabel.style.display = 'block';
            pesanInfoLabel.textContent = "Terima kasih pelanggan setia, sehat selalu ya 🙏 tanpa anda tidak ada cerita di kedai kita. Selalu kunjungi kami ya";
            initializeApp();
        }
    });
    formKasir.addEventListener('submit', (event) => {
        event.preventDefault();
        const namaKasir = namaKasirLoginInput.value.trim();
        const passwordKasir = passwordKasirLoginInput.value.trim();
        if (namaKasir === 'Harry' && passwordKasir === '313121') {
            localStorage.setItem('userRole', 'kasir');
            localStorage.setItem('namaKasir', namaKasir);
            loginPopup.style.display = 'none';
            appContainer.style.display = 'block';
            kasirFabs.style.display = 'block';
            namaPemesanModal.style.display = 'none';
            pesanInfoLabel.style.display = 'none';
            initializeApp();
        } else {
            alert('Nama kasir atau password salah!');
        }
    });

    // Modal Nama Pemesan
    document.getElementById('btnSimpanNamaPemesan').onclick = function() {
        var nama = inputNamaPemesan.value.trim();
        if (nama.length < 2) { return; }
        localStorage.setItem('namaPemesan', nama);
        localStorage.setItem('namaPelanggan', nama);
        namaPemesanModal.style.display = 'none';
        autofillNamaPemesanForm();
    };
    function autofillNamaPemesanForm() {
        const nama = localStorage.getItem('namaPemesan') || '';
        const alamat = localStorage.getItem('alamatPelanggan') || '';
        if (namaPemesanInput) namaPemesanInput.value = nama;
        if (alamatPemesanInput) alamatPemesanInput.value = alamat;
    }

    // Inisialisasi aplikasi
    function initializeApp() {
        const currentUserRole = localStorage.getItem('userRole');
        if (currentUserRole === 'kasir') {
            diskonSection.style.display = 'flex';
        } else {
            diskonSection.style.display = 'none';
            namaDiskonInput.value = '';
            nilaiDiskonInput.value = 0;
        }
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
        updateActionButtonVisibility();
        paymentChoiceButtons.style.display = 'flex';
    }

    // Produk
    function displayProduk() {
        produkList.innerHTML = '';
        const currentUserRole = localStorage.getItem('userRole');
        produkData.forEach(produk => {
            let itemInCart = keranjang.find(item => item.id === produk.id && !item.isManual);
            let qty = itemInCart ? itemInCart.qty : 0;
            const produkDiv = document.createElement('div');
            produkDiv.classList.add('produk-item');
            let hargaDisplayHtml = `<p>Harga: <span class="price-display">${formatRupiah(produk.harga)}</span></p>`;
            if (currentUserRole === 'kasir') {
                hargaDisplayHtml = `
                    <p class="edit-price-wrapper">
                        Harga: 
                        <input type="number" 
                               class="product-price-input" 
                               data-id="${produk.id}" 
                               value="${produk.harga}" 
                               min="0" 
                               onchange="handlePriceChange(this, ${produk.id})"
                               onblur="formatPriceInput(this)">
                    </p>`;
            }
            produkDiv.innerHTML = `
                <img src="${produk.gambar}" alt="${produk.nama}">
                <h3>${produk.nama}</h3>
                ${hargaDisplayHtml} 
                <div class="produk-controls" id="controls-${produk.id}">
                    ${qty < 1 ? `
                        <button class="add-to-cart-btn qty-btn" data-id="${produk.id}" title="Tambah ke keranjang"><i class="fas fa-plus"></i></button>
                    ` : `
                        <button class="qty-control-btn qty-btn minus-btn" data-id="${produk.id}" data-action="minus" title="Kurangi qty">-</button>
                        <span class="qty-value">${qty}</span>
                        <button class="qty-control-btn qty-btn plus-btn" data-id="${produk.id}" data-action="plus" title="Tambah qty">+</button>
                    `}
                </div>
            `;
            produkList.appendChild(produkDiv);
        });
    }
    function updateProdukControls() { displayProduk(); }
    window.handlePriceChange = function(inputElement, produkId) {
        let newPrice = parseFloat(inputElement.value);
        if (isNaN(newPrice) || newPrice < 0) newPrice = 0;
        const produk = produkData.find(p => p.id === produkId);
        if (produk) {
            produk.harga = newPrice;
            keranjang.forEach(item => {
                if (!item.isManual && item.id === produkId) {
                    item.harga = newPrice;
                }
            });
            localStorage.setItem('produkHarga', JSON.stringify(produkData.map(p => ({ id: p.id, harga: p.harga }))));
            updateKeranjang();
        }
    };
    window.formatPriceInput = function(inputElement) {
        let value = parseFloat(inputElement.value);
        if (isNaN(value)) value = 0;
        inputElement.value = value;
    };
    produkList.addEventListener('focusin', function(e) {
        const input = e.target;
        if (input.classList.contains('product-price-input')) input.value = '';
    });
    produkList.addEventListener('keydown', function(e) {
        const input = e.target;
        if (input.classList.contains('product-price-input') && e.key === 'Enter') {
            e.preventDefault();
            const produkId = parseInt(input.dataset.id);
            window.handlePriceChange(input, produkId);
            input.blur();
        }
    });
    produkList.addEventListener('click', function(e) {
        const btn = e.target.closest('button');
        if (!btn) return;
        const produkId = parseInt(btn.dataset.id);
        if (btn.classList.contains('add-to-cart-btn')) {
            const product = produkData.find(p => p.id === produkId);
            if (product) tambahKeKeranjang(product);
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

    function tambahKeKeranjang(produkSumber) {
        let productToAdd;
        if (produkSumber.isManual) {
            productToAdd = { ...produkSumber };
        } else {
            const existingItem = keranjang.find(item => !item.isManual && item.id === produkSumber.id);
            if (existingItem) {
                existingItem.qty += (produkSumber.qty || 1);
                updateKeranjang();
                updateProdukControls();
                return;
            } else {
                productToAdd = { ...produkSumber, qty: produkSumber.qty || 1 };
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
                    <td>
                        <input type="number" value="${item.qty}" min="1"
                            onchange="updateCartItemQty(${index}, this.value)"
                            onfocus="clearQtyOnFocus(this, ${index})"
                        >
                    </td>
                    <td>${formatRupiah(subtotal)}</td>
                    <td><button onclick="removeFromCart(${index})" class="btn-remove-item"><i class="fas fa-trash-alt"></i></button></td>
                `;
                keranjangItems.appendChild(row);
            });
        }
        // Diskon hanya untuk kasir
        let totalSetelahDiskon = total;
        if (localStorage.getItem('userRole') === 'kasir') {
            let diskon = parseFloat(nilaiDiskonInput.value) || 0;
            if (diskon < 0) diskon = 0;
            totalSetelahDiskon = Math.max(total - diskon, 0);
        }
        keranjangTotal.textContent = formatRupiah(totalSetelahDiskon);

        // Autofill nominal pembayaran sesuai total setelah diskon
        const totalBelanjaNumeric = totalSetelahDiskon;
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
    nilaiDiskonInput.addEventListener('input', () => {
        updateKeranjang();
    });
    namaDiskonInput.addEventListener('input', () => {
        // Optional: jika mau update preview di keranjang/struk
    });

    window.clearQtyOnFocus = function(inputElement, index) { inputElement.value = ''; };
    window.updateCartItemQty = function(index, newQty) {
        let quantity = parseInt(newQty);
        if (isNaN(quantity) || quantity < 1) quantity = 0;
        if (quantity === 0) keranjang.splice(index, 1);
        else keranjang[index].qty = quantity;
        updateKeranjang();
        updateProdukControls();
    };
    window.removeFromCart = function(index) {
        keranjang.splice(index, 1);
        updateKeranjang();
        updateProdukControls();
    };

    clearCartFab.addEventListener('click', () => {
        keranjang = [];
        resetHargaProdukKeDefault();
        updateKeranjang();
        updateProdukControls();
        namaPemesanInput.value = '';
        alamatPemesanInput.value = '';
        keteranganPesananInput.value = '';
        nominalPembayaranInput.value = 0;
        namaDiskonInput.value = '';
        nilaiDiskonInput.value = 0;
        delete nominalPembayaranInput.dataset.autofilled;
        hitungKembalian();
        updateActionButtonVisibility();
        productSearchBarcodeInput.value = '';
        productSearchBarcodeInput.focus();
    });

    function hitungKembalian() {
        const totalBelanja = parseFloat(keranjangTotal.textContent.replace('Rp', '').replace(/\./g, '').replace(',', '.')) || 0;
        const nominalPembayaran = parseFloat(nominalPembayaranInput.value) || 0;
        const kembalian = nominalPembayaran - totalBelanja;
        kembalianDisplay.textContent = formatRupiah(kembalian);
        kembalianDisplay.style.color = kembalian < 0 ? '#dc3545' : '#ffcc00';
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

    function formatRupiah(number) {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(number);
    }

    // FAB Print
    if (printFab) {
        printFab.addEventListener('click', () => {
            if (keranjang.length === 0) {
                alert('Keranjang belanja kosong. Tidak ada yang bisa dicetak.');
                return;
            }
            printOptionsPopup.style.display = 'flex';
        });
    }

    // FAB Share
    shareOrderFab.addEventListener('click', async () => {
        const shareResult = generateShareMessage('Tunai');
        if (!shareResult.success) {
            alert(shareResult.message);
            return;
        }
        const messageToShare = shareResult.message +
            "\n\n[Link Pembayaran QRIS]\nhttps://drive.google.com/file/d/1XAOms4tVa2jkkkCdXRwbNIGy0dvu7RIk/view?usp=drivesdk";
        const totalBelanja = shareResult.total;
        const nominalPembayaran = shareResult.nominal;
        if (totalBelanja === 0) {
            alert('Keranjang belanja kosong. Tidak ada transaksi untuk dibagikan.');
            return;
        }
        if (nominalPembayaran < totalBelanja) {
            alert('Nominal pembayaran kurang dari total belanja. Harap selesaikan pembayaran sebelum membagikan transaksi.');
            return;
        }
        try {
            if (navigator.share) {
                await navigator.share({
                    title: 'Detail Transaksi HARINFOOD',
                    text: messageToShare
                });
                keranjang = [];
                resetHargaProdukKeDefault();
                updateKeranjang();
                updateProdukControls();
                namaPemesanInput.value = '';
                alamatPemesanInput.value = '';
                keteranganPesananInput.value = '';
                nominalPembayaranInput.value = 0;
                namaDiskonInput.value = '';
                nilaiDiskonInput.value = 0;
                hitungKembalian();
                updateActionButtonVisibility();
                productSearchBarcodeInput.value = '';
                productSearchBarcodeInput.focus();
                return;
            }
        } catch (error) {}
        const encodedMessage = encodeURIComponent(messageToShare);
        const whatsappURL = `https://wa.me/6281235368643?text=${encodedMessage}`;
        window.open(whatsappURL, '_blank');
        keranjang = [];
        resetHargaProdukKeDefault();
        updateKeranjang();
        updateProdukControls();
        namaPemesanInput.value = '';
        alamatPemesanInput.value = '';
        keteranganPesananInput.value = '';
        nominalPembayaranInput.value = 0;
        namaDiskonInput.value = '';
        nilaiDiskonInput.value = 0;
        hitungKembalian();
        updateActionButtonVisibility();
        productSearchBarcodeInput.value = '';
        productSearchBarcodeInput.focus();
    });

    // QRIS Button - langsung buka link QRIS
    btnBayarQris.addEventListener('click', () => {
        window.open('https://drive.google.com/file/d/1XAOms4tVa2jkkkCdXRwbNIGy0dvu7RIk/view?usp=drivesdk', '_blank');
    });

    // WhatsApp Button tetap seperti semula
    pesanWhatsappPelangganBtn.addEventListener('click', () => {
        if (keranjang.length === 0) {
            alert('Keranjang belanja kosong. Harap tambahkan produk.');
            return;
        }
        const shareResult = generateShareMessage('Tunai');
        if (!shareResult.success) {
            alert(shareResult.message);
            return;
        }
        const messageToSend = shareResult.message;
        const encodedMessage = encodeURIComponent(messageToSend);
        const whatsappURL = `https://wa.me/6281235368643?text=${encodedMessage}`;
        window.open(whatsappURL, '_blank');
        keranjang = [];
        resetHargaProdukKeDefault();
        updateKeranjang();
        updateProdukControls();
        namaPemesanInput.value = '';
        alamatPemesanInput.value = '';
        keteranganPesananInput.value = '';
        nominalPembayaranInput.value = 0;
        namaDiskonInput.value = '';
        nilaiDiskonInput.value = 0;
        hitungKembalian();
        updateActionButtonVisibility();
        productSearchBarcodeInput.value = '';
        productSearchBarcodeInput.focus();
    });

    function generateShareMessage(paymentMethod) {
        const namaPemesan = namaPemesanInput.value.trim();
        const alamatPemesan = alamatPemesanInput.value.trim();
        const keteranganPesanan = keteranganPesananInput.value.trim();
        const kasirName = localStorage.getItem('namaKasir') || '-';
        const currentUserRole = localStorage.getItem('userRole');
        const totalBelanja = keranjang.reduce((sum, item) => sum + (item.harga * item.qty), 0);
        let diskonNama = '', diskonNilai = 0;
        if (currentUserRole === 'kasir') {
            diskonNama = namaDiskonInput.value.trim() || '-';
            diskonNilai = parseFloat(nilaiDiskonInput.value) || 0;
        }
        const totalSetelahDiskon = Math.max(totalBelanja - diskonNilai, 0);
        const nominalPembayaran = parseFloat(nominalPembayaranInput.value) || 0;
        const kembalian = nominalPembayaran - totalSetelahDiskon;
        if (keranjang.length === 0) {
            return { success: false, message: 'Keranjang belanja masih kosong!' };
        }
        let message =
            `*STRUK TRANSAKSI HARINFOOD*\n` +
            `----------------------------\n` +
            `Nama: ${namaPemesan || '-'}\n` +
            `Alamat: ${alamatPemesan || '-'}\n` +
            (currentUserRole === 'kasir' ? `Kasir: ${kasirName}\n` : '') +
            `Tanggal: ${new Date().toLocaleDateString('id-ID')}\n` +
            `Jam: ${new Date().toLocaleTimeString('id-ID')}\n`;
        if (keteranganPesanan) {
            message += `Catatan: ${keteranganPesanan}\n`;
        }
        message += `----------------------------\n`;
        keranjang.forEach(item => {
            message += `${item.nama} (${item.qty}x): ${formatRupiah(item.harga * item.qty)}\n`;
        });
        if (currentUserRole === 'kasir' && diskonNilai > 0) {
            message += `----------------------------\n`;
            message += `Diskon (${diskonNama}): -${formatRupiah(diskonNilai)}\n`;
        }
        message += `----------------------------\n`;
        message += `TOTAL: ${formatRupiah(totalSetelahDiskon)}\n`;
        message += `Metode: ${paymentMethod}\n`;
        message += `Bayar: ${formatRupiah(nominalPembayaran)}\n`;
        message += `Kembalian: ${formatRupiah(kembalian)}\n`;
        return {
            success: true,
            message,
            total: totalSetelahDiskon,
            nominal: nominalPembayaran
        };
    }

    function printStruk(paymentMethod) {
        const namaPemesan = namaPemesanInput.value.trim();
        const alamatPemesan = alamatPemesanInput.value.trim();
        const keteranganPesanan = keteranganPesananInput.value.trim();
        const kasirName = localStorage.getItem('namaKasir') || '-';
        const currentUserRole = localStorage.getItem('userRole');
        const totalBelanja = keranjang.reduce((sum, item) => sum + (item.harga * item.qty), 0);
        let diskonNama = '', diskonNilai = 0;
        if (currentUserRole === 'kasir') {
            diskonNama = namaDiskonInput.value.trim() || '-';
            diskonNilai = parseFloat(nilaiDiskonInput.value) || 0;
        }
        const totalSetelahDiskon = Math.max(totalBelanja - diskonNilai, 0);
        const nominalPembayaran = parseFloat(nominalPembayaranInput.value) || 0;
        const kembalian = nominalPembayaran - totalSetelahDiskon;
        if (keranjang.length === 0) {
            alert('Keranjang belanja masih kosong!');
            return false;
        }
        if (nominalPembayaran < totalSetelahDiskon && paymentMethod === 'Tunai') {
            alert('Nominal pembayaran kurang dari total belanja.');
            return false;
        }
        const defaultShopName = "HARINFOOD";
        const displayPhoneNumber = "081235368643";
        const defaultAddress = "Jl Ender Rakit - Gedongan";
        const defaultFooterText = "Terima kasih sehat selalu ya 🤲 🙏🥰";
        const qrisImagePath = "qris.webp";
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
                        ${currentUserRole === 'kasir' ? `<p>Kasir: ${kasirName}</p>` : ''}
                        <p>Pelanggan: ${namaPemesan || '-'}</p>
                        <p>Alamat: ${alamatPemesan || '-'}</p>
                        <p>Tanggal: ${formattedDate}</p>
                        <p>Jam: ${formattedTime}</p>
                    </div>
        `;
        if (keteranganPesanan) {
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
            const subtotal = item.harga * item.qty;
            printContent += `<tr><td>${item.nama} (${item.qty}x)</td><td style="text-align:right;">${formatRupiah(subtotal)}</td></tr>`;
        });
        if (currentUserRole === 'kasir' && diskonNilai > 0) {
            printContent += `<tr><td>Diskon (${diskonNama})</td><td style="text-align:right;">-${formatRupiah(diskonNilai)}</td></tr>`;
        }
        printContent += `
                    </tbody></table>
                    <hr>
                    <p class="total-row"><span>TOTAL:</span> ${formatRupiah(totalSetelahDiskon)}</p>
                    <p class="print-payment-info"><span>Metode:</span> ${paymentMethod}</p>
                    <p class="print-payment-info"><span>BAYAR:</span> ${formatRupiah(nominalPembayaran)}</p>
                    <p class="print-payment-info"><span>KEMBALIAN:</span> ${formatRupiah(kembalian)}</p>
        `;
        if (paymentMethod === 'QRIS') {
            printContent += `
                    <div style="text-align: center; margin-top: 10px; margin-bottom: 5px;">
                        <img src="${qrisImagePath}" alt="QRIS Code" style="width: 45mm; height: auto; display: block; margin: 0 auto; padding-bottom: 5px;">
                    </div>
            `;
            printContent += `<p class="thank-you">${defaultFooterText} - Scan QRIS Untuk Pembayaran</p>`;
        } else {
            printContent += `<p class="thank-you">${defaultFooterText}</p>`;
        }
        printContent += `</div></body></html>`;
        const printWindow = window.open('', '_blank');
        printWindow.document.write(printContent);
        printWindow.document.close();
        printWindow.focus();
        setTimeout(() => {
            printWindow.print();
            keranjang = [];
            resetHargaProdukKeDefault();
            updateKeranjang();
            updateProdukControls();
            namaPemesanInput.value = '';
            alamatPemesanInput.value = '';
            keteranganPesananInput.value = '';
            nominalPembayaranInput.value = 0;
            namaDiskonInput.value = '';
            nilaiDiskonInput.value = 0;
            hitungKembalian();
            paymentChoiceButtons.style.display = 'flex';
            updateActionButtonVisibility();
            productSearchBarcodeInput.value = '';
            productSearchBarcodeInput.focus();
        }, 300);
        return true;
    }

    cetakStrukButton.addEventListener('click', () => {
        if (keranjang.length === 0) {
            alert('Keranjang belanja kosong. Tidak ada yang bisa dicetak.');
            return;
        }
        printOptionsPopup.style.display = 'flex';
    });
    btnPrintTunai.addEventListener('click', () => {
        printOptionsPopup.style.display = 'none';
        printStruk('Tunai');
    });
    btnPrintQris.addEventListener('click', () => {
        printOptionsPopup.style.display = 'none';
        printStruk('QRIS');
    });
    closePrintPopupBtn.addEventListener('click', () => {
        printOptionsPopup.style.display = 'none';
    });

    // FAB Manual Order Modal
    addManualOrderFab.addEventListener('click', () => {
        manualOrderModal.style.display = 'flex';
        manualProductNameInput.value = '';
        manualProductPriceInput.value = '';
        manualProductQtyInput.value = '1';
        manualProductNameInput.focus();
    });
    window.closeManualOrderModal = function() {
        manualOrderModal.style.display = 'none';
        productSearchBarcodeInput.focus(); 
    };
    window.addManualOrderItem = function() {
        const name = manualProductNameInput.value.trim();
        const price = parseFloat(manualProductPriceInput.value);
        const qty = parseInt(manualProductQtyInput.value);
        if (!name || isNaN(price) || price < 0 || isNaN(qty) || qty < 1) {
            alert('Harap isi nama produk, harga (minimal 0), dan kuantitas (minimal 1) dengan benar.');
            return;
        }
        const newManualItem = {
            id: nextManualItemId++, 
            nama: name,
            harga: price,
            qty: qty,
            isManual: true 
        };
        tambahKeKeranjang(newManualItem);
        manualOrderModal.style.display = 'none';
        productSearchBarcodeInput.focus(); 
    };

    // Barcode Scan
    productSearchBarcodeInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            e.preventDefault(); 
            const query = productSearchBarcodeInput.value.trim();
            if (query) {
                const foundProduct = produkData.find(p => 
                    p.barcode === query || p.nama.toLowerCase().includes(query.toLowerCase())
                );
                if (foundProduct) {
                    tambahKeKeranjang(foundProduct);
                    searchBarcodeFeedback.textContent = `Produk "${foundProduct.nama}" ditambahkan!`;
                    searchBarcodeFeedback.style.color = '#28a745';
                    productSearchBarcodeInput.value = ''; 
                } else {
                    searchBarcodeFeedback.textContent = `Produk atau barcode "${query}" tidak ditemukan.`;
                    searchBarcodeFeedback.style.color = '#dc3545';
                }
            } else {
                searchBarcodeFeedback.textContent = 'Masukkan nama produk atau scan barcode.';
                searchBarcodeFeedback.style.color = '#e0e0e0';
            }
            productSearchBarcodeInput.focus();
        }
    });
    productSearchBarcodeInput.addEventListener('input', () => {
        searchBarcodeFeedback.textContent = '';
    });

    // Visibilitas tombol (FAB Print khusus kasir)
    function updateActionButtonVisibility() {
        const currentUserRole = localStorage.getItem('userRole');
        if (currentUserRole === 'pelanggan') {
            pesanWhatsappPelangganBtn.style.display = 'flex';
            cetakStrukButton.style.display = 'none';
            if (printFab) printFab.style.display = 'none';
        } else {
            pesanWhatsappPelangganBtn.style.display = 'none';
            cetakStrukButton.style.display = 'none';
            if (printFab) printFab.style.display = 'flex';
        }
    }

    // Inisialisasi awal
    const storedRole = localStorage.getItem('userRole');
    if (storedRole) {
        loginPopup.style.display = 'none';
        appContainer.style.display = 'block';
        if (storedRole === 'kasir') {
            kasirFabs.style.display = 'block';
            cetakStrukButton.style.display = 'none';
            pesanInfoLabel.style.display = 'none';
            shareOrderFab.style.display = 'flex';
            productSearchBarcodeInput.style.display = 'block';
            productSearchBarcodeInput.focus();
            if (printFab) printFab.style.display = 'flex';
        } else {
            kasirFabs.style.display = 'none';
            cetakStrukButton.style.display = 'none';
            pesanInfoLabel.style.display = 'block';
            pesanInfoLabel.textContent = "Terima kasih pelanggan setia, sehat selalu ya 🙏 tanpa anda tidak ada cerita di kedai kita. Selalu kunjungi kami ya";
            shareOrderFab.style.display = 'none';
            productSearchBarcodeInput.style.display = 'none';
            if (printFab) printFab.style.display = 'none';
        }
        initializeApp();
    } else {
        loginPopup.style.display = 'flex';
        appContainer.style.display = 'none';
        if (printFab) printFab.style.display = 'none';
    }
});
