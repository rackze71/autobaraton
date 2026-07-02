const AUTOS = [
    { id: 1, marca: 'Toyota', modelo: 'Camry', anio: 2025, precio: 425000, motor: '2.5L', trans: 'Automático', km: 14, img: 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=600', tipo: 'sedan', personas: '5' },
    { id: 2, marca: 'Nissan', modelo: 'Sentra', anio: 2025, precio: 348000, motor: '2.0L', trans: 'CVT', km: 16, img: 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=600', tipo: 'sedan', personas: '5' },
    { id: 3, marca: 'Honda', modelo: 'CR-V', anio: 2025, precio: 560000, motor: '1.5T', trans: 'Automático', km: 13, img: 'https://images.unsplash.com/photo-1568844293986-8d0400bd4745?w=600', tipo: 'suv', personas: '5+' },
    { id: 4, marca: 'Mazda', modelo: 'CX-5', anio: 2025, precio: 520000, motor: '2.5L', trans: 'Automático', km: 12, img: 'https://images.unsplash.com/photo-1606611013016-969c19ba27bb?w=600', tipo: 'suv', personas: '5' },
    { id: 5, marca: 'Volkswagen', modelo: 'Jetta', anio: 2025, precio: 395000, motor: '1.4T', trans: 'DSG', km: 15, img: 'https://images.unsplash.com/photo-1606152421802-db97b9c7a11b?w=600', tipo: 'sedan', personas: '5' },
    { id: 6, marca: 'Kia', modelo: 'Sportage', anio: 2025, precio: 495000, motor: '2.0L', trans: 'Automático', km: 13, img: 'https://images.unsplash.com/photo-1619767886558-efdc259cde1a?w=600', tipo: 'suv', personas: '5+' }
];

const formatoPrecio = n => '$' + n.toLocaleString('es-MX');
const getCarrito = () => JSON.parse(localStorage.getItem('carrito') || '[]');
const guardarCarrito = c => localStorage.setItem('carrito', JSON.stringify(c));
const getFavoritos = () => JSON.parse(localStorage.getItem('favoritos') || '[]');
const guardarFavoritos = f => localStorage.setItem('favoritos', JSON.stringify(f));
const getComparador = () => JSON.parse(localStorage.getItem('comparador') || '[]');
const guardarComparador = c => localStorage.setItem('comparador', JSON.stringify(c));

function actualizarContador() {
    const count = getCarrito().length;
    const el = document.getElementById('cart-count');
    if (el) el.textContent = count;
}

function mostrarToast(msg) {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `<i class="fas fa-check-circle"></i><span>${msg}</span>`;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 2500);
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

function quitarDelCarrito(id) {
    const carrito = getCarrito().filter(i => i !== id);
    guardarCarrito(carrito);
    actualizarContador();
    renderCarrito();
}

function vaciarCarrito() {
    if (confirm('¿Vaciar carrito?')) {
        guardarCarrito([]);
        actualizarContador();
        renderCarrito();
    }
}

function toggleFavorito(id, event) {
    if (event) event.stopPropagation();
    let favs = getFavoritos();
    if (favs.includes(id)) {
        favs = favs.filter(f => f !== id);
        mostrarToast('Eliminado de favoritos');
    } else {
        favs.push(id);
        mostrarToast('Agregado a favoritos');
    }
    guardarFavoritos(favs);
    renderCatalogo();
    renderFavoritos();
}

function toggleComparador(id) {
    let comp = getComparador();
    if (comp.includes(id)) {
        comp = comp.filter(c => c !== id);
    } else {
        if (comp.length >= 3) {
            mostrarToast('Máximo 3 autos para comparar');
            return;
        }
        comp.push(id);
    }
    guardarComparador(comp);
    renderComparador();
    renderSelectorComparador();
}

function limpiarComparador() {
    guardarComparador([]);
    renderComparador();
    renderSelectorComparador();
}

function crearTarjetaAuto(auto, mostrarFav = true, mostrarComp = false) {
    const esFav = getFavoritos().includes(auto.id);
    const enComp = getComparador().includes(auto.id);
    
    return `
        <div class="car-card">
            <div class="car-card-img">
                <img src="${auto.img}" alt="${auto.marca} ${auto.modelo}">
                <span class="car-badge">Disponible</span>
                ${mostrarFav ? `<button class="car-fav-btn ${esFav ? 'active' : ''}" onclick="toggleFavorito(${auto.id}, event)"><i class="${esFav ? 'fas' : 'far'} fa-heart"></i></button>` : ''}
            </div>
            <div class="car-card-body">
                <div class="car-card-header">
                    <h3 class="car-card-title">${auto.marca} ${auto.modelo}</h3>
                    <span class="car-card-year">${auto.anio}</span>
                </div>
                <div class="car-specs">
                    <span><i class="fas fa-cog"></i> ${auto.trans}</span>
                    <span><i class="fas fa-gas-pump"></i> ${auto.motor}</span>
                    <span><i class="fas fa-tachometer-alt"></i> ${auto.km} km</span>
                </div>
                <div class="car-price">${formatoPrecio(auto.precio)} <small style="color:var(--gray);font-weight:400;font-size:0.8rem">MXN</small></div>
                <div class="car-monthly">Desde ${formatoPrecio(Math.round(auto.precio / 48))} /mes</div>
                <div class="car-actions">
                    <button class="btn-add-cart" onclick="agregarAlCarrito(${auto.id})"><i class="fas fa-cart-plus"></i> Agregar</button>
                    ${mostrarComp ? `<button class="btn-compare ${enComp ? 'active' : ''}" onclick="toggleComparador(${auto.id})"><i class="fas fa-balance-scale"></i></button>` : ''}
                </div>
            </div>
        </div>
    `;
}

function renderCatalogo() {
    const grid = document.getElementById('catalogo-grid');
    const sinResultados = document.getElementById('sin-resultados');
    if (!grid) return;

    const buscador = document.getElementById('buscador')?.value.toLowerCase() || '';
    const marca = document.getElementById('filtro-marca')?.value || '';
    const trans = document.getElementById('filtro-trans')?.value || '';
    const precioMax = parseInt(document.getElementById('filtro-precio')?.value) || Infinity;
    const orden = document.getElementById('filtro-orden')?.value || '';

    let lista = AUTOS.filter(a => {
        const matchBusqueda = !buscador || 
            a.marca.toLowerCase().includes(buscador) || 
            a.modelo.toLowerCase().includes(buscador) ||
            a.anio.toString().includes(buscador);
        const matchMarca = !marca || a.marca === marca;
        const matchTrans = !trans || a.trans === trans;
        const matchPrecio = a.precio <= precioMax;
        return matchBusqueda && matchMarca && matchTrans && matchPrecio;
    });

    if (orden === 'precio-asc') lista.sort((a, b) => a.precio - b.precio);
    if (orden === 'precio-desc') lista.sort((a, b) => b.precio - a.precio);
    if (orden === 'km-asc') lista.sort((a, b) => a.km - b.km);

    if (lista.length === 0) {
        grid.innerHTML = '';
        sinResultados?.classList.remove('hidden');
    } else {
        sinResultados?.classList.add('hidden');
        grid.innerHTML = lista.map(a => crearTarjetaAuto(a, true, true)).join('');
    }
}

function renderCarrito() {
    const items = document.getElementById('carrito-items');
    const vacio = document.getElementById('carrito-vacio');
    const contenido = document.getElementById('carrito-contenido');
    const countEl = document.getElementById('cart-items-count');
    if (!items) return;

    const carrito = getCarrito();
    const autos = carrito.map(id => AUTOS.find(a => a.id === id)).filter(Boolean);

    if (autos.length === 0) {
        vacio.classList.remove('hidden');
        contenido.classList.add('hidden');
        if (countEl) countEl.textContent = '0 autos en tu carrito';
        return;
    }

    vacio.classList.add('hidden');
    contenido.classList.remove('hidden');
    if (countEl) countEl.textContent = `${autos.length} auto${autos.length > 1 ? 's' : ''} en tu carrito`;

    items.innerHTML = autos.map(auto => `
        <div class="carrito-item">
            <img src="${auto.img}" alt="${auto.marca}">
            <div class="carrito-item-info">
                <h4>${auto.marca} ${auto.modelo} ${auto.anio}</h4>
                <p>${auto.trans} • ${auto.motor} • ${auto.km} km</p>
                <strong>${formatoPrecio(auto.precio)}</strong>
            </div>
            <button onclick="quitarDelCarrito(${auto.id})"><i class="fas fa-trash"></i></button>
        </div>
    `).join('');

    const subtotal = autos.reduce((s, a) => s + a.precio, 0);
    document.getElementById('resumen-subtotal').textContent = formatoPrecio(subtotal);
    document.getElementById('resumen-total').textContent = formatoPrecio(subtotal + 5000);
}

function renderFavoritos() {
    const grid = document.getElementById('fav-grid');
    const vacio = document.getElementById('fav-vacio');
    const countEl = document.getElementById('fav-count');
    if (!grid) return;

    const favs = getFavoritos();
    const autos = favs.map(id => AUTOS.find(a => a.id === id)).filter(Boolean);

    if (autos.length === 0) {
        vacio.classList.remove('hidden');
        grid.classList.add('hidden');
        if (countEl) countEl.textContent = '0 autos guardados';
        return;
    }

    vacio.classList.add('hidden');
    grid.classList.remove('hidden');
    if (countEl) countEl.textContent = `${autos.length} auto${autos.length > 1 ? 's' : ''} guardado${autos.length > 1 ? 's' : ''}`;
    grid.innerHTML = autos.map(a => crearTarjetaAuto(a, true, false)).join('');
}

function renderSelectorComparador() {
    const grid = document.getElementById('selector-grid');
    if (!grid) return;
    const comp = getComparador();
    grid.innerHTML = AUTOS.map(a => `
        <div class="selector-item ${comp.includes(a.id) ? 'selected' : ''}" onclick="toggleComparador(${a.id})">
            <img src="${a.img}" alt="${a.marca}">
            <strong>${a.marca} ${a.modelo}</strong>
            <small>${formatoPrecio(a.precio)}</small>
        </div>
    `).join('');
}

function renderComparador() {
    const tabla = document.getElementById('tabla-comparacion');
    const vacio = document.getElementById('comparador-vacio');
    const cont = document.getElementById('comparador-tabla');
    if (!tabla) return;

    const comp = getComparador();
    const autos = comp.map(id => AUTOS.find(a => a.id === id)).filter(Boolean);

    if (autos.length < 2) {
        vacio.classList.remove('hidden');
        cont.classList.add('hidden');
        return;
    }

    vacio.classList.add('hidden');
    cont.classList.remove('hidden');

    const specs = [
        { label: 'Precio', key: 'precio', format: formatoPrecio, best: 'min' },
        { label: 'Motor', key: 'motor' },
        { label: 'Transmisión', key: 'trans' },
        { label: 'Kilometraje', key: 'km', format: v => v + ' km', best: 'min' },
        { label: 'Año', key: 'anio', best: 'max' },
        { label: 'Tipo', key: 'tipo' },
        { label: 'Capacidad', key: 'personas' }
    ];

    let html = '<thead><tr><th>Característica</th>';
    autos.forEach(a => html += `<th>${a.marca} ${a.modelo}</th>`);
    html += '</tr></thead><tbody>';

    specs.forEach(spec => {
        html += `<tr><td>${spec.label}</td>`;
        let values = autos.map(a => a[spec.key]);
        let bestIdx = -1;
        if (spec.best === 'min') bestIdx = values.indexOf(Math.min(...values));
        if (spec.best === 'max') bestIdx = values.indexOf(Math.max(...values));
        
        autos.forEach((a, i) => {
            const val = spec.format ? spec.format(a[spec.key]) : a[spec.key];
            html += `<td class="${i === bestIdx ? 'best' : ''}">${val}</td>`;
        });
        html += '</tr>';
    });

    html += '</tbody>';
    tabla.innerHTML = html;
}

function calcularMensualidad(precio, enganche, meses) {
    const tasaAnual = 0.12;
    const tasaMensual = tasaAnual / 12;
    const financiado = precio * (1 - enganche / 100);
    if (financiado <= 0) return 0;
    const mensualidad = (financiado * tasaMensual) / (1 - Math.pow(1 + tasaMensual, -meses));
    return Math.round(mensualidad);
}

function initSimulador() {
    const precio = document.getElementById('sim-precio');
    const enganche = document.getElementById('sim-enganche');
    const plazo = document.getElementById('sim-plazo');
    const mensualidad = document.getElementById('sim-mensualidad');
    const engancheVal = document.getElementById('sim-enganche-val');
    const plazoVal = document.getElementById('sim-plazo-val');
    if (!precio) return;

    function actualizar() {
        const m = calcularMensualidad(+precio.value, +enganche.value, +plazo.value);
        mensualidad.textContent = formatoPrecio(m);
        engancheVal.textContent = enganche.value + '%';
        plazoVal.textContent = plazo.value + ' meses';
    }

    precio.addEventListener('input', actualizar);
    enganche.addEventListener('input', actualizar);
    plazo.addEventListener('input', actualizar);
    actualizar();
}

function formatearTarjeta(e) {
    let v = e.target.value.replace(/\D/g, '');
    e.target.value = v.match(/.{1,4}/g)?.join(' ') || '';
}

function formatearExpiry(e) {
    let v = e.target.value.replace(/\D/g, '');
    if (v.length >= 2) v = v.slice(0, 2) + '/' + v.slice(2, 4);
    e.target.value = v;
}

function renderCheckout() {
    const cont = document.getElementById('checkout-items');
    if (!cont) return;
    const autos = getCarrito().map(id => AUTOS.find(a => a.id === id)).filter(Boolean);
    cont.innerHTML = autos.map(a => `
        <div class="checkout-item">
            <span>${a.marca} ${a.modelo}</span>
            <strong>${formatoPrecio(a.precio)}</strong>
        </div>
    `).join('');
    const subtotal = autos.reduce((s, a) => s + a.precio, 0);
    document.getElementById('checkout-subtotal').textContent = formatoPrecio(subtotal);
    document.getElementById('checkout-total').textContent = formatoPrecio(subtotal + 5000);
}

function procesarPago(e) {
    e.preventDefault();
    const btn = e.target.querySelector('button[type="submit"]');
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Procesando...';
    btn.disabled = true;
    setTimeout(() => {
        guardarCarrito([]);
        actualizarContador();
        document.getElementById('order-num').textContent = Math.floor(Math.random() * 900000 + 100000);
        document.getElementById('modal-exito').classList.remove('hidden');
    }, 2000);
}

const QUIZ_PREGUNTAS = [
    {
        pregunta: '¿Cuántas personas usarán el auto principalmente?',
        opciones: [
            { texto: '1-2 personas', valor: 'pocas', icon: 'fa-user' },
            { texto: '3-4 personas', valor: 'medianas', icon: 'fa-users' },
            { texto: '5 o más personas', valor: 'muchas', icon: 'fa-user-friends' }
        ]
    },
    {
        pregunta: '¿Para qué tipo de uso lo necesitas?',
        opciones: [
            { texto: 'Ciudad (tráfico, estacionamiento)', valor: 'ciudad', icon: 'fa-city' },
            { texto: 'Carretera (viajes largos)', valor: 'carretera', icon: 'fa-road' },
            { texto: 'Mixto (ciudad y carretera)', valor: 'mixto', icon: 'fa-route' }
        ]
    },
    {
        pregunta: '¿Cuál es tu presupuesto mensual aproximado?',
        opciones: [
            { texto: 'Menos de $8,000', valor: 'bajo', icon: 'fa-piggy-bank' },
            { texto: '$8,000 - $12,000', valor: 'medio', icon: 'fa-wallet' },
            { texto: 'Más de $12,000', valor: 'alto', icon: 'fa-money-bill-wave' }
        ]
    }
];

let quizActual = 0;
let quizRespuestas = [];

function renderPregunta() {
    const p = QUIZ_PREGUNTAS[quizActual];
    document.getElementById('quiz-pregunta').textContent = p.pregunta;
    document.getElementById('quiz-current').textContent = quizActual + 1;
    document.getElementById('quiz-progress-bar').style.width = ((quizActual + 1) / 3 * 100) + '%';
    document.getElementById('quiz-back').disabled = quizActual === 0;
    document.getElementById('quiz-next').innerHTML = quizActual === 2 ? 'Ver resultado <i class="fas fa-magic"></i>' : 'Siguiente <i class="fas fa-arrow-right"></i>';
    
    document.getElementById('quiz-opciones').innerHTML = p.opciones.map((op, i) => `
        <button class="quiz-opcion ${quizRespuestas[quizActual] === i ? 'selected' : ''}" onclick="seleccionarOpcion(${i})">
            <i class="fas ${op.icon}" style="color:var(--primary);margin-right:0.5rem"></i> ${op.texto}
        </button>
    `).join('');
}

function seleccionarOpcion(i) {
    quizRespuestas[quizActual] = i;
    renderPregunta();
}

function quizSiguiente() {
    if (quizRespuestas[quizActual] === undefined) {
        mostrarToast('Selecciona una opción');
        return;
    }
    if (quizActual < 2) {
        quizActual++;
        renderPregunta();
    } else {
        mostrarResultado();
    }
}

function quizAnterior() {
    if (quizActual > 0) {
        quizActual--;
        renderPregunta();
    }
}

function reiniciarQuiz() {
    quizActual = 0;
    quizRespuestas = [];
    document.getElementById('quiz-container').classList.remove('hidden');
    document.getElementById('quiz-resultado').classList.add('hidden');
    renderPregunta();
}

function mostrarResultado() {
    const personas = QUIZ_PREGUNTAS[0].opciones[quizRespuestas[0]].valor;
    const uso = QUIZ_PREGUNTAS[1].opciones[quizRespuestas[1]].valor;
    const presupuesto = QUIZ_PREGUNTAS[2].opciones[quizRespuestas[2]].valor;

    let candidatos = [...AUTOS];
    let razones = [];

    if (personas === 'muchas') {
        candidatos = candidatos.filter(a => a.tipo === 'suv');
        razones.push('Espacio para 5+ personas');
    } else if (personas === 'pocas') {
        candidatos = candidatos.filter(a => a.tipo === 'sedan');
        razones.push('Ideal para 1-2 personas');
    } else {
        razones.push('Perfecto para familias de 3-4 personas');
    }

    if (uso === 'ciudad') {
        candidatos.sort((a, b) => a.precio - b.precio);
        razones.push('Eficiente para ciudad');
    } else if (uso === 'carretera') {
        candidatos = candidatos.filter(a => a.tipo === 'suv' || a.motor.includes('T'));
        razones.push('Potente para carretera');
    } else {
        razones.push('Versátil para uso mixto');
    }

    if (presupuesto === 'bajo') candidatos = candidatos.filter(a => a.precio < 400000);
    else if (presupuesto === 'medio') candidatos = candidatos.filter(a => a.precio >= 400000 && a.precio < 550000);
    else candidatos = candidatos.filter(a => a.precio >= 550000);

    razones.push(`Presupuesto ${presupuesto} mensual`);

    if (candidatos.length === 0) candidatos = AUTOS;
    const recomendado = candidatos[0];

    document.getElementById('quiz-container').classList.add('hidden');
    document.getElementById('quiz-resultado').classList.remove('hidden');
    document.getElementById('auto-recomendado').innerHTML = crearTarjetaAuto(recomendado, false, false);
    document.getElementById('razones-lista').innerHTML = razones.map(r => `<li><i class="fas fa-check-circle"></i> ${r}</li>`).join('');
}

function animateStats() {
    document.querySelectorAll('.stat-num').forEach(el => {
        const target = +el.dataset.target;
        let current = 0;
        const increment = target / 50;
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                el.textContent = target + (target === 98 ? '' : '+');
                clearInterval(timer);
            } else {
                el.textContent = Math.floor(current);
            }
        }, 30);
    });
}

document.addEventListener('DOMContentLoaded', () => {
    actualizarContador();

    document.getElementById('buscador')?.addEventListener('input', renderCatalogo);
    document.getElementById('filtro-marca')?.addEventListener('change', renderCatalogo);
    document.getElementById('filtro-trans')?.addEventListener('change', renderCatalogo);
    document.getElementById('filtro-precio')?.addEventListener('change', renderCatalogo);
    document.getElementById('filtro-orden')?.addEventListener('change', renderCatalogo);

    if (document.getElementById('catalogo-grid')) {
        renderCatalogo();
        setTimeout(animateStats, 500);
    }
    if (document.getElementById('carrito-items')) renderCarrito();
    if (document.getElementById('fav-grid')) renderFavoritos();
    if (document.getElementById('selector-grid')) {
        renderSelectorComparador();
        renderComparador();
    }
    if (document.getElementById('quiz-pregunta')) renderPregunta();

    initSimulador();

    if (document.getElementById('form-checkout')) {
        renderCheckout();
        document.getElementById('card-number')?.addEventListener('input', formatearTarjeta);
        document.getElementById('card-expiry')?.addEventListener('input', formatearExpiry);
        document.getElementById('card-cvv')?.addEventListener('input', e => e.target.value = e.target.value.replace(/\D/g, ''));
        document.getElementById('form-checkout').addEventListener('submit', procesarPago);
    }

    const toggleDark = document.getElementById('toggle-dark');
    if (toggleDark) {
        const savedTheme = localStorage.getItem('tema');
        if (savedTheme === 'oscuro') {
            document.body.classList.add('dark');
            toggleDark.innerHTML = '<i class="fas fa-sun"></i>';
        }
        toggleDark.addEventListener('click', () => {
            document.body.classList.toggle('dark');
            const isDark = document.body.classList.contains('dark');
            localStorage.setItem('tema', isDark ? 'oscuro' : 'claro');
            toggleDark.innerHTML = isDark ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
        });
    }

    const backToTop = document.getElementById('back-to-top');
    if (backToTop) {
        window.addEventListener('scroll', () => {
            backToTop.classList.toggle('visible', window.scrollY > 500);
        });
        backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
    }

    document.querySelectorAll('a[href^="#"]').forEach(a => {
        a.addEventListener('click', e => {
            const target = document.querySelector(a.getAttribute('href'));
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
});