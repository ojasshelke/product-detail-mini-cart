# PDP Mini-Cart Experience

A modern e-commerce product detail page with integrated mini shopping cart interface, built with vanilla HTML, CSS, and JavaScript.

---

## Day 1 Project Status

- [x] Project folder structure initialized
- [x] Static HTML skeleton for product detail page
- [x] Responsive CSS layout with mobile-first approach
- [x] Mini-cart sidebar UI placeholder
- [x] DOM selectors and function stubs defined
- [x] Sample product data structure (JSON)
- [x] Git repository and initial commit

---

## Folder Structure

```
pdp-mini-cart-experience/
├── templates/
│   └── index.html          # Product detail page template
├── static/
│   ├── css/
│   │   └── style.css       # Stylesheet
│   └── js/
│       └── app.js          # JavaScript placeholders
├── data/
│   └── product.json        # Sample product data
├── .gitignore
└── README.md
```

---

## How to Preview Locally

### Method 1: Direct File Open
Open `templates/index.html` directly in your browser. Note: Some features may require a local server.

### Method 2: Python HTTP Server
```bash
python -m http.server 8000
```
Navigate to `http://localhost:8000/templates/`

### Method 3: VS Code Live Server
Install the "Live Server" extension, then right-click `templates/index.html` and select "Open with Live Server".

---

## Files Included in Day 1

**`templates/index.html`**
- Semantic HTML5 structure
- Product image gallery skeleton (4 thumbnails)
- Variant selectors (color, size)
- Quantity input controls
- Add to Cart / Buy Now buttons
- Mini-cart sidebar markup (closed by default)

**`static/css/style.css`**
- CSS custom properties for theming
- Mobile-first responsive grid layout
- Mini-cart sidebar styling (slide-in animation ready)
- Breakpoints: 500px (mobile), 768px (tablet/desktop)

**`static/js/app.js`**
- DOM element selectors defined
- Placeholder functions with TODO comments:
  - `openMiniCart()`
  - `closeMiniCart()`
  - `handleAddToCart()`
  - `updateCartDisplay()`
  - `handleQuantityIncrease()`
  - `handleQuantityDecrease()`
  - `handleVariantSelection()`
  - `handleThumbnailClick()`
  - `loadProductData()`

**`data/product.json`**
- Product metadata (id, title, price, description)
- Image URLs (4 placeholder images)
- Variant definitions (colors: black, white, blue; sizes: S, M, L)
- Stock and availability data

---

## What is NOT Included in Day 1

- Cart functionality (add/remove items)
- Mini-cart open/close interactions
- Product variant selection logic
- Image carousel/thumbnail switching
- Quantity increment/decrement handlers
- Cart calculations (subtotal, tax, total)
- localStorage persistence
- Dynamic product data loading
- Form validation
- Checkout flow

---

## Development Roadmap

**Day 2:** Mini-cart open/close, add to cart, cart item management  
**Day 3:** Variant selection, image switching, quantity controls  
**Day 4:** Cart calculations, cart state management  
**Day 5:** localStorage integration, cart persistence  
**Day 6:** Animations, transitions, UX polish  
**Day 7:** Error handling, edge cases, final testing  

---

## Pull Request: Day 1

**Title:** Project Setup & UI Skeleton

**Description:**
```
Created full project folder structure

- Added index.html with static PDP layout
- Added mini-cart sidebar placeholder
- Added style.css with base responsive styles
- Added app.js with placeholder functions
- Added product.json with sample data
```

---

## Contribution & Code Style

### Code Style
- Use semantic HTML5 elements
- Follow mobile-first CSS approach
- Use descriptive variable and function names
- Comment complex logic
- Maintain consistent indentation (2 spaces)

### Commit Messages
- Use present tense, imperative mood
- Prefix with component/feature name
- Example: `feat: implement mini-cart open/close`

### Pull Requests
- One feature per PR
- Include description of changes
- Reference related issues if applicable
- Ensure code follows project style guidelines

---

## License

MIT License

Copyright (c) 2024

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
