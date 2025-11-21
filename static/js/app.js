let currentImageIndex = 0;
let selectedVariant = '';
let images = [];

const productImage = document.getElementById('productImage');
const carouselPrev = document.getElementById('carouselPrev');
const carouselNext = document.getElementById('carouselNext');
const carouselDots = document.getElementById('carouselDots');
const variantSelect = document.getElementById('variantSelect');
const variantButtons = document.getElementById('variantButtons');
const addToCartBtn = document.getElementById('addToCartBtn');
const miniCart = document.getElementById('miniCart');
const closeCart = document.getElementById('closeCart');

function loadProductData() {
    fetch('/data/product.json')
        .then(res => res.json())
        .then(data => {
            images = data.images;
            initCarousel();
            initVariants(data.variants);
            document.getElementById('productTitle').textContent = data.title;
            document.getElementById('productPrice').textContent = `$${data.price.toFixed(2)}`;
            document.getElementById('productDescription').textContent = data.description;
        });
}

function initCarousel() {
    if (images.length === 0) return;
    productImage.src = images[0];
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
    productImage.src = images[currentImageIndex];
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
    variants.forEach(variant => {
        const option = document.createElement('option');
        option.value = variant.id;
        option.textContent = variant.name;
        variantSelect.appendChild(option);

        const btn = document.createElement('button');
        btn.className = 'variant-btn';
        btn.textContent = variant.name;
        btn.dataset.variantId = variant.id;
        btn.addEventListener('click', () => selectVariant(variant.id));
        variantButtons.appendChild(btn);
    });
}

function selectVariant(variantId) {
    selectedVariant = variantId;
    variantSelect.value = variantId;
    document.querySelectorAll('.variant-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.variantId === variantId);
    });
    addToCartBtn.disabled = !variantId;
}

function handleAddToCart() {
    if (!selectedVariant) return;
    const price = parseFloat(document.getElementById('productPrice').textContent.replace('$', ''));
    const title = document.getElementById('productTitle').textContent;
    const cartItem = {
        id: 'prod-001',
        title: title,
        price: price,
        variantId: selectedVariant,
        qty: 1,
        image: images[currentImageIndex],
        imageIndex: currentImageIndex
    };
    console.log('Added to cart:', cartItem);
}

carouselPrev.addEventListener('click', prevImage);
carouselNext.addEventListener('click', nextImage);
variantSelect.addEventListener('change', (e) => selectVariant(e.target.value));
addToCartBtn.addEventListener('click', handleAddToCart);
closeCart.addEventListener('click', () => miniCart.classList.remove('visible'));

document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') prevImage();
    if (e.key === 'ArrowRight') nextImage();
});

document.addEventListener('DOMContentLoaded', loadProductData);
