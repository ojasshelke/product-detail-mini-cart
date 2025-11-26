// Test cart.js module in Node.js console environment
const Cart = require('../static/js/cart.js');

console.log('=== Cart Module Tests ===\n');

// Mock localStorage
global.localStorage = {
    data: {},
    getItem(key) {
        return this.data[key] || null;
    },
    setItem(key, value) {
        this.data[key] = value;
    },
    removeItem(key) {
        delete this.data[key];
    },
    clear() {
        this.data = {};
    }
};

// Mock document for event listeners
global.document = {
    querySelectorAll: () => [],
    createElement: () => ({
        className: '',
        innerHTML: '',
        addEventListener: () => {},
        appendChild: () => {}
    }),
    querySelector: () => ({
        appendChild: () => {},
        querySelector: () => null
    })
};

// Mock DOM elements for testing
const mockCartBody = {
    innerHTML: '',
    querySelector: () => ({
        appendChild: () => {},
        querySelector: () => null
    })
};

const mockCartFooter = {
    innerHTML: '',
    setAttribute: () => {}
};

const mockVariantsMap = {
    'variant-1': 'Black',
    'variant-2': 'White',
    'variant-3': 'Blue'
};

// Initialize cart
const cart = new Cart();
cart.init(mockCartBody, mockCartFooter, mockVariantsMap);
localStorage.clear();

let testsPassed = 0;
let testsFailed = 0;

function assert(condition, message) {
    if (condition) {
        console.log('✓ PASS:', message);
        testsPassed++;
    } else {
        console.error('✗ FAIL:', message);
        testsFailed++;
    }
}

console.log('Test 1: Add item with productId p1 and variantId v1');
cart.addItem({
    productId: 'p1',
    variantId: 'v1',
    title: 'Product 1',
    price: 100,
    qty: 1,
    image: 'p1.jpg'
});
assert(cart.items.length === 1, 'Should have 1 item');
assert(cart.items[0].productId === 'p1', 'Item should have productId p1');
assert(cart.items[0].variantId === 'v1', 'Item should have variantId v1');
console.log('');

console.log('Test 2: Add item with different productId (p2) but same variantId (v1)');
cart.addItem({
    productId: 'p2',
    variantId: 'v1',
    title: 'Product 2',
    price: 150,
    qty: 1,
    image: 'p2.jpg'
});
assert(cart.items.length === 2, 'Should have 2 items (no collision)');
const p1Item = cart.items.find(i => i.productId === 'p1' && i.variantId === 'v1');
const p2Item = cart.items.find(i => i.productId === 'p2' && i.variantId === 'v1');
assert(p1Item && p1Item.qty === 1, 'p1-v1 should still have qty 1');
assert(p2Item && p2Item.qty === 1, 'p2-v1 should have qty 1');
console.log('');

console.log('Test 3: Add duplicate item (p1, v1) - should increment quantity');
cart.addItem({
    productId: 'p1',
    variantId: 'v1',
    title: 'Product 1',
    price: 100,
    qty: 1,
    image: 'p1.jpg'
});
assert(cart.items.length === 2, 'Should still have 2 items');
const p1ItemUpdated = cart.items.find(i => i.productId === 'p1' && i.variantId === 'v1');
assert(p1ItemUpdated.qty === 2, 'p1-v1 quantity should be 2');
console.log('');

console.log('Test 4: Update quantity of p1-v1 to 5');
cart.updateQty('p1', 'v1', 5);
const p1ItemAfterUpdate = cart.items.find(i => i.productId === 'p1' && i.variantId === 'v1');
assert(p1ItemAfterUpdate.qty === 5, 'p1-v1 quantity should be 5');
console.log('');

console.log('Test 5: Calculate total');
const total = cart.getTotal();
const expectedTotal = (100 * 5) + (150 * 1); // p1: 100*5, p2: 150*1
assert(Math.abs(total - expectedTotal) < 0.01, `Total should be ${expectedTotal}, got ${total}`);
console.log('');

console.log('Test 6: Remove item p2-v1');
cart.removeItem('p2', 'v1');
assert(cart.items.length === 1, 'Should have 1 item after removal');
const p2ItemAfterRemoval = cart.items.find(i => i.productId === 'p2' && i.variantId === 'v1');
assert(!p2ItemAfterRemoval, 'p2-v1 should be removed');
const p1ItemStillExists = cart.items.find(i => i.productId === 'p1' && i.variantId === 'v1');
assert(p1ItemStillExists && p1ItemStillExists.qty === 5, 'p1-v1 should still exist with qty 5');
console.log('');

console.log('Test 7: Cart persistence to localStorage');
cart.save();
const savedData = localStorage.getItem('mini_cart');
assert(savedData !== null, 'Cart should be saved to localStorage');
const parsed = JSON.parse(savedData);
assert(parsed.length === 1, 'Saved cart should have 1 item');
assert(parsed[0].productId === 'p1' && parsed[0].variantId === 'v1', 'Saved item should be p1-v1');
console.log('');

console.log('Test 8: Load cart from localStorage');
const newCart = new Cart();
newCart.init(mockCartBody, mockCartFooter, mockVariantsMap);
newCart.load();
assert(newCart.items.length === 1, 'Should load 1 item from localStorage');
assert(newCart.items[0].productId === 'p1' && newCart.items[0].variantId === 'v1', 'Loaded item should be p1-v1');
assert(newCart.items[0].qty === 5, 'Loaded item should have qty 5');
console.log('');

console.log('Test 9: Clear cart');
newCart.clearCart();
assert(newCart.items.length === 0, 'Cart should be empty after clear');
assert(localStorage.getItem('mini_cart') !== null, 'localStorage should still exist (empty array)');
console.log('');

console.log('=== Test Summary ===');
console.log(`Passed: ${testsPassed}`);
console.log(`Failed: ${testsFailed}`);
console.log(testsFailed === 0 ? '✓ All tests passed!' : '✗ Some tests failed');

process.exit(testsFailed === 0 ? 0 : 1);

