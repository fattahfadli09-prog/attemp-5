// Daftar menu dengan kategori
const menuItems = [
  { name: "Kopi Hitam", price: 10000, img: "img/blcoffee.jpg", category: "Minuman" },
  { name: "Cappuccino", price: 15000, img: "img/cp.jpg", category: "Minuman" },
  { name: "Es Teh", price: 8000, img: "img/esteh.jpg", category: "Minuman" },
  { name: "Roti Bakar", price: 12000, img: "img/rotbak.jpg", category: "Makanan" },
  { name: "Mie Goreng", price: 18000, img: "img/migoreng.jpg", category: "Makanan" },
  { name: "Nasi Goreng", price: 20000, img: "img/nasgor.jpg", category: "Makanan" },
];

const menuList = document.getElementById("menuList");
const orderList = document.getElementById("orderList");
const historyList = document.getElementById("historyList");
const totalPriceEl = document.getElementById("totalPrice");

let order = [];
let history = [];
let activeCategory = "all";

// Tampilkan menu
function displayMenu(filterText = "", filterCategory = "all") {
  menuList.innerHTML = "";
  menuItems
    .filter(item => {
      const matchText = item.name.toLowerCase().includes(filterText.toLowerCase());
      const matchCategory = filterCategory === "all" || item.category === filterCategory;
      return matchText && matchCategory;
    })
    .forEach(item => {
      const card = document.createElement("div");
      card.className = "menu-card";
      card.innerHTML = `
        <img src="${item.img}" alt="${item.name}">
        <h3>${item.name}</h3>
        <p>Rp ${item.price.toLocaleString()}</p>
        <small>${item.category}</small>
        <button onclick="addToOrder('${item.name}')">Tambah</button>
      `;
      menuList.appendChild(card);
    });
}
displayMenu();

// Tambah pesanan
function addToOrder(name) {
  const menu = menuItems.find(item => item.name === name);
  const existing = order.find(item => item.name === name);
  if (existing) {
    existing.qty++;
  } else {
    order.push({ ...menu, qty: 1 });
  }
  updateOrder();
}

// Update tampilan pesanan
function updateOrder() {
  orderList.innerHTML = "";
  let total = 0;
  order.forEach(item => {
    total += item.price * item.qty;
    const li = document.createElement("li");
    li.innerHTML = `
      ${item.name} x ${item.qty} 
      <span>Rp ${(item.price * item.qty).toLocaleString()}</span>
    `;
    orderList.appendChild(li);
  });
  totalPriceEl.textContent = total.toLocaleString();
}

// Checkout
document.getElementById("checkoutBtn").addEventListener("click", () => {
  if (order.length === 0) return alert("Belum ada pesanan!");
  const total = order.reduce((acc, item) => acc + item.price * item.qty, 0);
  const waktu = new Date().toLocaleString();
  history.push({ order: [...order], total, waktu });
  updateHistory();
  order = [];
  updateOrder();
  alert("Pesanan berhasil dicatat!");
});

// Hapus pesanan
document.getElementById("clearOrderBtn").addEventListener("click", () => {
  order = [];
  updateOrder();
});

// Tampilkan riwayat
function updateHistory() {
  historyList.innerHTML = "";
  history.forEach((transaksi, index) => {
    const li = document.createElement("li");
    li.innerHTML = `
      <div>
        <strong>Transaksi ${index + 1}</strong> (${transaksi.waktu})<br>
        Total: Rp ${transaksi.total.toLocaleString()}
      </div>
    `;
    historyList.appendChild(li);
  });
}

// Pencarian menu
document.getElementById("searchInput").addEventListener("input", (e) => {
  displayMenu(e.target.value, activeCategory);
});

// Filter kategori
document.querySelectorAll(".category-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".category-btn").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    activeCategory = btn.getAttribute("data-category");
    const searchText = document.getElementById("searchInput").value;
    displayMenu(searchText, activeCategory);
  });
});