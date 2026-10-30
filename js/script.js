// ==========================================
// CART STATE INITIALIZATION
// ==========================================
// Retrieve saved cart items from LocalStorage or initialize an empty array
let cart = JSON.parse(localStorage.getItem("biteboxCart")) || [];


// ==========================================
// CALCULATION HELPER FUNCTIONS
// ==========================================

/**
 * Calculates total price for a single item based on price and quantity.
 */
function calculateItemTotal(price, quantity) {
    return price * quantity;
}

/**
 * Iterates through all items in the cart to calculate total subtotal.
 */
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

/**
 * Determines delivery charge based on subtotal.
 */
function calculateDeliveryCharge(subtotal) {
    if (subtotal === 0) {
        return 0;
    }
    return 40;
}

/**
 * Determines packaging charge based on subtotal.
 */
function calculatePackagingCharge(subtotal) {
    if (subtotal === 0) {
        return 0;
    }
    return 20;
}

/**
 * Calculates percentage discount based on spending thresholds.
 */
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

/**
 * Computes net payable amount: Subtotal + Delivery + Packaging - Discount.
 */
function calculateTotal(subtotal, deliveryCharge, packagingCharge, discount) {
    return subtotal + deliveryCharge + packagingCharge - discount;
}

/**
 * Calculates charges and updates order summary UI breakdown in DOM.
 */
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

// Initial calculation run on script load
updateOrderSummary();


// ==========================================
// CART INTERACTIONS & EVENT DELEGATION
// ==========================================

/**
 * Uses document-level event delegation to capture "Add to Cart" clicks on 
 * both static cards (#menu-items) and dynamic API cards (#menu-container).
 */
document.addEventListener("click", function (event) {
    let button = event.target.closest("button");

    if (!button) {
        return;
    }
    
    // Check if the clicked button or its inner HTML contains "Add to Cart"
    if (button.textContent.includes("Add to Cart")) {
        let card = button.closest("article");
        if (card) {
            addToCart(card);
        }
    }
});

/**
 * Extracts product details from card element, updates cart array, and saves to LocalStorage.
 */
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
    updateCartCount();
    updateOrderSummary();

}


// ==========================================
// CART DOM RENDERING & ITEM CONTROLS
// ==========================================

let cartBody = document.querySelector("#shopping-cart tbody");

/**
 * Dynamically builds and displays cart items inside table body or renders empty state.
 */
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

    <img src="assets/icons/delete.png" alt="Delete" width="25">

    </a>

            </td>

    `;

        cartBody.appendChild(row);

    });

}

/**
 * Increases quantity of item at index, persists state, and re-renders UI.
 */
function increaseQuantity(index) {
    cart[index].quantity++;
    localStorage.setItem(
        "biteboxCart",
        JSON.stringify(cart)
    );
    renderCart();
    updateOrderSummary();
    updateCartCount();
}

/**
 * Decreases quantity of item at index, persists state, and re-renders UI.
 */
function decreaseQuantity(index) {
    if (cart[index].quantity > 1) {
        cart[index].quantity--;
        localStorage.setItem(
            "biteboxCart",
            JSON.stringify(cart)
        );
    }
    renderCart();
    updateOrderSummary();
    updateCartCount();
}

/**
 * Removes an item from cart array completely using splice.
 */
function removeFromCart(index) {
  
    cart.splice(index, 1);
    localStorage.setItem("biteboxCart", JSON.stringify(cart));

    renderCart();
    updateOrderSummary();
    updateCartCount();

}

/**
 * Resets cart array and clears saved cart from LocalStorage.
 */
function clearCart() {
    cart = [];
    localStorage.removeItem("biteboxCart");
    renderCart();
    updateOrderSummary();
    updateCartCount();
}

// Event listener to clear the cart when Clear Cart button is clicked
let clearCartButton =
    document.getElementById("clear-cart");

if (clearCartButton) {

    clearCartButton.addEventListener(
        "click",
        function () {

            clearCart();

        }
    );

}

/**
 * Event listener delegating clicks on quantity buttons (+/-) and remove links inside cart table.
 */
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

        let link = event.target.closest("a");
        if (link && link.classList.contains("remove-item")) {
            event.preventDefault();
            let index = parseInt(link.dataset.index);
            removeFromCart(index);
        }
    });
}


// ==========================================
// SEARCH & CATEGORY FILTERING
// ==========================================

let searchInput = document.querySelector("#menu-search");
let searchButton = document.querySelector("#search-button");

/**
 * Filters menu items based on user search text input.
 */
function searchMenu(searchText) {
    let searchValue = searchText.trim().toLowerCase();
    const menuCards = document.querySelectorAll("#menu-items article, #menu-container article");

    menuCards.forEach(function (card) {

        let foodName = card.querySelector("h3").textContent
            .trim().toLowerCase();

        if (foodName.includes(searchValue)) {
            card.style.display = "";
        } else {
            card.style.display = "none";
        }
    });
}

// Event listener for search button click
if(searchButton) {
    searchButton.addEventListener("click", function() {
        searchMenu(searchInput.value);
    });
};

let categoryCards = document.querySelectorAll("#categories article");

/**
 * Filters visible menu items based on selected category name.
 */
function filterMenu(category) {

    const menuCards = document.querySelectorAll("#menu-items article, #menu-container article");

    menuCards.forEach(function (card) {

        let cardCategory =
            card.dataset.category.toLowerCase();

        if (cardCategory === category) {

            card.style.display = "";

        } else {
            card.style.display = "none";
        }
    });
}

// Attaches click listeners to category cards for filtering
categoryCards.forEach(
    function(card) {

        card.addEventListener("click",function() {
                let category = card.querySelector("h3").textContent.trim().toLowerCase();
                filterMenu(category);
            }
        );
    }
);


// ==========================================
// THEME SWITCHER (DARK / LIGHT MODE)
// ==========================================

let themeButton = document.getElementById("theme-toggle");

/**
 * Toggles dark theme class on document body and updates theme preferences in LocalStorage.
 */
function toggleTheme() {
    document.body.classList.toggle("dark-theme");

    let themeIcon = themeButton.querySelector(".theme-icon");
    let themeText = themeButton.querySelector(".theme-text");

    if(document.body.classList.contains("dark-theme")) {
        themeIcon.textContent = "☾";
        themeText.textContent = "NIGHT MODE";
        localStorage.setItem("biteboxTheme", "dark");
    }
    else {
        themeIcon.textContent = "☀";
        themeText.textContent ="DAY MODE";
        localStorage.setItem("biteboxTheme","light");
    }
};

/**
 * Reads saved theme preference from LocalStorage and applies theme state to page.
 */
function loadTheme() {
    let savedTheme = localStorage.getItem("biteboxTheme");

    /* Disable animation while loading */
    document.body.classList.add("theme-loading");

    if(savedTheme === "dark") {
        document.body.classList.add("dark-theme");
    }
    else {
        document.body.classList.remove("dark-theme");
    }

    if (themeButton) {
        let themeIcon = themeButton.querySelector(".theme-icon");
        let themeText = themeButton.querySelector(".theme-text");

        if(savedTheme === "dark") {
            if(themeIcon) {
                themeIcon.textContent = "☾";
            }

            if(themeText) {
                themeText.textContent = "NIGHT MODE";
            }
        }
        else {
            if (themeIcon) {
                themeIcon.textContent = "☀";
            }

            if (themeText) {
                themeText.textContent = "DAY MODE";
            }
        }
    }

    // allow animation again
    setTimeout(function () {
        document.body.classList.remove("theme-loading");
    }, 50)
};

// Event listener for theme toggle button
if (themeButton) {
     themeButton.addEventListener("click",function () {
            toggleTheme();
        }
    );
};


// ==========================================
// UTILITY FUNCTIONS & TOAST NOTIFICATIONS
// ==========================================

/**
 * Computes total item count and updates badge indicator in navigation header.
 */
function updateCartCount() {

    let cartCount = 0;

    cart.forEach(function (item) {
        cartCount += item.quantity;
    });

    let cartCountElement =
        document.getElementById("cart-count");

    if (cartCountElement) {
        cartCountElement.textContent = cartCount;
    }
};

/**
 * Spawns dynamic toast message popup notification on UI.
 */
function showToast(message, type) {
    let toast = document.createElement("div");
    toast.className = "toast " + type;
    toast.textContent = message;
    document.body.appendChild(toast);

    setTimeout(function () {
        toast.classList.add("show");
    }, 100);

    setTimeout(function () {
        toast.classList.remove("show");

        setTimeout(function () {
            toast.remove();
        }, 300);

    }, 3000);
};


// ==========================================
// CONTACT FORM VALIDATION
// ==========================================

let contactForm = document.querySelector(".right-column form");

/**
 * Validates inputs for name, email format, Indian phone number format, subject, and message.
 */
if (contactForm) {

    contactForm.addEventListener(
        "submit",
        function (event) {

            event.preventDefault();


            let name =
                contactForm.querySelector(
                    'input[name="Name"]'
                );

            let email =
                contactForm.querySelector(
                    'input[name="Email"]'
                );

            let phone =
                contactForm.querySelector(
                    'input[name="Phone Number"]'
                );

            let subject =
                contactForm.querySelector(
                    'input[name="Subject"]'
                );

            let message =
                contactForm.querySelector(
                    'textarea[name="Message"]'
                );


            if (!name.value.trim()) {

                showToast(
                    "⚠ Please enter your name.",
                    "error"
                );

                return;
            }


            if (!email.value.trim()) {

                showToast(
                    "⚠ Please enter your email address.",
                    "error"
                );

                return;
            }


            if (!email.validity.valid) {

                showToast(
                    "⚠ Please enter a valid email address.",
                    "error"
                );

                return;
            }


            let phonePattern = /^[6-9]\d{9}$/;


            if (!phone.value.trim()) {

                showToast(
                    "⚠ Please enter your phone number.",
                    "error"
                );

                return;
            }


            if (!phonePattern.test(phone.value.trim())) {

                showToast(
                    "⚠ Please enter a valid 10-digit phone number.",
                    "error"
                );

                return;
            }


            if (!subject.value.trim()) {

                showToast(
                    "⚠ Please enter a subject.",
                    "error"
                );

                return;
            }


            if (!message.value.trim()) {

                showToast(
                    "⚠ Please enter your message.",
                    "error"
                );

                return;
            }


            showToast(
                "✓ Message sent successfully!",
                "success"
            );


            contactForm.reset();

        }
    );
}


// ==========================================
// CRUD OPERATIONS VIA API (MOCKAPI)
// ==========================================

// Variable to track the item being updated
let updateMenuId = null;

const addMenuBtn = document.getElementById("add-menu-btn");
const menuModal = document.getElementById("menu-modal");
const cancelMenuForm = document.getElementById("cancel-menu-form");
const menuForm = document.getElementById("menu-form");

const API_URL = "https://6ae1ec75bbb5412922995dc5.mockapi.io/menu";

// Modal display controls
if (addMenuBtn) {
    addMenuBtn.addEventListener("click", function () {
        updateMenuId = null;
        menuForm.reset();
        document.querySelector(".modal-header h2").textContent = "Add Menu Item";
        document.querySelector("#menu-form button[type='submit']").textContent = "Add Menu Item";
        menuModal.classList.add("show");
    });
}

if (cancelMenuForm) {
    cancelMenuForm.addEventListener("click", function() {
        menuModal.classList.remove("show");
    });
}

/**
 * Handles menu form submission for creating (POST) or updating (PUT) menu items.
 */
if (menuForm) {
    menuForm.addEventListener("submit", async function (event) {
        event.preventDefault();

        const name = document.getElementById("menu-name").value;
        const price = document.getElementById("menu-price").value;
        const category = document.getElementById("menu-category").value;
        const rating = document.getElementById("menu-rating").value;
        const reviews = document.getElementById("menu-reviews").value;
        const image = document.getElementById("menu-image").value;

        const menuItem = {
            name: name,
            price: price,
            category: category,
            rating: rating,
            reviews: reviews,
            image: image
        };

        try {
            if (updateMenuId !== null) {
                await updateMenuItem(updateMenuId, menuItem);
                updateMenuId = null;
            } else {
                const response = await fetch(API_URL, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(menuItem)
                });

                const data = await response.json();
                console.log("Menu item added:", data);
                displayMenuItems([data]);
            }
            menuModal.classList.remove("show");
            menuForm.reset();
        } catch (error) {
            console.error("Error saving menu item:", error);
        }
    });
}

/**
 * Fetches menu list from MockAPI endpoint.
 */
async function fetchMenuItems() {
    try {
        const response = await fetch(API_URL);
        const menuItems = await response.json();
        console.log("Menu items fetched:", menuItems);
        displayMenuItems(menuItems);
    } catch (error) {
        console.error("Error fetching menu items:", error);
    }
}

/**
 * Dynamically appends fetched menu item cards into #menu-container DOM element.
 */
function displayMenuItems(menuItems) {
    const menuContainer = document.getElementById("menu-container");
    if (!menuContainer) return;

    menuItems.forEach(menuItem => {
        const card = document.createElement("article");
        card.dataset.category = menuItem.category;
        card.classList.add("api-menu-card");
        card.dataset.id = menuItem.id;

        card.innerHTML = `
            <img src="${menuItem.image}" alt="${menuItem.name}">
            <h3>${menuItem.name}</h3>
            <p class="rating">
                ${menuItem.rating}
                <small>(${menuItem.reviews})</small>
            </p>
            <p class="price">₹${menuItem.price}</p>

            <div class="menu-actions">
                <button type="button" class="update-menu-btn">
                    <img src="assets/icons/edit.png" alt="Edit">
                </button>
                <button type="button" class="delete-menu-btn">
                    <img src="assets/icons/delete.png" alt="Delete">
                </button>
            </div>
            <button>
                <img src="assets/icons/shopping-cart-red.png" alt="Cart" width="14" height="14">
                Add to Cart
            </button>
        `;
        menuContainer.appendChild(card);
    });
}

// Initial fetch execution
fetchMenuItems();

/**
 * Delegated event listener on #menu-container for handling Edit/Update and Delete buttons.
 */
let apiMenuContainer = document.getElementById("menu-container");
if (apiMenuContainer) {
    apiMenuContainer.addEventListener("click", function (event) {
        const updateBtn = event.target.closest(".update-menu-btn");
        const deleteBtn = event.target.closest(".delete-menu-btn");

        if (updateBtn) {
            const card = updateBtn.closest("article"); 
            const menuId = card.dataset.id;
            updateMenuId = menuId;

            const menuName = card.querySelector("h3").textContent;
            const price = card.querySelector(".price").textContent.replace("₹", "").trim();
            const rating = card.querySelector(".rating").childNodes[0].textContent.trim();
            const reviews = card.querySelector(".rating small").textContent.replace("(", "").replace(")", "").trim();
            const category = card.dataset.category;
            const image = card.querySelector("img").src;

            document.getElementById("menu-name").value = menuName;
            document.getElementById("menu-price").value = price;
            document.getElementById("menu-category").value = category;
            document.getElementById("menu-rating").value = rating;
            document.getElementById("menu-reviews").value = reviews;
            document.getElementById("menu-image").value = image;

            document.querySelector(".modal-header h2").textContent = "Update Menu Item";
            document.querySelector("#menu-form button[type='submit']").textContent = "Update Menu Item";

            menuModal.classList.add("show");
        }

        if (deleteBtn) {
            const card = deleteBtn.closest("article");
            const menuId = card.dataset.id;
            console.log("Delete Menu ID:", menuId);
            deleteMenuItem(menuId, card);
        }
    });
}

/**
 * Sends a PUT request to API to update existing menu item record.
 */
async function updateMenuItem(menuId, menuItem) {
    try {
        const response = await fetch(`${API_URL}/${menuId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(menuItem)
        });

        const data = await response.json();
        console.log("Menu item updated:", data);

        const menuContainer = document.getElementById("menu-container");
        if (menuContainer) {
            const apiCards = menuContainer.querySelectorAll(".api-menu-card");
            apiCards.forEach(card => card.remove());
        }

        fetchMenuItems();

        menuForm.reset();
        document.querySelector(".modal-header h2").textContent =
            "Add Menu Item";
        document.querySelector("#menu-form button[type='submit']").textContent =
            "Add Menu Item";
        menuModal.classList.add("show");
    } catch (error) {
        console.error("Error updating menu item:", error);
    }
}

/**
 * Sends a DELETE request to API and removes card from DOM.
 */
async function deleteMenuItem(menuId, card) {
    try {
        const response = await fetch(`${API_URL}/${menuId}`, {
            method: "DELETE"
        });

        const data = await response.json();
        console.log("Menu item deleted:", data);

        card.remove();
    } catch (error) {
        console.error("Error deleting menu item:", error);
    }
}


// ==========================================
// INITIAL APPLICATION INVOCATIONS
// ==========================================
loadTheme();
renderCart();
updateCartCount();
updateOrderSummary();