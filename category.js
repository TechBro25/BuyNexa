// Category page functionality
let currentCategory = '';
let allProducts = [];
let filteredProducts = [];
let currentPage = 1;
const productsPerPage = 20;

document.addEventListener('DOMContentLoaded', function() {
    // Get category from URL
    const path = window.location.pathname;
    currentCategory = path.split('/').pop().replace('.html', '');
    
    // Load products for current category
    loadCategoryProducts();
    
    // Initialize search from URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const searchTerm = urlParams.get('search');
    if (searchTerm) {
        document.getElementById('searchInput').value = searchTerm;
    }
    
    updateCartCount();
    checkAuthStatus();
});

function loadCategoryProducts() {
    showLoading(true);
    
    // Get products for the current category
    allProducts = generateCategoryProducts(currentCategory, 300);
    
    // Apply search filter if exists
    const searchTerm = document.getElementById('searchInput')?.value;
    if (searchTerm) {
        allProducts = searchProductsInCategory(currentCategory, searchTerm);
    }
    
    // Load brands for filter
    loadBrandFilter();
    
    // Apply filters and display
    applyFilters();
    
    showLoading(false);
}

function loadBrandFilter() {
    const brandFilter = document.getElementById('brandFilter');
    const brands = getBrandsForCategory(currentCategory);
    
    // Clear existing options except "All Brands"
    brandFilter.innerHTML = '<option value="all">All Brands</option>';
    
    brands.forEach(brand => {
        const option = document.createElement('option');
        option.value = brand;
        option.textContent = brand;
        brandFilter.appendChild(option);
    });
}

function applyFilters() {
    const sortBy = document.getElementById('sortBy').value;
    const brandFilter = document.getElementById('brandFilter').value;
    const minPrice = parseFloat(document.getElementById('minPrice').value) || 0;
    const maxPrice = parseFloat(document.getElementById('maxPrice').value) || Infinity;
    const ratingFilter = parseFloat(document.getElementById('ratingFilter').value) || 0;
    
    // Apply filters
    filteredProducts = filterProducts(allProducts, {
        brand: brandFilter,
        minPrice: minPrice,
        maxPrice: maxPrice,
        rating: ratingFilter
    });
    
    // Apply sorting
    if (sortBy) {
        filteredProducts = sortProducts(filteredProducts, sortBy);
    }
    
    // Reset to first page
    currentPage = 1;
    
    // Display products
    displayProducts();
    updatePagination();
}

function displayProducts() {
    const productsGrid = document.getElementById('productsGrid');
    
    if (filteredProducts.length === 0) {
        productsGrid.innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center; padding: 4rem;">
                <h3 style="color: #64748b; margin-bottom: 1rem;">No products found</h3>
                <p style="color: #94a3b8;">Try adjusting your filters or search terms</p>
            </div>
        `;
        return;
    }
    
    // Calculate pagination
    const startIndex = (currentPage - 1) * productsPerPage;
    const endIndex = startIndex + productsPerPage;
    const productsToShow = filteredProducts.slice(startIndex, endIndex);
    
    // Display products
    productsGrid.innerHTML = productsToShow.map(product => createProductCard(product)).join('');
    
    // Add fade-in animation
    productsGrid.querySelectorAll('.product-card').forEach((card, index) => {
        card.style.animationDelay = `${index * 0.1}s`;
    });
}

function updatePagination() {
    const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
    const pageInfo = document.getElementById('pageInfo');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    
    pageInfo.textContent = `Page ${currentPage} of ${totalPages} (${filteredProducts.length} products)`;
    
    prevBtn.disabled = currentPage <= 1;
    nextBtn.disabled = currentPage >= totalPages;
    
    prevBtn.style.opacity = currentPage <= 1 ? '0.5' : '1';
    nextBtn.style.opacity = currentPage >= totalPages ? '0.5' : '1';
}

function changePage(direction) {
    const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
    const newPage = currentPage + direction;
    
    if (newPage >= 1 && newPage <= totalPages) {
        currentPage = newPage;
        displayProducts();
        updatePagination();
        
        // Scroll to top of products
        document.getElementById('productsGrid').scrollIntoView({ 
            behavior: 'smooth', 
            block: 'start' 
        });
    }
}

function clearFilters() {
    document.getElementById('sortBy').value = '';
    document.getElementById('brandFilter').value = 'all';
    document.getElementById('minPrice').value = '';
    document.getElementById('maxPrice').value = '';
    document.getElementById('ratingFilter').value = '';
    document.getElementById('searchInput').value = '';
    
    // Reload products
    loadCategoryProducts();
}

function searchProducts() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase().trim();
    
    if (searchTerm.length === 0) {
        // If empty search, reload all products
        loadCategoryProducts();
        return;
    }
    
    if (searchTerm.length < 2) {
        showMessage('Please enter at least 2 characters to search', 'error');
        return;
    }
    
    showLoading(true);
    
    // Filter products by search term
    allProducts = searchProductsInCategory(currentCategory, searchTerm);
    applyFilters();
    
    showLoading(false);
    
    if (filteredProducts.length === 0) {
        showMessage(`No products found for "${searchTerm}"`, 'error');
    } else {
        showMessage(`Found ${filteredProducts.length} products for "${searchTerm}"`, 'success');
    }
}

function showLoading(show) {
    const loadingState = document.getElementById('loadingState');
    const productsGrid = document.getElementById('productsGrid');
    
    if (show) {
        loadingState.style.display = 'block';
        productsGrid.style.display = 'none';
    } else {
        loadingState.style.display = 'none';
        productsGrid.style.display = 'grid';
    }
}

// Enhanced product data generation for 300+ products per category
function generateCategoryProducts(category, count = 300) {
    const categoryProducts = sampleProducts.filter(p => p.category === category);
    const products = [...categoryProducts];
    
    // Product name variations
    const variations = {
        electronics: [
            'Pro', 'Max', 'Ultra', 'Plus', 'Elite', 'Premium', 'Advanced', 'Deluxe', 
            'Supreme', 'Master', 'Expert', 'Professional', 'Studio', 'Gaming', 'Business'
        ],
        beauty: [
            'Luxury', 'Premium', 'Professional', 'Organic', 'Natural', 'Radiant', 
            'Glow', 'Perfect', 'Smooth', 'Silky', 'Matte', 'Shimmer', 'Hydrating'
        ],
        clothing: [
            'Classic', 'Modern', 'Vintage', 'Trendy', 'Casual', 'Formal', 'Premium', 
            'Designer', 'Elegant', 'Comfortable', 'Stylish', 'Chic', 'Urban'
        ],
        gadgets: [
            'Smart', 'Wireless', 'Portable', 'Compact', 'Multi-function', 'Digital', 
            'Bluetooth', 'Touch', 'Voice', 'Auto', 'Intelligent', 'Advanced'
        ],
        food: [
            'Organic', 'Premium', 'Artisan', 'Gourmet', 'Fresh', 'Natural', 'Pure', 
            'Handcrafted', 'Traditional', 'Exotic', 'Healthy', 'Delicious'
        ],
        books: [
            'Complete', 'Comprehensive', 'Essential', 'Ultimate', 'Practical', 'Advanced', 
            'Beginner\'s', 'Master', 'Professional', 'Student', 'Reference', 'Illustrated'
        ]
    };
    
    const brands = getBrandsForCategory(category);
    const currentVariations = variations[category] || variations.electronics;
    
    // Generate additional products
    for (let i = 0; i < count; i++) {
        const baseProduct = categoryProducts[i % categoryProducts.length];
        const variation = currentVariations[i % currentVariations.length];
        const randomBrand = brands[Math.floor(Math.random() * brands.length)];
        
        products.push({
            ...baseProduct,
            id: `${category}_${String(i + 100).padStart(3, '0')}`,
            name: `${variation} ${baseProduct.name}`,
            brand: randomBrand,
            price: Math.floor(baseProduct.price * (0.7 + Math.random() * 0.6)), // ±30% price variation
            rating: Math.floor(Math.random() * 2) + 4, // 4 or 5 stars
            reviews: Math.floor(Math.random() * 500) + 50,
            description: `${baseProduct.description} ${variation} edition with enhanced features and premium quality.`
        });
    }
    
    return products;
}

// Enhanced brand generation
function getBrandsForCategory(category) {
    const brandsByCategory = {
        electronics: [
            'TechPro', 'AudioTech', 'GameMax', 'SmartDevice', 'ElectroPlus', 'DigitalCore',
            'TechMobile', 'GamePro', 'WearTech', 'SoundMax', 'VisionTech', 'PowerCore'
        ],
        beauty: [
            'GlowBeauty', 'MakeupPro', 'NaturalGlow', 'HairCare+', 'SkinPerfect', 'BeautyLux',
            'CosmeticElite', 'PureBeauty', 'GlamourPro', 'RadiantSkin', 'BeautySecret'
        ],
        clothing: [
            'FashionForward', 'ElegantWear', 'DenimCraft', 'ActiveLife', 'StylePro', 'TrendSet',
            'ClassicWear', 'UrbanStyle', 'ComfortFit', 'ChicDesign', 'ModernLook'
        ],
        gadgets: [
            'ChargeTech', 'SoundMax', 'SmartHome', 'FitTrack', 'GadgetPro', 'TechSolutions',
            'InnovateTech', 'SmartGear', 'DigitalLife', 'ConnectTech', 'AutoTech'
        ],
        food: [
            'CoffeeCraft', 'NatureSweet', 'ChocoArt', 'TeaTime', 'PureTaste', 'GourmetPlus',
            'FreshChoice', 'OrganicLife', 'TasteMax', 'DeliciousEats', 'HealthyBites'
        ],
        books: [
            'TechBooks', 'BusinessPro', 'GrowthBooks', 'ClassicReads', 'LearnMore', 'WisdomPress',
            'KnowledgeHub', 'EducationPlus', 'BookCraft', 'ReadSmart', 'StudyGuide'
        ]
    };
    
    return brandsByCategory[category] || brandsByCategory.electronics;
}

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