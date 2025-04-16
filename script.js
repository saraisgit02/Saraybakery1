// Wait for the DOM to fully load
document.addEventListener("DOMContentLoaded", () => {
  // Select elements
  const cartButton = document.getElementById("cart-btn"); // Cart icon
  const cartCountElement = document.getElementById("cart-count"); // Cart count
  const notification = document.getElementById("notification");
  const notificationMessage = document.getElementById("notification-message");

  // Feedback form and container
  const feedbackForm = document.querySelector(".avis form"); // Feedback form
  const feedbackContainer = document.querySelector(".clients .box-container"); // Feedback container

  // Initialize cart state using localStorage
  let cartCount = parseInt(localStorage.getItem("cartCount")) || 0;
  // Initialize cart items array from localStorage
  let cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];

  // Create cart modal elements
  const cartModal = document.createElement("div");
  cartModal.className = "cart-modal";
  cartModal.id = "cart-modal";
  cartModal.innerHTML = `
    <div class="cart-modal-content">
      <span class="close-cart">&times;</span>
      <h2>Votre Panier</h2>
      <div class="cart-items-container"></div>
      <div class="cart-total">Total: <span>0.00</span> DA</div>
      <button class="checkout-btn">Passer à la caisse</button>
    </div>
  `;
  document.body.appendChild(cartModal);

  const cartItemsContainer = cartModal.querySelector(".cart-items-container");
  const closeCartButton = cartModal.querySelector(".close-cart");
  const cartTotalElement = cartModal.querySelector(".cart-total span");

  // Add CSS for the cart modal
  const cartStyle = document.createElement("style");
  cartStyle.textContent = `
    .cart-modal {
      display: none;
      position: fixed;
      z-index: 1000;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0,0,0,0.7);
      justify-content: center;
      align-items: center;
    }
    .cart-modal.active {
      display: flex;
    }
    .cart-modal-content {
      background-color: var(--bg);
      padding: 30px;
      border-radius: 15px;
      width: 80%;
      max-width: 400px;
      max-height: 80vh;
      overflow-y: auto;
      position: relative;
      box-shadow: 0 10px 30px rgba(0,0,0,0.2);
      border: 2px solid var(--primary-color);
    }
    .cart-modal-content h2 {
      color: var(--secondary);
      font-size: 2.8rem;
      text-align: center;
      margin-bottom: 20px;
      border-bottom: 2px solid var(--primary-color);
      padding-bottom: 10px;
    }
    .close-cart {
      position: absolute;
      top: 15px;
      right: 20px;
      font-size: 32px;
      cursor: pointer;
      color: var(--secondary);
      transition: transform 0.3s;
    }
    .close-cart:hover {
      transform: scale(1.2);
      color: var(--primary-color);
    }
    .cart-items-container {
      margin: 20px 0;
    }
    .cart-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 15px 0;
      border-bottom: 1px solid var(--primary-color);
      animation: fadeIn 0.5s ease;
    }
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .cart-item-info {
      flex-grow: 1;
      text-align: left;
    }
    .cart-item-info h4 {
      font-size: 1.8rem;
      color: var(--secondary);
      margin-bottom: 5px;
    }
    .cart-item-info p {
      font-size: 1.6rem;
      color: var(--primary-color);
    }
    .cart-item-remove {
      color: #e74c3c;
      cursor: pointer;
      padding: 5px 12px;
      font-size: 2.2rem;
      font-weight: bold;
      border-radius: 50%;
      transition: background-color 0.3s, color 0.3s;
    }
    .cart-item-remove:hover {
      background-color: #e74c3c;
      color: white;
    }
    .cart-total {
      margin: 20px 0;
      font-weight: bold;
      text-align: right;
      font-size: 2rem;
      color: var(--secondary);
    }
    .checkout-btn {
      background-color: var(--primary-color);
      color: white;
      border: none;
      padding: 12px 15px;
      border-radius: 8px;
      cursor: pointer;
      width: 100%;
      font-size: 1.8rem;
      font-weight: bold;
      transition: background-color 0.3s;
      text-transform: uppercase;
    }
    .checkout-btn:hover {
      background-color: var(--secondary);
    }
    .empty-cart-message {
      text-align: center;
      margin: 30px 0;
      color: #888;
      font-size: 1.8rem;
      font-style: italic;
    }
  `;
  document.head.appendChild(cartStyle);

  // Function to show a notification
  function showNotification(message) {
    notificationMessage.textContent = message;
    notification.classList.remove("hidden");
    notification.classList.add("show");

    // Hide the notification after 3 seconds
    setTimeout(() => {
      notification.classList.remove("show");
      notification.classList.add("hidden");
    }, 3000);
  }

  // Update the cart count and save it to localStorage
  function updateCartCount() {
    cartCountElement.textContent = cartCount || ""; // Show the count or leave it blank if 0
    localStorage.setItem("cartCount", cartCount); // Save the cart count to localStorage
    localStorage.setItem("cartItems", JSON.stringify(cartItems)); // Save cart items to localStorage
  }

  // Function to render cart items
  function renderCartItems() {
    cartItemsContainer.innerHTML = "";

    if (cartItems.length === 0) {
      cartItemsContainer.innerHTML =
        "<p class='empty-cart-message'>Votre panier est vide</p>";
      cartTotalElement.textContent = "0.00";
      return;
    }

    let total = 0;

    cartItems.forEach((item, index) => {
      const cartItemElement = document.createElement("div");
      cartItemElement.className = "cart-item";

      cartItemElement.innerHTML = `
        <div class="cart-item-info">
          <h4>${item.name}</h4>
          <p>${item.price.toFixed(2)} DA</p>
        </div>
        <div class="cart-item-remove" data-index="${index}">×</div>
      `;

      cartItemsContainer.appendChild(cartItemElement);
      total += item.price;
    });

    cartTotalElement.textContent = total.toFixed(2);
  }

  // Open cart modal when clicking on cart button
  cartButton.addEventListener("click", (event) => {
    event.preventDefault();
    renderCartItems();
    cartModal.classList.add("active");
    document.body.style.overflow = "hidden"; // Prevent scrolling behind modal
  });

  // Close cart modal when clicking on close button
  closeCartButton.addEventListener("click", () => {
    cartModal.classList.remove("active");
    document.body.style.overflow = ""; // Re-enable scrolling
  });

  // Close cart modal when clicking outside of it
  cartModal.addEventListener("click", (event) => {
    if (event.target === cartModal) {
      cartModal.classList.remove("active");
      document.body.style.overflow = "";
    }
  });

  // Remove item from cart when clicking the remove button
  cartItemsContainer.addEventListener("click", (event) => {
    if (event.target.classList.contains("cart-item-remove")) {
      const index = parseInt(event.target.dataset.index);
      cartItems.splice(index, 1);
      cartCount = cartItems.length;
      updateCartCount();
      renderCartItems();
      showNotification("Produit retiré du panier");
    }
  });

  // Shopping Cart Functionality (Event Delegation)
  document.body.addEventListener("click", (event) => {
    const clickedElement = event.target;

    // Check if the clicked element is an "Ajouter au panier" button
    if (
      clickedElement.classList.contains("btn") &&
      clickedElement.textContent.includes("Ajouter au panier")
    ) {
      event.preventDefault(); // Prevent default link behavior

      // Find the product information
      const productCard = clickedElement.closest(".box");
      if (productCard) {
        const productName =
          productCard.querySelector("h3")?.textContent || "Produit sans nom";
        const productPriceText =
          productCard.querySelector(".price")?.textContent || "0.00 DA";

        // Extract the price - match digits and decimals, handling both comma and dot as decimal separator
        const priceMatch = productPriceText.match(/(\d+[.,]?\d*)/);
        const productPrice = priceMatch
          ? parseFloat(priceMatch[0].replace(",", "."))
          : 0;

        // Add product to cart items
        cartItems.push({
          name: productName,
          price: productPrice,
        });
      }

      cartCount++;
      updateCartCount(); // Update the cart count
      showNotification("Produit ajouté au panier !");
    }
  });

  // Initialize the cart count (in case there are items in the cart on page load)
  updateCartCount();

  // Dynamic Feedback Submission
  if (feedbackForm && feedbackContainer) {
    feedbackForm.addEventListener("submit", (event) => {
      event.preventDefault(); // Prevent default form submission

      // Get input values
      const nameInput = feedbackForm.querySelector('input[type="text"]');
      const messageInput = feedbackForm.querySelector("textarea");

      // Validate inputs
      if (nameInput.value && messageInput.value) {
        // Create a new feedback box
        const newFeedbackBox = document.createElement("div");
        newFeedbackBox.classList.add("box");

        newFeedbackBox.innerHTML = `
            <img src="default-avatar.jpg" class="user" alt="User Avatar">
            <h3>${nameInput.value}</h3>
            <p>${messageInput.value}</p>
          `;

        // Append the new feedback to the container
        feedbackContainer.appendChild(newFeedbackBox);

        // Reset the form
        feedbackForm.reset();

        // Show success notification
        showNotification("Merci pour votre avis !");
      } else {
        showNotification("Veuillez remplir tous les champs !");
      }
    });
  } else {
    console.error("Feedback form or feedback container is missing!");
  }
});
