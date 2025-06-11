// Product Data
const products = [
    { id: 2, name: "Bluetooth Speaker", price: 2000, image: "images/speaker.jpg" },
    { id: 3, name: "Smart Watch", price: 5000, image: "images/watch.jpg" },
    { id: 4, name: "Noise Cancelling Headphones", price: 4500, image: "images/headphones.jpg" },
    { id: 5, name: "4K Webcam", price: 3000, image: "images/webcam.jpg" },
    { id: 6, name: "Mechanical Keyboard", price: 2800, image: "images/keyboard.jpg" }
];

let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Initialize Store
document.addEventListener('DOMContentLoaded', () => {
    renderProducts();
    updateCartDisplay();
});

function renderProducts() {
    const productGrid = document.getElementById('product-grid');
    
    products.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.innerHTML = `
            <img src="${product.image}" alt="${product.name}" class="product-image">
            <h3>${product.name}</h3>
            <p>Rs. ${product.price.toFixed(2)}</p>
            <button onclick="addToCart(${product.id})">Add to Cart</button>
        `;
        productGrid.appendChild(productCard);
    });
}

function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({
            ...product,
            quantity: 1
        });
    }
    
    updateCartDisplay();
    saveCartToStorage();
}

function updateCartDisplay() {
    const cartItems = document.getElementById('cart-items');
    const totalElement = document.getElementById('total');
    const itemCount = document.getElementById('item-count');
    
    cartItems.innerHTML = '';
    let total = 0;
    
    cart.forEach(item => {
        total += item.price * item.quantity;
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <span>${item.name}</span>
            <div>
                <button onclick="adjustQuantity(${item.id}, -1)">-</button>
                <span>${item.quantity}</span>
                <button onclick="adjustQuantity(${item.id}, 1)">+</button>
            </div>
            <span>Rs. ${(item.price * item.quantity).toFixed(2)}</span>
        `;
        cartItems.appendChild(cartItem);
    });
    
    totalElement.textContent = total.toFixed(2);
    itemCount.textContent = `${cart.reduce((sum, item) => sum + item.quantity, 0)} items`;
}

function adjustQuantity(productId, change) {
    const item = cart.find(item => item.id === productId);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            cart = cart.filter(item => item.id !== productId);
        }
        updateCartDisplay();
        saveCartToStorage();
    }
}

function checkout() {
    if (cart.length === 0) {
        alert('Your cart is empty!');
        return;
    }
    
    if (confirm(`Confirm purchase of Rs. ${document.getElementById('total').textContent}?`)) {
        cart = [];
        updateCartDisplay();
        saveCartToStorage();
        alert('Thank you for your purchase!');
    }
}

function saveCartToStorage() {
    localStorage.setItem('cart', JSON.stringify(cart));
}