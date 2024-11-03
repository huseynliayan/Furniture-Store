let ordersList = document.getElementById("ordersList");

function fetchOrders() {
  fetch("http://localhost:5000/orders", {
    method: "GET",
  })
    .then((response) => response.json())
    .then((orders) => {
      displayOrders(orders);
    })
    .catch((error) => {
      console.error("Error fetching orders:", error);
    });
}

function displayOrders(orders) {
  ordersList.innerHTML = "";
  orders.forEach((order) => {
    let orderDiv = document.createElement("div");
    orderDiv.classList.add("order");
    orderDiv.innerHTML = `
            <h2>Заказ от ${order.customerName}</h2>
            <p>Телефон: ${order.phoneNumber}</p>
            <p>Адрес доставки: ${order.address}</p>
            <p>Итоговая сумма: ${order.totalAmount} руб.</p>
            <h3>Товары:</h3>
            <ul>
                ${order.items
                  .map(
                    (item) =>
                      `<li>${item.product_name} — ${item.quantity} шт. — ${item.product_price} руб.</li>`
                  )
                  .join("")}
            </ul>
            <hr />
        `;
    ordersList.appendChild(orderDiv);
  });
}

fetchOrders();
