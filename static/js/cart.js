(function(global) {
    'use strict';

    const STORAGE_KEY = 'mini_cart';

    function Cart() {
        this.items = [];
        this.variantsMap = {};
        this.cartBody = null;
        this.cartFooter = null;
        this.renderTimeout = null;
    }

    Cart.prototype.init = function(cartBodyEl, cartFooterEl, variantsMapObj) {
        this.cartBody = cartBodyEl;
        this.cartFooter = cartFooterEl;
        this.variantsMap = variantsMapObj || {};
        return this;
    };

    Cart.prototype.load = function() {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            this.items = stored ? JSON.parse(stored) : [];
        } catch (e) {
            console.warn('Failed to parse cart data, resetting cart:', e);
            this.items = [];
            localStorage.removeItem(STORAGE_KEY);
        }
        this.render();
        return this;
    };

    Cart.prototype.save = function() {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(this.items));
        } catch (e) {
            console.error('Failed to save cart:', e);
        }
        this.debouncedRender();
        return this;
    };

    Cart.prototype.debouncedRender = function() {
        clearTimeout(this.renderTimeout);
        this.renderTimeout = setTimeout(() => this.render(), 50);
        return this;
    };

    Cart.prototype.addItem = function(item) {
        if (!item.productId || !item.variantId) {
            console.error('Item must have productId and variantId');
            return this;
        }

        const existing = this.items.find(i => 
            i.productId === item.productId && i.variantId === item.variantId
        );

        if (existing) {
            existing.qty += (item.qty || 1);
        } else {
            this.items.push({
                productId: item.productId,
                variantId: item.variantId,
                title: item.title || 'Product',
                price: item.price || 0,
                qty: item.qty || 1,
                image: item.image || ''
            });
        }

        this.save();
        return this;
    };

    Cart.prototype.updateQty = function(productId, variantId, qty) {
        const item = this.items.find(i => 
            i.productId === productId && i.variantId === variantId
        );
        if (item) {
            item.qty = Math.max(1, qty);
            this.save();
        }
        return this;
    };

    Cart.prototype.removeItem = function(productId, variantId) {
        this.items = this.items.filter(i => 
            !(i.productId === productId && i.variantId === variantId)
        );
        this.save();
        return this;
    };

    Cart.prototype.getCart = function() {
        return this.items;
    };

    Cart.prototype.clearCart = function() {
        this.items = [];
        this.save();
        return this;
    };

    Cart.prototype.getTotal = function() {
        return this.items.reduce((sum, item) => sum + (item.price * item.qty), 0);
    };

    Cart.prototype.render = function() {
        if (!this.cartBody) return this;

        const PLACEHOLDER_IMG = 'https://via.placeholder.com/800x600?text=No+Image';

        if (this.items.length === 0) {
            this.cartBody.innerHTML = '<p class="cart-empty">Cart is empty</p>';
            if (this.cartFooter) this.cartFooter.innerHTML = '';
            return this;
        }

        this.cartBody.innerHTML = '<div class="cart-items"></div>';
        const itemsContainer = this.cartBody.querySelector('.cart-items');

        this.items.forEach(item => {
            const itemEl = document.createElement('div');
            itemEl.className = 'cart-item';
            itemEl.innerHTML = `
                <img src="${item.image || PLACEHOLDER_IMG}" alt="${item.title}" class="cart-item-image" loading="lazy" onerror="this.src='${PLACEHOLDER_IMG}'">
                <div class="cart-item-details">
                    <div class="cart-item-title">${item.title}</div>
                    <div class="cart-item-variant">${this.variantsMap[item.variantId] || item.variantId}</div>
                    <div class="cart-item-controls">
                        <button class="qty-btn" data-action="decrease" data-product="${item.productId}" data-variant="${item.variantId}" aria-label="Decrease quantity">−</button>
                        <span class="qty-value">${item.qty}</span>
                        <button class="qty-btn" data-action="increase" data-product="${item.productId}" data-variant="${item.variantId}" aria-label="Increase quantity">+</button>
                    </div>
                </div>
                <div class="cart-item-right">
                    <div class="cart-item-subtotal">$${(item.price * item.qty).toFixed(2)}</div>
                    <button class="remove-btn" data-product="${item.productId}" data-variant="${item.variantId}" aria-label="Remove item">×</button>
                </div>
            `;
            itemsContainer.appendChild(itemEl);
        });

        const total = this.getTotal();
        const itemCount = this.items.reduce((sum, item) => sum + item.qty, 0);

        if (this.cartFooter) {
            this.cartFooter.innerHTML = `
                <div class="cart-total">
                    <strong>Total: $${total.toFixed(2)}</strong>
                </div>
            `;
            this.cartFooter.setAttribute('aria-label', `${itemCount} ${itemCount === 1 ? 'item' : 'items'} in cart, total ${total.toFixed(2)} dollars`);
        }

        this.attachEventListeners();
        return this;
    };

    Cart.prototype.attachEventListeners = function() {
        const debounce = (fn, delay) => {
            let timeout;
            return (...args) => {
                clearTimeout(timeout);
                timeout = setTimeout(() => fn(...args), delay);
            };
        };

        document.querySelectorAll('.qty-btn').forEach(btn => {
            btn.addEventListener('click', debounce((e) => {
                const productId = e.target.dataset.product;
                const variantId = e.target.dataset.variant;
                const action = e.target.dataset.action;
                const item = this.items.find(i => 
                    i.productId === productId && i.variantId === variantId
                );
                if (item) {
                    const qtyValue = e.target.closest('.cart-item').querySelector('.qty-value');
                    if (qtyValue) {
                        qtyValue.classList.add('updating');
                        setTimeout(() => qtyValue.classList.remove('updating'), 200);
                    }
                    this.updateQty(productId, variantId, action === 'increase' ? item.qty + 1 : item.qty - 1);
                }
            }, 50));
        });

        document.querySelectorAll('.remove-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                this.removeItem(btn.dataset.product, btn.dataset.variant);
            });
        });

        return this;
    };

    // Export for both browser and Node.js
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = Cart;
    }
    if (typeof window !== 'undefined') {
        window.Cart = Cart;
    }
    if (typeof global !== 'undefined' && typeof window === 'undefined') {
        global.Cart = Cart;
    }

})(typeof window !== 'undefined' ? window : (typeof global !== 'undefined' ? global : this));

