// Sample product data
const sampleProducts = [
    // Electronics
    {
        id: 'elec_001',
        name: 'Premium Wireless Headphones',
        price: 45000,
        image: 'https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg',
        description: 'High-quality wireless headphones with noise cancellation and 30-hour battery life.',
        category: 'electronics',
        rating: 5,
        reviews: 234,
        brand: 'AudioTech'
    },
    {
        id: 'elec_002',
        name: 'Smart Phone Pro Max',
        price: 320000,
        image: 'https://images.pexels.com/photos/47261/pexels-photo-47261.jpeg',
        description: 'Latest smartphone with advanced camera system and lightning-fast processor.',
        category: 'electronics',
        rating: 5,
        reviews: 567,
        brand: 'TechMobile'
    },
    {
        id: 'elec_003',
        name: 'Gaming Laptop Ultra',
        price: 580000,
        image: 'https://images.pexels.com/photos/2047905/pexels-photo-2047905.jpeg',
        description: 'High-performance gaming laptop with RTX graphics and RGB backlit keyboard.',
        category: 'electronics',
        rating: 4,
        reviews: 189,
        brand: 'GamePro'
    },
    {
        id: 'elec_004',
        name: 'Smart Watch Series X',
        price: 85000,
        image: 'https://images.pexels.com/photos/437037/pexels-photo-437037.jpeg',
        description: 'Advanced smartwatch with health monitoring and GPS tracking.',
        category: 'electronics',
        rating: 4,
        reviews: 456,
        brand: 'WearTech'
    },
    
    // Beauty Products
    {
        id: 'beauty_001',
        name: 'Luxury Face Cream Set',
        price: 25000,
        image: 'https://images.pexels.com/photos/3685538/pexels-photo-3685538.jpeg',
        description: 'Anti-aging face cream with natural ingredients for radiant skin.',
        category: 'beauty',
        rating: 5,
        reviews: 312,
        brand: 'GlowBeauty'
    },
    {
        id: 'beauty_002',
        name: 'Professional Makeup Kit',
        price: 35000,
        image: 'https://images.pexels.com/photos/2533266/pexels-photo-2533266.jpeg',
        description: 'Complete makeup kit with brushes and premium cosmetics.',
        category: 'beauty',
        rating: 4,
        reviews: 189,
        brand: 'MakeupPro'
    },
    {
        id: 'beauty_003',
        name: 'Organic Skincare Set',
        price: 42000,
        image: 'https://images.pexels.com/photos/3785147/pexels-photo-3785147.jpeg',
        description: 'Natural skincare products for all skin types.',
        category: 'beauty',
        rating: 5,
        reviews: 267,
        brand: 'NaturalGlow'
    },
    {
        id: 'beauty_004',
        name: 'Hair Treatment Kit',
        price: 18000,
        image: 'https://images.pexels.com/photos/3993444/pexels-photo-3993444.jpeg',
        description: 'Complete hair care system for healthy, shiny hair.',
        category: 'beauty',
        rating: 4,
        reviews: 145,
        brand: 'HairCare+'
    },
    
    // Clothing
    {
        id: 'cloth_001',
        name: 'Designer Casual Shirt',
        price: 15000,
        image: 'https://images.pexels.com/photos/996329/pexels-photo-996329.jpeg',
        description: 'Premium cotton casual shirt perfect for any occasion.',
        category: 'clothing',
        rating: 4,
        reviews: 98,
        brand: 'FashionForward'
    },
    {
        id: 'cloth_002',
        name: 'Elegant Evening Dress',
        price: 28000,
        image: 'https://images.pexels.com/photos/1488463/pexels-photo-1488463.jpeg',
        description: 'Stunning evening dress for special occasions.',
        category: 'clothing',
        rating: 5,
        reviews: 156,
        brand: 'ElegantWear'
    },
    {
        id: 'cloth_003',
        name: 'Comfortable Jeans',
        price: 22000,
        image: 'https://images.pexels.com/photos/1598505/pexels-photo-1598505.jpeg',
        description: 'High-quality denim jeans with perfect fit.',
        category: 'clothing',
        rating: 4,
        reviews: 234,
        brand: 'DenimCraft'
    },
    {
        id: 'cloth_004',
        name: 'Sports Activewear Set',
        price: 19000,
        image: 'https://images.pexels.com/photos/1661471/pexels-photo-1661471.jpeg',
        description: 'Breathable activewear for workouts and sports.',
        category: 'clothing',
        rating: 4,
        reviews: 187,
        brand: 'ActiveLife'
    },
    
    // Gadgets
    {
        id: 'gadget_001',
        name: 'Wireless Charging Station',
        price: 12000,
        image: 'https://images.pexels.com/photos/577585/pexels-photo-577585.jpeg',
        description: 'Fast wireless charging pad for multiple devices.',
        category: 'gadgets',
        rating: 4,
        reviews: 123,
        brand: 'ChargeTech'
    },
    {
        id: 'gadget_002',
        name: 'Bluetooth Speaker Pro',
        price: 18000,
        image: 'https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg',
        description: 'Portable speaker with amazing sound quality.',
        category: 'gadgets',
        rating: 5,
        reviews: 298,
        brand: 'SoundMax'
    },
    {
        id: 'gadget_003',
        name: 'Smart Home Assistant',
        price: 32000,
        image: 'https://images.pexels.com/photos/4790268/pexels-photo-4790268.jpeg',
        description: 'Voice-controlled smart assistant for home automation.',
        category: 'gadgets',
        rating: 4,
        reviews: 167,
        brand: 'SmartHome'
    },
    {
        id: 'gadget_004',
        name: 'Fitness Tracker Band',
        price: 15000,
        image: 'https://images.pexels.com/photos/437037/pexels-photo-437037.jpeg',
        description: 'Advanced fitness tracking with heart rate monitor.',
        category: 'gadgets',
        rating: 4,
        reviews: 145,
        brand: 'FitTrack'
    },
    
    // Food Items
    {
        id: 'food_001',
        name: 'Gourmet Coffee Beans',
        price: 8000,
        image: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg',
        description: 'Premium arabica coffee beans from Ethiopian highlands.',
        category: 'food',
        rating: 5,
        reviews: 234,
        brand: 'CoffeeCraft'
    },
    {
        id: 'food_002',
        name: 'Organic Honey Set',
        price: 6500,
        image: 'https://images.pexels.com/photos/87824/pexels-photo-87824.jpeg',
        description: 'Pure organic honey collection from local farms.',
        category: 'food',
        rating: 5,
        reviews: 189,
        brand: 'NatureSweet'
    },
    {
        id: 'food_003',
        name: 'Artisan Chocolate Box',
        price: 12000,
        image: 'https://images.pexels.com/photos/3794730/pexels-photo-3794730.jpeg',
        description: 'Handcrafted chocolates with premium ingredients.',
        category: 'food',
        rating: 5,
        reviews: 156,
        brand: 'ChocoArt'
    },
    {
        id: 'food_004',
        name: 'Herbal Tea Collection',
        price: 5500,
        image: 'https://images.pexels.com/photos/1417945/pexels-photo-1417945.jpeg',
        description: 'Variety pack of premium herbal teas.',
        category: 'food',
        rating: 4,
        reviews: 98,
        brand: 'TeaTime'
    },
    
    // Books
    {
        id: 'book_001',
        name: 'Programming Mastery Guide',
        price: 7500,
        image: 'https://images.pexels.com/photos/159711/books-bookstore-book-reading-159711.jpeg',
        description: 'Comprehensive guide to modern programming techniques.',
        category: 'books',
        rating: 5,
        reviews: 267,
        brand: 'TechBooks'
    },
    {
        id: 'book_002',
        name: 'Business Strategy Handbook',
        price: 9000,
        image: 'https://images.pexels.com/photos/1112048/pexels-photo-1112048.jpeg',
        description: 'Essential strategies for business success.',
        category: 'books',
        rating: 4,
        reviews: 145,
        brand: 'BusinessPro'
    },
    {
        id: 'book_003',
        name: 'Self-Development Series',
        price: 11000,
        image: 'https://images.pexels.com/photos/1029141/pexels-photo-1029141.jpeg',
        description: 'Complete collection of personal development books.',
        category: 'books',
        rating: 5,
        reviews: 198,
        brand: 'GrowthBooks'
    },
    {
        id: 'book_004',
        name: 'Classic Literature Set',
        price: 13500,
        image: 'https://images.pexels.com/photos/46274/pexels-photo-46274.jpeg',
        description: 'Timeless classics in beautiful hardcover editions.',
        category: 'books',
        rating: 5,
        reviews: 176,
        brand: 'ClassicReads'
    }
];

// Generate additional products for each category
function generateCategoryProducts(category, baseCount = 50) {
    const categoryProducts = sampleProducts.filter(p => p.category === category);
    const products = [...categoryProducts];
    
    // Generate more products based on the existing ones
    for (let i = 0; i < baseCount; i++) {
        const baseProduct = categoryProducts[i % categoryProducts.length];
        products.push({
            ...baseProduct,
            id: `${category}_${String(i + 100).padStart(3, '0')}`,
            name: `${baseProduct.name} ${i + 1}`,
            price: baseProduct.price + (Math.random() * 10000 - 5000),
            rating: Math.floor(Math.random() * 2) + 4, // 4 or 5 stars
            reviews: Math.floor(Math.random() * 500) + 50
        });
    }
    
    return products;
}

// Get products by category
function getProductsByCategory(category) {
    return generateCategoryProducts(category, 50);
}

// Search products
function searchProductsInCategory(category, searchTerm) {
    const products = getProductsByCategory(category);
    if (!searchTerm) return products;
    
    const term = searchTerm.toLowerCase();
    return products.filter(product => 
        product.name.toLowerCase().includes(term) ||
        product.description.toLowerCase().includes(term) ||
        product.brand.toLowerCase().includes(term)
    );
}

// Filter products
function filterProducts(products, filters) {
    return products.filter(product => {
        // Price filter
        if (filters.minPrice && product.price < filters.minPrice) return false;
        if (filters.maxPrice && product.price > filters.maxPrice) return false;
        
        // Brand filter
        if (filters.brand && filters.brand !== 'all' && product.brand !== filters.brand) return false;
        
        // Rating filter
        if (filters.rating && product.rating < filters.rating) return false;
        
        return true;
    });
}

// Sort products
function sortProducts(products, sortBy) {
    const sorted = [...products];
    
    switch (sortBy) {
        case 'price-low':
            return sorted.sort((a, b) => a.price - b.price);
        case 'price-high':
            return sorted.sort((a, b) => b.price - a.price);
        case 'rating':
            return sorted.sort((a, b) => b.rating - a.rating);
        case 'reviews':
            return sorted.sort((a, b) => b.reviews - a.reviews);
        case 'name':
            return sorted.sort((a, b) => a.name.localeCompare(b.name));
        default:
            return sorted;
    }
}

// Get unique brands for a category
function getBrandsForCategory(category) {
    const products = getProductsByCategory(category);
    const brands = [...new Set(products.map(p => p.brand))];
    return brands.sort();
}

// Get featured products (highest rated)
function getFeaturedProducts(limit = 8) {
    return sampleProducts
        .sort((a, b) => b.rating - a.rating)
        .slice(0, limit);
}

// Get related products (same category, different product)
function getRelatedProducts(productId, limit = 4) {
    const product = sampleProducts.find(p => p.id === productId);
    if (!product) return [];
    
    return sampleProducts
        .filter(p => p.category === product.category && p.id !== productId)
        .slice(0, limit);
}

// Get product by ID
function getProductById(productId) {
    return sampleProducts.find(p => p.id === productId) || 
           generateCategoryProducts('electronics', 100).find(p => p.id === productId);
}
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