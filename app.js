// Sample fruit data
const products = [
  { id: 1, name: "Apple", description: "Crisp and sweet red apple", price: 1.0, emoji: "🍎" },
  { id: 2, name: "Banana", description: "Fresh yellow banana", price: 0.8, emoji: "🍌" },
  { id: 3, name: "Orange", description: "Juicy orange", price: 1.2, emoji: "🍊" },
  { id: 4, name: "Grapes", description: "Seedless grapes", price: 2.0, emoji: "🍇" },
  { id: 5, name: "Strawberry", description: "Sweet strawberries", price: 2.5, emoji: "🍓" },
  { id: 6, name: "Watermelon", description: "Refreshing watermelon", price: 3.0, emoji: "🍉" },
  { id: 7, name: "Pineapple", description: "Tropical pineapple", price: 2.8, emoji: "🍍" },
  { id: 8, name: "Lemon", description: "Sour lemon", price: 0.7, emoji: "🍋" },
  { id: 9, name: "Peach", description: "Juicy peach", price: 1.7, emoji: "🍑" },
  { id: 10, name: "Cherry", description: "Fresh cherries", price: 2.2, emoji: "🍒" }
];

let cart = [];
let currentPage = "products";
let selectedProductId = null;
let navCollapsed = false;

function render() {
  document.getElementById("app").innerHTML = `
    <div class="navbar${navCollapsed ? ' collapsed' : ''}">
      <button class="toggle-nav" onclick="toggleNav()">${navCollapsed ? '➡️' : '⬅️'}</button>
      <a class="nav-link${currentPage === 'products' ? ' active' : ''}" onclick="goTo('products')">🍎${!navCollapsed ? ' Products' : ''}</a>
      <a class="nav-link${currentPage === 'cart' ? ' active' : ''}" onclick="goTo('cart')">🛒${!navCollapsed ? ' Cart' : ''}${cart.length > 0 && !navCollapsed ? ` (${cart.length})` : ''}</a>
      <a class="nav-link${currentPage === 'checkout' ? ' active' : ''}" onclick="goTo('checkout')">✅${!navCollapsed ? ' Checkout' : ''}</a>
    </div>
    <div class="main-content">
      ${renderPage()}
    </div>
  `;
}

function toggleNav() {
  navCollapsed = !navCollapsed;
  render();
}

function goTo(page, productId = null) {
  currentPage = page;
  selectedProductId = productId;
  render();
}

function renderPage() {
  if (currentPage === "products") return renderProducts();
  if (currentPage === "details") return renderProductDetails();
  if (currentPage === "cart") return renderCart();
  if (currentPage === "checkout") return renderCheckout();
  return "";
}

function renderProducts() {
  return `<div class="products-list">
    ${products.map(p => `
      <div class="product-card">
        <div class="product-emoji">${p.emoji}</div>
        <div class="product-title">${p.name}</div>
        <div class="product-price">$${p.price.toFixed(2)}</div>
        <button class="button" onclick="goTo('details', ${p.id})">View Details</button>
      </div>
    `).join("")}
  </div>`;
}

function renderProductDetails() {
  const p = products.find(x => x.id === selectedProductId);
  if (!p) return '<div>Product not found.</div>';
  return `<div class="product-card" style="max-width:340px;margin:auto;">
    <div class="product-emoji" style="font-size:3rem;">${p.emoji}</div>
    <div class="product-title" style="font-size:1.3rem;">${p.name}</div>
    <div style="margin:0.5rem 0;">${p.description}</div>
    <div class="product-price" style="font-size:1.1rem;">$${p.price.toFixed(2)}</div>
    <button class="button" onclick="addToCart(${p.id})">Add to Cart</button>
    <button class="button" style="background:#eee;color:#222;margin-left:0.5rem;" onclick="goTo('products')">Back</button>
  </div>`;
}

function addToCart(productId) {
  const item = cart.find(x => x.id === productId);
  if (item) {
    item.qty += 1;
  } else {
    cart.push({ id: productId, qty: 1 });
  }
  render();
}

function removeFromCart(productId) {
  cart = cart.filter(x => x.id !== productId);
  render();
}

function changeQty(productId, delta) {
  const item = cart.find(x => x.id === productId);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) removeFromCart(productId);
  render();
}

function renderCart() {
  if (cart.length === 0) return `<div class="cart-list"><div>Your cart is empty.</div></div>`;
  return `<div class="cart-list">
    ${cart.map(item => {
      const p = products.find(x => x.id === item.id);
      return `<div class="cart-item">
        <span>${p.emoji} ${p.name} x${item.qty}</span>
        <span class="cart-qty">
          <button class="button" style="padding:0 0.5rem;" onclick="changeQty(${item.id}, -1)">–</button>
          <button class="button" style="padding:0 0.5rem;" onclick="changeQty(${item.id}, 1)">+</button>
          <button class="button" style="background:#eee;color:#222;" onclick="removeFromCart(${item.id})">Remove</button>
        </span>
        <span>$${(p.price * item.qty).toFixed(2)}</span>
      </div>`;
    }).join("")}
    <div class="cart-total">Total: $${cartTotal().toFixed(2)}</div>
    <button class="button" style="width:100%;margin-top:1rem;" onclick="goTo('checkout')">Checkout</button>
  </div>`;
}

function cartTotal() {
  return cart.reduce((sum, item) => {
    const p = products.find(x => x.id === item.id);
    return sum + (p ? p.price * item.qty : 0);
  }, 0);
}

function renderCheckout() {
  if (cart.length === 0) return `<div class="checkout-form"><div>Your cart is empty.</div></div>`;
  return `<form class="checkout-form" onsubmit="submitOrder(event)">
    <label for="name">Name:</label>
    <input id="name" name="name" required />
    <label for="address">Address:</label>
    <input id="address" name="address" required />
    <div style="margin-bottom:0.5rem;font-weight:bold;">Order Summary:</div>
    <div style="margin-bottom:0.5rem;">
      ${cart.map(item => {
        const p = products.find(x => x.id === item.id);
        return `<div>${p.emoji} ${p.name} x${item.qty} - $${(p.price * item.qty).toFixed(2)}</div>`;
      }).join("")}
      <div style="margin-top:0.5rem;">Total: $${cartTotal().toFixed(2)}</div>
    </div>
    <button class="button" type="submit" style="width:100%;">Place Order</button>
    <button class="button" style="background:#eee;color:#222;width:100%;margin-top:0.5rem;" onclick="goTo('cart');return false;">Back to Cart</button>
  </form>`;
}

function submitOrder(e) {
  e.preventDefault();
  const name = e.target.name.value.trim();
  const address = e.target.address.value.trim();
  if (!name || !address) return;
  cart = [];
  alert(`Thank you, ${name}! Your order has been placed.`);
  goTo('products');
}

// Initial render
render();
