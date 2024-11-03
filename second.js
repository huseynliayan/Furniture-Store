let bagItems = JSON.parse(localStorage.getItem("bag")) || [];
let cartList = document.getElementById("cartList");
let cumulativePrice = document.getElementById("totalPrice");

function displayItem(item, index) {
  let div = document.createElement("div");
  div.classList.add("wishList");
  div.innerHTML = `
        <div>
            <img src="${item.url}" alt="${item.product_name}" /></div>
        <div>
            <h2>${item.product_name}</h2>
            <p>${item.product_description}</p>
            <p id="price">${item.product_price} руб.</p>
            <button>Избранные</button>
            <button id="delete-${index}">Удалить</button>
        </div>
        <div class="quantitySelector">
            <input type="number" id="quantity-${index}" name="quantity" min="1" max="100" step="1" value="${
    item.quantity || 1
  }">
        </div>
    `;
  div.querySelector(`#delete-${index}`).addEventListener("click", () => {
    bagItems.splice(index, 1);
    localStorage.setItem("bag", JSON.stringify(bagItems));
    updateCartList();
  });

  let hr = document.createElement("hr");
  hr.classList.add("divider");

  cartList.append(div);
  if (index < bagItems.length) {
    cartList.append(hr);
  }

  div.querySelector(`#quantity-${index}`).addEventListener("change", (ev) => {
    let newQuantity = parseInt(ev.target.value);
    if (newQuantity > 0) {
      bagItems[index].quantity = newQuantity;
      localStorage.setItem("bag", JSON.stringify(bagItems));
      updateCartList();
    } else {
      ev.target.value = 1; 
    }
  });
  return div;
}

function updateCartList() {
  cartList.innerHTML = "";
  bagItems.forEach((item, index) => {
    cartList.append(displayItem(item, index));
  });
  calculateTotalPrice();
}

function addItemToCart(newItem) {
  let existingItem = bagItems.find(
    (item) => item.product_name === newItem.product_name
  );
  if (existingItem) {
    existingItem.quantity = (existingItem.quantity || 1) + 1;
  } else {
    newItem.quantity = 1;
    bagItems.push(newItem);
  }
  localStorage.setItem("bag", JSON.stringify(bagItems));
  updateCartList();
}

function calculateTotalPrice() {
  let total = bagItems.reduce((sum, item) => {
    return sum + item.product_price * (item.quantity || 1);
  }, 0);
  cumulativePrice.textContent = `Итоговая сумма: ${total} руб.`;
}

function updateCartFromStorage() {
  bagItems = JSON.parse(localStorage.getItem("bag")) || [];
  console.log("Loaded items from storage:", bagItems); 
  updateCartList();
}

window.addEventListener("storage", (event) => {
  if (event.key === "bag") {
    updateCartFromStorage();
  }
});

let clearButton = document.getElementById("clear");
clearButton.addEventListener("click", () => {
  bagItems = [];
  localStorage.setItem("bag", JSON.stringify(bagItems)); 
  updateCartList();
});

let catalogs = document.getElementsByClassName("catalog");
Array.from(catalogs).forEach((catalog) => {
  catalog.addEventListener("click", () => {
    window.location.href = "index.html";
  });
});

document.querySelector(".orders").addEventListener("click", () => {
  window.location.href = "admin.html"; 
});

updateCartFromStorage(); 


let orderForm = document.getElementById("sendForm");

orderForm.addEventListener("submit", function (event) {
  event.preventDefault(); 

  if (
    !orderForm.elements[0].value ||
    !orderForm.elements[1].value ||
    !orderForm.elements[2].value
  ) {
    alert("Пожалуйста, заполните все поля!");
    return;
  }

  let orderData = {
    customerName: orderForm.elements[0].value,
    phoneNumber: orderForm.elements[1].value,
    address: orderForm.elements[2].value,
    items: bagItems,
    totalAmount: bagItems.reduce(
      (sum, item) => sum + item.product_price * (item.quantity || 1),
      0
    ),
  };

  fetch("http://localhost:5000/add-orders", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(orderData),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log("Order successfully placed:", data);
      localStorage.removeItem("bag");
      bagItems = [];
      updateCartList();
      alert("Заказ успешно оформлен!");
    })
    .catch((error) => {
      console.error("Error placing order:", error);
      alert("Произошла ошибка при оформлении заказа.");
    });
});
