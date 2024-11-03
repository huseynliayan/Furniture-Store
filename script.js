let list = document.getElementById("list");
let sortSelect = document.getElementById("sort");

if (localStorage.getItem("bag")) {
} else {
  localStorage.setItem("bag", "[]");
}

function showList(arr) {
  list.innerHTML = "";
  arr.forEach((item) => {
    let div = document.createElement("div");
    div.classList.add("product");
    div.innerHTML = `
            <img src="${item.url}" alt="${item.product_name}" />
            <h1>${item.product_name}</h1>
            <p>${item.product_description}</p>
            <button class="addToCart" aria-label="Добавить в корзину">
                <img src="add to cart.svg" alt="Корзина" />
            </button>
            <button class="addToFav" aria-label="Добавить в любимые">
                <img src="heart_outline.svg" alt="Любимые" />
            </button>
            <p>${item.product_price} руб.</p>
        `;
    div.querySelector(".addToCart").addEventListener("click", () => {
      let jsBag = JSON.parse(localStorage.getItem("bag"));
      const existingItem = jsBag.find((cartItem) => cartItem.id === item.id);
      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        jsBag.push({ ...item, quantity: 1 });
      }
      localStorage.setItem("bag", JSON.stringify(jsBag));
    });
    list.appendChild(div);
  });
}

function sortList(arr) {
  const sortValue = sortSelect.value;
  if (sortValue === "priceLow") {
    return arr.sort((a, b) => a.product_price - b.product_price);
  } else if (sortValue === "priceHigh") {
    return arr.sort((a, b) => b.product_price - a.product_price);
  }
  return arr;
}

document.querySelector('.orders').addEventListener('click', () => {
    window.location.href = 'admin.html'; 
});

document.querySelector('.basket').addEventListener('click', () => {
    window.location.href = 'second.html'; 
});



fetch("http://localhost:5000/goods", {
  method: "GET",
})
  .then((res) => res.json())
  .then((data) => {
    showList(data);
    sortSelect.addEventListener("change", () => {
      const sortedList = sortList(data);
      showList(sortedList);
    });
  });
