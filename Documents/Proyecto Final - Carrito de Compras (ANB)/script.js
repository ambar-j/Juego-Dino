
    document.addEventListener('DOMContentLoaded', () => {
    const products = [
            {id: 1, name: 'Jabón de Coco', price: 2000, category: 'jabones', icon: '', desc: 'Deliciosas galletitas con chips de chocolate belga, horneadas artesanalmente. Crocantes por fuera, suaves por dentro. El sabor tradicional que todos aman.'},
            {id: 2, name: 'Jabón de Vainilla', price: 320, category: 'jabones', icon: '', desc: 'Galletitas de vainilla natural con un toque de manteca. Perfectas para acompañar tu café o té. Suaves y aromáticas.'},
            {id: 3, name: 'Jabón de Lavanda', price: 380, category: 'jabones', icon: '', desc: 'Nuestras famosas cookies con el sabor único del red velvet y chips de chocolate blanco. Un toque de elegancia en cada mordida.'},
            {id: 4, name: 'Aromatizante de Sándalo', price: 340, category: 'aromatizantes', icon: '', desc: 'Cookies saludables de avena con pasas y un toque de canela. Perfectas para un snack nutritivo. Energía natural y deliciosa.'},
            {id: 5, name: 'KIT MYRODIA', price: 390, category: 'kits', icon: '', desc: 'Delicadas cookies con té verde matcha japonés y chips de chocolate blanco. Sabor único y sofisticado para paladares exigentes.'},
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
                <div class="product-img">${product.icon}</div>
                <div class="product-name">${product.name}</div>
                <div class="product-desc">${product.desc.substring(0, 70)}...</div>
                <div class="product-price">${product.price}</div>
                <button class="add-to-cart" onclick="event.stopPropagation(); addToCart(${product.id})">
                    🛒 Agregar
                </button>
            </div>
        `).join('');
    }

    window.showProductModal = function(id) {
        selectedProduct = products.find(p => p.id === id);
        document.getElementById('modalTitle').textContent = selectedProduct.icon + ' ' + selectedProduct.name;
        document.getElementById('modalIcon').textContent = selectedProduct.icon;
        document.getElementById('modalDesc').textContent = selectedProduct.desc;
        document.getElementById('modalPrice').textContent = `${selectedProduct.price}`;
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
                    <div style="margin-top: 10px; font-size: 16px;">¡Agrega algunos productos deliciosos!</div>
                </div>
            `;
            document.getElementById('cartTotal').textContent = '';
        } else {
            cartItems.innerHTML = cart.map(item => `
                <div class="cart-item">
                    <div class="cart-item-info">
                        <div class="cart-item-name">${item.icon} ${item.name}</div>
                        <div style="color: #ff6bb3; font-weight: 900; font-size: 18px;">${item.price}</div>
                    </div>
                    <div class="cart-item-controls">
                        <button class="qty-btn" onclick="updateQuantity(${item.id}, -1)">−</button>
                        <span class="qty-display">${item.quantity}</span>
                        <button class="qty-btn" onclick="updateQuantity(${item.id}, 1)">+</button>
                    </div>
                </div>
            `).join('');

            const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
            document.getElementById('cartTotal').innerHTML = `💰 Total: ${total}`;
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
        const itemsList = cart.map(item => `${item.icon} ${item.name} x${item.quantity}`).join('\n');
        alert(`✅ ¡Gracias por tu compra!\n\n${itemsList}\n\n💰 Total: ${total}\n\n🎉 ¡Pronto recibirás tus deliciosos productos!`);
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