document.addEventListener('DOMContentLoaded', function () {
    const buttons = document.querySelectorAll('.choice-btn');
    buttons.forEach(button => {
        button.addEventListener('click', function () {
            let category = this.textContent.trim().toUpperCase();
            fetchProducts(category);
        });
    });

    buttons.forEach(button => {
        button.addEventListener('click', function () {
            buttons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
        });
    });
});

function fetchProducts(category) {
    // Use the Fetch API to get the product data
    fetch('https://cdn.shopify.com/s/files/1/0564/3685/0790/files/multiProduct.json')
        .then(response => response.json())
        .then(data => {
            const categoryData = data.categories.find(cat => cat.category_name.toUpperCase() === category);
            if (categoryData) {
                displayProducts(categoryData.category_products);
            }
        })
        .catch(error => console.error('Error fetching products:', error));
}

function displayProducts(products) {
    const container = document.querySelector('.product-container');
    container.innerHTML = '';

    // Create product cards for each product
    products.forEach(product => {
        const discountPercentage = calculateDiscount(product.price, product.compare_at_price);
        const card = document.createElement('div');
        card.className = 'product-card';

        const priceDetails = `Rs ${product.price}.00 <del class="original-price">${product.compare_at_price}.00</del> `;

        let cardInnerHTML = '';


        if (product.badge_text) {
            cardInnerHTML += `<div class="badge-text">${product.badge_text}</div>`;
        }

        cardInnerHTML += `
            <img src="${product.image}" alt="${product.title}">
            <div class="details">
                <p><span class="product-title">${product.title}</span> • <span class="vendor">${product.vendor}</span></p>
                <p>${priceDetails}<span class="discount">${discountPercentage}% off</span></p>
                <button class="add-to-cart-btn">Add to Cart</button>
            </div>
        `;

        card.innerHTML = cardInnerHTML;

        container.appendChild(card);
    });
}

function calculateDiscount(price, compareAtPrice) {
    price = parseFloat(price);
    compareAtPrice = parseFloat(compareAtPrice);
    return Math.round(((compareAtPrice - price) / compareAtPrice) * 100);
}


