let currentImageIndex = 0;
let selectedVariant = '';
let images = [];
let productData = null;
let variantsMap = {};
let lastFocusedElement = null;
let addToCartLock = false;
let cart = null;

const API_BASE = window.API_BASE || '';
const PLACEHOLDER_IMG = 'https://via.placeholder.com/800x600?text=No+Image';

const productImage = document.getElementById('productImage');
const carouselPrev = document.getElementById('carouselPrev');
const carouselNext = document.getElementById('carouselNext');
const carouselDots = document.getElementById('carouselDots');
const variantSelect = document.getElementById('variantSelect');
const variantButtons = document.getElementById('variantButtons');
const addToCartBtn = document.getElementById('addToCartBtn');
const miniCart = document.getElementById('miniCart');
const closeCart = document.getElementById('closeCart');
const cartBody = document.getElementById('cartBody');
const cartOverlay = document.getElementById('cartOverlay');
const cartFooter = document.getElementById('cartFooter');

function debounce(fn, delay) {
    let timeout;
    return (...args) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => fn(...args), delay);
    };
}

function trapFocus(element) {
    const focusableElements = element.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    function handleTab(e) {
        if (e.key !== 'Tab') return;
        if (e.shiftKey) {
            if (document.activeElement === firstElement) {
                e.preventDefault();
                lastElement.focus();
            }
        } else {
            if (document.activeElement === lastElement) {
                e.preventDefault();
                firstElement.focus();
            }
        }
    }

    element.addEventListener('keydown', handleTab);
    if (firstElement) firstElement.focus();
    
    return () => element.removeEventListener('keydown', handleTab);
}

let focusTrapCleanup = null;

function openMiniCart() {
    lastFocusedElement = document.activeElement;
    miniCart.classList.add('visible');
    miniCart.setAttribute('aria-hidden', 'false');
    if (addToCartBtn) addToCartBtn.setAttribute('aria-expanded', 'true');
    if (cartOverlay) cartOverlay.classList.add('visible');
    focusTrapCleanup = trapFocus(miniCart);
}

function closeMiniCart() {
    miniCart.classList.remove('visible');
    miniCart.setAttribute('aria-hidden', 'true');
    if (addToCartBtn) addToCartBtn.setAttribute('aria-expanded', 'false');
    if (cartOverlay) cartOverlay.classList.remove('visible');
    if (focusTrapCleanup) {
        focusTrapCleanup();
        focusTrapCleanup = null;
    }
    if (lastFocusedElement) {
        lastFocusedElement.focus();
        lastFocusedElement = null;
    }
}

async function loadProductData() {
    try {
        // Try API first
        const apiResponse = await fetch(`${API_BASE}/api/products`);
        if (apiResponse.ok) {
            const data = await apiResponse.json();
            initializeProduct(data);
            return;
        }
    } catch (e) {
        console.log('API fetch failed, falling back to local JSON:', e);
    }

    // Fallback to local JSON
    try {
        const response = await fetch('./data/product.json');
        const data = await response.json();
        initializeProduct(data);
    } catch (e) {
        console.error('Fallback fetch failed, using inline data:', e);
        // Inline fallback for file:// mode
        if (window.location.protocol === 'file:' && window.FALLBACK_PRODUCT_DATA) {
            initializeProduct(window.FALLBACK_PRODUCT_DATA);
        } else {
            console.error('No product data available');
        }
    }
}

function initializeProduct(data) {
    productData = data;
    images = data.images || [];
    data.variants.forEach(v => { variantsMap[v.id] = v.name; });
    
    initCarousel();
    initVariants(data.variants);
    
    document.getElementById('productTitle').textContent = data.title;
    document.getElementById('productPrice').textContent = `$${data.price.toFixed(2)}`;
    document.getElementById('productDescription').textContent = data.description;
    
    // Initialize cart with variants map
    if (typeof Cart !== 'undefined') {
        cart = new Cart();
        cart.init(cartBody, cartFooter, variantsMap);
        cart.load();
    }
}

function initCarousel() {
    if (images.length === 0) {
        images = [PLACEHOLDER_IMG];
    }
    productImage.src = images[0] || PLACEHOLDER_IMG;
    productImage.onerror = () => { productImage.src = PLACEHOLDER_IMG; };
    createDots();
    updateCarousel();
}

function createDots() {
    carouselDots.innerHTML = '';
    images.forEach((_, index) => {
        const dot = document.createElement('button');
        dot.className = 'carousel-dot';
        if (index === 0) dot.classList.add('active');
        dot.addEventListener('click', () => goToImage(index));
        carouselDots.appendChild(dot);
    });
}

function updateCarousel() {
    productImage.src = images[currentImageIndex] || PLACEHOLDER_IMG;
    productImage.onerror = () => { productImage.src = PLACEHOLDER_IMG; };
    document.querySelectorAll('.carousel-dot').forEach((dot, index) => {
        dot.classList.toggle('active', index === currentImageIndex);
    });
}

function goToImage(index) {
    currentImageIndex = index;
    updateCarousel();
}

function nextImage() {
    currentImageIndex = (currentImageIndex + 1) % images.length;
    updateCarousel();
}

function prevImage() {
    currentImageIndex = (currentImageIndex - 1 + images.length) % images.length;
    updateCarousel();
}

function initVariants(variants) {
    variants.forEach((variant, index) => {
        const option = document.createElement('option');
        option.value = variant.id;
        option.textContent = variant.name;
        variantSelect.appendChild(option);

        const btn = document.createElement('button');
        btn.className = 'variant-btn';
        btn.textContent = variant.name;
        btn.dataset.variantId = variant.id;
        btn.setAttribute('role', 'radio');
        btn.setAttribute('aria-checked', 'false');
        btn.setAttribute('tabindex', index === 0 ? '0' : '-1');
        btn.addEventListener('click', () => selectVariant(variant.id));
        variantButtons.appendChild(btn);
    });
}

function selectVariant(variantId) {
    selectedVariant = variantId;
    variantSelect.value = variantId;
    document.querySelectorAll('.variant-btn').forEach(btn => {
        const isActive = btn.dataset.variantId === variantId;
        btn.classList.toggle('active', isActive);
        btn.setAttribute('aria-checked', isActive ? 'true' : 'false');
        btn.setAttribute('tabindex', isActive ? '0' : '-1');
    });
    addToCartBtn.disabled = !variantId;
}

function handleAddToCart() {
    if (!selectedVariant || addToCartLock || !cart) return;

    addToCartLock = true;
    setTimeout(() => { addToCartLock = false; }, 300);

    const price = parseFloat(document.getElementById('productPrice').textContent.replace('$', ''));
    const title = document.getElementById('productTitle').textContent;
    
    cart.addItem({
        productId: productData.id,
        variantId: selectedVariant,
        title: title,
        price: price,
        qty: 1,
        image: images[currentImageIndex] || PLACEHOLDER_IMG
    });
    
    openMiniCart();
}

carouselPrev.addEventListener('click', prevImage);
carouselNext.addEventListener('click', nextImage);
variantSelect.addEventListener('change', (e) => selectVariant(e.target.value));
addToCartBtn.addEventListener('click', handleAddToCart);
closeCart.addEventListener('click', closeMiniCart);
if (cartOverlay) cartOverlay.addEventListener('click', closeMiniCart);

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && miniCart.classList.contains('visible')) {
        closeMiniCart();
        return;
    }
    const activeElement = document.activeElement;
    const isInputFocused = activeElement && (
        activeElement.tagName === 'INPUT' ||
        activeElement.tagName === 'TEXTAREA' ||
        activeElement.isContentEditable
    );
    if (!isInputFocused) {
        if (e.key === 'ArrowLeft') prevImage();
        if (e.key === 'ArrowRight') nextImage();
    }
});

document.addEventListener('DOMContentLoaded', loadProductData);
