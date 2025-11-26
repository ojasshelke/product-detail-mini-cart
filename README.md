# PDP Mini-Cart Experience

A modern e-commerce product detail page with integrated mini shopping cart interface, built with vanilla HTML, CSS, JavaScript, and Flask backend.

**Live Demo:**
- Frontend: FRONTEND_URL
- Backend API: BACKEND_URL

---

## Days 1-10 Project Status

### Core Features Completed
- [x] Product detail page with image carousel and variant selection
- [x] Mini shopping cart with add/remove/update functionality
- [x] Cart persistence with localStorage
- [x] Responsive design and accessibility features
- [x] Flask backend API for product data and analytics
- [x] API fallback logic and defensive error handling
- [x] Deployment configurations for Netlify and cloud platforms
- [x] Cart merge logic using productId + variantId
- [x] Analytics dashboard with zero-data handling
- [x] Unit tests with real cart module

---

## Folder Structure

```
pdp-mini-cart-experience/
├── server/
│   ├── app.py              # Flask backend API (absolute paths)
│   ├── requirements.txt    # Python dependencies
│   └── analytics.log       # Analytics event log (generated)
├── templates/
│   ├── index.html          # Product detail page template
│   └── data/
│       └── product.json    # Fallback product data for frontend
├── static/
│   ├── css/
│   │   └── style.css       # Stylesheet
│   └── js/
│       ├── app.js          # Main application logic
│       ├── cart.js         # Cart module (CommonJS + Browser)
│       └── utils.js        # Utility functions
├── data/
│   └── product.json        # Backend product data source
├── dashboard/
│   ├── dashboard.html      # Analytics dashboard
│   └── static/
│       └── js/
│           └── dashboard.js # Dashboard logic
├── tests/
│   └── test_cart_console.js # Node.js cart tests
├── docs/
│   └── test-report.md      # Test report template
├── Procfile                # Heroku/Render deployment
├── netlify.toml           # Netlify configuration
├── .gitignore
└── README.md
```

---

## How to Run Locally

### Frontend Only (Standalone Mode)

Open `templates/index.html` directly in your browser. The page includes inline fallback data (`window.FALLBACK_PRODUCT_DATA`) for offline usage in `file://` protocol mode.

Alternatively, serve with a static server:

```bash
python -m http.server 8000
# Navigate to http://localhost:8000/templates/
```

The frontend will work standalone using:
1. Inline fallback data (for `file://` protocol)
2. Local JSON fallback (`./data/product.json` relative to `templates/`)

### Full Stack (Frontend + Backend)

1. **Backend Setup:**
```bash
cd server
pip install -r requirements.txt
python app.py
```
Backend runs on `http://localhost:5000` (or PORT env variable)

2. **Frontend Setup:**

Serve the frontend:

```bash
python -m http.server 8000
# Navigate to http://localhost:8000/templates/
```

3. **Configure API Connection:**

By default, frontend uses **same-origin** for API calls. To connect to a backend on a different domain or port:

```html
<!-- In templates/index.html, modify the script tag: -->
<script>
  window.API_BASE = 'http://localhost:5000';  // For local dev
  // OR
  window.API_BASE = 'https://your-backend.herokuapp.com';  // For production
</script>
```

4. **View Analytics Dashboard:**

```bash
# Open http://localhost:8000/dashboard/dashboard.html
```

---

## API_BASE Behavior (Critical for Deployment)

The frontend uses a **same-origin default** for API calls:

```javascript
const API_BASE = window.API_BASE || '';
fetch(`${API_BASE}/api/products`);
```

### How It Works:

| Scenario | `window.API_BASE` Value | Fetch URL Result |
|----------|------------------------|------------------|
| Same domain deployment | `undefined` (default) | `/api/products` (same-origin) |
| Local dev (different ports) | `'http://localhost:5000'` | `http://localhost:5000/api/products` |
| Production (different domains) | `'https://api.example.com'` | `https://api.example.com/api/products` |

### Configuration Methods:

**Method 1: Inline Script (recommended for production)**
```html
<script>
  window.API_BASE = 'https://your-backend-api.com';
</script>
```

**Method 2: Environment-based injection during build**
```javascript
// In your build process, replace placeholder
window.API_BASE = '{{ BACKEND_URL }}';
```

---

## Product Data Locations

The application uses a **three-tier fallback system** for product data:

1. **Backend API** (`/api/products`) - Reads from `data/product.json` using absolute paths
2. **Frontend Fallback** (`./data/product.json`) - Relative to `templates/index.html`, served from `templates/data/product.json`
3. **Inline Fallback** (`window.FALLBACK_PRODUCT_DATA`) - Embedded in HTML for `file://` protocol support

### For Deployment:

- **Backend** reads from: `data/product.json` (repo root)
- **Frontend** fallback reads from: `templates/data/product.json`
- **Offline mode** uses: inline `window.FALLBACK_PRODUCT_DATA` in `templates/index.html`

---

## Cart Merge Logic (productId + variantId)

The cart now correctly merges items using **both** `productId` AND `variantId`:

```javascript
// Correct merge logic
cart.addItem({
    productId: 'prod-001',
    variantId: 'variant-1',
    title: 'Headphones',
    price: 199.99,
    qty: 1
});

// Different products with same variantId stay separate
cart.addItem({ productId: 'prod-002', variantId: 'variant-1', ... }); // No collision!

// Same product + variant increments quantity
cart.addItem({ productId: 'prod-001', variantId: 'variant-1', ... }); // Qty += 1
```

---

## Key Files

**`server/app.py`** - Flask backend with absolute file paths (`os.path.join(os.path.dirname(__file__), ...)`)  
**`server/requirements.txt`** - Python dependencies (Flask, flask-cors, gunicorn)  
**`templates/index.html`** - Product detail page with inline fallback data  
**`static/js/app.js`** - Frontend application with API integration  
**`static/js/cart.js`** - Cart module with productId+variantId merge logic (CommonJS + browser compatible)  
**`static/js/utils.js`** - Utility functions (debounce, formatCurrency, animateCount)  
**`static/css/style.css`** - Responsive styles with accessibility features  
**`data/product.json`** - Backend product data source  
**`templates/data/product.json`** - Frontend fallback product data  
**`dashboard/dashboard.html`** - Analytics visualization dashboard  
**`dashboard/static/js/dashboard.js`** - Dashboard logic with Chart.js  
**`tests/test_cart_console.js`** - Node.js unit tests for cart module  
**`docs/test-report.md`** - Manual testing checklist and procedures

---

## Testing

### Manual Testing
See `docs/test-report.md` for comprehensive manual test procedures.

### Unit Tests (Node.js)
Run cart module tests:

```bash
cd tests
node test_cart_console.js
```

Tests verify:
- Cart item addition and merging by `productId` AND `variantId`
- No collision between different products with same variantId
- Quantity updates and removals
- Total calculation
- localStorage persistence
- CommonJS export compatibility

Expected output:
```
=== Cart Module Tests ===
✓ PASS: Should have 1 item
✓ PASS: Should have 2 items (no collision)
...
✓ All tests passed!
```

---

## Day-by-Day Changelog

**Day 1:** Project setup, HTML skeleton, responsive CSS, mini-cart UI placeholder, sample data structure  
**Day 2:** Mini-cart interactions, add-to-cart functionality, cart item management  
**Day 3:** Variant selection logic, image carousel switching, quantity controls  
**Day 4:** Cart calculations, state management, accessibility improvements  
**Day 5:** localStorage persistence, cart data persistence across sessions  
**Day 6:** Flask backend API, product data endpoint, analytics logging endpoint  
**Day 7:** API fallback logic, deployment configurations (Procfile, netlify.toml)  
**Day 8:** Defensive error handling, localStorage corruption recovery, double-click prevention, image placeholders  
**Day 9:** Documentation updates, test report template, deployment instructions  
**Day 10:** Final fixes - absolute paths, cart merge logic, dashboard, unit tests

---

## Deployment

### Frontend (Netlify)
1. Connect repository to Netlify
2. Build settings: Use `netlify.toml` configuration (publish `templates/` folder)
3. Deploy automatically on git push
4. **Configure API Base (if backend on different domain):**
   - Add environment variable or modify `templates/index.html`:
   ```html
   <script>
     window.API_BASE = 'https://your-backend.herokuapp.com';
   </script>
   ```

### Backend (Render/Heroku)
1. **Render:** Connect repo, select Python, use commands:
   - Build: `cd server && pip install -r requirements.txt`
   - Start: `cd server && gunicorn app:app`
2. **Heroku:** Use `Procfile`, deploy via git push or GitHub integration
3. Environment variable `PORT` (auto-assigned by platform)
4. Backend uses absolute paths for:
   - Product data: `os.path.join(os.path.dirname(__file__), '..', 'data', 'product.json')`
   - Analytics log: `os.path.join(os.path.dirname(__file__), 'analytics.log')`

### Same-Domain Deployment (Advanced)

If you want to serve both frontend and backend from the same domain:

1. Use Flask to serve static files:
```python
@app.route('/')
def index():
    return send_from_directory('../templates', 'index.html')

@app.route('/static/<path:path>')
def serve_static(path):
    return send_from_directory('../static', path)
```

2. No `window.API_BASE` configuration needed - uses same-origin by default!

---

## API Endpoints

- `GET /api/products` - Returns product JSON data
- `POST /api/analytics` - Records analytics events (event, payload, timestamp)
- `GET /api/analytics` - Retrieves all analytics events (for dashboard)

Analytics data is appended to `server/analytics.log` using absolute paths.

---

## Known Issues & Future Work

**Current Limitations:**
- Demo backend stores analytics in flat file (not suitable for production)
- No user authentication or real database
- Basic error handling for development/demo purposes
- No payment processing or checkout flow

**Future Enhancements:**
- Database integration (PostgreSQL/SQLite)
- User authentication and session management
- Payment gateway integration
- Advanced analytics and reporting
- Admin panel for product management
- Order history and user accounts

## Final Submission: Days 1-10 Complete

**Status:** ✅ All features implemented and tested  
**Demo:** FRONTEND_URL  
**API:** BACKEND_URL  
**Test Report:** See `docs/test-report.md`

**Features Delivered:**
- Complete PDP with image carousel and variant selection
- Functional mini-cart with persistence
- Flask API backend with analytics logging (absolute paths)
- Responsive design with accessibility features
- API fallback and defensive error handling (file:// support)
- Deployment configurations for production
- Cart merge logic using productId + variantId (collision-free)
- Analytics dashboard with Chart.js and zero-data handling
- Unit tests with real cart module (CommonJS compatible)

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
