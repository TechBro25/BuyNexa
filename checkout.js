let appliedCoupon = null;

document.addEventListener('DOMContentLoaded', function () {
    checkAuthStatus().then(() => {
        if (!currentUser) {
            window.location.href = `login.html?redirect=${encodeURIComponent(window.location.pathname)}`;
            return;
        }

        const savedCoupon = localStorage.getItem('appliedCoupon');
        if (savedCoupon) {
            appliedCoupon = JSON.parse(savedCoupon);
        }

        if (currentUser) {
            document.getElementById('customerName').value = currentUser.fullName || '';
            document.getElementById('email').value = currentUser.email || '';
            document.getElementById('phone').value = currentUser.phone || '';
        }

        updateOrderSummary();
    });
});

function selectPaymentMethod(method) {
    document.querySelectorAll('.payment-method').forEach(el => {
        el.classList.remove('selected');
    });

    event.currentTarget.classList.add('selected');
    document.getElementById(method + 'Payment').checked = true;

    const bankInfo = document.getElementById('bankInfo');
    if (method === 'bank') {
        bankInfo.classList.add('show');
    } else {
        bankInfo.classList.remove('show');
    }
}

function updateOrderSummary() {
    const orderItems = document.getElementById('orderItems');

    if (cart.length === 0) {
        window.location.href = 'cart.html';
        return;
    }

    orderItems.innerHTML = cart.map(item => `
        <div style="display: flex; align-items: center; gap: 1rem; margin-bottom: 1rem; padding-bottom: 1rem; border-bottom: 1px solid #e2e8f0;">
            <img src="${item.image}" alt="${item.name}" style="width: 50px; height: 50px; object-fit: cover; border-radius: 8px;">
            <div style="flex: 1;">
                <h4 style="font-size: 0.9rem; margin-bottom: 0.25rem;">${item.name}</h4>
                <p style="font-size: 0.8rem; color: #64748b;">Qty: ${item.quantity}</p>
            </div>
            <div style="text-align: right;">
                <p style="font-weight: 600;">${formatPrice(item.price * item.quantity)}</p>
            </div>
        </div>
    `).join('');

    const subtotalAmount = getCartTotal();
    let discountAmount = 0;

    if (appliedCoupon) {
        discountAmount = calculateDiscount(subtotalAmount, appliedCoupon);
    }

    const totalAmount = subtotalAmount - discountAmount;

    document.getElementById('orderSubtotal').textContent = formatPrice(subtotalAmount);
    document.getElementById('orderTotal').textContent = formatPrice(totalAmount);

    const discountRow = document.getElementById('orderDiscountRow');
    if (discountAmount > 0) {
        document.getElementById('orderDiscount').textContent = `-${formatPrice(discountAmount)}`;
        discountRow.style.display = 'flex';
    } else {
        discountRow.style.display = 'none';
    }
}

function calculateDiscount(amount, coupon) {
    if (coupon.type === 'percentage') {
        return amount * (coupon.value / 100);
    }
    return coupon.value;
}

document.getElementById('checkoutForm').addEventListener('submit', async function (e) {
    e.preventDefault();

    const formData = new FormData(e.target);
    const paymentMethod = formData.get('paymentMethod');

    if (!paymentMethod) {
        showMessage('Please select a payment method', 'error');
        return;
    }

    const subtotalAmount = getCartTotal();
    const discountAmount = appliedCoupon ? calculateDiscount(subtotalAmount, appliedCoupon) : 0;
    const totalAmount = subtotalAmount - discountAmount;

    const orderData = {
        customerName: formData.get('customerName'),
        email: formData.get('email'),
        phone: formData.get('phone'),
        country: formData.get('country'),
        address: formData.get('address'),
        paymentMethod: getPaymentMethodName(paymentMethod),
        total: formatPrice(totalAmount),
        currency: currentCurrency,
        items: cart.map(item => ({
            name: item.name,
            quantity: item.quantity,
            price: formatPrice(item.price * item.quantity)
        })),
        appliedCoupon: appliedCoupon
    };

    try {
        const response = await fetch('/api/orders', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify(orderData)
        });

        const data = await response.json();

        if (data.success) {
            cart = [];
            localStorage.removeItem('cart');
            localStorage.removeItem('appliedCoupon');

            showMessage('Order placed successfully! You will receive a confirmation email shortly.', 'success');
            showOrderConfirmation(data.orderId, paymentMethod);
        } else {
            showMessage(data.message || 'Failed to place order', 'error');
        }
    } catch (error) {
        console.error('Checkout error:', error);
        showMessage('Network error. Please try again.', 'error');
    }
});

function getPaymentMethodName(method) {
    const methods = {
        'card': 'Credit/Debit Card',
        'bank': 'Bank Transfer',
        'paypal': 'PayPal'
    };
    return methods[method] || method;
}

function showOrderConfirmation(orderId, paymentMethod) {
    let confirmationMessage = `
        <h2 style="color: #10B981; margin-bottom: 1rem;">✅ Order Confirmed!</h2>
        <p style="margin-bottom: 1rem;"><strong>Order ID:</strong> ${orderId}</p>
        <p style="margin-bottom: 1rem;">Thank you for your order! We've received your payment request.</p>
    `;

    if (paymentMethod === 'bank') {
        confirmationMessage += `
            <div style="background: #f0f9ff; padding: 1rem; border-radius: 8px; margin: 1rem 0;">
                <h4 style="color: #3B82F6; margin-bottom: 0.5rem;">Next Steps for Bank Transfer:</h4>
                <ol style="margin-bottom: 1rem;">
                    <li>Transfer the exact amount to our Moniepoint account</li>
                    <li>Take a screenshot of the payment confirmation</li>
                    <li>Send the proof via WhatsApp for verification</li>
                </ol>
                <a href="https://wa.me/2349154609367" target="_blank" class="whatsapp-link">
                    📱 Send Payment Proof on WhatsApp
                </a>
            </div>
        `;
    }

    confirmationMessage += `
        <div style="margin-top: 2rem;">
            <button onclick="window.location.href='index.html'" class="form-button">Continue Shopping</button>
        </div>
    `;

    showModal(confirmationMessage);
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