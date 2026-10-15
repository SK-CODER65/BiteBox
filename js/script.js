let cart = JSON.parse(localStorage.getItem("biteboxCart")) || [];

function calculateItemTotal(price, quantity) {
    return price * quantity;
}

function calculateSubTotal() {
    let subtotal = 0;

    cart.forEach(function (item) {
        let itemTotal =
            calculateItemTotal(
                item.price,
                item.quantity
            );

        subtotal += itemTotal;
    });

    return subtotal;
}

function calculateDeliveryCharge(subtotal) {
    if (subtotal === 0) {
        return 0;
    }
    return 40;
}

function calculatePackagingCharge(subtotal) {
    if (subtotal === 0) {
        return 0;
    }
    return 20;
}

function calculateDiscount(subtotal) {
    if (subtotal > 500 && subtotal <= 798) {
        return subtotal * 0.10;
    }
    else if (subtotal > 799 && subtotal <= 999) {
        return subtotal * 0.15;
    }
    else if (subtotal >= 1000) {
        return subtotal * 0.25;
    }
    return 0;
}

function calculateTotal(subtotal, deliveryCharge, packagingCharge, discount) {
    return subtotal + deliveryCharge + packagingCharge - discount;
}

function updateOrderSummary() {
    let subtotalElement = document.getElementById("subtotal-amount");
    if (!subtotalElement) {
        return;
    }

    let subtotal = calculateSubTotal();
    let deliveryCharge = calculateDeliveryCharge(subtotal);
    let packagingCharge = calculatePackagingCharge(subtotal);
    let discount = calculateDiscount(subtotal);
    let totalamount = calculateTotal(subtotal, deliveryCharge, packagingCharge, discount);

    document.getElementById("subtotal-amount").textContent = "₹" + subtotal.toFixed(2);
    document.getElementById("delivery-amount").textContent = "₹" + deliveryCharge.toFixed(2);
    document.getElementById("packaging-amount").textContent = "₹" + packagingCharge.toFixed(2);
    document.getElementById("discount-amount").textContent = "₹" + discount.toFixed(2);
    document.getElementById("total-amount").textContent = "₹" + totalamount.toFixed(2);
}

updateOrderSummary();

let menuContainer = document.getElementById("menu-items");

if (menuContainer) {
    menuContainer.addEventListener("click", function (event) {
        let button = event.target.closest("button");

        if (!button) {
            return;
        }
        if (button.textContent.includes("Add to Cart")) {
            let card = button.closest("article");
            addToCart(card);
        }
    });
}

function addToCart(card) {
    let name = card.querySelector("h3").textContent.trim();

    let priceText = card.querySelector(".price").textContent;

    let price = parseFloat(priceText.replace("₹", ""));

    let image = card.querySelector("img").getAttribute("src");

    console.log("Name:", name);
    console.log("Price:", price);
    console.log("Image:", image);
    console.log("Cart:", cart);

    let cartItem = {
        name: name,
        price: price,
        image: image,
        quantity: 1
    };

    let existingItem = cart.find(function (item) {
        return item.name === name;
    });

    if (existingItem) {
        existingItem.quantity++;
    }
    else {
        cart.push(cartItem);
    }

    localStorage.setItem("biteboxCart", JSON.stringify(cart));

    renderCart();
    updateOrderSummary();
}

let cartBody = document.querySelector("#shopping-cart tbody");

function renderCart() {
    if (!cartBody) {
        return;
    }

    cartBody.innerHTML = "";

    if (cart.length === 0) {
        let row = document.createElement("tr");

        row.innerHTML = `
        <td colspan=5> 
        <div class="empty-cart">
            <h3> Your Cart is Empty</h3>
                    <p>
                        Add some delicious food
                        from our Menu!
                    </p>
            </div> 
            </td>
            `;

        cartBody.appendChild(row);
        return;
    }

    cart.forEach(function (item, index) {
        let itemTotal = item.price * item.quantity;
        let row = document.createElement("tr");

        row.innerHTML = `
            <td>

                <div class="cart-item">

                    <img
                        src="${item.image}"
                        alt="${item.name}"
                        style="width: 90px; height: 62px; object-fit: cover; border-radius: 8px;"
                    >

                    <div>

                        <h3>
                            ${item.name}
                        </h3>

                    </div>

                </div>

            </td>

            <td>
                ₹${item.price}
            </td>

    <td>

                <div class="quantity-box">

                    <button
                        class="decrease"
                        data-index="${index}">
                        −
                    </button>

                    <span>
                        ${item.quantity}
                    </span>

                    <button
                        class="increase"
                        data-index="${index}">
                        +
                    </button>

                </div>

            </td>


            <td>
                ₹${itemTotal.toFixed(2)}
            </td>
            <td>

    <a href="#" class="remove-item" data-index="${index}">

    <img src="/assets/icons/delete.png" alt="Delete" width="25">

    </a>

            </td>

    `;

        cartBody.appendChild(row);

    });

}

function increaseQuantity(index) {
    cart[index].quantity++;
    localStorage.setItem("biteboxCart", JSON.stringify(cart));

    renderCart();
    updateOrderSummary();
}

function decreaseQuantity(index) {
    if(cart[index].quantity > 1){
        cart[index].quantity--;
        localStorage.setItem("biteboxCart", JSON.stringify(cart));
    }

    renderCart();
    updateOrderSummary();
}

if(cartBody){
    cartBody.addEventListener("click", function (event) {
        let button = event.target.closest("button");
 
        if (!button) {
            let link = event.target.closest("a");
            if (link && link.classList.contains("remove-item")) {
                event.preventDefault();
                let index = parseInt(link.dataset.index);
                removeFromCart(index);
            }
            return;
        }

        let index = parseInt(button.dataset.index);

        if (button.classList.contains("increase")) {
            increaseQuantity(index);
        }

        if (button.classList.contains("decrease")) {
            decreaseQuantity(index);
        }
    });
}

function removeFromCart(index) {
    cart.splice(index, 1);
    localStorage.setItem("biteboxCart", JSON.stringify(cart));

    renderCart();
    updateOrderSummary();
}

function clearCart() {
    cart = [];
    localStorage.removeItem("biteboxCart");
    renderCart();
    updateOrderSummary();
}

renderCart();
updateOrderSummary();