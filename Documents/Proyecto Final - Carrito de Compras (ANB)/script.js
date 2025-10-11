document.addEventListener('DOMContentLoaded', () => {
    const products = [
        {
            id: 1, 
            name: 'Jabón de Coco', 
            price: 2000, 
            category: 'jabones', 
            icon: './images/jabon-coco.jpg',
            desc: 'Jabón artesanal 100% natural con aceite de coco puro. Hidrata profundamente y deja la piel suave y sedosa. Elaborado a mano con ingredientes orgánicos.'
        },
        {
            id: 2, 
            name: 'Jabón de Vainilla', 
            price: 2000, 
            category: 'jabones', 
            icon: './images/jabon-vainilla.jpg',
            desc: 'Jabón cremoso con extracto de vainilla natural. Aromático y delicado, perfecto para pieles sensibles. Deja una fragancia dulce y reconfortante.'
        },
        {
            id: 3, 
            name: 'Jabón de Lavanda', 
            price: 2000, 
            category: 'jabones', 
            icon: './images/jabon-lavanda.jpg',
            desc: 'Jabón relajante con aceite esencial de lavanda. Propiedades calmantes y aromáticas ideales para el final del día. Elaboración artesanal con flores de lavanda.'
        },
        {
            id: 4, 
            name: 'Aromatizante de Sándalo', 
            price: 2000, 
            category: 'aromatizantes', 
            icon: './images/aromatizante-sandalo.jpg',
            desc: 'Spray aromatizante con esencia de sándalo. Perfecto para ambientar espacios con un aroma místico y relajante. 100ml de pura frescura natural.'
        },
        {
            id: 5, 
            name: 'Kit MYRODIA', 
            price: 8000, 
            category: 'kits', 
            icon: './images/kit-myrodia.jpg',
            desc: 'Kit completo con 3 jabones artesanales, aromas y spray de sándalo. La combinación perfecta para regalar o consentirte. Presentación especial en caja eco-friendly.'
        },
        {
            id: 6, 
            name: 'Kit ESPECIAL', 
            price: 10000, 
            category: 'especiales', 
            icon: './images/kit-especial.jpg',
            desc: 'Kit completo con 4 jabones artesanales, aromas y spray de sándalo. La combinación perfecta para regalar o consentirte. Presentación especial en caja eco-friendly.'
        },
    ];

    let cart = [];
    let currentCategory = 'todos';
    let selectedProduct = null;

    function renderProducts() {
        const grid = document.getElementById('productsGrid');
        const filtered = currentCategory === 'todos'
            ? products
            : products.filter(p => p.category === currentCategory);

        grid.innerHTML = filtered.map(product => `
            <div class="product-card" onclick="showProductModal(${product.id})">
                <div class="product-img">
                    <img src="${product.icon}" alt="${product.name}" 
                         style="width: 100%; height: 100%; object-fit: cover; border-radius: 20px;">
                </div>
                <div class="product-name">${product.name}</div>
                <div class="product-desc">${product.desc.substring(0, 70)}...</div>
                <div class="product-price">$${product.price}</div>
                <button class="add-to-cart" onclick="event.stopPropagation(); addToCart(${product.id})">
                    🛒 Agregar
                </button>
            </div>
        `).join('');
    }

    window.showProductModal = function(id) {
        selectedProduct = products.find(p => p.id === id);
        document.getElementById('modalTitle').textContent = selectedProduct.name;
        document.getElementById('modalIcon').innerHTML = `
            <img src="${selectedProduct.icon}" alt="${selectedProduct.name}" 
                 style="width: 100%; height: 100%; object-fit: cover; border-radius: 15px;">
        `;
        document.getElementById('modalDesc').textContent = selectedProduct.desc;
        document.getElementById('modalPrice').textContent = `$${selectedProduct.price}`;
        document.getElementById('productModal').style.display = 'block';
    };

    window.closeProductModal = function() {
        document.getElementById('productModal').style.display = 'none';
    };

    window.addFromModal = function() {
        if (selectedProduct) {
            addToCart(selectedProduct.id);
            closeProductModal();
        }
    };

    window.filterCategory = function(category, evt) {
        currentCategory = category;
        document.querySelectorAll('.category-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        if (evt && evt.currentTarget) {
            evt.currentTarget.classList.add('active');
        }
        renderProducts();
    };

    window.addToCart = function(productId) {
        const product = products.find(p => p.id === productId);
        const existingItem = cart.find(item => item.id === productId);

        if (existingItem) {
            existingItem.quantity++;
        } else {
            cart.push({ ...product, quantity: 1 });
        }

        updateCart();
    };

    window.updateQuantity = function(productId, change) {
        const item = cart.find(i => i.id === productId);
        if (item) {
            item.quantity += change;
            if (item.quantity <= 0) {
                cart = cart.filter(i => i.id !== productId);
            }
            updateCart();
        }
    };

    function updateCart() {
        const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
        document.getElementById('cartCount').textContent = cartCount;

        const cartItems = document.getElementById('cartItems');

        if (cart.length === 0) {
            cartItems.innerHTML = `
                <div class="empty-cart">
                    <span class="empty-cart-emoji">🛒</span>
                    <div>Tu carrito está vacío</div>
                    <div style="margin-top: 10px; font-size: 16px;">¡Agrega algunos productos!</div>
                </div>
            `;
            document.getElementById('cartTotal').textContent = '';
        } else {
            cartItems.innerHTML = cart.map(item => `
                <div class="cart-item">
                    <div class="cart-item-info">
                        <div style="display: flex; align-items: center; gap: 10px;">
                            <img src="${item.icon}" alt="${item.name}" 
                                 style="width: 50px; height: 50px; object-fit: cover; border-radius: 8px;">
                            <div>
                                <div class="cart-item-name">${item.name}</div>
                                <div style="color: #7d5ba6; font-weight: 900; font-size: 18px;">$${item.price}</div>
                            </div>
                        </div>
                    </div>
                    <div class="cart-item-controls">
                        <button class="qty-btn" onclick="updateQuantity(${item.id}, -1)">−</button>
                        <span class="qty-display">${item.quantity}</span>
                        <button class="qty-btn" onclick="updateQuantity(${item.id}, 1)">+</button>
                    </div>
                </div>
            `).join('');

            const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
            document.getElementById('cartTotal').innerHTML = `💰 Total: $${total}`;
        }
    }

    window.toggleCart = function() {
        const modal = document.getElementById('cartModal');
        // Alternar visibilidad del carrito
        modal.style.display = modal.style.display === 'block' ? 'none' : 'block';
    };

    window.checkout = function() {
        if (cart.length === 0) {
            alert('❌ Tu carrito está vacío');
            return;
        }
        const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const itemsList = cart.map(item => `${item.name} x${item.quantity}`).join('\n');
        alert(`✅ ¡Gracias por tu compra!\n\n${itemsList}\n\n💰 Total: $${total}\n\n🎉 ¡Pronto recibirás tus productos!`);
        cart = [];
        updateCart();
        toggleCart();
    };

    // Cerrar modales al hacer clic fuera
    document.getElementById('cartModal').addEventListener('click', function(e) {
        if (e.target === this) toggleCart();
    });

    document.getElementById('productModal').addEventListener('click', function(e) {
        if (e.target === this) closeProductModal();
    });

    // Render inicial
    renderProducts();
});