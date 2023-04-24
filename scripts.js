// // Add to cart

// const addToCartButtons = document.querySelectorAll(".add-to-cart");

// addToCartButtons.forEach((button) => {
//   button.addEventListener("click", addToCartClicked);
// });

// function addToCartClicked(event) {
//   const button = event.target;
//   const product = button.parentElement;
//   const productName = product.querySelector("h3").innerText;
//   const size = product.querySelector("#size").value;
//   addItemToCart(productName, size);
// }

// function addItemToCart(productName, size) {
//   const cartItem = document.createElement("tr");
//   cartItem.innerHTML = `
//       <td>${productName}</td>
//       <td>${size}</td>
//       <td>1</td>
//       <td><button class="remove-item">Remove</button></td>
//     `;
//   const cartItems = document.querySelector("tbody");

//   if (cartItems === null) {
//     console.error("Cannot find cart items table!");
//     return;
//   }

//   console.log(`Adding ${productName} in size ${size} to cart`);
//   cartItems.appendChild(cartItem);
// }

// // Remove from cart

// const removeItemButtons = document.querySelectorAll(".remove-item");

// removeItemButtons.forEach((button) => {
//   button.addEventListener("click", removeItem);
// });

// function removeItem(event) {
//   const buttonClicked = event.target;
//   buttonClicked.parentElement.parentElement.remove();
// }

// LOCAL STORAGE

document.addEventListener("DOMContentLoaded", () => {
  const addToCartButtons = document.querySelectorAll(".add-to-cart");
  const cartItemsList = document.querySelector(".cart-items");

  addToCartButtons.forEach((button) => {
    button.addEventListener("click", addToCart);
  });

  loadCartItemsFromLocalStorage();

  function addToCart(event) {
    const product = event.target.closest(".product");
    if (!product) return;

    const productId = product.dataset.id;
    const productName = product.querySelector("h3").textContent;
    const productSize = product.querySelector(".product-size").value;

    const cartItem = createCartItem(productId, productName, productSize);
    cartItemsList.appendChild(cartItem);

    saveCartItemToLocalStorage(productId, productSize);

    // Show feedback to the user
    const button = event.target;
    const originalText = button.textContent;
    button.textContent = "Added!";
    button.disabled = true;

    setTimeout(() => {
      button.textContent = originalText;
      button.disabled = false;
    }, 1000);
  }

  function createCartItem(productId, productName, productSize) {
    const cartItem = document.createElement("li");
    cartItem.textContent = `${productName} - ${productSize}`;
    cartItem.dataset.id = productId;
    cartItem.dataset.size = productSize;
    cartItem.classList.add("cart-item");

    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Remove";
    deleteButton.addEventListener("click", removeCartItem);
    cartItem.appendChild(deleteButton);

    return cartItem;
  }

  function removeCartItem(event) {
    const cartItem = event.target.closest(".cart-item");
    cartItemsList.removeChild(cartItem);

    removeCartItemFromLocalStorage(cartItem.dataset.id, cartItem.dataset.size);
  }

  function saveCartItemToLocalStorage(productId, productSize) {
    const cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
    cartItems.push({ productId, productSize });
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
  }

  function loadCartItemsFromLocalStorage() {
    const cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
    cartItems.forEach((item) => {
      const product = document.querySelector(
        `.product[data-id="${item.productId}"]`
      );

      if (product) {
        const productName = product.querySelector("h3").textContent;
        const cartItem = createCartItem(
          item.productId,
          productName,
          item.productSize
        );
        cartItemsList.appendChild(cartItem);
      } else {
        removeCartItemFromLocalStorage(item.productId, item.productSize);
      }
    });
  }

  function removeCartItemFromLocalStorage(productId, productSize) {
    const cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
    const updatedCartItems = cartItems.filter(
      (item) =>
        !(item.productId === productId && item.productSize === productSize)
    );
    localStorage.setItem("cartItems", JSON.stringify(updatedCartItems));
  }

  //toggle cart
  const shoppingCartToggle = document.querySelector(".shopping-cart-toggle");
  const shoppingCartContainer = document.querySelector(
    ".shopping-cart-container"
  );

  shoppingCartToggle.addEventListener("click", toggleShoppingCart);

  function toggleShoppingCart() {
    shoppingCartContainer.classList.toggle("open");
  }
});
