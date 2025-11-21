const addToCartBtn = document.getElementById('addToCartBtn');
const miniCart = document.getElementById('miniCart');
const closeCart = document.getElementById('closeCart');
const variantSelect = document.getElementById('variantSelect');

function openMiniCart() {
    miniCart.classList.add('visible');
}

function closeMiniCart() {
    miniCart.classList.remove('visible');
}

function handleAddToCart() {
    const selectedVariant = variantSelect.value;
    const cartItem = { variant: selectedVariant, quantity: 1 };
    console.log('Added to cart:', cartItem);
}

addToCartBtn.addEventListener('click', handleAddToCart);
closeCart.addEventListener('click', closeMiniCart);
