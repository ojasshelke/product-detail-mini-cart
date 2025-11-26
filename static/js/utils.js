(function(global) {
    'use strict';

    const utils = {
        debounce: function(fn, wait) {
            let timeout;
            return function(...args) {
                clearTimeout(timeout);
                timeout = setTimeout(() => fn.apply(this, args), wait);
            };
        },

        formatCurrency: function(amount) {
            return '$' + parseFloat(amount).toFixed(2);
        },

        animateCount: function(element, from, to, duration) {
            if (!element) return;
            
            const start = performance.now();
            const diff = to - from;
            
            function update(timestamp) {
                const elapsed = timestamp - start;
                const progress = Math.min(elapsed / duration, 1);
                
                const current = from + (diff * progress);
                element.textContent = Math.round(current);
                
                if (progress < 1) {
                    requestAnimationFrame(update);
                }
            }
            
            requestAnimationFrame(update);
        }
    };

    // Export for both browser and Node.js
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = utils;
    }
    if (typeof window !== 'undefined') {
        window.utils = utils;
    }
    if (typeof global !== 'undefined' && typeof window === 'undefined') {
        global.utils = utils;
    }

})(typeof window !== 'undefined' ? window : (typeof global !== 'undefined' ? global : this));

