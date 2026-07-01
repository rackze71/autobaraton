const AUTOS = [
    { id: 1, marca: 'Toyota', modelo: 'Camry', anio: 2025, precio: 425000, motor: '2.5L', trans: 'Automático', km: 14, img: 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=600' },
    { id: 2, marca: 'Nissan', modelo: 'Sentra', anio: 2025, precio: 348000, motor: '2.0L', trans: 'CVT', km: 16, img: 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=600' },
    { id: 3, marca: 'Honda', modelo: 'CR-V', anio: 2025, precio: 560000, motor: '1.5T', trans: 'Automático', km: 13, img: 'https://images.unsplash.com/photo-1568844293986-8d0400bd4745?w=600' },
    { id: 4, marca: 'Mazda', modelo: 'CX-5', anio: 2025, precio: 520000, motor: '2.5L', trans: 'Automático', km: 12, img: 'https://images.unsplash.com/photo-1606611013016-969c19ba27bb?w=600' },
    { id: 5, marca: 'Volkswagen', modelo: 'Jetta', anio: 2025, precio: 395000, motor: '1.4T', trans: 'DSG', km: 15, img: 'https://images.unsplash.com/photo-1606152421802-db97b9c7a11b?w=600' },
    { id: 6, marca: 'Kia', modelo: 'Sportage', anio: 2025, precio: 495000, motor: '2.0L', trans: 'Automático', km: 13, img: 'https://images.unsplash.com/photo-1619767886558-efdc259cde1a?w=600' }
];

const formatoPrecio = (n) => '$' + n.toLocaleString('es-MX');
const getCarrito = () => JSON.parse(localStorage.getItem('carrito') || '[]');
const guardarCarrito = (c) => localStorage.setItem('carrito', JSON.stringify(c));

function actualizarContador() {
    const count = getCarrito().length;
    const el = document.getElementById('cart-count');
    if (el) el.textContent = count;
}

function mostrarToast(msg) {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `<i class="fas fa-check-circle mr-2"></i>${msg}`;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 2500);
}

// === CATÁLOGO (index.html) ===
function renderCatalogo(filtro = '') {
    const grid = document.getElementById('catalogo-grid');
    if (!grid) return;
    
    const lista = filtro ? AUTOS.filter(a => a.marca === filtro) : AUTOS;
    
    grid.innerHTML = lista.map(auto => `
        <div class="car-card bg-white rounded-2xl overflow-hidden border border-gray-100">
            <div class="relative">
                <img src="${auto.img}" alt="${auto.marca} ${auto.modelo}" class="w-full h-48 object-cover">
                <span class="absolute top-3 left-3 badge-stock">Disponible</span>
            </div>
            <div class="p-5">
                <div class="flex justify-between mb-1">
                    <h3 class="font-bold text-lg">${auto.marca} ${auto.modelo}</h3>
                    <span class="text-sm text-slate-500">${auto.anio}</span>
                </div>
                <div class="flex gap-3 text-xs text-slate-500 mb-3">
                    <span><i class="fas fa-cog mr-1"></i>${auto.trans}</span>
                    <span><i class="fas fa-gas-pump mr-1"></i>${auto.motor}</span>                    <span><i class="fas fa-tachometer-alt mr-1"></i>${auto.km} km</span>
                </div>
                <p class="text-2xl font-bold mb-3">${formatoPrecio(auto.precio)} <span class="text-xs text-slate-500 font-normal">MXN</span></p>
                <p class="text-emerald-600 text-sm font-semibold mb-3">Desde ${formatoPrecio(Math.round(auto.precio / 48))} /mes</p>
                <button class="btn-add-cart" onclick="agregarAlCarrito(${auto.id})">
                    <i class="fas fa-cart-plus mr-1"></i> Agregar al carrito
                </button>
            </div>
        </div>
    `).join('');
}

function agregarAlCarrito(id) {
    const carrito = getCarrito();
    if (!carrito.includes(id)) {
        carrito.push(id);
        guardarCarrito(carrito);
        actualizarContador();
        mostrarToast('Auto agregado al carrito');
    } else {
        mostrarToast('Este auto ya está en tu carrito');
    }
}

// === CARRITO (carrito.html) ===
function renderCarrito() {
    const items = document.getElementById('carrito-items');
    const vacio = document.getElementById('carrito-vacio');
    if (!items) return;

    const carrito = getCarrito();
    const autos = carrito.map(id => AUTOS.find(a => a.id === id)).filter(Boolean);

    if (autos.length === 0) {
        vacio.classList.remove('hidden');
        items.innerHTML = '';
        return;
    }

    items.innerHTML = autos.map(auto => `
        <div class="bg-white rounded-2xl p-4 flex gap-4 shadow-sm">
            <img src="${auto.img}" class="w-24 h-24 object-cover rounded-xl">
            <div class="flex-1">
                <h4 class="font-bold">${auto.marca} ${auto.modelo} ${auto.anio}</h4>
                <p class="text-sm text-slate-500">${auto.trans} • ${auto.motor}</p>
                <p class="font-bold text-lg mt-1">${formatoPrecio(auto.precio)}</p>
            </div>
            <button onclick="quitarDelCarrito(${auto.id})" class="text-slate-400 hover:text-red-500 self-start">
                <i class="fas fa-trash"></i>
            </button>        </div>
    `).join('');

    const subtotal = autos.reduce((s, a) => s + a.precio, 0);
    document.getElementById('resumen-subtotal').textContent = formatoPrecio(subtotal);
    document.getElementById('resumen-total').textContent = formatoPrecio(subtotal + 5000);
}

function quitarDelCarrito(id) {
    const carrito = getCarrito().filter(i => i !== id);
    guardarCarrito(carrito);
    actualizarContador();
    renderCarrito();
}

// === CHECKOUT (checkout.html) ===
function renderCheckout() {
    const cont = document.getElementById('checkout-items');
    if (!cont) return;

    const autos = getCarrito().map(id => AUTOS.find(a => a.id === id)).filter(Boolean);
    cont.innerHTML = autos.map(a => `
        <div class="flex justify-between">
            <span>${a.marca} ${a.modelo}</span>
            <span class="font-semibold">${formatoPrecio(a.precio)}</span>
        </div>
    `).join('');

    const subtotal = autos.reduce((s, a) => s + a.precio, 0);
    document.getElementById('checkout-subtotal').textContent = formatoPrecio(subtotal);
    document.getElementById('checkout-total').textContent = formatoPrecio(subtotal + 5000);
}

function formatearTarjeta(e) {
    let v = e.target.value.replace(/\s/g, '').replace(/\D/g, '');
    e.target.value = v.match(/.{1,4}/g)?.join(' ') || '';
}

function formatearExpiry(e) {
    let v = e.target.value.replace(/\D/g, '');
    if (v.length >= 2) v = v.slice(0, 2) + '/' + v.slice(2, 4);
    e.target.value = v;
}

function procesarPago(e) {
    e.preventDefault();
    const btn = e.target.querySelector('button[type="submit"]');
    btn.innerHTML = '<i class="fas fa-spinner fa-spin mr-1"></i> Procesando...';
    btn.disabled = true;
    // Simulación: no hace nada real
    setTimeout(() => {
        localStorage.removeItem('carrito');
        document.getElementById('modal-exito').classList.remove('hidden');
    }, 2000);
}

// === INICIALIZACIÓN ===
document.addEventListener('DOMContentLoaded', () => {
    actualizarContador();

    // Catálogo
    const filtro = document.getElementById('filtro-marca');
    if (filtro) {
        renderCatalogo();
        filtro.addEventListener('change', e => renderCatalogo(e.target.value));
    }

    // Carrito
    if (document.getElementById('carrito-items')) renderCarrito();

    // Checkout
    if (document.getElementById('form-checkout')) {
        renderCheckout();
        document.getElementById('card-number')?.addEventListener('input', formatearTarjeta);
        document.getElementById('card-expiry')?.addEventListener('input', formatearExpiry);
        document.getElementById('card-cvv')?.addEventListener('input', e => e.target.value = e.target.value.replace(/\D/g, ''));
        document.getElementById('form-checkout').addEventListener('submit', procesarPago);
    }
});

