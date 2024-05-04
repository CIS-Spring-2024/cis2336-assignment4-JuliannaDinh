// script.js

document.addEventListener('DOMContentLoaded', function() {
    const menuItems = [
        {
            name: "Vietnamese Iced Coffee",
            description: "rich and intense coffee served over ice with a generous pour of sweetened condensed milk",
            price: 2.50,
            image: "coffee.jpg"
        },
        {
            name: "Shredded Chicken Banh Mi",
            description: "A delicious sandwich with various fillings.",
            price: 5.00,
            image: "banhmi.jpg"
        },
        {
            name: "Vietnamese Chicken Salad",
            description: "A healthy mix of fresh vegetables and dressing.",
            price: 6.00,
            image: "salad.jpg"
        }
    ];

    const menuContainer = document.getElementById('menu-items');

    menuItems.forEach(item => {
        const menuItem = document.createElement('div');
        menuItem.classList.add('menu-item');

        menuItem.innerHTML = `
            <img src="${item.image}" alt="${item.name}">
            <h2>${item.name}</h2>
            <p>${item.description}</p>
            <p>$${item.price.toFixed(2)}</p>
            <input type="number" id="quantity-${item.name}" min="1" max="10" placeholder="Quantity">
            <button onclick="addToCart('${item.name}', ${item.price})">Add to Cart</button>
        `;

        menuContainer.appendChild(menuItem);
    });

    // Update cart when page loads to display any previously added items
    updateCart();
});

let cartItems = [];

function addToCart(name, price) {
    const quantityInput = document.getElementById(`quantity-${name}`);
    const quantity = parseInt(quantityInput.value);
    if (isNaN(quantity) || quantity <= 0 || quantity > 10) {
        alert("Please enter a valid quantity (1-10).");
        return;
    }

    // Check if item already exists in cart, if so, update quantity
    const existingItemIndex = cartItems.findIndex(item => item.name === name);
    if (existingItemIndex !== -1) {
        cartItems[existingItemIndex].quantity += quantity;
    } else {
        cartItems.push({ name, price, quantity });
    }

    updateCart();
}

function removeItem(index) {
    cartItems.splice(index, 1);
    updateCart();
}

function updateCart() {
    const cartList = document.getElementById('cart-items');
    cartList.innerHTML = '';
    let totalPrice = 0;
    cartItems.forEach((item, index) => {
        const li = document.createElement('li');
        li.innerHTML = `
            ${item.name} (x<input type="number" min="1" value="${item.quantity}" onchange="updateQuantity(${index}, this.value)">) - 
            $${(item.price * item.quantity).toFixed(2)} 
            <button onclick="removeItem(${index})">Remove</button>
        `;
        cartList.appendChild(li);
        totalPrice += item.price * item.quantity;
    });
    document.getElementById('total-price').textContent = `Total: $${totalPrice.toFixed(2)}`;

    // Send cart items to server for processing
    fetch('/process-order', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ items: cartItems })
    })
    .then(response => response.json())
    .then(data => {
        console.log(data.totalPrice);
    })
    .catch(error => console.error('Error:', error));
}

function updateQuantity(index, newQuantity) {
    const parsedQuantity = parseInt(newQuantity);
    if (isNaN(parsedQuantity) || parsedQuantity <= 0 || parsedQuantity > 10) {
        alert("Please enter a valid quantity (1-10).");
        return;
    }
    cartItems[index].quantity = parsedQuantity;
    updateCart();
}
