(function () {
  const cardContainer = document.querySelector(".card__container");
  const cardButtons = document.querySelectorAll(".card__button");
  const cardActives = document.querySelectorAll(".card__btn-active");

  // Cart
  const shoppingCartContainer = document.querySelector(".shopping__cart-items");
  const cartQuantity = document.querySelector(".cart__quantity");
  const cartTotal = document.querySelector(".shopping__cart-total");
  const cartEmpty = document.querySelector(".shopping__cart-empty");
  const shoppingCart = document.querySelector(".shopping__cart");
  const confirmButton = document.querySelector(".shopping__cart-btn");

  // Event delegation for increment and decrement buttons
  function handleIncrementDecrement() {
    const cardActives = document.querySelectorAll(".card__btn-active");
    cardActives.forEach((btn) => {
      btn.addEventListener("click", function (e) {
        const card = e.target.closest(".card");
        const cardName = card.querySelector(".card__details").innerText;
        const parentEl = shoppingCartContainer;
        const existingCartItem = parentEl.querySelector(
          `.shopping__cart-item[data-name="${cardName}"]`
        );
        const cardQuantity = document.querySelectorAll(".card__quantity");
        const incrementButton = e.target.closest(".card__increment");
        const decrementButton = e.target.closest(".card__decrement");
        const quantityElement =
          existingCartItem.querySelector(".item-quantity");
        const totalElement = existingCartItem.querySelector(".item-total");
        const price = parseFloat(
          existingCartItem.querySelector(".item-price").innerText
        );

        if (incrementButton) {
          // Increment the quantity
          const quantity = ++quantityElement.innerText;
          cardQuantity.forEach((card) => card.innerText++);

          // Update the total price for the item
          const totalPrice = quantity * price;
          totalElement.innerText = `$${totalPrice.toFixed(2)}`;

          // Update the cart summary
          updateCartSummary();
        }

        if (decrementButton) {
          // Decrement the quantity (but not below 1)
          let quantity = parseInt(quantityElement.innerText);
          if (quantity > 1) {
            const quantity = --quantityElement.innerText;
            cardQuantity.forEach((card) => card.innerText--);

            // Update the total price for the item
            const totalPrice = quantity * price;
            totalElement.innerText = `$${totalPrice.toFixed(2)}`;

            // Update the cart summary
            updateCartSummary();
          }
        }
      });
    });
  }

  // Function to update the cart summary (total quantity and total price)
  function updateCartSummary() {
    const cartItems = document.querySelectorAll(".shopping__cart-item");
    const totalQuantity = shoppingCartContainer.childElementCount;
    let totalPrice = 0;

    cartItems.forEach((item) => {
      const price = parseFloat(
        item.querySelector(".item-total").innerText.replace("$", "")
      );
      totalPrice += price;
    });

    // Update the cart quantity and total price in the DOM
    cartQuantity.innerText = totalQuantity;
    cartTotal.innerText = `$${totalPrice.toFixed(2)}`;
  }

  function deleteCloseCart() {
    let currentlyActiveButton = null;
    // delete cart
    shoppingCartContainer.addEventListener("click", function (e) {
      if (e.target.closest(".item-remove")) {
        // Remove item from the cart
        const cartItem = e.target.closest(".shopping__cart-item");
        cartItem.remove();
        updateCartSummary();

        // Check if the cart is empty and display the empty cart message
        if (shoppingCartContainer.childElementCount === 0) {
          shoppingCart.classList.add("hidden");
          cartEmpty.classList.remove("hidden");
        }
      }
    });
  }

  // Call this function after rendering the cards
  function renderCard(products) {
    cardContainer.innerHTML = "";

    products.forEach((card) => {
      // Card markup
      const markup = `
        <div class="card sm:w-48">
            <picture>
                <source media="(min-width:1024px)" srcset="${
                  card.image.desktop
                }">
                <source media="(min-width:768px)" srcset="${card.image.tablet}">
                <img
                    src="${card.image.mobile}"
                    alt="${card.name}"
                    class="card__img w-full h-48 object-cover rounded-lg"
                />
            </picture>
            <div class="py-6 grid relative">
              <button
                class="card__button flex card-btn place-self-center cursor-pointer bg-white text-dark hover:text-amber-700 border-1 border-amber-900 hover:border-amber-700"
              >
                <img
                  class="w-6 h-6 inline-block mr-2"
                  src="./assets/images/icon-add-to-cart.svg"
                  alt=""
                />
                Add to Cart
              </button>
              <div
                class="card-btn flex card__btn-active hidden place-self-center items-center bg-amber-700 border-red-300"
              >
                <button
                  class="card__decrement button-circle active:bg-white p-0 border-1 border-white"
                >
                  <p class="text-lg text-white active:text-amber-700 text-center">-</p>
                </button>
                <div>
                  <p
                    class="card__quantity text-center cursor-default text-lg font-bold text-white"
                  >
                    1
                  </p>
                </div>
                <button
                  class="card__increment active:bg-white border-white border-1 button-circle"
                >
                  <p class="text-lg text-white active:text-amber-700 text-center">+</p>
                </button>
              </div>
              <p class="card__name text-sm text-amber-800 mt-4">${
                card.category
              }</p>
              <h2 class="card__details text-base font-semibold">
                ${card.name}
              </h2>
              <p class="card__price text-lg font-bold text-red-500">$${card.price.toFixed(
                2
              )}</p>
            </div>
        </div>
    `;

      cardContainer.insertAdjacentHTML("beforeend", markup);
    });

    //   // Add event listeners to the dynamically created buttons
    attachAddToCartListeners();
    handleIncrementDecrement(); // Call the function to handle increment and decrement
    deleteCloseCart(); // Call the function to handle delete and close cart
  }

  // function to fetch data from the API
  async function fetchData() {
    try {
      const response = await fetch("./data.json");
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      // console.log(data);
      renderCard(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }
  fetchData();

  // button toggle and add to cart
  function attachAddToCartListeners() {
    const cardButtons = document.querySelectorAll(".card__button");
    cardButtons.forEach((btn) => {
      btn.addEventListener("click", function (e) {
        e.stopPropagation();
        const parentEl = shoppingCartContainer;
        const card = e.target.closest(".card");
        const cardButton = card.querySelector(".card__button");
        const cardActive = card.querySelector(".card__btn-active");

        // Reset all card quantities to 1
        const allCardQuantities = document.querySelectorAll(".card__quantity");
        allCardQuantities.forEach((quantityElement) => {
          quantityElement.innerText = "1";
        });

        // Close all other active buttons
        const allCardButtons = document.querySelectorAll(".card__button");
        const allCardActives = document.querySelectorAll(".card__btn-active");
        allCardButtons.forEach((button) => button.classList.remove("hidden"));
        allCardActives.forEach((active) => active.classList.add("hidden"));

        // Add a global click listener to handle clicks outside the active buttons
        document.addEventListener("click", function (e) {
          // Check if the click is outside any card
          const clickedCard = e.target.closest(".card__btn-active");
          if (!clickedCard) {
            // Close all active buttons and show the "Add to Cart" buttons
            const allCardButtons = document.querySelectorAll(".card__button");
            const allCardActives =
              document.querySelectorAll(".card__btn-active");
            allCardButtons.forEach((button) =>
              button.classList.remove("hidden")
            );
            allCardActives.forEach((active) => active.classList.add("hidden"));
          }
        });

        // Extract the card details
        const cardName = card.querySelector(".card__details").innerText;
        const cardPrice = parseFloat(
          card.querySelector(".card__price").innerText.replace("$", "")
        );
        const cardQuantity = parseInt(
          card.querySelector(".card__quantity").innerText
        );
        const existingCartItem = parentEl.querySelector(
          `.shopping__cart-item[data-name="${cardName}"]`
        );

        if (shoppingCart.classList.contains("hidden")) {
          shoppingCart.classList.remove("hidden");
          cartEmpty.classList.add("hidden");
        }

        if (existingCartItem) {
          // If the item already exists in the cart
          const cartQuantityElement =
            existingCartItem.querySelector(".item-quantity");
          const cartQuantityValue = parseInt(cartQuantityElement.innerText);

          // Update the card quantity to match the cart quantity
          card.querySelector(".card__quantity").innerText = cartQuantityValue;

          cardButton.classList.add("hidden");
          cardActive.classList.remove("hidden");
        } else {
          // If the item is not in the cart, render it
          const markup = `
        <div class="shopping__cart-item flex justify-between py-4 items-center border-b-2 border-gray-100" data-name="${cardName}" data-image="${
            card.querySelector(".card__img").src
          }">
          <div class="item-info flex flex-col">
            <div class="flex gap-3 justify-between text-xs">
              <p class="text-amber-700"> <span class="item-quantity ">${cardQuantity}</span>x</p>
              <p>@$<span class="item-price text-grey-200">${cardPrice.toFixed(
                2
              )}</span></p>
              <p>$<span class="item-total text-grey-700">${cardPrice.toFixed(
                2
              )}</span></p>
            </div>
          </div>
          <button class="button-circle item-remove border-1 border-amber-800">
            <img src="./assets/images/icon-remove-item.svg" alt="Remove Item">
          </button>
        </div>
      `;
          parentEl.insertAdjacentHTML("beforeend", markup);

          // Show the active button
          cardButton.classList.add("hidden");
          cardActive.classList.remove("hidden");
        }

        // Update the cart quantity and total
        updateCartSummary();
      });
    });
  }

  // Function to clear the shopping cart
  function clearCart() {
    shoppingCartContainer.innerHTML = "";
    updateCartSummary();
    shoppingCart.classList.add("hidden");
    cartEmpty.classList.remove("hidden");
  }

  // Function to reset all card buttons and quantities
  function resetCards() {
    const allCardButtons = document.querySelectorAll(".card__button");
    const allCardActives = document.querySelectorAll(".card__btn-active");
    const allCardQuantities = document.querySelectorAll(".card__quantity");

    allCardButtons.forEach((button) => button.classList.remove("hidden"));
    allCardActives.forEach((active) => active.classList.add("hidden"));
    allCardQuantities.forEach((quantity) => (quantity.innerText = "1"));
  }

  // Function to populate the modal with cart items
  function populateModal() {
    const parentEl = document.querySelector(".order-container");
    parentEl.innerHTML = ""; // Clear the modal's order container
    const cartItems = document.querySelectorAll(".shopping__cart-item");
    let totalPrice = 0;

    cartItems.forEach((item) => {
      const itemName = item.getAttribute("data-name");
      const itemImage = item.getAttribute("data-image");
      const itemQuantity = item.querySelector(".item-quantity").innerText;
      const itemPrice = item.querySelector(".item-price").innerText;
      const itemTotal = parseFloat(
        item.querySelector(".item-total").innerText.replace("$", "")
      );

      totalPrice += itemTotal;

      const markup = `
      <div class="flex">
          <div class="shopping__cart-item flex justify-between items-center py-4 border-b-2 border-gray-100 w-full">
            <div class="item-info flex items-center gap-3">
              <img class="w-10 h-10 rounded-lg" src=${itemImage}>
              <div class="flex flex-col gap-1">
                  <p class="text-base text-bold">${itemName}</p>
                  <div class="flex items-center gap-3">
                      <p class="item-quantity text-amber-700 text-sm"><span>${itemQuantity}</span>x</p>
                      <p>@$<span class="text-sm item-price">${itemPrice}</span></p>
                  </div>
              </div>
          </div>
          <span class="item-total text-bold ">$${itemTotal.toFixed(2)}</span>
      </div>
    `;
      parentEl.insertAdjacentHTML("beforeend", markup);
    });

    const totalMarkup = `
    <div class="my-4 flex justify-between items-center">
      <p class="text-gray-500 text-sm">Order Total</p>
      <p class="text-amber-950 font-bold text-2xl shopping__cart-total">$${totalPrice.toFixed(
        2
      )}</p>
    </div>
  `;
    parentEl.insertAdjacentHTML("beforeend", totalMarkup);
  }

  // Event listener for the "Confirm Order" button
  document.addEventListener("DOMContentLoaded", () => {
    const confirmButton = document.querySelector(".shopping__cart-btn");
    const modal = document.getElementById("orderModal");
    const closeModalButton = document.getElementById("closeModalButton");

    // Handle "Confirm Order" button click
    confirmButton.addEventListener("click", () => {
      populateModal(); // Populate the modal with cart items
      modal.classList.remove("hidden"); // Show the modal
    });

    // Handle "Start New Order" button click
    closeModalButton.addEventListener("click", () => {
      modal.classList.add("hidden"); // Hide the modal
      clearCart(); // Clear the shopping cart
      resetCards(); // Reset all card buttons and quantities
    });
  });
})();
