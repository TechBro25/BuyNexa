// Global variables
let currentCurrency = 'NGN';
let cart = JSON.parse(localStorage.getItem('cart')) || [];
let currentUser = null;

// Currency conversion rates (example rates)
const currencyRates = {
    NGN: 1,
    USD: 0.0012,
    EUR: 0.0011,
    GBP: 0.00095
};

const currencySymbols = {
    NGN: '₦',
    USD: '$',
    EUR: '€',
    GBP: '£'
};

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    updateCartCount();
    checkAuthStatus();
    startCountdownTimer();
    loadHotDeals();
    loadRecommendedProducts();
});

// Authentication functions
async function checkAuthStatus() {
    try {
        const response = await fetch('/api/auth/status');
        const data = await response.json();
        
        if (data.authenticated) {
            currentUser = data.user;
            updateUserMenu(true);
        } else {
            updateUserMenu(false);
        }
    } catch (error) {
        console.error('Error checking auth status:', error);
        updateUserMenu(false);
    }
}

function updateUserMenu(isLoggedIn) {
    const loginBtn = document.getElementById('loginBtn');
    const userInfo = document.getElementById('userInfo');
    const userName = document.getElementById('userName');
    
    if (isLoggedIn && currentUser) {
        loginBtn.style.display = 'none';
        userInfo.style.display = 'block';
        userName.textContent = currentUser.fullName;
    } else {
        loginBtn.style.display = 'block';
        userInfo.style.display = 'none';
    }
}

async function logout() {
    try {
        const response = await fetch('/api/logout', {
            method: 'POST',
            credentials: 'include'
        });
        
        const data = await response.json();
        if (data.success) {
            currentUser = null;
            updateUserMenu(false);
            showMessage('Logged out successfully', 'success');
            
            // Redirect to home if on protected page
            if (window.location.pathname === '/checkout.html') {
                window.location.href = '/';
            }
        }
    } catch (error) {
        console.error('Logout error:', error);
        showMessage('Error logging out', 'error');
    }
}

// Currency functions
function changeCurrency(currency) {
    currentCurrency = currency;
    localStorage.setItem('selectedCurrency', currency);
    updateAllPrices();
}

function convertPrice(price, fromCurrency = 'NGN', toCurrency = currentCurrency) {
    if (fromCurrency === toCurrency) return price;
    
    // Convert to base currency (NGN) first
    let basePrice = price;
    if (fromCurrency !== 'NGN') {
        basePrice = price / currencyRates[fromCurrency];
    }
    
    // Convert to target currency
    return basePrice * currencyRates[toCurrency];
}

function formatPrice(price, currency = currentCurrency) {
    const convertedPrice = convertPrice(price, 'NGN', currency);
    const symbol = currencySymbols[currency];
    return `${symbol}${convertedPrice.toLocaleString()}`;
}

function updateAllPrices() {
    // Update product prices
    const priceElements = document.querySelectorAll('.product-price');
    priceElements.forEach(element => {
        const originalPrice = parseFloat(element.dataset.price);
        element.textContent = formatPrice(originalPrice);
    });
    
    // Update cart if present
    if (typeof updateCartDisplay === 'function') {
        updateCartDisplay();
    }
}

// Cart functions
function addToCart(product) {
    const existingItem = cart.find(item => item.id === product.id);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            ...product,
            quantity: 1,
            addedAt: new Date().toISOString()
        });
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    showMessage(`${product.name} added to cart!`, 'success');
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    
    if (typeof updateCartDisplay === 'function') {
        updateCartDisplay();
    }
}

function updateCartQuantity(productId, newQuantity) {
    const item = cart.find(item => item.id === productId);
    if (item) {
        if (newQuantity <= 0) {
            removeFromCart(productId);
        } else {
            item.quantity = newQuantity;
            localStorage.setItem('cart', JSON.stringify(cart));
            updateCartCount();
            
            if (typeof updateCartDisplay === 'function') {
                updateCartDisplay();
            }
        }
    }
}

function updateCartCount() {
    const cartCount = document.getElementById('cartCount');
    if (cartCount) {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCount.textContent = totalItems;
    }
}

function getCartTotal() {
    return cart.reduce((total, item) => {
        return total + (item.price * item.quantity);
    }, 0);
}

// Product functions
function createProductCard(product) {
    return `
        <div class="product-card fade-in-up">
            <img src="${product.image}" alt="${product.name}" loading="lazy">
            <div class="product-info">
                <h3 class="product-title">${product.name}</h3>
                <p class="product-description">${product.description}</p>
                <div class="product-rating">
                    <span class="stars">${'★'.repeat(product.rating)}${'☆'.repeat(5-product.rating)}</span>
                    <span class="rating-text">(${product.reviews} reviews)</span>
                </div>
                <div class="product-price" data-price="${product.price}">
                    ${formatPrice(product.price)}
                </div>
                <button class="add-to-cart" onclick="addToCart(${JSON.stringify(product).replace(/"/g, '&quot;')})">
                    Add to Cart
                </button>
            </div>
        </div>
    `;
}

function loadHotDeals() {
    const hotDealsGrid = document.getElementById('hotDealsGrid');
    if (!hotDealsGrid) return;
    
    // Get sample products for hot deals
    const hotDeals = sampleProducts.slice(0, 8);
    hotDealsGrid.innerHTML = hotDeals.map(product => createProductCard(product)).join('');
}

function loadRecommendedProducts() {
    const recommendedGrid = document.getElementById('recommendedGrid');
    if (!recommendedGrid) return;
    
    // Get sample products for recommendations
    const recommended = sampleProducts.slice(8, 16);
    recommendedGrid.innerHTML = recommended.map(product => createProductCard(product)).join('');
}

// Search function
function searchProducts() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    if (searchTerm.length < 2) {
        showMessage('Please enter at least 2 characters to search', 'error');
        return;
    }
    
    // For demo purposes, redirect to electronics page with search term
    window.location.href = `electronics.html?search=${encodeURIComponent(searchTerm)}`;
}

// Countdown timer
function startCountdownTimer() {
    // Set end date (7 days from now)
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + 7);
    
    function updateTimer() {
        const now = new Date().getTime();
        const distance = endDate.getTime() - now;
        
        if (distance < 0) {
            // Timer expired, reset to 7 days
            endDate.setDate(new Date().getDate() + 7);
            return;
        }
        
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);
        
        const daysEl = document.getElementById('days');
        const hoursEl = document.getElementById('hours');
        const minutesEl = document.getElementById('minutes');
        const secondsEl = document.getElementById('seconds');
        
        if (daysEl) daysEl.textContent = days.toString().padStart(2, '0');
        if (hoursEl) hoursEl.textContent = hours.toString().padStart(2, '0');
        if (minutesEl) minutesEl.textContent = minutes.toString().padStart(2, '0');
        if (secondsEl) secondsEl.textContent = seconds.toString().padStart(2, '0');
    }
    
    updateTimer();
    setInterval(updateTimer, 1000);
}

// Coupon functions
function copyCoupon(code) {
    navigator.clipboard.writeText(code).then(() => {
        showMessage(`Coupon code ${code} copied to clipboard!`, 'success');
    }).catch(() => {
        showMessage('Failed to copy coupon code', 'error');
    });
}

// Utility functions
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
    }
}

function showMessage(message, type = 'info') {
    // Create message element
    const messageEl = document.createElement('div');
    messageEl.className = `message ${type}`;
    messageEl.textContent = message;
    
    // Add to top of body
    document.body.insertBefore(messageEl, document.body.firstChild);
    
    // Remove after 3 seconds
    setTimeout(() => {
        messageEl.remove();
    }, 3000);
}

function showModal(content) {
    // Create modal
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content">
            <span class="close" onclick="this.parentElement.parentElement.remove()">&times;</span>
            ${content}
        </div>
    `;
    
    document.body.appendChild(modal);
    modal.style.display = 'block';
    
    // Close on background click
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.remove();
        }
    });
}

// Load saved currency preference
document.addEventListener('DOMContentLoaded', function() {
    const savedCurrency = localStorage.getItem('selectedCurrency');
    if (savedCurrency) {
        currentCurrency = savedCurrency;
        const currencySelector = document.getElementById('currencySelector');
        if (currencySelector) {
            currencySelector.value = savedCurrency;
        }
    }
});

// Handle search on Enter key
document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                searchProducts();
            }
        });
    }
});
// Simple No-Zoom JavaScript - Add this to your existing JS

// Prevent zoom with keyboard shortcuts
document.addEventListener('keydown', function(e) {
    // Prevent Ctrl + Plus/Minus (zoom in/out)
    if (e.ctrlKey && (e.keyCode === 107 || e.keyCode === 187 || e.keyCode === 109 || e.keyCode === 189)) {
        e.preventDefault();
        return false;
    }
    
    // Prevent Ctrl + 0 (reset zoom)
    if (e.ctrlKey && e.keyCode === 48) {
        e.preventDefault();
        return false;
    }
});

// Prevent zoom with mouse wheel + Ctrl
document.addEventListener('wheel', function(e) {
    if (e.ctrlKey) {
        e.preventDefault();
        return false;
    }
}, { passive: false });

// Prevent pinch zoom on mobile devices
document.addEventListener('touchstart', function(e) {
    if (e.touches.length > 1) {
        e.preventDefault();
    }
});

document.addEventListener('touchmove', function(e) {
    if (e.touches.length > 1) {
        e.preventDefault();
    }
}, { passive: false });