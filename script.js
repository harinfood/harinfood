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
    const diskonSection = document.getElementById('diskon-section');
    const namaDiskonInput = document.getElementById('nama-diskon');
    const nilaiDiskonInput = document.getElementById('nilai-diskon');
    const cartFab = document.getElementById('cart-fab');
    const floatingPesanWhatsapp = document.getElementById('floating-pesan-whatsapp');
    let popupKeranjang = document.getElementById('popup-keranjang');
    let popupKeranjangNominal = document.getElementById('popup-keranjang-nominal');
    let popupKembalianDisplay = document.getElementById('popup-kembalian-display');
    let popupKeranjangTotal = document.getElementById('popup-keranjang-total');
    let popupKeranjangPrintBtn = null;
    let popupNamaPelangganInput = null;
    let popupAlamatPelangganInput = null;
    let popupWhatsAppBtn = null;
    let kembalianModal;

    function formatNumberWithDots(n) {
        if (typeof n === "string") n = n.replace(/\./g, '');
        let x = n.toString().replace(/[^0-9]/g, '');
        if (x === "") return "";
        return x.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    }
    function parseNumberFromDots(str) {
        return parseInt((str || "").toString().replace(/\./g, "")) || 0;
    }

    function createKembalianModal() {
        if (document.getElementById('kembalian-modal')) return;
        kembalianModal = document.createElement('div');
        kembalianModal.id = "kembalian-modal";
        kembalianModal.style.display = "none";
        kembalianModal.innerHTML = `
            <div class="kembalian-modal-content">
                <span id="close-kembalian-modal" style="position:absolute;right:20px;top:10px;font-size:2em;cursor:pointer;color:#333;">&times;</span>
                <h2 style="text-align:center;color:#28a745;margin-bottom: 1em;">Kembalian</h2>
                <div id="kembalian-modal-value" style="font-size:2.5em;font-weight:bold;text-align:center;color:#28a745;letter-spacing: 2px; margin-bottom: 20px;">Rp 0</div>
            </div>
        `;
        document.body.appendChild(kembalianModal);
        document.getElementById('close-kembalian-modal').onclick = () => {
            kembalianModal.style.display = "none";
        };
    }
    createKembalianModal();

    function setPopupKeranjangClosed(val) {
        localStorage.setItem('popupKeranjangClosed', val ? '1' : '');
    }
    function isPopupKeranjangClosed() {
        return localStorage.getItem('popupKeranjangClosed') === '1';
    }
    function showPopupKeranjang(forceShow = false) {
        if (!forceShow) {
            if (isPopupKeranjangClosed()) return;
            if (keranjang.length === 0) return;
        }
        updatePopupKeranjang(true);
        popupKeranjang.style.display = "flex";
        setPopupKeranjangClosed(false);
        document.body.style.overflow = "hidden";
        setTimeout(() => {
            document.getElementById('close-popup-keranjang').focus();
        }, 100);
    }
    function hidePopupKeranjang() {
        popupKeranjang.style.display = "none";
        setPopupKeranjangClosed(true);
        document.body.style.overflow = "";
    }
    document.getElementById('close-popup-keranjang').onclick = hidePopupKeranjang;

    const produkData = [
        { id: 1, nama: "Risol", harga: 3000, gambar: "risol.webp", barcode: "risol" },
        { id: 2, nama: "Cibay", harga: 2500, gambar: "cibay.webp", barcode: "cibay" },
        { id: 4, nama: "Tteokbokki", harga: 5000, gambar: "toppoki.webp", barcode: "toppoki" },
        { id: 5, nama: "Tteokbokki", harga: 10000, gambar: "toppoki.webp", barcode: "toppoki10" },
        { id: 9, nama: "Es Teh Jumbo", harga: 3000, gambar: "esteh.webp", barcode: "esteh" },
        { id: 10, nama: "Es Teh kecil", harga: 2000, gambar: "esteh.webp", barcode: "esteh2" }
    ];
    const produkDefaultHarga = produkData.map(p => ({ id: p.id, harga: p.harga }));

    let keranjang = [];
    let nextManualItemId = 1000;
    let isNominalInputFocused = false;

    function saveKeranjangToStorage() {
        localStorage.setItem('keranjang', JSON.stringify(keranjang));
    }
    function loadKeranjangFromStorage() {
        try {
            const data = localStorage.getItem('keranjang');
            keranjang = data ? JSON.parse(data) : [];
        } catch (e) {
            keranjang = [];
        }
    }

    function resetHargaProdukKeDefault() {
        produkDefaultHarga.forEach(def => {
            const produk = produkData.find(p => p.id === def.id);
            if (produk) produk.harga = def.harga;
        });
        localStorage.removeItem('produkHarga');
    }

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
        const passwordKasirLoginInput = document.getElementById('password-kasir-login');
        if (namaKasir === 'Harry' && passwordKasirLoginInput.value.trim() === '313121') {
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

    document.getElementById('btnSimpanNamaPemesan').onclick = function() {
        var nama = inputNamaPemesan.value.trim();
        if (nama.length < 2) { return; }
        localStorage.setItem('namaPemesan', nama);
        localStorage.setItem('namaPelanggan', nama);
        namaPemesanModal.style.display = 'none';
        autofillNamaPemesanForm();
    };
    inputNamaPemesan.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            document.getElementById('btnSimpanNamaPemesan').click();
        }
    });

    function autofillNamaPemesanForm() {
        const nama = localStorage.getItem('namaPemesan') || '';
        const alamat = localStorage.getItem('alamatPelanggan') || '';
        if (namaPemesanInput) namaPemesanInput.value = nama;
        if (alamatPemesanInput) alamatPemesanInput.value = alamat;
    }
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
        loadKeranjangFromStorage();
        updateKeranjang();
        hitungKembalian();
        updateActionButtonVisibility();
        paymentChoiceButtons.style.display = 'flex';
    }

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
                saveKeranjangToStorage();
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
        updateFloatingButtonVisibility();
        saveKeranjangToStorage();
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
        let totalSetelahDiskon = total;
        if (localStorage.getItem('userRole') === 'kasir') {
            let diskon = parseFloat(nilaiDiskonInput.value) || 0;
            if (diskon < 0) diskon = 0;
            totalSetelahDiskon = Math.max(total - diskon, 0);
        }
        keranjangTotal.textContent = formatRupiah(totalSetelahDiskon);

        if (!isNominalInputFocused) {
            nominalPembayaranInput.value = totalSetelahDiskon > 0 ? totalSetelahDiskon : "";
            nominalPembayaranInput.dataset.lastTotal = totalSetelahDiskon;
        }
        hitungKembalian();
        updatePopupKeranjang();
        updateFloatingButtonVisibility();
        saveKeranjangToStorage();
    }

    nilaiDiskonInput.addEventListener('input', updateKeranjang);
    window.clearQtyOnFocus = function(inputElement, index) { inputElement.value = ''; };
    window.updateCartItemQty = function(index, newQty) {
        let quantity = parseInt(newQty);
        if (isNaN(quantity) || quantity < 1) quantity = 0;
        if (quantity === 0) keranjang.splice(index, 1);
        else keranjang[index].qty = quantity;
        updateKeranjang();
        updateProdukControls();
        updateFloatingButtonVisibility();
        saveKeranjangToStorage();
    };
    window.removeFromCart = function(index) {
        keranjang.splice(index, 1);
        updateKeranjang();
        updateProdukControls();
        updateFloatingButtonVisibility();
        saveKeranjangToStorage();
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
        updateFloatingButtonVisibility();
        saveKeranjangToStorage();
    });

    function hitungKembalian() {
        const totalBelanja = parseFloat(keranjangTotal.textContent.replace('Rp', '').replace(/\./g, '').replace(',', '.')) || 0;
        const nominalPembayaran = parseFloat(nominalPembayaranInput.value) || 0;
        const kembalian = nominalPembayaran - totalBelanja;
        kembalianDisplay.textContent = formatRupiah(kembalian);
        kembalianDisplay.style.color = kembalian < 0 ? '#dc3545' : '#ffcc00';
    }
    nominalPembayaranInput.addEventListener('focus', () => {
        isNominalInputFocused = true;
        nominalPembayaranInput.value = "";
    });
    nominalPembayaranInput.addEventListener('blur', () => {
        isNominalInputFocused = false;
        if (nominalPembayaranInput.value === "" || isNaN(parseFloat(nominalPembayaranInput.value))) {
            let total = keranjangTotal.textContent.replace(/[^0-9,]/g, "").replace(",", ".");
            total = parseFloat(total) || 0;
            nominalPembayaranInput.value = total > 0 ? total : "";
            nominalPembayaranInput.dataset.lastTotal = total;
        }
        hitungKembalian();
    });
    nominalPembayaranInput.addEventListener('input', () => {
        if (nominalPembayaranInput.value === "" || isNaN(parseFloat(nominalPembayaranInput.value))) {
            let total = keranjangTotal.textContent.replace(/[^0-9,]/g, "").replace(",", ".");
            total = parseFloat(total) || 0;
            nominalPembayaranInput.value = total > 0 ? total : "";
            nominalPembayaranInput.dataset.lastTotal = total;
        }
        hitungKembalian();
    });
    nominalPembayaranInput.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' || e.keyCode === 13) {
            e.preventDefault();
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

    function getBase64Image(imgUrl, callback) {
        const img = new window.Image();
        img.crossOrigin = "anonymous";
        img.onload = function() {
            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0);
            const dataURL = canvas.toDataURL("image/png");
            callback(dataURL);
        };
        img.onerror = function() {
            callback(null);
        };
        img.src = imgUrl;
    }

    function generateStrukText(paymentMethod, qrisBase64 = null) {
        let namaPemesan = namaPemesanInput.value.trim();
        let alamatPemesan = alamatPemesanInput.value.trim();
        if (popupNamaPelangganInput && popupAlamatPelangganInput) {
            namaPemesan = popupNamaPelangganInput.value.trim();
            alamatPemesan = popupAlamatPelangganInput.value.trim();
        }
        let keteranganPesanan = keteranganPesananInput.value.trim();
        let popupCatatanInput = document.getElementById('popup-catatan-belanja');
        if (popupCatatanInput && popupCatatanInput.value.trim() !== "") {
            keteranganPesanan = popupCatatanInput.value.trim();
        }
        const kasirName = localStorage.getItem('namaKasir') || '-';
        const currentUserRole = localStorage.getItem('userRole');
        const totalBelanja = keranjang.reduce((sum, item) => sum + (item.harga * item.qty), 0);
        let diskonNama = '', diskonNilai = 0;
        if (currentUserRole === 'kasir') {
            diskonNama = namaDiskonInput.value.trim() || '-';
            diskonNilai = parseFloat(nilaiDiskonInput.value) || 0;
        }
        const totalSetelahDiskon = Math.max(totalBelanja - diskonNilai, 0);
        let nominalPembayaran = parseFloat(nominalPembayaranInput.value) || 0;
        if (popupKeranjangNominal) {
            nominalPembayaran = parseNumberFromDots(popupKeranjangNominal.value) || nominalPembayaran;
        }
        const kembalian = nominalPembayaran - totalSetelahDiskon;
        if (keranjang.length === 0) {
            return { success: false, message: 'Keranjang belanja masih kosong!' };
        }
        let message =
`Nama: ${namaPemesan || '-'}
Alamat: ${alamatPemesan || '-'}
${currentUserRole === 'kasir' ? `Kasir: ${kasirName}\n` : ''}Tanggal: ${new Date().toLocaleDateString('id-ID')}
Jam: ${new Date().toLocaleTimeString('id-ID')}
${keteranganPesanan ? `Catatan: ${keteranganPesanan}\n` : ''}-----------------------------
`;
        keranjang.forEach(item => {
            message += `${item.nama} (${item.qty}x)  ${formatRupiah(item.harga * item.qty)}\n`;
        });
        if (currentUserRole === 'kasir' && diskonNilai > 0) {
            message += `-----------------------------\n`;
            message += `Diskon (${diskonNama}) : -${formatRupiah(diskonNilai)}\n`;
        }
        message += `-----------------------------\n`;
        message += `TOTAL     : ${formatRupiah(totalSetelahDiskon)}\n`;
        message += `Bayar     : ${formatRupiah(nominalPembayaran)}\n`;
        message += `Kembalian : ${formatRupiah(kembalian)}\n`;
        return {
            success: true,
            message,
            total: totalSetelahDiskon,
            nominal: nominalPembayaran,
            qrisBase64: qrisBase64
        };
    }

    function printStruk(paymentMethod) {
        if (paymentMethod === 'QRIS') {
            getBase64Image('qris.webp', function(qrisBase64) {
                doPrintStruk(paymentMethod, qrisBase64);
            });
        } else {
            doPrintStruk(paymentMethod, null);
        }
    }

    function doPrintStruk(paymentMethod, qrisBase64) {
        const shareResult = generateStrukText(paymentMethod, qrisBase64);
        if (!shareResult.success) {
            alert(shareResult.message);
            return false;
        }
        const defaultFooterText = "Terima kasih sehat selalu ya 🤲 🙏🥰";
        let printTableProduk = '';
        keranjang.forEach(item => {
            printTableProduk += `
                <tr>
                    <td class="print-item" style="text-align:left;word-break:break-word;font-size:11px;padding:0.5px 0;line-height:1.05;">${item.nama} (${item.qty}x)</td>
                    <td class="print-item" style="text-align:right;font-size:11px;padding:0.5px 0;line-height:1.05;">${formatRupiah(item.harga * item.qty)}</td>
                </tr>
            `;
        });

        let diskonTr = '';
        if (localStorage.getItem('userRole') === 'kasir' && (parseFloat(nilaiDiskonInput.value) || 0) > 0) {
            diskonTr = `
            <tr>
                <td style="text-align:left;font-size:11px;padding:0.5px 0;">Diskon (${namaDiskonInput.value || '-'})</td>
                <td style="text-align:right;font-size:11px;padding:0.5px 0;">-${formatRupiah(parseFloat(nilaiDiskonInput.value) || 0)}</td>
            </tr>`;
        }

        let printContent = `
            <html>
            <head>
                <title>Struk Belanja</title>
                <meta name="viewport" content="width=58mm, initial-scale=1">
                <link rel="stylesheet" href="style.css">
                <style>
                    @media print { .print-actions { display: none !important; } }
                    body, #print-area { font-family:'Arial', 'Poppins', sans-serif !important; font-size:11px !important; line-height:1.05 !important; font-weight:bold !important; margin:0 !important; padding:0 !important;}
                    #print-area { width:58mm !important; max-width:58mm !important; padding:2mm 2mm 0 2mm !important; }
                    table { width:100%; border-collapse: collapse; font-size:11px;}
                    td { padding:0.5px 0; font-weight:bold; font-size:11px;}
                    .total-row td { border-top:1.5px solid #000; font-size:12px;}
                    .print-header { text-align:center!important;margin-bottom:4px!important;font-size:14px!important;font-weight:bold!important;line-height:1.05!important;letter-spacing:0.02em!important;}
                    .print-header .shop-address-print, .print-header .shop-phone-print { font-size:11px!important;font-weight:bold!important;margin:0!important;line-height:1.05!important;}
                    .print-info p { margin:0!important;font-size:11px!important;font-weight:bold!important; }
                    .thank-you { text-align:center;margin-top:8px!important;font-size:11px!important;font-style:italic!important;font-weight:bold!important;}
                </style>
                <script>
                    function shareWhatsApp() {
                        var msg = encodeURIComponent(\`${shareResult.message}\`);
                        window.open('https://wa.me/?text=' + msg, '_blank');
                    }
                    function cetakUlang() {
                        window.print();
                    }
                <\/script>
            </head>
            <body>
                <div id="print-area">
                    <div class="print-header">
                        <p class="shop-name-print" style="font-size:14px;margin-bottom:1px;"><b>HARINFOOD</b></p>
                        <p class="shop-address-print">Jl Ender Rakit - Gedongan</p>
                        <p class="shop-phone-print">081235368643</p>
                    </div>
                    <div class="print-info">
                        <p>Nama   : ${popupNamaPelangganInput ? popupNamaPelangganInput.value : namaPemesanInput.value}</p>
                        <p>Alamat : ${popupAlamatPelangganInput ? popupAlamatPelangganInput.value : alamatPemesanInput.value}</p>
                        ${localStorage.getItem('userRole') === 'kasir' ? `<p>Kasir  : ${localStorage.getItem('namaKasir')}</p>` : ''}
                        <p>Tanggal: ${new Date().toLocaleDateString('id-ID')}</p>
                        <p>Jam    : ${new Date().toLocaleTimeString('id-ID')}</p>
                        ${(() => {
                            let catatan = keteranganPesananInput.value;
                            let popupCatatan = document.getElementById('popup-catatan-belanja');
                            if (popupCatatan && popupCatatan.value.trim() !== "") catatan = popupCatatan.value;
                            return catatan ? `<p>Catatan: ${catatan}</p>` : '';
                        })()}
                    </div>
                    <hr style="margin:2px 0;">
                    <table>
                        ${printTableProduk}
                        ${diskonTr}
                        <tr class="total-row"><td style="text-align:left;font-size:11px;">TOTAL</td><td style="text-align:right;font-size:11px;">${formatRupiah(shareResult.total)}</td></tr>
                        <tr><td style="text-align:left;font-size:11px;">Bayar</td><td style="text-align:right;font-size:11px;">${formatRupiah(shareResult.nominal)}</td></tr>
                        <tr><td style="text-align:left;font-size:11px;">Kembalian</td><td style="text-align:right;font-size:11px;">${formatRupiah(shareResult.nominal - shareResult.total)}</td></tr>
                    </table>
                    <hr style="margin:2px 0;">
        `;

        if (paymentMethod === 'QRIS') {
            printContent += `
                <div style="text-align: center; margin-top: 10px; margin-bottom: 5px;">
                    <img src="${shareResult.qrisBase64 ? shareResult.qrisBase64 : 'qris.webp'}" alt="QRIS Code" style="width: 45mm; height: auto; display: block; margin: 0 auto; padding-bottom: 5px;">
                </div>
                <p class="thank-you">${defaultFooterText} - Scan QRIS Untuk Pembayaran</p>
            `;
        } else {
            printContent += `<p class="thank-you">${defaultFooterText}</p>`;
        }
        printContent += `
            <div class="print-actions">
                <button onclick="cetakUlang()">Cetak Struk</button>
                <button onclick="shareWhatsApp()">Bagikan via WhatsApp</button>
            </div>
            </div></body></html>`;

        const printWindow = window.open('', '_blank');
        printWindow.document.write(printContent);
        printWindow.document.close();
        printWindow.focus();
        setTimeout(() => {
            keranjang = [];
            saveKeranjangToStorage();
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
            updateFloatingButtonVisibility();
        }, 300);
        return true;
    }

    shareOrderFab && shareOrderFab.addEventListener('click', async () => {
        const shareResult = generateStrukText('Tunai');
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
                saveKeranjangToStorage();
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
                updateFloatingButtonVisibility();
                return;
            }
        } catch (error) {}
        const encodedMessage = encodeURIComponent(messageToShare);
        const whatsappURL = `https://wa.me/6281235368643?text=${encodedMessage}`;
        window.open(whatsappURL, '_blank');
        keranjang = [];
        saveKeranjangToStorage();
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
        updateFloatingButtonVisibility();
    });

    function kirimPesanWhatsappPelanggan() {
        if (keranjang.length === 0) {
            alert('Keranjang masih kosong, silakan pilih pesanan terlebih dahulu!');
            return;
        }
        const shareResult = generateStrukText('Tunai');
        if (!shareResult.success) {
            alert(shareResult.message);
            return;
        }
        const messageToSend = shareResult.message;
        const encodedMessage = encodeURIComponent(messageToSend);
        const whatsappURL = `https://wa.me/6281235368643?text=${encodedMessage}`;
        window.open(whatsappURL, '_blank');
        keranjang = [];
        saveKeranjangToStorage();
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
        updateFloatingButtonVisibility();
    }

    function updateFloatingButtonVisibility() {
        const currentUserRole = localStorage.getItem('userRole');
        if (!floatingPesanWhatsapp) return;
        if (currentUserRole === 'pelanggan') {
            if (keranjang.length > 0) {
                floatingPesanWhatsapp.style.opacity = "1";
                floatingPesanWhatsapp.style.pointerEvents = "auto";
                floatingPesanWhatsapp.style.transform = "scale(1)";
                floatingPesanWhatsapp.style.transition = "opacity 0.35s cubic-bezier(0.4,0,0.2,1), transform 0.35s cubic-bezier(0.4,0,0.2,1)";
            } else {
                floatingPesanWhatsapp.style.opacity = "0";
                floatingPesanWhatsapp.style.pointerEvents = "none";
                floatingPesanWhatsapp.style.transform = "scale(0.7)";
                floatingPesanWhatsapp.style.transition = "opacity 0.25s cubic-bezier(0.4,0,0.2,1), transform 0.25s cubic-bezier(0.4,0,0.2,1)";
            }
        } else {
            floatingPesanWhatsapp.style.opacity = "0";
            floatingPesanWhatsapp.style.pointerEvents = "none";
            floatingPesanWhatsapp.style.transform = "scale(0.7)";
        }
    }
    function updateKasirFabVisibility() {
        const currentUserRole = localStorage.getItem('userRole');
        if (kasirFabs) {
            kasirFabs.style.display = (currentUserRole === 'kasir') ? 'block' : 'none';
        }
    }
    btnBayarQris.addEventListener('click', () => {
        window.open('https://drive.google.com/file/d/1XAOms4tVa2jkkkCdXRwbNIGy0dvu7RIk/view?usp=drivesdk', '_blank');
    });
    if (printFab) {
        printFab.addEventListener('click', () => {
            if (keranjang.length === 0) {
                alert('Keranjang belanja kosong. Tidak ada yang bisa dicetak.');
                return;
            }
            printOptionsPopup.style.display = 'flex';
        });
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

    addManualOrderFab.addEventListener('click', () => {
        manualOrderModal.style.display = 'flex';
        manualProductNameInput.value = '';
        manualProductPriceInput.value = '';
        manualProductQtyInput.value = '1';
        manualProductNameInput.focus();
    });
    manualProductNameInput.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' || e.keyCode === 13) {
            e.preventDefault();
            manualProductPriceInput.focus();
        }
    });
    manualProductPriceInput.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' || e.keyCode === 13) {
            e.preventDefault();
            manualProductQtyInput.focus();
        }
    });
    manualProductQtyInput.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' || e.keyCode === 13) {
            e.preventDefault();
            window.addManualOrderItem();
        }
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

    productSearchBarcodeInput.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' || e.keyCode === 13) {
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

    function updateActionButtonVisibility() {
        updateKasirFabVisibility();
        updateFloatingButtonVisibility();
    }

    document.addEventListener('keydown', function(e) {
        const currentUserRole = localStorage.getItem('userRole');
        const manualOrderModal = document.getElementById('manualOrderModal');
        const manualOrderOpen = manualOrderModal && manualOrderModal.style.display === 'flex';
        if (currentUserRole !== 'kasir' || manualOrderOpen) return;

        if (e.key === "F12") {
            e.preventDefault();
            const dapurFab = document.getElementById('dapur-fab');
            if (dapurFab && dapurFab.style.display !== "none") {
                dapurFab.click();
            }
        }
        if (e.key === 'F1') {
            e.preventDefault();
            if (keranjang.length > 0 && printFab) printFab.click();
        }
        if (e.key === 'F2') {
            e.preventDefault();
            if (keranjang.length > 0 && shareOrderFab) shareOrderFab.click();
        }
        if (e.key === 'F3') {
            e.preventDefault();
            if (addManualOrderFab) addManualOrderFab.click();
        }
        if (e.key === 'F4') {
            e.preventDefault();
            if (clearCartFab) clearCartFab.click();
        }
        if (e.key === 'F6') {
            e.preventDefault();
            showPopupKeranjang(true);
        }
    });

    if (cartFab) {
        cartFab.addEventListener('click', function() {
            showPopupKeranjang(true);
        });
    }
    if (floatingPesanWhatsapp) {
        floatingPesanWhatsapp.onclick = function() {
            showPopupKeranjang(true);
        };
    }

    function updatePopupKeranjang(forceShow = false) {
        if (popupKeranjang.style.display === "none" && !forceShow) return;
        const tbody = document.getElementById('popup-keranjang-items');
        popupKeranjangTotal = document.getElementById('popup-keranjang-total');
        popupKeranjangNominal = document.getElementById('popup-keranjang-nominal');
        popupKembalianDisplay = document.getElementById('popup-kembalian-display');
        popupKeranjangPrintBtn = document.getElementById('popup-keranjang-print');
        popupWhatsAppBtn = document.getElementById('popup-keranjang-whatsapp');
        let namaPelangganPopup = document.getElementById('popup-nama-pelanggan');
        let alamatPelangganPopup = document.getElementById('popup-alamat-pelanggan');
        let popupCatatanInput = document.getElementById('popup-catatan-belanja');

        if (!popupCatatanInput) {
            const catatanDiv = document.createElement('div');
            catatanDiv.style.marginBottom = "10px";
            catatanDiv.innerHTML = `
                <label style="font-weight:bold;color:#007bff;">Catatan/Keterangan Pesanan:</label>
                <textarea id="popup-catatan-belanja" style="width:99%;padding:7px;border-radius:5px;border:1px solid #007bff;min-height:40px;"></textarea>
            `;
            if (popupKeranjang.firstElementChild && popupKeranjang.firstElementChild.children.length >= 3) {
                popupKeranjang.firstElementChild.insertBefore(catatanDiv, popupKeranjang.firstElementChild.children[3]);
            }
            popupCatatanInput = document.getElementById('popup-catatan-belanja');
        }
        if (popupCatatanInput) {
            popupCatatanInput.value = keteranganPesananInput.value;
            popupCatatanInput.oninput = function() {
                keteranganPesananInput.value = popupCatatanInput.value;
            };
        }

        if (!namaPelangganPopup || !alamatPelangganPopup) {
            const namaAlamatDiv = document.createElement('div');
            namaAlamatDiv.style.marginBottom = "10px";
            namaAlamatDiv.innerHTML = `
                <label style="font-weight:bold;color:#007bff;">Nama Pemesan:</label>
                <input type="text" id="popup-nama-pelanggan" style="width:99%;padding:7px;border-radius:5px;border:1px solid #007bff;margin-bottom:8px;">
                <label style="font-weight:bold;color:#007bff;">Alamat Pemesan:</label>
                <textarea id="popup-alamat-pelanggan" style="width:99%;padding:7px;border-radius:5px;border:1px solid #007bff;min-height:40px;"></textarea>
            `;
            popupKeranjang.firstElementChild.insertBefore(namaAlamatDiv, popupKeranjang.firstElementChild.children[2]);
            namaPelangganPopup = document.getElementById('popup-nama-pelanggan');
            alamatPelangganPopup = document.getElementById('popup-alamat-pelanggan');
        }
        popupNamaPelangganInput = namaPelangganPopup;
        popupAlamatPelangganInput = alamatPelangganPopup;

        let namaPelangganDefault = localStorage.getItem('namaPemesan') || namaPemesanInput.value || "";
        let alamatPelangganDefault = localStorage.getItem('alamatPelanggan') || alamatPemesanInput.value || "";
        if (popupNamaPelangganInput && popupNamaPelangganInput.value === "") popupNamaPelangganInput.value = namaPelangganDefault;
        if (popupAlamatPelangganInput && popupAlamatPelangganInput.value === "") popupAlamatPelangganInput.value = alamatPelangganDefault;

        popupNamaPelangganInput.oninput = function() {
            namaPemesanInput.value = popupNamaPelangganInput.value;
            localStorage.setItem('namaPemesan', popupNamaPelangganInput.value);
        };
        popupAlamatPelangganInput.oninput = function() {
            alamatPemesanInput.value = popupAlamatPelangganInput.value;
            localStorage.setItem('alamatPelanggan', popupAlamatPelangganInput.value);
        };

        let total = 0;
        tbody.innerHTML = '';
        if (keranjang.length === 0) {
            tbody.innerHTML = `<tr><td colspan="4" style="text-align:center;color:#222;font-weight:500;">Keranjang kosong.</td></tr>`;
        } else {
            keranjang.forEach((item, idx) => {
                const subtotal = item.harga * item.qty;
                total += subtotal;
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td style="color:#222;">${item.nama}</td>
                    <td>
                        <input type="number" value="${item.qty}" min="1" style="width:48px;color:#222;"
                            onchange="window.popupUpdateQty(${idx}, this.value)">
                    </td>
                    <td style="color:#222;">${formatRupiah(subtotal)}</td>
                    <td>
                        <button onclick="window.popupRemoveItem(${idx})" style="background:none;border:none;color:#dc3545;font-size:1.2em;cursor:pointer;" title="Hapus"><i class="fas fa-trash"></i></button>
                    </td>
                `;
                tbody.appendChild(row);
            });
        }

        // --- REMOVE/Hide the "Total: Rp0" text if total==0 (the old static total above the sticky footer) ---
        // Find and hide/remove the old static total if total == 0
        // Cari elemen yang berisi tulisan "Total: Rp0"
        let staticTotalNode = null;
        const staticNodes = popupKeranjang.querySelectorAll('strong, span, div');
        staticNodes.forEach(node => {
            if (
                node.textContent && 
                typeof node.textContent === "string" &&
                node.textContent.trim().match(/^Total:\s*Rp0$/i)
            ) {
                staticTotalNode = node;
            }
        });
        if (staticTotalNode) {
            if (total === 0) {
                staticTotalNode.style.display = "none";
            } else {
                staticTotalNode.style.display = "";
            }
        }

        let pembayaranInline = popupKeranjang.querySelector('.pembayaran-section-inline');
        if (pembayaranInline && pembayaranInline.parentElement) {
            pembayaranInline.parentElement.removeChild(pembayaranInline);
        }
        pembayaranInline = document.createElement('div');
        pembayaranInline.className = 'pembayaran-section-inline';
        pembayaranInline.style.position = 'sticky';
        pembayaranInline.style.bottom = '62px';
        pembayaranInline.style.background = '#fff';
        pembayaranInline.style.zIndex = '22';
        pembayaranInline.style.padding = '6px 0 6px 0';
        pembayaranInline.style.margin = '0 -20px 0 -20px';
        pembayaranInline.style.borderTop = '1px solid #eee';
        pembayaranInline.style.display = 'flex';
        pembayaranInline.style.alignItems = 'center';
        pembayaranInline.style.justifyContent = 'space-between';
        pembayaranInline.style.gap = '8px';

        let leftDiv = document.createElement('div');
        leftDiv.style.display = 'flex';
        leftDiv.style.alignItems = 'center';
        let labelTotal = document.createElement('span');
        labelTotal.textContent = 'Total:';
        labelTotal.style.fontWeight = 'bold';
        labelTotal.style.color = '#222';
        labelTotal.style.fontSize = '1em';
        labelTotal.style.marginRight = '4px';
        let spanTotal = document.createElement('span');
        spanTotal.id = 'popup-keranjang-total';
        spanTotal.textContent = formatRupiah(total);
        spanTotal.style.fontWeight = 'bold';
        spanTotal.style.color = '#ff9800';
        spanTotal.style.fontSize = '1em';
        leftDiv.appendChild(labelTotal);
        leftDiv.appendChild(spanTotal);

        let rightDiv = document.createElement('div');
        rightDiv.style.display = 'flex';
        rightDiv.style.alignItems = 'center';
        let labelNominal = document.createElement('span');
        labelNominal.textContent = 'Bayar:';
        labelNominal.style.color = '#00f0ff';
        labelNominal.style.fontWeight = '700';
        labelNominal.style.fontSize = '1em';
        labelNominal.style.marginRight = '3px';
        let inputNominal = document.createElement('input');
        inputNominal.type = 'number';
        inputNominal.id = 'popup-keranjang-nominal';
        inputNominal.min = '0';
        inputNominal.value = total > 0 ? formatNumberWithDots(total) : "";
        inputNominal.style.width = '90px';
        inputNominal.style.padding = '6px';
        inputNominal.style.borderRadius = '4px';
        inputNominal.style.border = '2px solid #00f0ff';
        inputNominal.style.color = '#222';
        inputNominal.style.fontWeight = 'bold';
        inputNominal.style.background = '#f8f8f8';
        rightDiv.appendChild(labelNominal);
        rightDiv.appendChild(inputNominal);

        pembayaranInline.appendChild(leftDiv);
        pembayaranInline.appendChild(rightDiv);

        popupKeranjang.firstElementChild.appendChild(pembayaranInline);

        popupKeranjangTotal = pembayaranInline.querySelector('#popup-keranjang-total');
        popupKeranjangNominal = pembayaranInline.querySelector('#popup-keranjang-nominal');

        if (!popupKeranjangNominal._formatted) {
            popupKeranjangNominal.value = total > 0 ? formatNumberWithDots(total) : "";
            popupKeranjangNominal.dataset.lastTotal = total;
            popupKeranjangNominal._formatted = true;
        }
        popupKeranjangNominal.style.color = "#222";
        hitungKembalianPopup();

        popupKeranjangNominal.addEventListener('input', function(e) {
            let cursor = popupKeranjangNominal.selectionStart;
            let before = popupKeranjangNominal.value.length;
            let clean = formatNumberWithDots(popupKeranjangNominal.value);
            popupKeranjangNominal.value = clean;
            let after = clean.length;
            popupKeranjangNominal.setSelectionRange(cursor + (after - before), cursor + (after - before));
            hitungKembalianPopup();
        });

        popupKeranjangNominal.addEventListener('focus', function() {
            this.value = "";
        });
        popupKeranjangNominal.addEventListener('blur', function() {
            if (this.value === "" || isNaN(parseNumberFromDots(this.value))) {
                this.value = total > 0 ? formatNumberWithDots(total) : "";
                this.dataset.lastTotal = total;
            }
            hitungKembalianPopup();
        });
        popupKeranjangNominal.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.keyCode === 13) {
                e.preventDefault();
                hitungKembalianPopup();
                showKembalianModalPopupKeranjang();
            }
        });

        const currentUserRole = localStorage.getItem('userRole');
        const popupContent = popupKeranjang.querySelector('.popup-keranjang-content');
        let stickyFooter = popupContent.querySelector('.popup-sticky-footer');
        if (stickyFooter) stickyFooter.remove();

        stickyFooter = document.createElement('div');
        stickyFooter.className = 'popup-sticky-footer';
        stickyFooter.style.position = 'sticky';
        stickyFooter.style.bottom = '0';
        stickyFooter.style.left = '0';
        stickyFooter.style.right = '0';
        stickyFooter.style.background = '#fff';
        stickyFooter.style.zIndex = '20';
        stickyFooter.style.display = 'flex';
        stickyFooter.style.flexDirection = 'column';
        stickyFooter.style.gap = '10px';
        stickyFooter.style.paddingTop = '10px';
        stickyFooter.style.boxShadow = '0 -2px 12px #0001';

        if (!popupKeranjangPrintBtn) {
            popupKeranjangPrintBtn = document.createElement('button');
            popupKeranjangPrintBtn.id = 'popup-keranjang-print';
            popupKeranjangPrintBtn.innerHTML = '<i class="fas fa-print"></i> Cetak Struk';
            popupKeranjangPrintBtn.style.background = '#007bff';
            popupKeranjangPrintBtn.style.color = '#fff';
            popupKeranjangPrintBtn.style.border = 'none';
            popupKeranjangPrintBtn.style.padding = '8px 16px';
            popupKeranjangPrintBtn.style.borderRadius = '5px';
            popupKeranjangPrintBtn.style.cursor = 'pointer';
            popupKeranjangPrintBtn.style.fontWeight = 'bold';
            popupKeranjangPrintBtn.style.fontSize = '1em';
            popupKeranjangPrintBtn.style.width = '100%';
        }
        popupKeranjangPrintBtn.style.display = (currentUserRole === 'kasir') ? 'block' : 'none';
        popupKeranjangPrintBtn.onclick = function() {
            namaPemesanInput.value = popupNamaPelangganInput.value;
            alamatPemesanInput.value = popupAlamatPelangganInput.value;
            nominalPembayaranInput.value = parseNumberFromDots(popupKeranjangNominal.value);
            hitungKembalian();
            hidePopupKeranjang();
            printStruk('Tunai');
            setPopupKeranjangClosed(true);
        };

        if (!popupWhatsAppBtn) {
            popupWhatsAppBtn = document.createElement('button');
            popupWhatsAppBtn.id = 'popup-keranjang-whatsapp';
            popupWhatsAppBtn.innerHTML = '<i class="fab fa-whatsapp"></i> Kirim Pesan via WhatsApp';
            popupWhatsAppBtn.style.background = 'linear-gradient(45deg, #25D366, #128C7E)';
            popupWhatsAppBtn.style.color = '#fff';
            popupWhatsAppBtn.style.border = 'none';
            popupWhatsAppBtn.style.padding = '12px 18px';
            popupWhatsAppBtn.style.borderRadius = '6px';
            popupWhatsAppBtn.style.cursor = 'pointer';
            popupWhatsAppBtn.style.fontSize = '1.08em';
            popupWhatsAppBtn.style.width = '100%';
            popupWhatsAppBtn.style.fontWeight = 'bold';
            popupWhatsAppBtn.style.zIndex = 10;
        }
        popupWhatsAppBtn.style.display = (currentUserRole === 'pelanggan') ? 'block' : 'none';
        popupWhatsAppBtn.onclick = function() {
            namaPemesanInput.value = popupNamaPelangganInput.value.trim();
            alamatPemesanInput.value = popupAlamatPelangganInput.value.trim();
            localStorage.setItem('namaPemesan', namaPemesanInput.value);
            localStorage.setItem('alamatPelanggan', alamatPemesanInput.value);
            nominalPembayaranInput.value = parseNumberFromDots(popupKeranjangNominal.value);
            hitungKembalian();
            hidePopupKeranjang();
            kirimPesanWhatsappPelanggan();
            setPopupKeranjangClosed(true);
        };

        if(currentUserRole === 'kasir') {
            stickyFooter.appendChild(popupKeranjangPrintBtn);
        }
        if(currentUserRole === 'pelanggan') {
            stickyFooter.appendChild(popupWhatsAppBtn);
        }
        popupContent.appendChild(stickyFooter);
    }
    window.popupUpdateQty = function(idx, val) {
        let quantity = parseInt(val);
        if (isNaN(quantity) || quantity < 1) quantity = 0;
        if (quantity === 0) keranjang.splice(idx, 1);
        else keranjang[idx].qty = quantity;
        updateKeranjang();
        updatePopupKeranjang(true);
        updateFloatingButtonVisibility();
        saveKeranjangToStorage();
    };
    window.popupRemoveItem = function(idx) {
        keranjang.splice(idx, 1);
        updateKeranjang();
        updatePopupKeranjang(true);
        updateFloatingButtonVisibility();
        saveKeranjangToStorage();
    };

    function showKembalianModalPopupKeranjang() {
        if (!popupKeranjangNominal || !popupKeranjangTotal) return;
        const totalBelanja = parseFloat(popupKeranjangTotal.textContent.replace('Rp', '').replace(/\./g, '').replace(',', '.')) || 0;
        const nominalPembayaran = parseNumberFromDots(popupKeranjangNominal.value);
        const kembalian = nominalPembayaran - totalBelanja;
        createKembalianModal();
        const valDiv = document.getElementById('kembalian-modal-value');
        if (nominalPembayaran < totalBelanja) {
            valDiv.style.color = '#dc3545';
            valDiv.innerHTML = 'Nominal pembayaran harus lebih dari total belanjaan!';
        } else {
            valDiv.style.color = '#28a745';
            valDiv.innerHTML = formatRupiah(kembalian);
        }
        kembalianModal.style.display = 'flex';
        kembalianModal.style.justifyContent = 'center';
        kembalianModal.style.alignItems = 'center';
    }

    function hitungKembalianPopup() {
    }

    popupKeranjang.addEventListener('click', function(e) {
        if (e.target === popupKeranjang) {
            hidePopupKeranjang();
        }
    });

    const storedRole = localStorage.getItem('userRole');
    if (storedRole) {
        document.body.setAttribute("data-role", storedRole);
        loginPopup.style.display = 'none';
        appContainer.style.display = 'block';
        updateKasirFabVisibility();
        updateFloatingButtonVisibility();
        if (storedRole === 'kasir') {
            cetakStrukButton.style.display = 'none';
            pesanInfoLabel.style.display = 'none';
            shareOrderFab.style.display = 'flex';
            productSearchBarcodeInput.style.display = 'block';
            productSearchBarcodeInput.focus();
            if (printFab) printFab.style.display = 'flex';
            if (cartFab) cartFab.style.display = 'flex';
        } else {
            cetakStrukButton.style.display = 'none';
            pesanInfoLabel.style.display = 'block';
            pesanInfoLabel.textContent = "Terima kasih pelanggan setia, sehat selalu ya 🙏 tanpa anda tidak ada cerita di kedai kita. Selalu kunjungi kami ya";
            shareOrderFab.style.display = 'none';
            productSearchBarcodeInput.style.display = 'none';
            if (printFab) printFab.style.display = 'none';
            if (cartFab) cartFab.style.display = 'none';
        }
        initializeApp();
    } else {
        document.body.removeAttribute("data-role");
        loginPopup.style.display = 'flex';
        appContainer.style.display = 'none';
        updateKasirFabVisibility();
        updateFloatingButtonVisibility();
        if (printFab) printFab.style.display = 'none';
        if (cartFab) cartFab.style.display = 'none';
    }

    const dapurFab = document.getElementById('dapur-fab');
    const dapurStrukModal = document.getElementById('dapurStrukModal');
    const dapurBodyInput = document.getElementById('dapurBodyInput');

    if (dapurFab) {
        dapurFab.addEventListener('click', () => {
            dapurBodyInput.value = '';
            dapurStrukModal.style.display = 'flex';
            dapurBodyInput.focus();
        });
    }
    window.closeDapurStrukModal = function() {
        dapurStrukModal.style.display = 'none';
    };

    window.printDapurStruk = function() {
        const isi = dapurBodyInput.value.trim();
        if (!isi) {
            alert('Isi pesanan/keterangan tidak boleh kosong!');
            return;
        }
        const headerHtml = `
            <div class="print-header">
                <p class="shop-name-print"><b>HARINFOOD</b></p>
                <p class="shop-address-print">Jl Ender Rakit - Gedongan</p>
                <p class="shop-phone-print">081235368643</p>
            </div>
        `;
        const footerHtml = `<p class="thank-you">Terima kasih sehat selalu ya 🤲 🙏🥰</p>`;
        const printContent = `
            <html>
            <head>
                <title>Struk Dapur</title>
                <meta name="viewport" content="width=58mm, initial-scale=1">
                <link rel="stylesheet" href="style.css">
                <style>
                    @media print { .print-actions { display: none !important; } }
                    .print-header { text-align: center !important; margin-bottom: 10px; }
                    .thank-you { text-align: center; margin-top: 8px !important; font-size: 1em !important; font-style: italic !important; font-weight: bold !important;}
                </style>
            </head>
            <body>
                <div id="print-area">
                    ${headerHtml}
                    <pre style="font-family:inherit;font-size:inherit;white-space:pre-wrap;">${isi}</pre>
                    ${footerHtml}
                    <div class="print-actions">
                        <button onclick="window.print();">Cetak Struk</button>
                    </div>
                </div>
            </body>
            </html>
        `;
        const printWindow = window.open('', '_blank');
        printWindow.document.write(printContent);
        printWindow.document.close();
        printWindow.focus();
        setTimeout(() => {
            printWindow.print();
            dapurStrukModal.style.display = 'none';
        }, 300);
    };
});